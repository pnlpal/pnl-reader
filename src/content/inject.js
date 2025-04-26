import { Readability } from "@mozilla/readability";
import { h, render } from "preact";
import ReaderApp from "./app.js";
import htm from "htm";
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "file-loader!pdfjs-dist/build/pdf.worker.mjs";
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
import styles from "./inject.scss";

function isPDF() {
  return (
    location.pathname.endsWith(".pdf") ||
    document.contentType === "application/pdf"
  );
}
async function parsePDF(url) {
  const loadingTask = pdfjsLib.getDocument(url);
  const pdf = await loadingTask.promise;

  let textContent = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const text = await page.getTextContent();
    text.items.forEach((item) => {
      textContent += item.str + " ";
    });
  }
  return textContent;
}

const html = htm.bind(h);
const readerModeEnabledDate = document.documentElement.getAttribute(
  "data-pnl-reader-mode-date"
);
const readerModeExitDate = localStorage.getItem(
  "data-pnl-reader-mode-exit-date"
);
const isReadMode = !!readerModeEnabledDate;
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
  // const article = isPDF()
  //   ? { content: await parsePDF(location.href) }
  //   : new Readability(documentClone).parse();

  if (isPDF()) {
    const pdfViewerUrl = chrome.runtime.getURL("pdf-viewer.html");
    window.open(
      `${pdfViewerUrl}?file=${encodeURIComponent(location.href)}`,
      "_blank"
    );
    return;
  }

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
        onToggle=${exitReadMode}
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
function exitReadMode() {
  localStorage.setItem("data-pnl-reader-mode-exit-date", Date.now());
  chrome.runtime.sendMessage({ type: "reader mode disabled" });
  location.reload();
}
// console.log("Reader mode:", readerModeEnabledDate);
if (readerModeEnabledDate && Date.now() - readerModeEnabledDate < 2000) {
  console.log("Read mode is enabled in the last 2 seconds. Ignoring.");
} else if (
  readerModeExitDate &&
  Date.now() - parseInt(readerModeExitDate) < 2000
) {
  console.log("Read mode is disabled in the last 2 seconds. Ignoring.");
  chrome.runtime.sendMessage({ type: "reader mode disabled" });
} else if (!isReadMode) {
  enableReadMode();
} else {
  exitReadMode();
}
