import message from "./message.js";
import cloud from "./pnl-cloud.js";

// Simple in-memory cache for the last request
let lastKey = null;
let lastResult = null;
let isBusy = false;
let pending = [];

message.on("speak text", async ({ text, lang, voice }) => {
  const key = `${text}||${lang}||${voice}`;

  // If the last result matches, return it
  if (key === lastKey && lastResult) {
    return lastResult;
  }

  // If a task is running, queue this request and wait
  if (isBusy) {
    return new Promise((resolve, reject) => {
      pending.push({ key, text, lang, voice, resolve, reject });
    });
  }

  isBusy = true;
  try {
    const result = await cloud.ttsSpeak({ text, lang, voice });
    lastKey = key;
    lastResult = result;
    isBusy = false;

    // Resolve any pending requests that match this key
    pending = pending.filter((req) => {
      if (req.key === key) {
        req.resolve(result);
        return false;
      }
      return true;
    });

    return result;
  } catch (e) {
    isBusy = false;
    // Reject all pending requests
    pending.forEach((req) => req.reject(e));
    pending = [];
    throw e;
  }
});
