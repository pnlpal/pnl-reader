"use strict";
import utils from "utils";
import { clearHighlights } from "../ttsPlayer/highlightSelection.js";

export default (translate, paragraphSelector) => {
  function injectTranslator(htmlContent) {
    // Parse the HTML and inject the translator icon at the end of each paragraph
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");

    doc.querySelectorAll(paragraphSelector).forEach((el) => {
      const elText = el.textContent.trim();
      if (
        !el.querySelector(".pnl-reader-paragraph-translate") &&
        (utils.isSentence(elText) || utils.isValidWordOrPhrase(elText))
      ) {
        // Check if paragraph already has a wrapper (from speaker injection)
        let wrapper = el.closest(".tts-paragraph-wrap");

        if (!wrapper) {
          // Create wrapper if it doesn't exist
          wrapper = document.createElement("div");
          wrapper.className = "tts-paragraph-wrap";
          el.classList.add("tts-paragraph");
          el.parentNode.insertBefore(wrapper, el);
          wrapper.appendChild(el);
        }

        // Create translate icon
        const translateIcon = document.createElement("span");
        translateIcon.className =
          "pnl-reader-paragraph-translate pnl-reader-translate-icon";
        translateIcon.innerHTML = "🌐";

        translateIcon.title = "Translate this paragraph";

        // Append inside the paragraph element, at the end
        el.appendChild(translateIcon);

        // Create container for translator panel
        const translatorContainer = document.createElement("div");
        translatorContainer.className = "paragraph-translator-container";
        wrapper.appendChild(translatorContainer);
      }
    });

    return doc.body.innerHTML;
  }

  function activateParagraphTranslation(el) {
    const wrapper = el.classList.contains("tts-paragraph-wrap")
      ? el
      : el.closest(".tts-paragraph-wrap");

    if (!wrapper) return null;

    // Add visual feedback for translation
    wrapper.classList.add("tts-paragraph-wrap--translation");

    const translatorContainer = wrapper.querySelector(
      ".paragraph-translator-container"
    );
    translatorContainer.classList.add("paragraph-translator-container--active");
    return wrapper;
  }

  function showTranslationLoading(wrapper) {
    const translateIcon = wrapper.querySelector(
      ".pnl-reader-paragraph-translate"
    );
    if (translateIcon) {
      translateIcon.classList.add("pnl-reader-translate-icon--loading");
    }
  }

  function hideTranslationLoading(wrapper, success = true) {
    const translateIcon = wrapper.querySelector(
      ".pnl-reader-paragraph-translate"
    );
    if (translateIcon) {
      translateIcon.classList.remove("pnl-reader-translate-icon--loading");
      if (success) {
        translateIcon.classList.add("pnl-reader-translate-icon--success");
        setTimeout(() => {
          translateIcon.classList.remove("pnl-reader-translate-icon--success");
        }, 2000);
      } else {
        translateIcon.classList.add("pnl-reader-translate-icon--error");
        setTimeout(() => {
          translateIcon.classList.remove("pnl-reader-translate-icon--error");
        }, 2000);
      }
    }
  }

  // Event listener for translate icon clicks
  if (!document._pnlReaderTranslateListenerAdded) {
    document.addEventListener("click", function (e) {
      if (
        e.target.classList.contains("pnl-reader-paragraph-translate") ||
        e.target.parentElement.classList.contains(
          "pnl-reader-paragraph-translate"
        )
      ) {
        e.preventDefault();
        e.stopPropagation();

        const wrapper = activateParagraphTranslation(e.target);
        if (wrapper && translate) {
          const el = wrapper.querySelector(paragraphSelector);
          const text = el.textContent.trim();

          // Show loading state
          showTranslationLoading(wrapper);

          // Call translate function
          translate(
            el,
            text,
            wrapper.querySelector(".paragraph-translator-container")
          )
            .then(() => {
              hideTranslationLoading(wrapper, true);
            })
            .catch((error) => {
              console.error("Translation error:", error);
              hideTranslationLoading(wrapper, false);
            });
        }
      }
    });
    document._pnlReaderTranslateListenerAdded = true;
  }

  return {
    injectTranslator,
    activateParagraphTranslation,
  };
};
