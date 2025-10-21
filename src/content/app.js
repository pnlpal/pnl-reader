import { h } from "preact";
import htm from "htm";
import { useState, useEffect, useMemo, useRef } from "preact/hooks";
import Arrow from "./arrow.js";
import ThemeSelector from "./themeSelector.js";
import TextStylesDropdown from "./textStylesDropdown.js";
import FontSizeRange from "./fontSizeRange.js";
import TTSPlayer from "./ttsPlayer/ttsPlayer.js";
import AppLogo from "../images/logo64.png";
import { throttle, debounce } from "lodash";
import utils from "utils";
import injectSpeakerOnPage from "./ttsPlayer/injectSpeakerOnPage.js";
import { detectLanguage } from "./ttsPlayer/detectLanguage.js";
import { highlightSelection } from "./ttsPlayer/highlightSelection.js";
import { ReadPageIcon } from "./ttsPlayer/icons.js";

const html = htm.bind(h);

export default function ReaderApp({
  article: { title, byline, publishedTime, content, length },
  pageData: { nextPageLink, previousPageLink },
  onToggle,
  globalSettings,
}) {
  const [settings, setSettings] = useState({
    ...globalSettings,
    ...JSON.parse(localStorage.getItem("PNLReader-settings")),
  });
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  // 1. Add state for TTS
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [ttsText, setTtsText] = useState("");
  const [ttsLang, setTtsLang] = useState(settings.ttsLang || "");
  const [ttsNextParagraphText, setTtsNextParagraphText] = useState("");

  const [ttsStartTimestamp, setTtsStartTimestamp] = useState(null);
  // State of reading whole page, use ref is needed to access latest value in async loops
  const [readingWholePageTimestamp, setReadingWholePageTimestamp] =
    useState(null);
  const readingWholePageTimestampRef = useRef(readingWholePageTimestamp);
  useEffect(() => {
    readingWholePageTimestampRef.current = readingWholePageTimestamp;
  }, [readingWholePageTimestamp]);
  const ttsPlayEndedResolverRef = useRef(null);

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

    setSettings((prev) => ({ ...prev, ...update }));
    const isOnOptionsPage =
      window.location.href.includes("extension://") &&
      window.location.href.includes("/options.html");

    if (isOnOptionsPage) {
      let _timer;
      clearTimeout(_timer);

      saveGlobalSettings(update).then(() => {
        const $status = document.getElementById("PNLReaderStatus");
        document.querySelector("#PNLReaderStatus>span").innerText =
          "Success! Global settings are saved.";
        $status.style.display = "block";
        _timer = setTimeout(() => {
          $status.style.display = "none";
        }, 3000);
      });
    } else {
      localStorage.setItem(
        "PNLReader-settings",
        JSON.stringify({ ...settings, ...update })
      );
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

  function exitVoiceMode() {
    setIsVoiceMode(false);
  }

  async function speak(text = "", node) {
    if (!text) return;
    if (utils.isSentence(text) || utils.isValidWordOrPhrase(text)) {
      const lang = (await detectLanguage(text, node)) || ttsLang || "";
      if (!lang) {
        console.warn("Could not detect language for text:", text);
        return;
      }
      setTtsStartTimestamp(Date.now());
      saveSettings({ ttsLang: lang });
      setTtsText(text);
      setTtsNextParagraphText("");
      setTtsLang(lang);
      setIsVoiceMode(true);
      setReadingWholePageTimestamp(null);
      ttsPlayEndedResolverRef.current = null;
      return true;
    }
  }

  const {
    injectParagraphSpeakers,
    clearActiveParagraphSpeaking,
    paragraphSelector,
    activateParagraphSpeaking,
  } = injectSpeakerOnPage(speak);

  function handleTTSPlayEnded(args) {
    if (ttsPlayEndedResolverRef.current) {
      ttsPlayEndedResolverRef.current(args);
      ttsPlayEndedResolverRef.current = null;
    }
  }

  async function readWholePage() {
    const articleContent = document.getElementById("PNLReaderArticleContent");
    if (!articleContent) return;
    // Get all visible paragraphs and block elements
    const blocks = Array.from(
      articleContent.querySelectorAll(paragraphSelector)
    );

    const lang =
      (await detectLanguage(articleContent.textContent)) || ttsLang || "";
    if (!lang) {
      console.error("Could not detect language for the page.");
      return;
    }
    saveSettings({ ttsLang: lang });
    setReadingWholePageTimestamp(Date.now());
    setTtsStartTimestamp(Date.now());

    for (let i = 0; i < blocks.length; i++) {
      try {
        // Await TTS playback for each paragraph
        const text = blocks[i].textContent.trim();
        if (!text) {
          continue;
        }

        const nextParagraphText = (() => {
          let j = i + 1;
          while (j < blocks.length) {
            const nextText_ = blocks[j].textContent.trim();
            if (nextText_) {
              return nextText_;
            }
            j++;
          }
          return "";
        })();

        // console.warn(
        //   "Reading paragraph:",
        //   text,
        //   "next paragraph:",
        //   nextParagraphText,
        //   "time:",
        //   new Date().toISOString()
        // );

        setTtsText(text);
        setTtsNextParagraphText(nextParagraphText);
        setTtsLang(lang);
        setIsVoiceMode(true);
        activateParagraphSpeaking(blocks[i]);

        // Wait for the TTSPlayer to finish before continuing

        await new Promise((resolve) => {
          const handler = (args) => {
            if (args.text !== text) return;
            if (args.voice !== (settings.voice || "Luna")) return;
            if (args.startTimestamp < readingWholePageTimestampRef.current)
              return;

            resolve();
          };
          ttsPlayEndedResolverRef.current = handler;
        });

        if (!readingWholePageTimestampRef.current) {
          break;
        }
      } catch (e) {
        console.warn("Skipping paragraph due to error:", e);
      }
    }
  }

  useEffect(() => {
    const handleSelectionSpeak = debounce(() => {
      const selection = window.getSelection();
      const selectedText = selection.toString().trim();
      if (selectedText && utils.isSentence(selectedText)) {
        // Only speak if it's a sentence for now
        highlightSelection(selection);
        speak(selectedText, selection.anchorNode).then((spokenTextChanged) => {
          if (spokenTextChanged) {
            clearActiveParagraphSpeaking();
          }
        });
      }
    }, 200);

    document.addEventListener("mouseup", handleSelectionSpeak);
    document.addEventListener("touchend", handleSelectionSpeak);

    return () => {
      document.removeEventListener("mouseup", handleSelectionSpeak);
      document.removeEventListener("touchend", handleSelectionSpeak);
      handleSelectionSpeak.cancel();
    };
  }, []);

  const updatedContent = useMemo(
    () => injectParagraphSpeakers(content),
    [content]
  );

  return html`
    <div id="PNLReader">
      <header
        id="PNLReaderHeader"
        class="sticky-on-top ${isHeaderHidden ? "hidden-header" : ""}"
      >
        <nav class="topbar">
          <h1 class="title">
            <a
              href="https://pnl.dev/topic/950/pnl-reader-simple-elegant-and-transparent"
              target="_blank"
              rel="noopener noreferrer"
              style="text-decoration: none; color: inherit;"
            >
              <img src=${AppLogo} alt="PNL Reader" />
              <span>PNL Reader</span>
            </a>
          </h1>
          <ul class="toolbar">
            <li>
              <button
                role="button"
                id="readPageBtn"
                class="secondary outline"
                onClick=${readWholePage}
                aria-label="Read the whole page"
                data-tooltip="Read the whole page"
                data-placement="bottom"
              >
                ${ReadPageIcon()}
              </button>
            </li>
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
            id="PNLReaderArticleContent"
            class="content"
            dangerouslySetInnerHTML=${{ __html: updatedContent }}
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
      html`<${TTSPlayer}
        text=${ttsText}
        nextParagraphText=${ttsNextParagraphText}
        lang=${ttsLang}
        startTimestamp=${ttsStartTimestamp}
        settings=${settings}
        saveSettings=${saveSettings}
        exitVoiceMode=${exitVoiceMode}
        onAudioPlayEnded=${handleTTSPlayEnded}
      />`}
    </div>
  `;
}
