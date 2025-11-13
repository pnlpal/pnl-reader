import { render, h } from "preact";
import htm from "htm";
import TTSPlayer from "./ttsPlayer.js";
import picoStyles from "@picocss/pico/scss/pico.scss?inline";

const html = htm.bind(h);

let ttsPlayerStyles = "";
for (const node of document.head.childNodes) {
  if (node.tagName === "STYLE") {
    const style = node.innerHTML;
    if (style.includes("PNLTTSPlayerContainer")) {
      ttsPlayerStyles = style;
    }
  }
}

class PNLTTSPlayerElement extends HTMLElement {
  constructor() {
    super();

    // Create shadow DOM for isolation
    this.shadow = this.attachShadow({ mode: "closed" });

    // Create and inject styles
    this.injectStyles();

    // Create render target
    this.renderTarget = document.createElement("div");
    this.renderTarget.id = "PNLTTSPlayerContainer";
    this.shadow.appendChild(this.renderTarget);

    // Internal state
    this._isVisible = false;
    this._settings = this.loadSettings();
  }

  // Inject styles into shadow DOM
  injectStyles() {
    // Inject Pico CSS
    const picoStyleElement = document.createElement("style");
    picoStyleElement.textContent = picoStyles;
    this.shadow.appendChild(picoStyleElement);

    const styleElement = document.createElement("style");
    styleElement.textContent = ttsPlayerStyles;
    this.shadow.appendChild(styleElement);
  }

  // Add this helper method to update the player
  updatePlayer() {
    const playerElement = html`
      <${TTSPlayer}
        text=${this._currentText}
        lang=${this._currentLang}
        settings=${this._settings}
        saveSettings=${(update) => this.handleSaveSettings(update)}
        exitVoiceMode=${() => this.hide()}
        ...${this._currentOptions}
      />
    `;

    render(playerElement, this.renderTarget);
  }

  // Show the player with text and language
  show(text, lang = "en", options = {}) {
    if (!text || !text.trim()) {
      console.warn("No text provided to TTS player");
      return;
    }

    this._isVisible = true;
    this._currentText = text;
    this._currentLang = lang;
    this._currentOptions = options;

    this.updatePlayer();

    // Position the web component itself
    this.style.cssText = `
  position: fixed !important;
  top: 20px !important;
  right: 20px !important;
  z-index: 2147483647 !important;
  pointer-events: none !important;
`;
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
    return this;
  }

  // Hide the player
  hide() {
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
    return this;
  }

  // Handle settings updates
  handleSaveSettings(update) {
    this._settings = { ...this._settings, ...update };
    this.saveSettings(this._settings);

    // Force a re-render by calling show again with updated settings
    if (this._isVisible && this._currentText) {
      this.updatePlayer();
    }

    // Dispatch settings change event
    this.dispatchEvent(
      new CustomEvent("settingschange", {
        detail: update,
        bubbles: true,
      })
    );
  }

  // Load settings from localStorage
  loadSettings() {
    try {
      const stored = localStorage.getItem("pnl-tts-settings");
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      return {};
    }
  }

  // Save settings to localStorage
  saveSettings(settings) {
    try {
      localStorage.setItem("pnl-tts-settings", JSON.stringify(settings));
    } catch (e) {
      console.warn("Failed to save TTS settings");
    }
  }

  // Get current visibility state
  isVisible() {
    return this._isVisible;
  }

  disconnectedCallback() {
    if (this.renderTarget) {
      render(null, this.renderTarget);
    }
  }
}

// Register the custom element
if (!customElements.get("pnl-tts-player")) {
  customElements.define("pnl-tts-player", PNLTTSPlayerElement);
}

// At the end of the file, add these for easy usage:
window.createTTSPlayer = () => document.createElement("pnl-tts-player");
window.showTTSPlayer = (text, lang, options) => {
  const player = window.createTTSPlayer();
  return player.show(text, lang, options);
};

showTTSPlayer(
  "The pendulum of an antique clock swung soundlessly on the wall, its rhythmic ticking absent in the stillness.",
  "en"
);
