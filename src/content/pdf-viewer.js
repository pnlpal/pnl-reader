import { h, render } from "preact";
import ReaderApp from "./app.js";
import htm from "htm";
import styles from "./inject.scss";

import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "file-loader!pdfjs-dist/build/pdf.worker.mjs";
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const urlParams = new URLSearchParams(window.location.search);
const pdfUrl = urlParams.get("file");
console.log("PDF URL:", pdfUrl);

async function parsePDF(url) {
  const loadingTask = pdfjsLib.getDocument(url);
  const pdf = await loadingTask.promise;

  let textContent = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const text = await page.getTextContent();

    let previousY = null;
    text.items.forEach((item) => {
      const currentY = item.transform[5];

      // Add a newline if the Y position changes significantly
      if (previousY !== null && Math.abs(currentY - previousY) > 10) {
        textContent += "\n";
      }

      textContent += item.str;
      previousY = currentY;
    });

    textContent += "\n\n"; // Add a page break
  }
  return `<pre>${textContent}</pre>`;
}

const html = htm.bind(h);
let globalSettings;

// Function to enable read mode
async function enableReadMode() {
  const documentClone = document.cloneNode(true);
  // const article = isPDF()
  //   ? { content: await parsePDF(location.href) }
  //   : new Readability(documentClone).parse();
  const pdfContent = await parsePDF(pdfUrl);
  const article = { content: pdfContent };
  const pageData = {};

  function injectStyles() {
    const style = document.createElement("style");
    style.textContent = styles;
    document.head.appendChild(style);
  }
  injectStyles();

  render(
    html`<${ReaderApp} article=${article} pageData=${pageData} + />`,
    document.body
  );
}

enableReadMode();
