import { h } from "preact";
import htm from "htm";
import { useCallback, useState, useEffect } from "preact/hooks";
import text2Translation from "./text2Translation.js";
import getErrorBanner from "../errorMessages.js";

const html = htm.bind(h);

// Common languages for translation
const languages = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "ru", name: "Russian" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "zh", name: "Chinese (Simplified)" },
  { code: "zh-TW", name: "Chinese (Traditional)" },
  { code: "ar", name: "Arabic" },
  { code: "hi", name: "Hindi" },
  { code: "th", name: "Thai" },
  { code: "vi", name: "Vietnamese" },
  { code: "nl", name: "Dutch" },
  { code: "sv", name: "Swedish" },
  { code: "da", name: "Danish" },
  { code: "no", name: "Norwegian" },
  { code: "fi", name: "Finnish" },
  { code: "pl", name: "Polish" },
  { code: "tr", name: "Turkish" },
];

const getLanguageName = (code) => {
  const lang = languages.find((l) => l.code === code);
  return lang ? lang.name : code;
};

const Translator = ({
  text,
  lang,
  settings,
  saveSettings,
  onTranslationComplete,
  onError,
  onClose,
}) => {
  const [targetLang, setTargetLang] = useState(
    settings.translateTargetLang || ""
  );
  const [translatedText, setTranslatedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasError, setHasError] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Translate when text or target language changes
  useEffect(() => {
    if (!text || !lang || !targetLang || targetLang === lang) {
      setTranslatedText("");
      setError(null);
      setHasError(false);
      return;
    }

    performTranslation();
  }, [text, targetLang, lang]);

  const performTranslation = async () => {
    if (!text || !text.trim()) return;

    setLoading(true);
    setError(null);
    setHasError(false);

    try {
      const data = await text2Translation({
        text,
        fromLang: lang,
        targetLang: targetLang,
      });

      setTranslatedText(data.translation || "");
      if (data.isProUser === false) {
        setError({
          type: "in-trial",
          ...data,
        });
      }

      if (onTranslationComplete) {
        onTranslationComplete({
          text: text,
          fromLang: lang,
          targetLang: targetLang,
          ...data,
        });
      }
    } catch (err) {
      console.error("Translation error:", err);
      setError(err);
      setHasError(true);
      setTranslatedText("");

      if (onError) {
        onError(err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTargetLangChange = useCallback(
    (e) => {
      const lang = e.target.value;
      setTargetLang(lang);

      if (saveSettings) {
        saveSettings({ translateTargetLang: lang });
      }
    },
    [saveSettings]
  );

  const copyTranslation = async () => {
    if (!translatedText) return;

    try {
      await navigator.clipboard.writeText(translatedText);
      setCopySuccess(true);

      // Reset success state after 2 seconds
      setTimeout(() => {
        setCopySuccess(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy translation:", err);
    }
  };

  return html`
    <article class="translator-panel">
      <header class="translator-header">
        <div class="translator-lang-selector">
          <div class="translator-lang-info">
            <span class="translator-from-label hide-sm">From:</span>
            <span class="translator-from-lang hide-sm"
              >${getLanguageName(lang)}</span
            >
            <span class="translator-arrow">→</span>
            <span class="translator-to-label hide-sm">To:</span>
          </div>

          <select
            class="translator-target-select"
            value=${targetLang}
            onChange=${handleTargetLangChange}
            aria-label="Select target language"
          >
            ${languages
              .filter((l) => l.code !== "auto")
              .map(
                (lang) => html`
                  <option
                    value=${lang.code}
                    selected=${targetLang === lang.code}
                  >
                    ${lang.name}
                  </option>
                `
              )}
          </select>
        </div>
        ${onClose &&
        html`
          <button
            onClick=${onClose}
            type="button"
            class="translator-close-btn"
            aria-label="Close translator"
            data-tooltip="Close translator"
            data-placement="left"
          >
            ✕
          </button>
        `}
      </header>

      <!-- Loading State -->
      ${loading &&
      html`
        <div class="translator-loading">
          <div class="translator-spinner"></div>
          <p class="translator-loading-text">Translating...</p>
        </div>
      `}

      <!-- No Target Language Selected -->
      ${!loading &&
      !hasError &&
      !targetLang &&
      html`
        <div class="translator-prompt">
          <p class="translator-prompt-text">
            <span class="translator-prompt-icon">👆</span>
            Please select a target language to translate
          </p>
        </div>
      `}
      <!-- Same Language Warning -->
      ${!loading &&
      !hasError &&
      targetLang &&
      lang === targetLang &&
      html`
        <div class="translator-warning">
          <p class="translator-warning-text">
            <span class="translator-warning-icon">⚠️</span>
            Source and target languages are the same. Please choose a different
            target language.
          </p>
        </div>
      `}

      <!-- Success State -->
      ${!loading &&
      !hasError &&
      translatedText &&
      html`
        <div class="translator-content tts-paragraph-wrap">
          <p
            class="translator-result-text tts-paragraph"
            data-tts-lang=${targetLang}
          >
            ${translatedText}
          </p>

          <footer class="translator-footer">
            <button
              type="button"
              class="pnl-reader-paragraph-speaker"
              data-tooltip="Read translation"
              data-placement="top"
            >
              🔊
            </button>
            <button
              onClick=${copyTranslation}
              type="button"
              class="translator-copy-btn"
              data-tooltip=${copySuccess ? "Copied!" : "Copy translation"}
              data-placement="top"
            >
              ${copySuccess ? "✓" : "📋"}
            </button>
          </footer>
        </div>
      `}

      <!-- Error State -->
      ${error &&
      html`
        <div class="translator-error">
          ${getErrorBanner(error, "translation")}

          <button
            onClick=${performTranslation}
            type="button"
            hidden=${error.type === "in-trial" ? true : false}
            class="translator-retry-btn secondary"
          >
            🔄 Retry
          </button>
        </div>
      `}

      <!-- Empty State -->
      ${!loading &&
      !hasError &&
      !translatedText &&
      targetLang &&
      lang !== targetLang &&
      text &&
      html`
        <div class="translator-empty">
          <p class="translator-empty-text">No translation available</p>
        </div>
      `}
    </article>
  `;
};

export default Translator;
