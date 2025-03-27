import { h } from "preact";
import htm from "htm";
import { useEffect } from "preact/hooks";

const html = htm.bind(h);

const FontSelector = ({ settings, saveSettings }) => {
  const fontType = settings.fontType;
  const defaultFontType =
    "system-ui, Segoe UI, Roboto, Helvetica, Arial, sans-serif";
  const changeFontType = (e) => {
    const newFontType = e.target.value;
    const $article = document.getElementById("PNLReaderArticle");
    if (!$article) return;
    if (!newFontType) {
      $article.style.setProperty("--pico-font-family", defaultFontType);
      return;
    }
    const fontFamily_ = `${newFontType}, ${defaultFontType}`;
    $article.style.setProperty("--pico-font-family", fontFamily_);
    saveSettings({ fontType: newFontType });
  };

  // init the font family
  useEffect(() => {
    changeFontType({ target: { value: fontType } });
  }, []);

  const allFonts = [
    {
      value: "system-ui",
      label: "System UI",
      tooltip: "Default system font, usually sans-serif.",
    },
    {
      value: "'Source Serif 4'",
      label: "Source Serif 4",
      tooltip: "A serif font with Cyrillic, Greek and Vietnamese support.",
    },
    {
      value: "Georgia",
      label: "Georgia",
      tooltip: "A classic serif font designed for readability on screens.",
    },
    {
      value: "Merriweather",
      label: "Merriweather",
      tooltip: "A serif font with Cyrillic and Vietnamese support.",
    },
    {
      value: "'Times New Roman'",
      label: "Times New Roman",
      tooltip: "A classic serif font widely used in print and digital media.",
    },
    {
      value: "Calibri",
      label: "Calibri",
      tooltip: "A sans-serif font.",
    },
    {
      value: "Roboto",
      label: "Roboto",
      tooltip:
        "A modern sans-serif font with Cyrillic, Greek and Vietnamese support.",
    },
    {
      value: "'Open Sans'",
      label: "Open Sans",
      tooltip:
        "A clean and versatile sans-serif font with excellent readability and multilingual support.",
    },
    {
      value: "'Noto Serif SC', serif",
      label: "Noto Serif SC",
      tooltip:
        "aka 思源宋体, a serif font with Simplified Chinese, Cyrillic and Vietnamese support.",
    },
    {
      value: "'Noto Serif TC', serif",
      label: "Noto Serif TC",
      tooltip: "aka 思源宋体, a serif font with Traditional Chinese support.",
    },
    {
      value: "'Noto Serif JP', serif",
      label: "Noto Serif JP",
      tooltip: "A serif font with Japanese support.",
    },
    {
      value: "'ZCOOL QingKe HuangYou', sans-serif",
      label: "ZCOOL QingKe HuangYou",
      tooltip:
        "aka 站酷庆科黄油体, a sans-serif font with Simplified Chinese support.",
    },
    {
      value: "'Baloo 2'", // Casual, fun, multilanguage like Hindi, Tamil, etc
      label: "Baloo 2",
      tooltip:
        "A playful and rounded font with multilingual support, including Indian scripts.",
    },
    {
      value: "'Source Code Pro', monospace",
      label: "Source Code Pro",
      tooltip: "A monospaced font designed for coding.",
    },
    {
      value: "'IBM Plex Mono', monospace",
      label: "IBM Plex Mono",
      tooltip: "A monospaced font designed for coding.",
    },
    {
      value: "'Patrick Hand'", // Handwriting
      label: "Patrick Hand",
      tooltip: "A casual handwriting font.",
    },
    {
      value: "'Comic Sans MS', cursive",
      label: "Comic Sans MS",
      tooltip: "A casual and playful font.",
    },
    {
      value: "Lobster, cursive", // Decorative
      label: "Lobster",
      tooltip: "A decorative font.",
    },
    {
      value: "'Indie Flower', cursive",
      label: "Indie Flower",
      tooltip: "A decorative font.",
    },
    {
      value: "'Dancing Script', cursive", //  Handwriting/Decorative
      label: "Dancing Script",
      tooltip: "A casual handwriting and decorative font.",
    },
  ];

  return html`
    <select
      id="fontType"
      name="fontType"
      aria-label="Select Font"
      onChange=${changeFontType}
      value=${fontType}
    >
      ${allFonts.map(
        (font) =>
          html`
            <option
              value=${font.value}
              style="font-family: ${font.value};"
              data-tooltip="${font.tooltip}"
              data-placement="right"
              title="${font.tooltip}"
            >
              ${font.label}
            </option>
          `
      )}
    </select>
  `;
};

export default FontSelector;
