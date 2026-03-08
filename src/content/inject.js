import { h, render } from "preact";
import ReaderApp from "./app.js";
import htm from "htm";
import styles from "./inject.scss";
import {
  getSiteCustomization,
  applyCustomStyles,
  getArticleContent,
} from "./siteCustomization.js";

const html = htm.bind(h);
const readerModeEnabledDate = document.documentElement.getAttribute(
  "data-pnl-reader-mode-date",
);
const readerModeExitDate = localStorage.getItem(
  "data-pnl-reader-mode-exit-date",
);
const isReadMode = !!readerModeEnabledDate;
let globalSettings;

function makePageVisible() {
  // Make body visible as we have hidden the unstyled page during loading.
  document.body.style.setProperty("visibility", "visible", "important");
}

function getPageData(siteCustomization) {
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

  const getFromCustomization = () => {
    if (
      siteCustomization &&
      siteCustomization.navigation &&
      typeof siteCustomization.navigation === "object"
    ) {
      const previousSelector = siteCustomization.navigation.previous;
      const nextSelector = siteCustomization.navigation.next;
      return {
        previousPageLink:
          previousSelector && document.querySelector(previousSelector)?.href,
        nextPageLink:
          nextSelector && document.querySelector(nextSelector)?.href,
      };
    }
  };

  const generalTry = () => {
    return {
      previousPageLink: Array.from(document.querySelectorAll("a")).find(
        (el) =>
          el.textContent.toLocaleLowerCase().includes("previous") ||
          el.textContent.match(/Prev[^\w]/) || // Such as lightnovelworld.co
          el.textContent.includes("上一章") ||
          el.textContent.includes("上一页"),
      )?.href,
      nextPageLink: Array.from(document.querySelectorAll("a")).find(
        (el) =>
          el.textContent.toLocaleLowerCase().includes("next") ||
          el.textContent.includes("下一章") ||
          el.textContent.includes("下一页"),
      )?.href,
    };
  };
  return getFromCustomization() || scribblehub() || royalroad() || generalTry();
}

async function getGlobalSettings() {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ type: "get settings" }, (response) => {
      resolve(response || {});
    });
  });
}

function cleanHtmlHead() {
  const keepKeywords = [
    "dictionariez",
    "fairydict",
    "dictionaries-tooltip",
    "PNLReader",
  ];

  // Clean head
  for (const node of Array.from(document.head.childNodes)) {
    if (node.tagName === "LINK" && node.rel === "stylesheet") {
      node.remove();
    } else if (node.tagName === "SCRIPT") {
      node.remove();
    } else if (node.tagName === "STYLE") {
      const style = node.innerHTML;
      if (!keepKeywords.some((key) => style.includes(key))) {
        node.remove();
      }
    }
  }

  // Also clean any styles/links in body (some sites inject there)
  document.body
    .querySelectorAll("style, link[rel='stylesheet']")
    .forEach((el) => {
      const content = el.innerHTML || el.href || "";
      if (!keepKeywords.some((key) => content.includes(key))) {
        el.remove();
      }
    });

  // Remove all inline styles from remaining elements
  document.querySelectorAll("[style]").forEach((el) => {
    // Keep only our reader container
    if (!el.closest("#PNLReader")) {
      el.removeAttribute("style");
    }
  });
}

function preventPageReload() {
  window.stop();
  const script = document.createElement("script");
  script.textContent = `
    window.location.reload = function() { console.log("PNLReader blocked reload"); };
    window.location.replace = function() { console.log("PNLReader blocked replace"); };
    window.location.assign = function() { console.log("PNLReader blocked assign"); };
  `;
  (document.head || document.documentElement).appendChild(script);
}

// Function to enable read mode
async function enableReadMode() {
  if (!globalSettings) {
    globalSettings = await getGlobalSettings();
    // console.log("Got global settings", globalSettings);
  }
  const documentClone = document.cloneNode(true);
  const siteCustomization = getSiteCustomization(globalSettings);

  const article = getArticleContent(documentClone, siteCustomization);

  if (article) {
    preventPageReload();
    chrome.runtime.sendMessage({ type: "reader mode enabled" });
    const pageData = getPageData(siteCustomization);
    document.documentElement.setAttribute(
      "data-pnl-reader-mode-date",
      Date.now(),
    );

    cleanHtmlHead();
    document.body.innerHTML = "";
    applyCustomStyles(siteCustomization);

    function injectStyles() {
      const style = document.createElement("style");
      style.textContent = styles;
      document.head.appendChild(style);
    }
    injectStyles();

    render(
      html`<${ReaderApp}
        article=${article}
        onToggle=${exitReadMode}
        pageData=${pageData}
        globalSettings=${globalSettings}
        +
      />`,
      document.body,
    );
    makePageVisible();
  } else {
    console.error("Failed to parse the article content.");
    makePageVisible();
  }
}
function exitReadMode() {
  localStorage.setItem("data-pnl-reader-mode-exit-date", Date.now());
  chrome.runtime.sendMessage({ type: "reader mode disabled" });
  location.reload();
}

// console.log("Reader mode:", readerModeEnabledDate);
if (readerModeEnabledDate && Date.now() - readerModeEnabledDate < 2000) {
  console.log("Read mode is enabled in the last 2 seconds. Ignoring.");
  makePageVisible();
} else if (
  readerModeExitDate &&
  Date.now() - parseInt(readerModeExitDate) < 2000
) {
  console.log("Read mode is disabled in the last 2 seconds. Ignoring.");
  makePageVisible();
  chrome.runtime.sendMessage({ type: "reader mode disabled" });
} else if (!isReadMode) {
  enableReadMode();
} else {
  exitReadMode();
}
