import "./pdf-viewer.less";
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "file-loader!pdfjs-dist/build/pdf.worker.mjs";
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const urlParams = new URLSearchParams(window.location.search);
const pdfUrl = urlParams.get("file");
console.log("PDF URL:", pdfUrl);
async function renderPDFWithText(url) {
  const loadingTask = pdfjsLib.getDocument(url);
  const pdf = await loadingTask.promise;

  const container = document.createElement("div");
  container.id = "pdf-container";
  document.body.appendChild(container);

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);

    // Create a container for the page
    const pageContainer = document.createElement("div");
    pageContainer.className = "pdf-page-container";
    container.appendChild(pageContainer);

    // Create a canvas for the visual rendering
    const canvas = document.createElement("canvas");
    canvas.className = "pdf-page";
    pageContainer.appendChild(canvas);

    const context = canvas.getContext("2d");
    const viewport = page.getViewport({ scale: 1.5 });

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    // Render the page into the canvas
    // await page.render({ canvasContext: context, viewport }).promise;

    // Extract and overlay the text
    const textContent = await page.getTextContent();
    const textLayerDiv = document.createElement("div");
    textLayerDiv.className = "textLayer";
    pageContainer.appendChild(textLayerDiv);

    // Use the TextLayer class to render the text layer8
    const textLayer = new pdfjsLib.TextLayer({
      textContentSource: textContent,
      container: textLayerDiv,
      viewport,
    });

    await textLayer.render();
  }
}

// Call the function to render the PDF with text
renderPDFWithText(pdfUrl);
