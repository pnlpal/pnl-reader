import message from "./message.js";

chrome.runtime.onInstalled.addListener(function (details) {
  if ([chrome.runtime.OnInstalledReason.INSTALL].includes(details.reason)) {
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

(chrome.action || chrome.browserAction).onClicked.addListener((tab) => {
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

  chrome.tabs.onUpdated.addListener(async (tabId, info) => {
    if (updatedTabId && tabId === updatedTabId && info.status === "complete") {
      try {
        updatedTabId = null;
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
