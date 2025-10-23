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

  const getPrettyMessage = (msg) => {
    if (!msg) return "";

    const lowermsg = msg.toLowerCase();

    if (
      lowermsg.includes("failed to fetch") ||
      lowermsg.includes("networkerror") ||
      lowermsg.includes("network error") ||
      lowermsg.includes("fetch failed")
    ) {
      return "Network error or server is unreachable. Please try again later.";
    }
    if (lowermsg.includes("timeout")) {
      return "The request timed out. Please check your internet connection and try again.";
    }
    if (lowermsg.includes("forbidden")) {
      return "You do not have permission to access this resource.";
    }

    if (lowermsg.includes("internal server error")) {
      return "Server encountered an error. Please try again later.";
    }

    return msg;
  };
  const errorMsg = getPrettyMessage(
    error.message || error.status?.message || String(error)
  );

  if (errorMsg === "Unauthorized" || error.statusCode === 401) {
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
  } else if (error.type === "trial-limit-reached") {
    const { trialsUsed, maxTrialsAllowed } = error;
    return html`
      <div class="tts-audio-error-banner">
        Your trial limit (${trialsUsed}/${maxTrialsAllowed} used) has been
        reached. To continue using text-to-speech, please
        <a href="${pnlBase}/pro" target="_blank" class="tts-error-action-link">
          upgrade your account
        </a>
        .
      </div>
    `;
  } else if (error.type === "in-trial") {
    const { trialsUsed, trialsMaxAllowed } = error;
    return html`
      <div class="tts-audio-error-banner in-trial">
        You have used ${trialsUsed}/${trialsMaxAllowed} of your trial quota. Our
        text-to-speech service uses a proprietary API, which incurs real costs
        for each request. To continue using text-to-speech, please
        <a href="${pnlBase}/pro" target="_blank" class="tts-error-action-link">
          upgrade your account
        </a>
        .
      </div>
    `;
  } else if (errorMsg.includes("Media load rejected by URL safety check")) {
    return html`<div class="tts-audio-error-banner">
      The audio was blocked by the site's csp policy. This will be resolved in
      the next version. To help us prioritize this issue, please report this
      site at:
      <a href="https://pnl.dev/category/3/feedback" target="_blank">pnl.dev</a>
    </div>`;
  }
  // Add more mappings as needed
  // if (/quota/i.test(errorMsg)) { ... }

  // Default: show the error message
  return html`<div class="tts-audio-error-banner">${errorMsg}</div>`;
}
