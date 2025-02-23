import { h } from "preact";
import htm from "htm";
import { useState, useEffect } from "preact/hooks";

const html = htm.bind(h);

export default function ReaderApp({
  article: { title, byline, publishedTime, content, length },
  settings: { theme, initialFontSize },
  onToggle,
}) {
  const [fontSize, setFontSize] = useState(initialFontSize);

  useEffect(() => {
    if (!fontSize) {
      return;
    }
    const $article = document.getElementById("PNLReaderArticle");
    $article.style.fontSize = `${fontSize}px`;
    // change line-height based on font-size
    $article.style.lineHeight = `${fontSize * 1.5}px`;
    console.log(
      "Font Size changed to",
      fontSize,
      "line-height",
      fontSize * 1.5
    );
  }, [fontSize]);

  const handleFontSizeChange = (e) => {
    setFontSize(e.target.value);
  };

  return html`
    <div id="PNLReader">
      <header>
        <nav class="topbar">
          <h1 class="title">PNL Reader</h1>
          <ul class="toolbar">
            <li>
              <label> Font Size </label>
              <input
                type="range"
                id="fontSize"
                min="16"
                max="64"
                data-tooltip="Font Size: ${fontSize}px"
                value=${fontSize}
                onInput=${handleFontSizeChange}
              />
            </li>
            <li>
              <label> Theme </label>
              <select id="theme">
                <option value="auto">Auto</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </li>

            <li>
              <button
                id="toggleReadModeBtn"
                class="secondary"
                onClick=${onToggle}
                aria-label="Exit Reader Mode"
                data-tooltip="Exit Reader Mode"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  fill="currentColor"
                >
                  <path
                    d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                  />
                </svg>
              </button>
            </li>
          </ul>
        </nav>
      </header>
      <main>
        <article class="container" id="PNLReaderArticle">
          <header>
            <details open>
              <summary class="title">${title}</summary>
              <p class="byline">
                ${byline ? html`<span>By ${byline}</span>` : ""}
              </p>
              <p class="published-time" datetime=${publishedTime}>
                ${new Date(publishedTime).toLocaleString()}
              </p>
              <p class="length">${length} words</p>
            </details>
          </header>
          <section
            class="content"
            dangerouslySetInnerHTML=${{ __html: content }}
          ></section>
        </article>
      </main>
    </div>
  `;
}
