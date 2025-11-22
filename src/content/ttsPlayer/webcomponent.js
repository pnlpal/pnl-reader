import { render, h } from "preact";
import htm from "htm";
import TTSPlayer from "./ttsPlayer.js";
import picoStyles from "@picocss/pico/scss/pico.scss?inline";
import "@webcomponents/custom-elements";

const html = htm.bind(h);

let ttsPlayerStyles = "";
for (const node of document.head.childNodes) {
  if (node.tagName === "STYLE") {
    const style = node.innerHTML;
    if (style.includes("PNLTTSPlayerContainer")) {
      ttsPlayerStyles += style;
    }
  }
}

class PNLTTSPlayerElement extends HTMLElement {
  constructor() {
    super();

    // Create shadow DOM for isolation
    this.shadow = this.attachShadow({ mode: "closed" });

    // Create render target
    this.renderTarget = document.createElement("div");
    this.renderTarget.id = "PNLTTSPlayerContainer";
    this.shadow.appendChild(this.renderTarget);

    // Internal state
    this._isVisible = false;
    this._stylesInjected = false;
  }

  disconnectedCallback() {
    if (this.renderTarget) {
      render(null, this.renderTarget);
    }
  }

  connectedCallback() {
    // Inject styles into shadow DOM
    const injectStyles = () => {
      // Inject Pico CSS
      const picoStyleElement = document.createElement("style");
      picoStyleElement.textContent = picoStyles;
      this.shadow.appendChild(picoStyleElement);

      const styleElement = document.createElement("style");
      styleElement.textContent = ttsPlayerStyles;
      this.shadow.appendChild(styleElement);
    };

    const handleSaveSettings = (update) => {
      this._settings = { ...this._settings, ...update };
      try {
        localStorage.setItem(
          "pnl-tts-settings",
          JSON.stringify(this._settings)
        );
      } catch (e) {
        console.warn("Failed to save TTS settings");
      }

      // Force a re-render by calling show again with updated settings
      if (this._isVisible && this._currentText) {
        updatePlayer();
      }

      // Dispatch settings change event
      this.dispatchEvent(
        new CustomEvent("settingschange", {
          detail: update,
          bubbles: true,
        })
      );
    };

    const loadSettings = () => {
      try {
        const stored = localStorage.getItem("pnl-tts-settings");
        return stored ? JSON.parse(stored) : {};
      } catch (e) {
        return {};
      }
    };

    const updatePlayer = () => {
      const playerElement = html`
        <${TTSPlayer}
          text=${this._currentText}
          lang=${this._currentLang}
          settings=${this._settings}
          saveSettings=${handleSaveSettings}
          exitVoiceMode=${hide}
          ...${this._currentOptions}
        />
      `;

      render(playerElement, this.renderTarget);
    };

    // Show the player with text and language
    const show = (text, lang = "en", options = {}) => {
      if (!text || !text.trim()) {
        console.warn("No text provided to TTS player");
        return;
      }

      this._isVisible = true;
      this._currentText = text;
      this._currentLang = lang;
      this._currentOptions = options;

      updatePlayer();

      // Make sure the render target allows pointer events
      this.renderTarget.style.pointerEvents = "auto";

      // Add to DOM if not already there
      if (!this.parentNode) {
        document.body.appendChild(this);
      }

      // Dispatch show event
      this.dispatchEvent(
        new CustomEvent("show", {
          detail: { text, lang, options },
          bubbles: true,
        })
      );
    };

    const hide = () => {
      this._isVisible = false;
      render(null, this.renderTarget);

      if (this.parentNode) {
        this.parentNode.removeChild(this);
      }

      // Dispatch hide event
      this.dispatchEvent(
        new CustomEvent("hide", {
          bubbles: true,
        })
      );
    };

    if (!this._settings) {
      this._settings = loadSettings();
    }
    if (!this._stylesInjected) {
      injectStyles();
      this._stylesInjected = true;
    }
    this.show = show;
    this.hide = hide;
    console.log("PNL TTS Player Web Component connected");
  }
}

// Register the custom element
if (!customElements.get("pnl-tts-player")) {
  customElements.define("pnl-tts-player", PNLTTSPlayerElement);
}

window.createTTSPlayer = () => {
  if (document.querySelector("pnl-tts-player")) {
    return document.querySelector("pnl-tts-player");
  }
  const element = document.createElement("pnl-tts-player");
  document.documentElement.appendChild(element);
  return element;
};

window.addEventListener("message", (event) => {
  if (event.source !== window) return; // Only accept messages from the same window
  // Only accept messages from same origin for security
  if (event.origin !== window.location.origin) {
    return;
  }

  const { command, text, lang } = event.data;
  if (text && command === "pnl-tts-play") {
    const player = window.createTTSPlayer();
    player.show(text, lang);
  }
});
