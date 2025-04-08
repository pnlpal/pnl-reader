import { Readability } from "@mozilla/readability";
import { h, render } from "preact";
import ReaderApp from "./app.js";
import htm from "htm";

import styles from "./inject.scss";

const html = htm.bind(h);
let originalContent = document.body.cloneNode(true);
let readerModeEnabledDate = document.documentElement.getAttribute(
  "data-pnl-reader-mode-date"
);
let isReadMode = !!readerModeEnabledDate;
let globalSettings;

function getPageData() {
  const scribblehub = () => {
    if (location.host === "www.scribblehub.com") {
      return {
        previousPageLink: document.querySelector("a.btn-prev:not(.disabled)")
          ?.href,
        nextPageLink: document.querySelector("a.btn-next:not(.disabled)")?.href,
      };
    }
  };
  const royalroad = () => {
    if (location.host === "www.royalroad.com") {
      const buttons = document.querySelectorAll(".nav-buttons .btn-primary");
      if (buttons.length > 1)
        return {
          previousPageLink: buttons[0]?.href,
          nextPageLink: buttons[1]?.href,
        };
    }
  };

  const generalTry = () => {
    return {
      previousPageLink: Array.from(document.querySelectorAll("a")).find(
        (el) =>
          el.textContent.includes("Previous") ||
          el.textContent.match(/Prev[^\w]/) || // Such as lightnovelworld.co
          el.textContent.includes("上一章") ||
          el.textContent.includes("上一页")
      )?.href,
      nextPageLink: Array.from(document.querySelectorAll("a")).find(
        (el) =>
          el.textContent.includes("Next") ||
          el.textContent.includes("下一章") ||
          el.textContent.includes("下一页")
      )?.href,
    };
  };
  return scribblehub() || royalroad() || generalTry();
}

async function getGlobalSettings() {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ type: "get settings" }, (response) => {
      resolve(response || {});
    });
  });
}

// Function to enable read mode
async function enableReadMode() {
  const documentClone = document.cloneNode(true);
  const article = new Readability(documentClone).parse();

  if (article) {
    chrome.runtime.sendMessage({ type: "reader mode enabled" });
    const pageData = getPageData();
    document.documentElement.setAttribute(
      "data-pnl-reader-mode-date",
      Date.now()
    );

    if (!globalSettings) {
      globalSettings = await getGlobalSettings();
      console.log("Got global settings", globalSettings);
    }
    document.head.innerHTML = "";
    document.body.innerHTML = "";

    function injectStyles() {
      const style = document.createElement("style");
      style.textContent = styles;
      document.head.appendChild(style);
    }
    injectStyles();

    render(
      html`<${ReaderApp}
        article=${article}
        onToggle=${toggleReadMode}
        pageData=${pageData}
        globalSettings=${globalSettings}
        +
      />`,
      document.body
    );
  } else {
    console.error("Failed to parse the article content.");
  }
}
function toggleReadMode() {
  if (isReadMode) {
    document.body = originalContent;
    const PNLReader = document.getElementById("PNLReader");
    if (PNLReader) {
      PNLReader.remove();
    }
    document.documentElement.removeAttribute("data-theme");
    chrome.runtime.sendMessage({ type: "reader mode disabled" });
  } else {
    enableReadMode();
  }
  isReadMode = !isReadMode;
}
// console.log("Reader mode:", readerModeEnabledDate);
if (readerModeEnabledDate && Date.now() - readerModeEnabledDate < 2000) {
  console.log("Read mode is enabled in the last 2 seconds. Ignoring.");
} else if (!isReadMode) {
  toggleReadMode();
} else {
  chrome.runtime.sendMessage({ type: "reader mode disabled" });
  location.reload();
}
