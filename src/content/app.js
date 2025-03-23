import { h } from "preact";
import htm from "htm";
import { useState, useEffect } from "preact/hooks";
import Arrow from "./arrow.js";
import ThemeSelector from "./themeSelector.js";
import TextStylesDropdown from "./textStylesDropdown.js";
import FontSizeRange from "./fontSizeRange.js";
import AppLogo from "../images/logo64.png";
import { throttle } from "lodash";
const html = htm.bind(h);

export default function ReaderApp({
  article: { title, byline, publishedTime, content, length },
  pageData: { nextPageLink, previousPageLink },
  onToggle,
}) {
  const settings = JSON.parse(localStorage.getItem("PNLReader-settings")) || {};
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);

  const saveSettings = (update) => {
    Object.assign(settings, update);
    localStorage.setItem("PNLReader-settings", JSON.stringify(settings));
  };

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down and past 50px
        setIsHeaderHidden(true);
      } else {
        // Scrolling up
        setIsHeaderHidden(false);
      }

      lastScrollY = currentScrollY;
    };

    const throttledHandleScroll = throttle(handleScroll, 200);
    window.addEventListener("scroll", throttledHandleScroll);

    return () => {
      window.removeEventListener("scroll", throttledHandleScroll);
    };
  }, []);

  return html`
    <div id="PNLReader">
      <header
        id="PNLReaderHeader"
        class="sticky-on-top ${isHeaderHidden ? "hidden-header" : ""}"
      >
        <nav class="topbar">
          <h1 class="title">
            <img src=${AppLogo} alt="PNL Reader" />
            <span>PNL Reader</span>
          </h1>
          <ul class="toolbar">
            <li class="hide-xs">
              <label> Font Size </label>
              <${FontSizeRange}
                settings=${settings}
                saveSettings=${saveSettings}
              />
            </li>
            <li>
              <label> Theme </label>
              <${ThemeSelector}
                settings=${settings}
                saveSettings=${saveSettings}
              />
            </li>

            <li>
              <!-- Primary outline -->
              <${TextStylesDropdown}
                settings=${settings}
                saveSettings=${saveSettings}
              />
            </li>

            <li>
              <button
                role="button"
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
