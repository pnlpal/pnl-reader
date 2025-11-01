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

// Make body visible as we have hidden the unstyled page during loading.
document.body.style.setProperty("visibility", "visible", "important");

(async () => {
  // global settings
  const globalSettings = await utils.send("get settings");
  let existingCustomFonts = globalSettings.customLocalFonts || [];

  // Hide browse fonts button if not supported
  if (!("queryLocalFonts" in window)) {
    browseFontsCard.style.display = "none";
  }

  const formatFontValue = (fontName) => {
    if (!fontName) return "";
    if (!fontName.includes(",")) return fontName.trim();
    return fontName
      .split(",")
      .map((part) => {
        // wrap each part in quotes if it contains spaces and is not already quoted
        const trimmed = part.trim();
        if (
          trimmed.includes(" ") &&
          !(
            (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
            (trimmed.startsWith("'") && trimmed.endsWith("'"))
          )
        ) {
          return `'${trimmed}'`;
        }
        return trimmed;
      })
      .join(", ");
  };

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

        // Get search elements
        const searchInput = document.getElementById("font-search-input");
        const dropdown = document.getElementById("font-dropdown");
        let selectedFont = "";
        let allFonts = [];

        // Prepare font list
        allFonts = availableFonts.map((font) => ({
          name: font.fullName || font.postscriptName || font.family,
          displayName: font.fullName || font.postscriptName || font.family,
        }));

        // Sort fonts alphabetically
        allFonts.sort((a, b) => a.name.localeCompare(b.name));

        function renderDropdown(fonts = allFonts) {
          dropdown.innerHTML = "";

          if (fonts.length === 0) {
            const noResults = document.createElement("div");
            noResults.style.cssText =
              "padding: 0.5rem; color: var(--pico-muted-color); font-style: italic;";
            noResults.textContent = "No fonts found";
            dropdown.appendChild(noResults);
            return;
          }

          fonts.forEach((font) => {
            const item = document.createElement("div");
            item.style.cssText = `
            padding: 0.5rem;
            cursor: pointer;
            font-family: '${font.name}', sans-serif;
            border-bottom: 1px solid var(--pico-muted-border-color);
          `;
            item.textContent = font.displayName;

            // Hover effect
            item.addEventListener("mouseenter", () => {
              item.style.backgroundColor = "var(--pico-primary-background)";
            });
            item.addEventListener("mouseleave", () => {
              item.style.backgroundColor = "transparent";
            });

            // Click to select
            item.addEventListener("click", () => {
              selectedFont = font.name;
              searchInput.value = font.name;
              dropdown.style.display = "none";

              // Update preview
              if (preview) {
                const formattedFont = formatFontValue(font.name);
                preview.style.fontFamily = formattedFont;
              }
              // Focus the input and place cursor at the end for editing
              searchInput.focus();
            });

            dropdown.appendChild(item);
          });
        }

        // Search functionality
        searchInput.addEventListener("input", (e) => {
          const searchTerm = e.target.value.toLowerCase().trim();

          // Update selected font to current input value (for manual editing)
          selectedFont = e.target.value.trim();
          // Update preview with current input
          if (preview) {
            const formattedFont = selectedFont
              ? formatFontValue(selectedFont)
              : "inherit";
            preview.style.fontFamily = formattedFont;
          }

          // Filter fonts
          const filteredFonts = allFonts.filter((font) =>
            font.name.toLowerCase().includes(searchTerm)
          );

          renderDropdown(filteredFonts);
          dropdown.style.display = "block";
        });

        // Show all fonts when input is focused
        searchInput.addEventListener("focus", () => {
          const searchTerm = searchInput.value.toLowerCase().trim();
          const filteredFonts = allFonts.filter((font) =>
            font.name.toLowerCase().includes(searchTerm)
          );
          renderDropdown(filteredFonts);
          dropdown.style.display = "block";
        });

        // Hide dropdown when clicking outside
        document.addEventListener("click", (e) => {
          if (!searchInput.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.style.display = "none";
          }
        });

        // Keyboard navigation
        searchInput.addEventListener("keydown", (e) => {
          const items = dropdown.querySelectorAll("div");
          if (items.length === 0) return;

          if (e.key === "ArrowDown") {
            e.preventDefault();
            const first = items[0];
            first.style.backgroundColor = "var(--pico-primary-background)";
            first.focus();
          } else if (e.key === "Enter") {
            e.preventDefault();
            if (selectedFont) {
              applyFont(selectedFont);
            }
          }
        });

        // Update the system font selector reference to use our selected font
        window.getSelectedSystemFont = () => selectedFont;
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
      preview.style.fontFamily = formatFontValue(val) || "inherit";
    });
  }

  // Live preview for system font selector
  if (systemFontsList && preview) {
    systemFontsList.addEventListener("change", () => {
      const val = systemFontsList.value;
      preview.style.fontFamily = formatFontValue(val) || "inherit";
    });
  }

  // Apply font handlers
  async function applyFont(fontName) {
    if (!fontName.trim()) {
      applyStatus.style.display = "none";
      return;
    }

    // Format the font name before saving
    const formattedFontName = formatFontValue(fontName);

    try {
      const updatedFonts = [
        ...existingCustomFonts.filter((f) => f !== formattedFontName),
        formattedFontName,
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
      Font "${formattedFontName}" added to PNL Reader! 
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

  // Update the apply system font handler
  if (applySystemBtn) {
    applySystemBtn.onclick = (e) => {
      e.preventDefault();
      const selectedFont = window.getSelectedSystemFont
        ? window.getSelectedSystemFont()
        : "";
      if (selectedFont) {
        applyFont(selectedFont);
      } else {
        applyStatus.innerHTML = "Please select a font first.";
        applyStatus.style.color = "#fd7e14";
        applyStatus.style.display = "inline-block";
        setTimeout(() => (applyStatus.style.display = "none"), 3000);
      }
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
      fontSpan.style.cssText = `font-family: ${fontName}; flex: 1;`;
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
