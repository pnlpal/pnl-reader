const urlParams = new URLSearchParams(window.location.search);
const pdfUrl = urlParams.get("file");
console.log("PDF URL:", pdfUrl);

function fetchPDFContent() {
  return fetch(pdfUrl)
    .then(async (response) => {
      const blob = await response.blob();
      window.blob = blob;
      window.blobUrl = URL.createObjectURL(blob);
      console.log("Blob URL:", window.blobUrl);

      chrome.runtime.sendMessage({
        type: "pdf content",
        blobUrl: window.blobUrl,
      });

      // const readerUrl = "http://localhost:4200/pdf-reader-ii/";
      // window.open(readerUrl, "_blank");
    })
    .catch((error) => {
      console.error("Error fetching PDF content:", error);
      return null;
    });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "finished reading pdf content") {
    console.log("Finished reading PDF content");
    URL.revokeObjectURL(window.blobUrl);
    window.close();
  }
});

fetchPDFContent();
