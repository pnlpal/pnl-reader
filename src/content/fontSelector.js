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
    { value: "system-ui", label: "System UI" },
    {
      value: "'Source Serif 4'",
      label: "Source Serif 4",
    },
    {
      value: "'Segoe UI'",
      label: "Segoe UI",
    },
    {
      value: "Calibri",
      label: "Calibri",
    },
    {
      value: "Georgia",
      label: "Georgia",
    },
    {
      value: "Merriweather",
      label: "Merriweather",
    },
    {
      value: "'Times New Roman'",
      label: "Times New Roman",
    },
    {
      value: "Roboto", // A modern sans-serif font with Cyrillic support.
      label: "Roboto",
    },
    {
      value: "'Open Sans'",
      label: "Open Sans",
    },
    {
      value: "'Baloo 2'", // Casual, fun, multilanguage like Hindi, Tamil, etc
      label: "Baloo 2",
    },
    {
      value: "'Source Code Pro', monospace",
      label: "Source Code Pro",
    },
    {
      value: "'IBM Plex Mono', monospace",
      label: "IBM Plex Mono",
    },

    {
      value: "'Patrick Hand'", // Handwriting
      label: "Patrick Hand",
    },
    {
      value: "'Comic Sans MS', cursive",
      label: "Comic Sans MS",
    },
    {
      value: "Lobster, cursive", // Decorative
      label: "Lobster",
    },
    {
      value: "'Indie Flower', cursive",
      label: "Indie Flower",
    },
    {
      value: "'Dancing Script', cursive", //  Handwriting/Decorative
      label: "Dancing Script",
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
            <option value=${font.value} style="font-family: ${font.value};">
              ${font.label}
            </option>
          `
      )}
    </select>
  `;
};

export default FontSelector;
