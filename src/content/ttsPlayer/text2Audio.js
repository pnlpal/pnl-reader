"use strict";
import utils from "utils";
const CACHE_KEY = "PNLReader-tts-cache";
const CACHE_LIMIT = 10;

function getCache() {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    return cached ? JSON.parse(cached) : [];
  } catch (e) {
    console.warn("Failed to read TTS cache from localStorage:", e);
    return [];
  }
}

function setCache(cacheArr) {
  let arr = [...cacheArr];
  while (arr.length > 0) {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(arr));
      return;
    } catch (e) {
      if (
        e instanceof DOMException &&
        (e.name === "QuotaExceededError" ||
          e.name === "NS_ERROR_DOM_QUOTA_REACHED")
      ) {
        console.warn(
          "Storage quota exceeded when saving TTS cache, removing oldest cache item.",
          e
        );
        arr.shift();
      } else {
        console.error("Failed to save TTS cache to localStorage:", e);
        return;
      }
    }
  }
  // If we get here, nothing could be saved
  console.warn("Unable to save any cache due to storage quota limits.");
}

export default async (
  { text = "", lang = "en", voice = "Luna" },
  prefetch = false
) => {
  let speakResult;

  let cacheArr = getCache();

  // Find cached result
  const cachedSpeakResult = cacheArr.find(
    (item) => item.text === text && item.voice === voice
  );

  if (cachedSpeakResult) {
    // console.log(
    //   `${prefetch ? "[prefetch] " : "[speak]"}[from cache] Speaking text:`,
    //   text
    // );
    speakResult = cachedSpeakResult;
  } else {
    speakResult = await utils.send("speak text", {
      text,
      lang,
      voice,
    });

    // console.log(
    //   `${prefetch ? "[prefetch] " : "[speak]"}[new] Speaking text:`,
    //   text,
    //   "lang:",
    //   lang,
    //   "voice:",
    //   voice,
    //   "result:",
    //   speakResult.audio ? "success" : "error"
    // );

    // Add to cache, keep only last CACHE_LIMIT items
    if (speakResult.audio) {
      cacheArr.push({ text, voice, audio: speakResult.audio });
      if (cacheArr.length > CACHE_LIMIT) {
        cacheArr.shift();
      }
      setCache(cacheArr);
    }
  }

  if (speakResult.audio) {
    if (prefetch) {
      return;
    }
    const uint8 = new Uint8Array(speakResult.audio);
    const blob = new Blob([uint8], { type: "audio/mpeg" });
    const url = URL.createObjectURL(blob);
    return {
      url,
      trialsUsed: speakResult.trialsUsed,
      isProUser: speakResult.isProUser,
      trialsMaxAllowed: speakResult.trialsMaxAllowed,
    };
  } else {
    console.error("No audio received:", speakResult.error || "Unknown error");
    throw new Error(speakResult.error || "Unknown error");
  }
};
