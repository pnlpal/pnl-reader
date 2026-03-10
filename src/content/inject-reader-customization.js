/**
 * Content script for pnl.dev
 */

import utils from "utils";

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

// Set data attribute to pnl.dev to indicate PNL Reader is installed
document.body.setAttribute(
  "data-pnl-reader-version",
  chrome.runtime.getManifest().version,
);

async function fillComposerWithCustomizationData() {
  // Only run on compose page
  if (!location.pathname.includes("/compose")) return;

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
}

function handleAddToReader() {
  const allowedHosts = ["pnl.dev", "localhost:4567"];
  if (!allowedHosts.includes(location.host)) return;

  function parseConfigFromContent(contentNode) {
    const jsonCode = contentNode.querySelector("code.language-json");
    const json =
      jsonCode?.textContent || contentNode.querySelector("code")?.textContent;
    const css = contentNode.querySelector("code.language-css")?.textContent;

    const config = JSON.parse(json);
    if (css) config.css = css;
    return config;
  }

  async function addCustomizationByTopic(tid) {
    const res = await fetch(`${location.origin}/api/topic/${tid}`);
    const topic = await res.json();

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = topic.posts[0].content;

    const config = parseConfigFromContent(tempDiv);
    config.troveUrl = `${location.origin}${topic.url}`;
    await utils.send("add site customization", { customization: config });
  }

  async function addCustomizationByParseContent(contentNode) {
    const config = parseConfigFromContent(contentNode);

    const postEl = contentNode.closest('[component="post"]');
    const pid = postEl?.dataset.pid;
    if (pid) config.troveUrl = `${location.origin}/post/${pid}`;

    await utils.send("add site customization", { customization: config });
  }

  // Event delegation for dynamically added buttons
  document.addEventListener("click", async (e) => {
    const btn = e.target.closest(".add-to-reader");
    if (!btn) return;

    e.preventDefault();
    btn.textContent = "waiting...";
    btn.classList.add("disabled");

    try {
      if (btn.dataset.tid) {
        await addCustomizationByTopic(btn.dataset.tid);
      } else {
        const contentNode = btn.closest(".content, .preview");
        await addCustomizationByParseContent(contentNode);
      }
      btn.textContent = "Added!";
      btn.classList.remove("disabled");
      alert(
        "Customization added to PNL Reader!\n\n" +
          "• Go to the target site and activate PNL Reader to see the effect\n" +
          "• Or manage your customizations in extension options → Site Customization",
      );
    } catch (err) {
      btn.textContent = "Error";
      btn.classList.remove("disabled");
      alert(`Failed to add customization:\n\n${err.message}`);
      console.error("Failed to add customization:", err);
    }
  });
}

fillComposerWithCustomizationData();
handleAddToReader();
