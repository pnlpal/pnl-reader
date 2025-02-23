import { Readability } from "@mozilla/readability";
import "./inject.scss";

let originalContent = document.body.cloneNode(true);
let isReadMode = false;

// Function to enable read mode
function enableReadMode() {
  const documentClone = document.cloneNode(true);
  const article = new Readability(documentClone).parse();
  console.log("Article", article);
  const wrapperDiv = document.createElement("div");

  function createToggleButton() {
    const toggleButton = document.createElement("button");
    toggleButton.id = "toggleReadModeBtn";
    toggleButton.innerText = "Toggle Read Mode";
    toggleButton.className =
      "fixed top-4 right-4 px-4 py-2 bg-blue-500 text-white rounded shadow";
    toggleButton.onclick = toggleReadMode;

    wrapperDiv.appendChild(toggleButton);
  }

  function renderArticleInWrapper() {
    const mainContentDiv = document.createElement("article");
    mainContentDiv.className = "container";
    mainContentDiv.innerHTML = article.content;

    wrapperDiv.className = "pnl-read-mode-wrapper";
    wrapperDiv.appendChild(mainContentDiv);
    document.body.appendChild(wrapperDiv);
  }

  if (article) {
    // Set Pico.css dark mode
    document.documentElement.setAttribute("data-theme", "dark");
    document.body.innerHTML = "";
    renderArticleInWrapper(article);
    createToggleButton();
  } else {
    console.error("Failed to parse the article content.");
  }
}
function toggleReadMode() {
  if (isReadMode) {
    document.body.innerHTML = "";
    document.body.appendChild(originalContent.cloneNode(true));
    const readModeStyle = document.getElementById("readModeStyle");
    if (readModeStyle) {
      readModeStyle.remove();
    }
    document.documentElement.removeAttribute("data-theme");
  } else {
    enableReadMode();
  }
  isReadMode = !isReadMode;
}

// toggleReadMode();
