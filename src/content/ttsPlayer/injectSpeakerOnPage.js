"use strict";
import utils from "utils";
import { clearHighlights } from "./highlightSelection.js";

export default (speak) => {
  function injectParagraphSpeakers(htmlContent) {
    // Parse the HTML and inject the speaker icon at the start of each <p>
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");
    doc.querySelectorAll("p").forEach((p) => {
      const pText = p.textContent.trim();
      if (
        !p.parentElement.classList.contains("tts-paragraph-wrap") &&
        (utils.isSentence(pText) || utils.isValidWordOrPhrase(pText))
      ) {
        const wrapper = document.createElement("div");
        wrapper.className = "tts-paragraph-wrap";
        p.parentNode.insertBefore(wrapper, p);
        wrapper.appendChild(p);

        const icon = document.createElement("span");
        icon.className = "pnl-reader-paragraph-speaker tts-speaker-icon";
        icon.textContent = "🔊";
        wrapper.insertBefore(icon, p);
      }
    });
    return doc.body.innerHTML;
  }

  function clearActiveParagraphSpeaking() {
    document
      .querySelectorAll("#PNLReaderArticleContent .tts-paragraph-wrap--active")
      .forEach((el) => el.classList.remove("tts-paragraph-wrap--active"));
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
        const wrapper = e.target.closest(".tts-paragraph-wrap");
        // Remove active class from all
        clearActiveParagraphSpeaking();
        // Clear any highlighted selection
        clearHighlights();
        // Add active class to this paragraph
        wrapper.classList.add("tts-paragraph-wrap--active");
        // Speak
        const p = wrapper.querySelector("p");
        speak(p.textContent, p);
      }
    });
    document._pnlReaderParagraphListenerAdded = true;
  }

  return {
    injectParagraphSpeakers,
    clearActiveParagraphSpeaking,
  };
};
