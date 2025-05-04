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
    })
    .catch((error) => {
      console.error("Error fetching PDF content:", error);
      const $loadingMessage = document.querySelector(".loading-message");
      $loadingMessage.style.display = "none";
      const $errorMessage = document.querySelector(".error-message");
      $errorMessage.style.display = "block";

      // Countdown timer
      let countdown = 5;
      const countdownElement = document.getElementById("countdown");
      countdownElement.textContent = countdown;

      const interval = setInterval(() => {
        countdown -= 1;
        countdownElement.textContent = countdown;

        if (countdown <= 0) {
          clearInterval(interval);
          chrome.runtime.sendMessage({
            type: "redirect to pnl-reader",
          });
        }
      }, 1000);
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
