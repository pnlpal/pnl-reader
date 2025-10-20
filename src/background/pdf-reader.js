import message from "./message.js";

function parsePDFURL(url) {
  const arxivRegex = /https?:\/\/(?:www\.)?arxiv\.org\/pdf\/[^\/]+$/;
  const acmRegex = /https?:\/\/dl\.acm\.org\/doi\/pdf\/\d+\.\d+\/\d+/;
  const generalPDFRegex = /https?:\/\/.*[.]pdf$/;

  const parse_ = (regexMatch = generalPDFRegex) => {
    if (regexMatch.test(url)) {
      const urlObj = new URL(url);

      // get from file param first
      const fileParam = urlObj.searchParams.get("file");
      if (regexMatch.test(fileParam)) {
        return fileParam;
      }

      // parse some common pdf extension
      // ie. chrome-extension://oemmndcbldboiebfnladdacbdfmadadm/file:///C:/Users/xxx/Documents/a.pdf
      const browserExtensionPattern =
        /^(chrome-extension:|extension:|edge-extension:|moz-extension:)\/\//;
      if (browserExtensionPattern.test(url)) {
        // Use regexMatch to extract the real PDF URL after the extension prefix
        const match = url.match(
          new RegExp(
            `${browserExtensionPattern.source}[^/]+/(${regexMatch.source})`
          )
        );
        return match?.[2];
      }

      return url;
    }
  };
  return parse_(arxivRegex) || parse_(acmRegex) || parse_(generalPDFRegex);
}

function setupPdfReader() {
  let pdfBlobUrl = null;
  let tempTabId = null;

  (chrome.action || chrome.browserAction).onClicked.addListener(async (tab) => {
    if (parsePDFURL(tab.url)) {
      const tempTab = await chrome.tabs.create({
        url:
          chrome.runtime.getURL("pdf-viewer.html") +
          "?file=" +
          encodeURIComponent(parsePDFURL(tab.url)),
      });
      tempTabId = tempTab.id;
    }
  });

  message.on("pdf content", async ({ blobUrl }) => {
    pdfBlobUrl = blobUrl;
    chrome.tabs.create({
      url: "https://pnl.dev/pdf-reader/",
    });
  });
  message.on("redirect to pnl-reader", async () => {
    chrome.tabs.update(tempTabId, {
      url: "https://pnl.dev/pdf-reader/",
    });
  });

  message.on("get pdf blob url", async () => {
    return { pdfBlobUrl };
  });
  message.on("finished reading pdf content", async () => {
    pdfBlobUrl = null;
  });
}

export { parsePDFURL, setupPdfReader };
