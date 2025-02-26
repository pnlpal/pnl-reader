import message from "./message.js";

chrome.runtime.onInstalled.addListener(function (details) {
  const manifestData = chrome.runtime.getManifest();
  if (
    [chrome.runtime.OnInstalledReason.INSTALL].includes(details.reason) &&
    details.previousVersion != manifestData.version
  ) {
    chrome.tabs.create({
      url: chrome.runtime.getURL("welcome.html"),
    });
  }
});

chrome.runtime.onMessage.addListener(function (...args) {
  message.handle(...args);
  // sendResponse becomes invalid when the event listener returns,
  // unless you return true from the event listener to indicate you wish to send a response asynchronously
  return true;
});

chrome.action.onClicked.addListener((tab) => {
  if (!tab.url.includes("chrome://")) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["inject.bundle.js"],
    });
  }
});

(function setupPageUpdater() {
  let updatedTabId = null;
  let timer = null;

  message.on("goToLink", async ({ url }, sender) => {
    const tabId = sender.tab.id;
    await chrome.tabs.update(tabId, { url });
    updatedTabId = tabId;

    clearTimeout(timer);
    timer = setTimeout(() => {
      updatedTabId = null;
    }, 5000);
  });

  chrome.tabs.onUpdated.addListener((tabId) => {
    if (tabId === updatedTabId) {
      updatedTabId = null;
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ["inject.bundle.js"],
      });
    }
  });
})();
