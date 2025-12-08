import { render, h } from "preact";
import htm from "htm";
import utils from "utils";
import Translator from "./translatorPanel.js";
import picoStyles from "@picocss/pico/scss/pico.scss?inline";
import "@webcomponents/custom-elements";

const html = htm.bind(h);

let translatorStyles = "";
for (const node of document.head.childNodes) {
  if (node.tagName === "STYLE") {
    const style = node.innerHTML;
    if (style.includes("PNLTranslatorContainer")) {
      translatorStyles += style;
    }
  }
}
let cachedTranslatorSettings = null;

class PNLTranslatorElement extends HTMLElement {
  constructor() {
    super();

    // Create shadow DOM for isolation
    this.shadow = this.attachShadow({ mode: "closed" });

    // Create render target
    this.renderTarget = document.createElement("div");
    this.renderTarget.id = "PNLTranslatorContainer";
    this.shadow.appendChild(this.renderTarget);

    // Internal state
    this._isVisible = false;
    this._stylesInjected = false;
    this._settings = cachedTranslatorSettings || {};
    this._escapeHandler = null;
  }

  disconnectedCallback() {
    if (this.renderTarget) {
      render(null, this.renderTarget);
    }
    // Remove escape key listener
    this.removeEscapeListener();
  }

  connectedCallback() {
    // Inject styles into shadow DOM
    const injectStyles = () => {
      // Set base font-size for rem calculations in shadow DOM
      const baseStyleElement = document.createElement("style");
      baseStyleElement.textContent = `
        :host {
          --pico-font-size: 18px;
          font-size: 18px !important;
          line-height: 1.5 !important;
        }
        
        * {
          box-sizing: border-box;
        }
      `;
      this.shadow.appendChild(baseStyleElement);

      // Inject Pico CSS
      const picoStyleElement = document.createElement("style");
      picoStyleElement.textContent = picoStyles;
      this.shadow.appendChild(picoStyleElement);

      const styleElement = document.createElement("style");
      styleElement.textContent = translatorStyles;
      this.shadow.appendChild(styleElement);
    };

    const handleSaveSettings = async (update) => {
      this._settings = { ...this._settings, ...update };
      cachedTranslatorSettings = this._settings;
      try {
        await utils.send("save setting", {
          key: "translatorSettings",
          value: JSON.stringify(this._settings),
        });
      } catch (e) {
        console.warn("Failed to save translator settings", e);
      }

      // Force a re-render by calling show again with updated settings
      if (this._isVisible && this._currentText) {
        updateTranslator();
      }

      // Dispatch settings change event
      this.dispatchEvent(
        new CustomEvent("settingschange", {
          detail: update,
          bubbles: true,
        })
      );
    };

    const updateTranslator = () => {
      const translatorElement = html`
        <${Translator}
          text=${this._currentText}
          lang=${this._currentLang}
          settings=${this._settings}
          saveSettings=${handleSaveSettings}
          onClose=${hide}
        />
      `;

      render(translatorElement, this.renderTarget);
    };
    const addEscapeListener = () => {
      if (!this._escapeHandler) {
        this._escapeHandler = (event) => {
          if (event.key === "Escape" && this._isVisible) {
            event.preventDefault();
            event.stopPropagation();
            this.hide();
          }
        };

        // Add to document to capture regardless of focus
        document.addEventListener("keydown", this._escapeHandler, true); // Use capture phase

        // Also add to window as backup
        window.addEventListener("keydown", this._escapeHandler, true);
      }
    };

    const removeEscapeListener = () => {
      if (this._escapeHandler) {
        document.removeEventListener("keydown", this._escapeHandler, true);
        window.removeEventListener("keydown", this._escapeHandler, true);
        this._escapeHandler = null;
      }
    };

    const hide = () => {
      this._isVisible = false;
      render(null, this.renderTarget);

      if (this.parentNode) {
        this.parentNode.removeChild(this);
      }

      // Remove escape key listener
      removeEscapeListener();

      // Dispatch hide event
      this.dispatchEvent(
        new CustomEvent("hide", {
          bubbles: true,
        })
      );
    };

    // Show the translator with text and language
    const show = (text, lang = "en", settings = {}) => {
      if (!text || !text.trim()) {
        console.warn("No text provided to Translator");
        return;
      }

      this._isVisible = true;
      this._currentText = text;
      this._currentLang = lang;
      this._settings = { ...settings, ...cachedTranslatorSettings };

      updateTranslator();

      // Make sure the render target allows pointer events
      this.renderTarget.style.pointerEvents = "auto";

      // Add to DOM if not already there
      if (!this.parentNode) {
        document.body.appendChild(this);
      }

      // Add escape key listener
      addEscapeListener();

      // Dispatch show event
      this.dispatchEvent(
        new CustomEvent("show", {
          detail: { text, lang, settings },
          bubbles: true,
        })
      );
    };

    if (!this._stylesInjected) {
      injectStyles();
      this._stylesInjected = true;
    }
    this.show = show;
    this.hide = hide;
    this.removeEscapeListener = removeEscapeListener;
    console.log("PNL Translator Web Component connected");
  }
}

function adjustTranslatorPosition(translator, selectionRect) {
  let translatorX = selectionRect.x + window.scrollX;
  let translatorY =
    selectionRect.y + selectionRect.height + window.scrollY + 50;
  let translatorRight;
  // Ensure translator stays within viewport bounds
  const viewportWidth = window.innerWidth;
  //   const viewportHeight = window.innerHeight;
  // Adjust if translator goes off-screen horizontally
  if (translatorX < 0) {
    translatorX = window.scrollX;
  }
  if (viewportWidth - translatorX < 400) {
    translatorRight = 30;
  }

  translator.style.cssText = `
        position: absolute;
        ${
          translatorRight
            ? `right: ${translatorRight}px`
            : `left: ${translatorX}px`
        };
        top: ${translatorY}px;
        width: ${selectionRect.width}px;
        min-width: 460px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 2147483647;
        `;
}

// Register the custom element
if (!customElements.get("pnl-translator")) {
  customElements.define("pnl-translator", PNLTranslatorElement);
}

window.createTranslator = () => {
  if (document.querySelector("pnl-translator")) {
    return document.querySelector("pnl-translator");
  }
  const element = document.createElement("pnl-translator");
  document.documentElement.appendChild(element);
  return element;
};

window.addEventListener("message", (event) => {
  if (event.source !== window) return; // Only accept messages from the same window
  // Only accept messages from same origin for security
  if (event.origin !== window.location.origin) {
    return;
  }

  const { command, text, lang, selectionRect, translatorSettings } = event.data;
  if (text && command === "pnl-translate") {
    const translator = window.createTranslator();
    translator.show(text, lang, translatorSettings);
    if (selectionRect) {
      adjustTranslatorPosition(translator, selectionRect);
    }
  }
});
