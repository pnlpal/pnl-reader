import message from "./message.js";
import "./speak.js";
import { parsePDFURL, setupPdfReader } from "./pdf-reader.js";

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

(function setupPageUpdater() {
  let enabledTabs = []; // [{ id: tabId, url: "https://..." }, ...]

  chrome.storage.local.get("enabledTabs", (data) => {
    if (data?.enabledTabs?.every((x) => x.id)) {
      enabledTabs = data.enabledTabs;
    }
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
    // Remove any previous entry for this tab
    if (!sender.tab.id) {
      return;
    }
    enabledTabs = enabledTabs.filter((t) => t.id !== sender.tab.id);
    enabledTabs.push({ id: sender.tab.id, url: sender.tab.url });
    chrome.storage.local.set({ enabledTabs });
  });
  message.on("reader mode disabled", async (_, sender) => {
    // console.log("Disable reader mode", sender.tab.id);
    enabledTabs = enabledTabs.filter((t) => t.id !== sender.tab.id);
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
    enabledTabs = enabledTabs.filter((t) => t.id !== tid);
    chrome.storage.local.set({ enabledTabs });
  });

  chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
    // console.log("Tab updated", tabId, info, tab);
    const previousTabInfo = enabledTabs.find((t) => t.id === tabId);

    // check if the host is changed, but it only works on Firefox as only firefox gives the url in tab.
    if (tab?.url) {
      const previousHost = new URL(previousTabInfo.url).host;
      const currentHost = new URL(tab.url).host;
      if (previousHost !== currentHost) {
        // host changed, remove from enabledTabs
        // console.log(
        //   "Host changed, disable reader mode",
        //   tabId,
        //   previousHost,
        //   "->",
        //   currentHost
        // );
        enabledTabs = enabledTabs.filter((t) => t.id !== tabId);
        chrome.storage.local.set({ enabledTabs });
        return;
      }
    }

    // Step 1: Hide the page as soon as navigation starts to avoid flash of unstyled page.
    if (info.status === "loading" && previousTabInfo) {
      try {
        await chrome.scripting.insertCSS({
          target: { tabId: tabId },
          css: "body { visibility: hidden !important; }",
        });
      } catch (e) {
        console.error("Insert CSS error", e);
      }
    }
    // Step 2: Inject the script when the page is fully loaded
    if (info.status === "complete" && previousTabInfo) {
      try {
        // console.log("Executing script", tabId);
        await chrome.scripting.executeScript({
          target: { tabId: tabId },
          files: ["inject.bundle.js"],
        });
      } catch (e) {
        console.error("Exec script error", e);

        // recover page
        chrome.scripting.insertCSS({
          target: { tabId: tabId },
          css: "body { visibility: visible !important; }",
        });
      }
    }
  });
})();

setupPdfReader();
