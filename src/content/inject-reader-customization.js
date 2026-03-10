/**
 * Content script for pnl.dev
 * Fills NodeBB composer with site customization data from temp storage
 */

(async function () {
  // Set data attribute to pnl.dev to indicate PNL Reader is installed
  document.body.setAttribute(
    "data-pnl-reader-version",
    chrome.runtime.getManifest().version,
  );

  // Only run on compose page
  if (!location.href.includes("/compose")) return;

  // Check for share data
  const { siteCustomizationsShareData } = await chrome.storage.local.get(
    "siteCustomizationsShareData",
  );
  if (!siteCustomizationsShareData) return;
  console.log(
    "[PNL Reader] Found shared customization data, filling composer...",
    siteCustomizationsShareData,
  );
  // Clear storage immediately to prevent re-triggering
  await chrome.storage.local.remove("siteCustomizationsShareData");

  // Check if data is fresh (within 5 minutes)
  if (Date.now() - siteCustomizationsShareData.timestamp > 5 * 60 * 1000)
    return;

  const { config, css } = siteCustomizationsShareData;

  // Build markdown content
  function buildMarkdown() {
    // Ensure name and urlMatch appear first in JSON output
    const { name, urlMatch, ...rest } = config;
    const orderedConfig = { name, urlMatch, ...rest };

    let md = `## ${config.name}\n\n`;
    md += `**URL Match:** \`${config.urlMatch}\`\n\n`;
    md += `### Configuration\n\n`;
    md += "```json\n";
    md += JSON.stringify(orderedConfig, null, 2);
    md += "\n```\n";

    if (css) {
      md += `\n### Custom CSS\n\n`;
      md += "```css\n";
      md += css;
      md += "\n```\n";
    }

    return md;
  }

  function waitForElement(selector, timeout = 5000) {
    return new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        const element = document.querySelector(selector);
        if (element) {
          clearInterval(interval);
          resolve(element);
        }
      }, 100);
      setTimeout(() => {
        clearInterval(interval);
        reject(new Error(`Element ${selector} not found`));
      }, timeout);
    });
  }

  // Wait for NodeBB composer to load and fill it
  async function fillComposer() {
    try {
      const titleInput = await waitForElement(".composer input.title");
      const bodyTextarea = await waitForElement(".composer textarea.write");

      // Fill title
      titleInput.value = `Site Customization - ${config.name}`;
      titleInput.dispatchEvent(new Event("input", { bubbles: true }));

      // Fill body
      bodyTextarea.value = buildMarkdown();
      bodyTextarea.dispatchEvent(new Event("input", { bubbles: true }));

      // Fill tag
      const tagsInput = await waitForElement(
        ".composer .bootstrap-tagsinput input",
      );
      tagsInput.focus();
      tagsInput.value = "pnl-reader";
      tagsInput.dispatchEvent(new Event("input", { bubbles: true }));
      tagsInput.blur();

      console.log("[PNL Reader] Composer filled with customization data");
    } catch (e) {
      console.warn("[PNL Reader] Could not find composer elements:", e.message);
    }
  }

  // Start filling composer
  fillComposer();
})();
