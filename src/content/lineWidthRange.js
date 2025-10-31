import { h } from "preact";
import htm from "htm";
import { useState, useEffect } from "preact/hooks";

const html = htm.bind(h);
const isMobile =
  /Mobi|Android/i.test(navigator.userAgent) || window.innerWidth < 890;

const LineWidthRange = ({ settings, saveSettings }) => {
  const [lineWidth, setLineWidth] = useState(settings.lineWidth);
  const defaultLineWidth = isMobile ? 100 : 70;

  useEffect(() => {
    const $article = document.getElementById("PNLReaderArticle");
    if (!$article) return;
    if (!lineWidth) {
      $article.style.setProperty(
        "--pnl-reader-line-width",
        `${defaultLineWidth}%`
      );
      return;
    }

    $article.style.setProperty("--pnl-reader-line-width", `${lineWidth}%`);
    saveSettings({ lineWidth });
  }, [lineWidth]);

  const handleLineWidthChange = (e) => {
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
      value=${lineWidth || defaultLineWidth}
      data-tooltip="Line Width: ${lineWidth || defaultLineWidth}%"
      title="Line Width: ${lineWidth || defaultLineWidth}%"
      onInput=${handleLineWidthChange}
    />
  `;
};

export default LineWidthRange;
