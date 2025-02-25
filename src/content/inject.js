import { Readability } from "@mozilla/readability";
import "./inject.scss";
import { h, render } from "preact";
import ReaderApp from "./app.js";
import htm from "htm";
const html = htm.bind(h);
let originalContent = document.body.cloneNode(true);
let isReadMode = !!document.getElementById("PNLReader");

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
          el.textContent.includes("上一章")
      )?.href,
      nextPageLink: Array.from(document.querySelectorAll("a")).find(
        (el) =>
          el.textContent.includes("Next") || el.textContent.includes("下一章")
      )?.href,
    };
  };
  return scribblehub() || royalroad() || generalTry();
}

// Function to enable read mode
function enableReadMode() {
  const documentClone = document.cloneNode(true);
  const article = new Readability(documentClone).parse();

  if (article) {
    const pageData = getPageData();
    // Set Pico.css dark mode
    document.documentElement.setAttribute("data-theme", "dark");
    document.body.innerHTML = "";

    render(
      html`<${ReaderApp}
        article=${article}
        onToggle=${toggleReadMode}
        pageData=${pageData}
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
  } else {
    enableReadMode();
  }
  isReadMode = !isReadMode;
}

if (!isReadMode) {
  toggleReadMode();
} else {
  location.reload();
}
