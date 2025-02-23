import { Readability } from "@mozilla/readability";
import "./inject.scss";
import { h, render } from "preact";
import ReaderApp from "./app.js";
import htm from "htm";
const html = htm.bind(h);
let originalContent = document.body.cloneNode(true);
let isReadMode = !!document.getElementById("PNLReader");

// Function to enable read mode
function enableReadMode() {
  const documentClone = document.cloneNode(true);
  const article = new Readability(documentClone).parse();
  console.log("Article", article);

  if (article) {
    // Set Pico.css dark mode
    document.documentElement.setAttribute("data-theme", "dark");
    document.body.innerHTML = "";

    render(
      html`<${ReaderApp} article=${article} onToggle=${toggleReadMode} />`,
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
}
