import "./styles.less";

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
      alert("Could not access local fonts. This feature requires permission.");
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
function applyFont(fontName) {
  if (!fontName.trim()) {
    applyStatus.style.display = "none";
    return;
  }
  // Here you would save to extension settings, e.g. via messaging or storage
  applyStatus.style.display = "inline";
  setTimeout(() => (applyStatus.style.display = "none"), 2000);
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
