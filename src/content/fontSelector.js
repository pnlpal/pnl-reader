import { h } from "preact";
import htm from "htm";
import { useEffect } from "preact/hooks";
import utils from "utils";

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

  const localFonts =
    settings.customLocalFonts?.map((f) => ({
      value: f,
      label: `${f} ⚡`, // lightning bolt to indicate local font
      tooltip: `Custom local font: ${f}`,
      isCustom: true,
    })) || [];

  const allFonts = [
    {
      value: "system-ui",
      label: "System UI",
      tooltip: "Default system font, usually sans-serif.",
    },
    ...localFonts,
    {
      value: "'Source Serif 4', serif",
      label: "Source Serif 4",
      tooltip: "A serif font with Cyrillic, Greek and Vietnamese support.",
    },
    {
      value: "Georgia, serif",
      label: "Georgia",
      tooltip: "A classic serif font designed for readability on screens.",
    },
    {
      value: "Merriweather, serif",
      label: "Merriweather",
      tooltip: "A serif font with Cyrillic and Vietnamese support.",
    },
    {
      value:
        "'Times New Roman', 'Liberation Serif', STFangsong, FangSong, serif",
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
    <div
      id="fontType"
      style="display: flex; flex-direction: column; align-items: flex-start;"
    >
      <select
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
      <button
        type="button"
        onClick=${() => {
          utils.send("open custom font page");
        }}
        style="
        margin-top: 0.5em;
        padding: 0.3em 0.6em;
        font-size: 0.8em;
        background: transparent;
        border: 1px solid var(--pico-muted-border-color);
        border-radius: 0.25rem;
        color: var(--pico-color);
        cursor: pointer;
        width: 100%;
      "
        title="Add or manage custom fonts"
      >
        ⚙️ Manage Custom Fonts
      </button>
    </div>
  `;
};

export default FontSelector;
