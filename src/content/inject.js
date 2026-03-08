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

// Helper to get site customization matching current URL
function getSiteCustomization(globalSettings) {
  const configs = globalSettings.siteCustomizations || [];
  return configs.find((config) => {
    try {
      if (new RegExp(config.match).test(location.href)) return true;
    } catch (e) {
      // Ignore invalid regex
    }
    return location.href.includes(config.match);
  });
}

function applyCustomStyles(siteCustomization) {
  // 1. Check for site-specific CSS
  if (siteCustomization && siteCustomization.css) {
    const styleElement = document.createElement("style");
    // Auto-prefix all selectors with #PNLReaderArticle
    styleElement.textContent = prefixCssSelectors(
      siteCustomization.css,
      "#PNLReaderArticle",
    );
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

/**
 * Prefix all CSS selectors with a given prefix.
 * Handles @media queries but skips @keyframes.
 */
function prefixCssSelectors(css, prefix) {
  return css.replace(/([^{}]+)\{/g, (match, selectors) => {
    const trimmed = selectors.trim();
    // Skip @rules (media, keyframes, supports, etc.)
    if (trimmed.startsWith("@")) {
      return match;
    }
    // Skip if already prefixed
    if (trimmed.includes(prefix)) {
      return match;
    }
    // Prefix each selector in comma-separated list
    const prefixed = trimmed
      .split(",")
      .map((s) => `${prefix} ${s.trim()}`)
      .join(", ");
    return prefixed + " {";
  });
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

// Helper to extract HTML content from an element, including shadow DOM
function extractElementContent(el) {
  // If element has a shadow root, extract content from it
  if (el.shadowRoot) {
    // ShadowRoot doesn't have innerHTML, so we need to serialize children
    const temp = document.createElement("div");
    Array.from(el.shadowRoot.childNodes).forEach((child) => {
      if (child.nodeType === Node.ELEMENT_NODE) {
        // Skip style, script, link elements
        if (["STYLE", "SCRIPT", "LINK"].includes(child.tagName)) return;
        temp.appendChild(child.cloneNode(true));
      } else if (child.nodeType === Node.TEXT_NODE) {
        temp.appendChild(child.cloneNode(true));
      }
    });
    // Also check for slotted content
    const slots = el.shadowRoot.querySelectorAll("slot");
    slots.forEach((slot) => {
      const assigned = slot.assignedNodes({ flatten: true });
      assigned.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          temp.appendChild(node.cloneNode(true));
        } else if (
          node.nodeType === Node.TEXT_NODE &&
          node.textContent.trim()
        ) {
          temp.appendChild(node.cloneNode(true));
        }
      });
    });
    return temp.innerHTML;
  }
  // Use outerHTML for media elements that need to preserve the tag itself
  const outerHTMLTags = [
    "IMG",
    "VIDEO",
    "AUDIO",
    "PICTURE",
    "SOURCE",
    "IFRAME",
    "CANVAS",
    "SVG",
    "EMBED",
    "OBJECT",
  ];
  if (outerHTMLTags.includes(el.tagName)) {
    return el.outerHTML;
  }
  // Default to innerHTML for container elements
  return el.innerHTML;
}

// Helper to query elements including those with shadow DOM on the live document
function querySelectorAllWithShadow(selector) {
  // First try normal query on live document (not clone, since shadow DOM isn't cloned)
  const elements = document.querySelectorAll(selector);
  return Array.from(elements);
}

function getArticleContent(documentClone, siteCustomization) {
  // 1. Try finding content using formatted config
  if (siteCustomization?.article) {
    const articleConfig = siteCustomization.article;
    // If content selector is provided, try to find it
    if (articleConfig.content) {
      // Support array of selectors - combine content from all matches
      const selectors = Array.isArray(articleConfig.content)
        ? articleConfig.content
        : [articleConfig.content];

      const contentParts = [];
      selectors.forEach((selector) => {
        try {
          // Query live document to access shadow DOM
          const elements = querySelectorAllWithShadow(selector);
          elements.forEach((el) => {
            // Extract content (handles shadow DOM)
            let html = extractElementContent(el);
            // Create a temp container to apply excludes and clean styles
            const temp = document.createElement("div");
            temp.innerHTML = html;
            if (articleConfig.excludes) {
              removeUnwantedElements(temp, articleConfig.excludes);
            }
            // Remove inline styles from extracted content
            temp.querySelectorAll("[style]").forEach((styled) => {
              styled.removeAttribute("style");
            });
            // Remove any style tags that came with the content
            temp.querySelectorAll("style").forEach((s) => s.remove());
            contentParts.push(temp.innerHTML);
          });
        } catch (e) {
          console.warn("Invalid content selector:", selector, e);
        }
      });

      if (contentParts.length > 0) {
        const title = articleConfig.title
          ? document.querySelector(articleConfig.title)?.textContent ||
            documentClone.querySelector(articleConfig.title)?.textContent ||
            documentClone.title
          : documentClone.title;

        // Extract byline (author)
        let byline = null;
        if (articleConfig.byline) {
          byline =
            document.querySelector(articleConfig.byline)?.textContent ||
            documentClone.querySelector(articleConfig.byline)?.textContent;
        }

        // Extract published time
        let publishedTime = null;
        if (articleConfig.publishedTime) {
          const timeEl = document.querySelector(articleConfig.publishedTime);
          if (timeEl) {
            // Try datetime attribute first, then title, then textContent
            publishedTime =
              timeEl.getAttribute("datetime") ||
              timeEl.getAttribute("title") ||
              timeEl.textContent;
          }
        }

        const content = contentParts.join("\n");
        // Calculate text length (excluding HTML tags)
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = content;
        const textLength = tempDiv.textContent.length;

        return {
          content,
          title,
          byline,
          publishedTime,
          length: textLength,
          siteName: location.hostname,
        };
      }
    }

    // If no content selector provided, or selector failed, but we have exclude rules:
    // Apply excludes to body before passing to Readability
    if (articleConfig.excludes) {
      removeUnwantedElements(documentClone.body, articleConfig.excludes);
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
