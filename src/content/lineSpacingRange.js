import { h } from "preact";
import htm from "htm";
import { useState, useEffect } from "preact/hooks";

const html = htm.bind(h);

const LineSpacingRange = ({ settings, saveSettings }) => {
  const [lineHeight, setLineHeight] = useState(settings.lineHeight || 1.5);

  useEffect(() => {
    if (!lineHeight) {
      return;
    }
    const $article = document.getElementById("PNLReaderArticle");
    $article.style.setProperty("--pnl-reader-line-height", lineHeight);
    saveSettings({ lineHeight });
  }, [lineHeight]);

  const handleLineHeightChange = (e) => {
    settings.lineHeight = e.target.value;
    setLineHeight(e.target.value);
  };

  return html`
    <input
      type="range"
      id="lineSpacing"
      name="lineSpacing"
      min="1"
      max="2.5"
      step="0.1"
      value=${lineHeight}
      data-tooltip="Line Spacing: ${lineHeight}"
      onInput=${handleLineHeightChange}
    />
  `;
};

export default LineSpacingRange;
