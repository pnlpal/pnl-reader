import { h } from "preact";
import htm from "htm";
import { useState, useEffect } from "preact/hooks";
import Arrow from "./arrow.js";

const html = htm.bind(h);

export default function ReaderApp({
  article: { title, byline, publishedTime, content, length },
  pageData: { nextPageLink, previousPageLink },
  onToggle,
}) {
  const settings = JSON.parse(localStorage.getItem("PNLReader-settings")) || {
    theme: "auto",
    fontSize: 22,
    isFixedHeader: true,
    isHeaderDetailsOpen: true,
  };
  const [fontSize, setFontSize] = useState(settings.fontSize);
  const [isFixedHeader, setIsFixedHeader] = useState(settings.isFixedHeader);
  const saveSettings = (update) => {
    Object.assign(settings, update);
    localStorage.setItem("PNLReader-settings", JSON.stringify(settings));
  };
  const changeTheme = (theme) => {
    if (theme === "auto") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", theme);
    }
    saveSettings({ theme });
  };
  changeTheme(settings.theme);

  useEffect(() => {
    if (!fontSize) {
      return;
    }
    const $article = document.getElementById("PNLReaderArticle");
    $article.style.fontSize = `${fontSize}px`;
    // change line-height based on font-size
    $article.style.lineHeight = `${fontSize * 1.5}px`;
    saveSettings({ fontSize });
  }, [fontSize]);

  const handleFontSizeChange = (e) => {
    setFontSize(e.target.value);
  };
  const toggleHeaderSticky = () => {
    setIsFixedHeader(!isFixedHeader);
    saveSettings({ isFixedHeader: !isFixedHeader });
  };
  const goToNext = () => {
    if (!nextPageLink) {
      return;
    }
    chrome.runtime.sendMessage({ type: "goToLink", url: nextPageLink });
  };
  const goToPrevious = () => {
    if (!previousPageLink) {
      return;
    }
    chrome.runtime.sendMessage({ type: "goToLink", url: previousPageLink });
  };

  return html`
    <div id="PNLReader">
      <header
        id="PNLReaderHeader"
        class=${isFixedHeader ? "sticky-on-top" : ""}
      >
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
                data-placement="bottom"
                value=${fontSize}
                onInput=${handleFontSizeChange}
              />
            </li>
            <li>
              <label> Theme </label>
              <select id="theme" onChange=${(e) => changeTheme(e.target.value)}>
                <option value="auto" selected=${settings.theme === "auto"}>
                  Auto
                </option>
                <option value="dark" selected=${settings.theme === "dark"}>
                  Dark
                </option>
                <option value="light" selected=${settings.theme === "light"}>
                  Light
                </option>
              </select>
            </li>

            <li>
              <label class="switch"> Sticky Header </label>
              <input
                type="checkbox"
                role="switch"
                checked=${isFixedHeader}
                onChange=${toggleHeaderSticky}
              />
            </li>

            <li>
              <button
                id="toggleReadModeBtn"
                class="secondary"
                onClick=${onToggle}
                aria-label="Exit PNL Reader"
                data-tooltip="Exit PNL Reader"
                data-placement="left"
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
            <details
              open=${settings.isHeaderDetailsOpen}
              onClick=${() =>
                saveSettings({
                  isHeaderDetailsOpen: !settings.isHeaderDetailsOpen,
                })}
            >
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
      <footer>
        <${Arrow}
          direction="left"
          onClick=${goToPrevious}
          tooltip="<- Previous Page"
          href=${previousPageLink}
        />
        <${Arrow}
          direction="right"
          onClick=${goToNext}
          tooltip="Next Page ->"
          href=${nextPageLink}
        />
      </footer>
    </div>
  `;
}
