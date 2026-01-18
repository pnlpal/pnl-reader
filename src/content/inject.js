import { Readability } from "@mozilla/readability";
import { h, render } from "preact";
import ReaderApp from "./app.js";
import htm from "htm";
import styles from "./inject.scss";

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
          el.textContent.includes("上一页"),
      )?.href,
      nextPageLink: Array.from(document.querySelectorAll("a")).find(
        (el) =>
          el.textContent.includes("Next") ||
          el.textContent.includes("下一章") ||
          el.textContent.includes("下一页"),
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

function cleanHtmlHead() {
  for (const node of document.head.childNodes) {
    if (node.tagName === "LINK" && node.rel === "stylesheet") {
      // console.log("Removing stylesheet:", node.href);
      node.remove();
    } else if (node.tagName === "SCRIPT") {
      // console.log("Removing script:", node.src);
      node.remove();
    } else if (node.tagName === "STYLE") {
      const style = node.innerHTML;
      const dictionariezKeyWords = [
        "dictionariez",
        "fairydict",
        "dictionaries-tooltip",
        "PNLReader",
      ];
      if (!dictionariezKeyWords.some((key) => style.includes(key))) {
        // console.log("Removing style:", style);
        node.remove();
      }
    }
  }
}

// Helper to get site customization matching current URL
function getSiteCustomization(globalSettings) {
  const configs = globalSettings.siteCustomizations || [];
  return configs.find((config) => {
    try {
      if (new RegExp(config.pattern).test(location.href)) return true;
    } catch (e) {
      // Ignore invalid regex
    }
    return location.href.includes(config.pattern);
  });
}

function applyCustomStyles(siteCustomization) {
  // 1. Check for site-specific CSS
  if (siteCustomization && siteCustomization.css) {
    const styleElement = document.createElement("style");
    styleElement.textContent = siteCustomization.css;
    document.head.appendChild(styleElement);
  }

  // 2. Check for global custom styles (legacy or override)
  const globalCustomStyles = localStorage.getItem("PNLReader-custom-styles");
  if (globalCustomStyles) {
    const styleElement = document.createElement("style");
    styleElement.textContent = globalCustomStyles;
    document.head.appendChild(styleElement);
  }
}

function removeUnwantedElements(element, selectors) {
  if (!selectors || !Array.isArray(selectors)) return;
  selectors.forEach((selector) => {
    try {
      const unwanted = element.querySelectorAll(selector);
      unwanted.forEach((el) => el.remove());
    } catch (e) {
      console.warn("Invalid selector:", selector, e);
    }
  });
}

function getArticleContent(documentClone, siteCustomization) {
  // 1. Try finding content using formatted config
  if (siteCustomization) {
    // If selector is provided, try to find it
    if (siteCustomization.selector) {
      const customArticle = documentClone.querySelector(
        siteCustomization.selector,
      );
      if (customArticle) {
        // Remove unwanted elements from the FOUND article
        if (siteCustomization.exclude) {
          removeUnwantedElements(customArticle, siteCustomization.exclude);
        }
        return {
          content: customArticle.innerHTML,
          title: documentClone.title,
          siteName: location.hostname,
        };
      }
    }

    // If no selector provided, or selector failed, but we have exclude rules:
    // Apply exclude rules to the documentClone BEFORE passing to Readability?
    // OR we can rely on Readability.
    // Let's apply excludes to body if no selector was successfully used.
    if (siteCustomization.exclude) {
      removeUnwantedElements(documentClone.body, siteCustomization.exclude);
    }
  }

  // 2. Legacy fallback
  const customArticleContentSelector = localStorage.getItem(
    "PNLReader-article-content-selector",
  );
  if (customArticleContentSelector) {
    const customArticle = documentClone.querySelector(
      customArticleContentSelector,
    );
    if (customArticle) {
      return {
        content: customArticle.innerHTML,
        title: documentClone.title,
      };
    }
  }

  // 3. Readability fallback
  return new Readability(documentClone).parse();
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
    chrome.runtime.sendMessage({ type: "reader mode enabled" });
    const pageData = getPageData();
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
