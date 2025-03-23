import { h } from "preact";
import htm from "htm";
import { useState, useEffect } from "preact/hooks";

const html = htm.bind(h);

const LineSpacingRange = ({ settings, saveSettings }) => {
  const [lineHeight, setLineHeight] = useState(settings.lineHeight);
  const defaultLineHeight = 1.5;

  useEffect(() => {
    const $article = document.getElementById("PNLReaderArticle");
    if (!lineHeight) {
      $article.style.setProperty("--pnl-reader-line-height", defaultLineHeight);
      return;
    }
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
      value=${lineHeight || defaultLineHeight}
      data-tooltip="Line Spacing: ${lineHeight || defaultLineHeight}"
      onInput=${handleLineHeightChange}
    />
  `;
};

export default LineSpacingRange;
