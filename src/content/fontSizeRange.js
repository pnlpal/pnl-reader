import { h } from "preact";
import htm from "htm";
import { useState, useEffect } from "preact/hooks";

const html = htm.bind(h);

const FontSizeRange = ({ settings, saveSettings }) => {
  const [fontSize, setFontSize] = useState(settings.fontSize);
  const defaultFontSize = 22;

  useEffect(() => {
    const $article = document.getElementById("PNLReaderArticle");
    if (!$article) return;
    if (!fontSize) {
      $article.style.setProperty("--pico-font-size", `${defaultFontSize}px`);
      return;
    }
    $article.style.setProperty("--pico-font-size", `${fontSize}px`);
    saveSettings({ fontSize });
  }, [fontSize]);

  const handleFontSizeChange = (e) => {
    setFontSize(e.target.value);
  };

  return html`
    <input
      type="range"
      name="fontSize"
      min="16"
      max="64"
      data-tooltip="Font Size: ${fontSize || defaultFontSize}px"
      title="Font Size: ${fontSize || defaultFontSize}px"
      data-placement="bottom"
      value=${fontSize || defaultFontSize}
      onInput=${handleFontSizeChange}
    />
  `;
};

export default FontSizeRange;
