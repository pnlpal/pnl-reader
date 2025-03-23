import { h } from "preact";
import htm from "htm";
import { useState, useEffect } from "preact/hooks";

const html = htm.bind(h);

const LineWidthRange = ({ settings, saveSettings }) => {
  const [lineWidth, setLineWidth] = useState(settings.lineWidth || 70);

  useEffect(() => {
    if (!lineWidth) {
      return;
    }
    const $article = document.getElementById("PNLReaderArticle");
    $article.style.setProperty("--pnl-reader-line-width", `${lineWidth}%`);
    saveSettings({ lineWidth });
  }, [lineWidth]);

  const handleLineWidthChange = (e) => {
    settings.lineWidth = e.target.value;
    setLineWidth(e.target.value);
  };

  return html`
    <input
      type="range"
      id="lineWidth"
      name="lineWidth"
      min="30"
      max="100"
      step="5"
      value=${lineWidth}
      data-tooltip="Line Width: ${lineWidth}%"
      onInput=${handleLineWidthChange}
    />
  `;
};

export default LineWidthRange;
