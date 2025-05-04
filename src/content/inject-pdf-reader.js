chrome.runtime.sendMessage({ type: "get pdf blob url" }, (response) => {
  if (response && response.pdfBlobUrl) {
    const pdfBlobUrl = response.pdfBlobUrl;
    console.log("Received PDF blob URL:", pdfBlobUrl);
    // fetch blob content
    fetch(pdfBlobUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.blob();
      })
      .then((blob) => blob.arrayBuffer())
      .then((arrayBuffer) => {
        chrome.runtime.sendMessage({
          type: "finished reading pdf content",
        });
        (window.frames[0] || window).postMessage({
          type: "PDF_CONTENT",
          arrayBuffer: arrayBuffer,
        });
      })
      .catch((error) => {
        console.error("Error fetching PDF blob URL:", error);
      });
  } else {
    console.error("No PDF blob URL found in the response.");
  }
});
