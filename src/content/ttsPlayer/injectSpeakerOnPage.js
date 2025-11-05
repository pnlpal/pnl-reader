"use strict";
import utils from "utils";
import { clearHighlights } from "./highlightSelection.js";
import getTextFromNode from "../getTextFromNode.js";

// Elements to support: paragraphs, headings, list items, blockquotes, etc.
const paragraphSelector =
  "p, h1, h2, h3, h4, h5, h6, li, blockquote, dt, dd, figcaption, summary";

export default (speak) => {
  function injectParagraphSpeakers(htmlContent) {
    // Parse the HTML and inject the speaker icon at the start of each <p>
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");

    doc.querySelectorAll(paragraphSelector).forEach((el) => {
      const elText = el.textContent.trim();
      if (
        !el.parentElement.classList.contains("tts-paragraph-wrap") &&
        (utils.isSentence(elText) || utils.isValidWordOrPhrase(elText))
      ) {
        const wrapper = document.createElement("div");
        wrapper.className = "tts-paragraph-wrap";
        el.classList.add("tts-paragraph");
        el.parentNode.insertBefore(wrapper, el);
        wrapper.appendChild(el);

        const icon = document.createElement("span");
        icon.className = "pnl-reader-paragraph-speaker tts-speaker-icon";
        icon.textContent = "🔊";
        wrapper.insertBefore(icon, el);
      }
    });
    return doc.body.innerHTML;
  }

  function activateParagraphSpeaking(
    el,
    focusMode = false,
    nextParagraphEl = null
  ) {
    const wrapper = el.classList.contains("tts-paragraph-wrap")
      ? el
      : el.closest(".tts-paragraph-wrap");

    const nextWrapper = nextParagraphEl
      ? nextParagraphEl.classList.contains("tts-paragraph-wrap")
        ? nextParagraphEl
        : nextParagraphEl.closest(".tts-paragraph-wrap")
      : null;

    if (!wrapper) return;
    // Remove active class from all
    clearActiveParagraphSpeaking();
    // Clear any highlighted selection
    clearHighlights();
    // Add active class to this paragraph
    wrapper.classList.add("tts-paragraph-wrap--active");
    if (focusMode) {
      wrapper.classList.add("tts-paragraph-wrap--active-focus");
    }
    if (nextWrapper) {
      nextWrapper.classList.add("tts-paragraph-wrap--active");
      nextWrapper.classList.add("tts-paragraph-wrap--active-next");
    }
    return wrapper;
  }

  function clearActiveParagraphSpeaking() {
    document
      .querySelectorAll("#PNLReaderArticleContent .tts-paragraph-wrap--active")
      .forEach((el) => {
        el.classList.remove("tts-paragraph-wrap--active");
        el.classList.remove("tts-paragraph-wrap--active-next");
        el.classList.remove("tts-paragraph-wrap--active-focus");
      });
  }

  // After rendering the HTML:
  if (!document._pnlReaderParagraphListenerAdded) {
    document.addEventListener("click", function (e) {
      if (
        e.target.classList.contains("pnl-reader-paragraph-speaker") ||
        e.target.parentElement.classList.contains(
          "pnl-reader-paragraph-speaker"
        )
      ) {
        const wrapper = activateParagraphSpeaking(e.target, true);
        // Speak
        if (wrapper) {
          const el = wrapper.querySelector(paragraphSelector);
          const text = getTextFromNode(el);
          speak(el, text);
        }
      }
    });
    document._pnlReaderParagraphListenerAdded = true;
  }

  return {
    paragraphSelector,
    injectParagraphSpeakers,
    clearActiveParagraphSpeaking,
    activateParagraphSpeaking,
  };
};
