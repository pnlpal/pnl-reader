import { h } from "preact";
import htm from "htm";
import "./arrow.scss";
import { useState, useEffect } from "preact/hooks";

const html = htm.bind(h);

const FontSizeRange = ({ settings, saveSettings }) => {
  const [fontSize, setFontSize] = useState(settings.fontSize);

  useEffect(() => {
    if (!fontSize) {
      return;
    }
    const $article = document.getElementById("PNLReaderArticle");
    $article.setAttribute(
      "style",
      `--pico-font-size: ${fontSize}px; --pico-line-height: ${
        fontSize * 1.5
      }px;`
    );
    saveSettings({ fontSize });
  }, [fontSize]);

  const handleFontSizeChange = (e) => {
    settings.fontSize = e.target.value;
    setFontSize(e.target.value);
  };

  return html`
    <input
      type="range"
      name="fontSize"
      min="16"
      max="64"
      data-tooltip="Font Size: ${fontSize}px"
      data-placement="bottom"
      value=${fontSize}
      onInput=${handleFontSizeChange}
    />
  `;
};

export default FontSizeRange;
