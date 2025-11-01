import "./styles.less";
import utils from "utils";

const fontInput = document.getElementById("font-name-input");
const preview = document.getElementById("font-preview");
const applyBtn = document.getElementById("apply-font-btn");
const applySystemBtn = document.getElementById("apply-system-font-btn");
const applyStatus = document.getElementById("apply-status");
const systemFontsList = document.getElementById("system-fonts-list");
const manualInputGroup = document.getElementById("manual-input-group");
const systemFontGroup = document.getElementById("system-font-group");
const browseFontsBtn = document.getElementById("browse-fonts-btn");
const browseFontsCard = document.getElementById("browse-fonts-card");

(async () => {
  // global settings
  const globalSettings = await utils.send("get settings");
  let existingCustomFonts = globalSettings.customLocalFonts || [];

  // Hide browse fonts button if not supported
  if (!("queryLocalFonts" in window)) {
    browseFontsCard.style.display = "none";
  }

  // Browse system fonts button handler
  if (browseFontsBtn) {
    browseFontsBtn.onclick = async () => {
      try {
        // Query available fonts when button is clicked
        const availableFonts = await window.queryLocalFonts();

        // Hide manual input and browse button, show system font selector
        manualInputGroup.style.display = "none";
        browseFontsCard.style.display = "none";
        systemFontGroup.style.display = "flex";

        // Populate font list
        systemFontsList.innerHTML =
          '<option value="">-- Select a font --</option>';
        availableFonts.forEach((font) => {
          const name = font.fullName || font.postscriptName || font.family;
          const opt = document.createElement("option");
          opt.value = name;
          opt.textContent = name;
          opt.style.fontFamily = name;
          systemFontsList.appendChild(opt);
        });
      } catch (e) {
        alert(
          "Could not access local fonts. This feature requires permission."
        );
        console.log("Could not access local fonts:", e);
      }
    };
  }

  // Live preview for manual input
  if (fontInput && preview) {
    fontInput.addEventListener("input", () => {
      const val = fontInput.value.trim();
      preview.style.fontFamily = val ? `'${val}', sans-serif` : "inherit";
    });
  }

  // Live preview for system font selector
  if (systemFontsList && preview) {
    systemFontsList.addEventListener("change", () => {
      const val = systemFontsList.value;
      preview.style.fontFamily = val ? `'${val}', sans-serif` : "inherit";
    });
  }

  // Apply font handlers
  async function applyFont(fontName) {
    if (!fontName.trim()) {
      applyStatus.style.display = "none";
      return;
    }

    try {
      const updatedFonts = [
        ...existingCustomFonts.filter((f) => f !== fontName),
        fontName,
      ];
      await utils.send("save settings", {
        globalSettings: {
          ...globalSettings,
          customLocalFonts: updatedFonts,
        },
      });
      // Update local variable and re-render
      existingCustomFonts = updatedFonts;
      renderExistingFonts();
      // Show success message with instructions
      applyStatus.innerHTML = `
      Font "${fontName}" added to PNL Reader! 
      <br><small>Refresh any page where PNL Reader is active to see this font in the toolbar.</small>
    `;
      applyStatus.style.color = "#36b37e";
      applyStatus.style.display = "inline-block";

      setTimeout(() => (applyStatus.style.display = "none"), 8000); // Show for 8 seconds
    } catch (error) {
      // Show error message
      applyStatus.innerHTML = `Failed to save font. Please try again or report the issue at https://pnl.dev`;
      applyStatus.style.color = "#d63384";
      applyStatus.style.display = "inline-block";

      setTimeout(() => (applyStatus.style.display = "none"), 8000);
    }
  }

  if (applyBtn && fontInput) {
    applyBtn.onclick = (e) => {
      e.preventDefault();
      applyFont(fontInput.value);
    };
  }

  if (applySystemBtn && systemFontsList) {
    applySystemBtn.onclick = (e) => {
      e.preventDefault();
      applyFont(systemFontsList.value);
    };
  }

  // Function to render existing custom fonts
  function renderExistingFonts() {
    const existingFontsCard = document.getElementById("existing-fonts-card");
    const existingFontsList = document.getElementById("existing-fonts-list");

    if (!existingCustomFonts || existingCustomFonts.length === 0) {
      existingFontsCard.style.display = "none";
      return;
    }

    existingFontsCard.style.display = "block";
    existingFontsList.innerHTML = "";

    existingCustomFonts.forEach((fontName) => {
      const fontItem = document.createElement("div");
      fontItem.style.cssText = `
        display: flex; 
        align-items: center; 
        justify-content: space-between; 
        padding: 0.5em 0; 
        border-bottom: 1px solid var(--pico-muted-border-color);
    `;

      const fontSpan = document.createElement("span");
      fontSpan.style.cssText = `font-family: '${fontName}', sans-serif; flex: 1;`;
      fontSpan.textContent = fontName;

      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.className = "secondary outline";
      removeBtn.style.cssText =
        "margin: 0; padding: 0.3em 0.8em; font-size: 0.8em;";
      removeBtn.textContent = "Remove";
      removeBtn.dataset.fontName = fontName;

      // Add event listener instead of inline onclick
      removeBtn.addEventListener("click", () => {
        removeFont(fontName);
      });

      fontItem.appendChild(fontSpan);
      fontItem.appendChild(removeBtn);
      existingFontsList.appendChild(fontItem);
    });
  }

  // Function to remove a custom font
  async function removeFont(fontName) {
    try {
      const updatedFonts = existingCustomFonts.filter((f) => f !== fontName);

      await utils.send("save settings", {
        globalSettings: {
          ...globalSettings,
          customLocalFonts: updatedFonts,
        },
      });

      // Update local variable and re-render
      existingCustomFonts = updatedFonts;
      renderExistingFonts();

      // Show success message
      applyStatus.innerHTML = `Font "${fontName}" removed from PNL Reader!`;
      applyStatus.style.color = "#36b37e";
      applyStatus.style.display = "inline-block";

      setTimeout(() => (applyStatus.style.display = "none"), 3000);
    } catch (error) {
      // Show error message
      applyStatus.innerHTML = `Failed to remove font. Please try again.`;
      applyStatus.style.color = "#d63384";
      applyStatus.style.display = "inline-block";

      setTimeout(() => (applyStatus.style.display = "none"), 3000);
    }
  }

  renderExistingFonts();
})();
