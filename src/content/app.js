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
    colorAndTheme: "auto",
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
  const changeTheme = (colorAndTheme = "auto") => {
    const [colorScheme, theme] =
      colorAndTheme.split(" ").length === 2
        ? colorAndTheme.toLowerCase().split(" ")
        : ["", colorAndTheme];
    document.documentElement.setAttribute("data-color-scheme", colorScheme);
    if (theme === "auto") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", theme);
    }
    saveSettings({ colorAndTheme: colorAndTheme });
  };
  changeTheme(settings.colorAndTheme);

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
    setFontSize(e.target.value);
  };
  const toggleHeaderSticky = () => {
    setIsFixedHeader(!isFixedHeader);
    saveSettings({ isFixedHeader: !isFixedHeader });
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
                <option
                  value="auto"
                  selected=${settings.colorAndTheme === "auto"}
                >
                  Auto
                </option>
                <option
                  value="dark"
                  selected=${settings.colorAndTheme === "dark"}
                >
                  Dark
                </option>
                <option
                  value="light"
                  selected=${settings.colorAndTheme === "light"}
                >
                  Light
                </option>
                <option
                  value="solarized dark"
                  selected=${settings.colorAndTheme === "solarized dark"}
                >
                  Solarized Dark
                </option>
                <option
                  value="solarized light"
                  selected=${settings.colorAndTheme === "solarized light"}
                >
                  Solarized Light
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
                class="secondary outline"
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
          tooltip="<- Previous Page"
          href=${previousPageLink}
        />
        <${Arrow}
          direction="right"
          tooltip="Next Page ->"
          href=${nextPageLink}
        />
      </footer>
    </div>
  `;
}
