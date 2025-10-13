import { h } from "preact";
import htm from "htm";
import { useState, useEffect } from "preact/hooks";
import Arrow from "./arrow.js";
import ThemeSelector from "./themeSelector.js";
import TextStylesDropdown from "./textStylesDropdown.js";
import FontSizeRange from "./fontSizeRange.js";
import TTSPlayer from "./ttsPlayer.js";
import AppLogo from "../images/logo64.png";
import { throttle } from "lodash";
const html = htm.bind(h);
import utils from "utils";

export default function ReaderApp({
  article: { title, byline, publishedTime, content, length },
  pageData: { nextPageLink, previousPageLink },
  onToggle,
  globalSettings,
}) {
  const settings = {
    ...globalSettings,
    ...JSON.parse(localStorage.getItem("PNLReader-settings")),
  };
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  // 1. Add state for TTS
  const [ttsAudioUrl, setTtsAudioUrl] = useState(null);
  const [isVoiceMode, setIsVoiceMode] = useState(false);

  const saveGlobalSettings = async (update) => {
    Object.assign(globalSettings, update);
    await chrome.runtime.sendMessage({
      type: "save settings",
      globalSettings: globalSettings,
    });
  };

  const saveSettings = (update) => {
    const hasChanged = Object.keys(update).some((key) => {
      return settings[key] !== update[key];
    });
    if (!hasChanged) {
      return;
    }

    Object.assign(settings, update);
    const isOnOptionsPage =
      window.location.href.includes("extension://") &&
      window.location.href.includes("/options.html");

    if (isOnOptionsPage) {
      let _timer;
      clearTimeout(_timer);

      saveGlobalSettings(settings).then(() => {
        const $status = document.getElementById("PNLReaderStatus");
        document.querySelector("#PNLReaderStatus>span").innerText =
          "Success! Global settings are saved.";
        $status.style.display = "block";
        _timer = setTimeout(() => {
          $status.style.display = "none";
        }, 3000);
      });
    } else {
      localStorage.setItem("PNLReader-settings", JSON.stringify(settings));
    }
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

  async function speak(text) {
    const selection = window.getSelection().toString().trim();
    text = typeof text === "string" ? text.trim() : selection;
    if (!text) return;

    console.log("Speaking text:", text);
    const speakResult = await utils.send("speak text", { text });

    console.log("Speak result:", speakResult);
    if (speakResult.audio) {
      const uint8 = new Uint8Array(speakResult.audio);
      const blob = new Blob([uint8], { type: "audio/mpeg" }); // or correct mime type
      const url = URL.createObjectURL(blob);

      setTtsAudioUrl(url); // Set the audio URL
      setIsVoiceMode(true); // Show the TTSPlayer
    } else {
      console.error(
        "No audio URL received.",
        speakResult.error || "Unknown error"
      );
    }
  }

  function exitVoiceMode() {
    setIsVoiceMode(false);
    if (ttsAudioUrl) {
      URL.revokeObjectURL(ttsAudioUrl);
      setTtsAudioUrl(null);
    }
  }

  useEffect(() => {
    document.addEventListener("mouseup", speak);
    return () => {
      document.removeEventListener("mouseup", speak);
    };
  }, []);
  window.speak = speak; // For testing in console

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
              <!-- print button -->
              <button
                role="button"
                id="printBtn"
                class="secondary outline"
                onClick=${() => window.print()}
                aria-label="Print"
                data-tooltip="Print"
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
                    d="M19 8h-1V4H6v4H5c-1.1 0-2 .9-2 2v7h4v3h10v-3h4v-7c0-1.1-.9-2-2-2zm-6 9H9v-2h4v2zm3-9H8V5h8v3z"
                  />
                </svg>
              </button>
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
      <article id="PNLReaderStatus">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 26 26"
          width="26"
          height="26"
          fill="green"
        >
          <circle cx="12" cy="12" r="10" />
          <path
            d="M9 12l2 2 4-4"
            stroke="white"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            fill="none"
          />
        </svg>
        <span>Success! Your settings are saved.</span>
      </article>
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
      ${isVoiceMode &&
      ttsAudioUrl &&
      html`<${TTSPlayer}
        src=${ttsAudioUrl}
        settings=${settings}
        saveSettings=${saveSettings}
        onExit=${exitVoiceMode}
      />`}
    </div>
  `;
}
