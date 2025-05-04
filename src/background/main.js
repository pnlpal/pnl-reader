import message from "./message.js";

chrome.runtime.onInstalled.addListener(function (details) {
  if ([chrome.runtime.OnInstalledReason.INSTALL].includes(details.reason)) {
    chrome.tabs.create({
      url: chrome.runtime.getURL("options.html"),
    });
  }
});

chrome.runtime.onMessage.addListener(function (...args) {
  message.handle(...args);
  // sendResponse becomes invalid when the event listener returns,
  // unless you return true from the event listener to indicate you wish to send a response asynchronously
  return true;
});

function parsePDFURL(url) {
  if (url.endsWith(".pdf")) {
    const urlObj = new URL(url);
    const fileParam = urlObj.searchParams.get("file");
    if (fileParam?.endsWith(".pdf")) {
      return fileParam;
    }
    if (url.startsWith("chrome-extension://")) {
      // ie. chrome-extension://oemmndcbldboiebfnladdacbdfmadadm/file:///C:/Users/xxx/Documents/a.pdf
      return url.match(/(file|http|https):\/\/.*\.pdf/)?.[0];
    }

    return url;
  }
}

(function setupPageUpdater() {
  let enabledTabs = [];
  chrome.storage.local.get("enabledTabs", (data) => {
    enabledTabs = data.enabledTabs || [];
    // console.log("Enabled tabs:", enabledTabs);
  });

  (chrome.action || chrome.browserAction).onClicked.addListener((tab) => {
    if (parsePDFURL(tab.url)) {
      return;
    } else if (!tab.url.includes("chrome://")) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["inject.bundle.js"],
      });
    }
  });

  message.on("reader mode enabled", async (_, sender) => {
    // console.log("Enabled reader mode", sender.tab.id);
    if (!enabledTabs.includes(sender.tab.id)) {
      enabledTabs.push(sender.tab.id);
      chrome.storage.local.set({ enabledTabs });
    }
  });
  message.on("reader mode disabled", async (_, sender) => {
    // console.log("Disable reader mode", sender.tab.id);
    enabledTabs = enabledTabs.filter((id) => id !== sender.tab.id);
    chrome.storage.local.set({ enabledTabs });
  });

  message.on("save settings", async ({ globalSettings }) => {
    // console.log("Save settings", settings);
    chrome.storage.local.set({ globalPNLReaderSettings: globalSettings });
  });
  message.on("get settings", async () => {
    // console.log("Get settings");
    return new Promise(async (resolve) => {
      chrome.storage.local.get("globalPNLReaderSettings", (data) => {
        resolve(data?.globalPNLReaderSettings);
      });
    });
  });

  chrome.tabs.onRemoved.addListener(async function (tid) {
    // console.log("Tab removed", tid);
    enabledTabs = enabledTabs.filter((id) => id !== tid);
    chrome.storage.local.set({ enabledTabs });
  });

  chrome.tabs.onUpdated.addListener(async (tabId, info) => {
    // console.log("Tab updated", tabId, info);
    if (info.status === "complete" && enabledTabs.includes(tabId)) {
      try {
        // console.log("Executing script", tabId);
        await chrome.scripting.executeScript({
          target: { tabId: tabId },
          files: ["inject.bundle.js"],
        });
      } catch (e) {
        console.error("Exec script error", e);
      }
    }
  });
})();

(function setupPdfReader() {
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
})();
