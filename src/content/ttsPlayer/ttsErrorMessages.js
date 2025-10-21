import { h } from "preact";
import htm from "htm";
const html = htm.bind(h);

const pnlBase =
  process.env.NODE_ENV === "development"
    ? "http://localhost:4567"
    : "https://pnl.dev";

// Map error messages to user-friendly messages and actions
export default function getErrorBanner(error) {
  if (!error) return null;
  const errorMsg = error.message || String(error);

  if (errorMsg === "Unauthorized") {
    return html`
      <div class="tts-audio-error-banner">
        To use text-to-speech, please
        <a
          href="${pnlBase}/login"
          target="_blank"
          class="tts-error-action-link"
        >
          log in or sign up
        </a>
        at pnl.dev.
      </div>
    `;
  }

  // Add more mappings as needed
  // if (/quota/i.test(errorMsg)) { ... }

  // Default: show the error message
  return html`<div class="tts-audio-error-banner">${errorMsg}</div>`;
}
