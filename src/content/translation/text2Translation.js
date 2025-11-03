"use strict";
import utils from "utils";
const CACHE_KEY = "PNLReader-translation-cache";
const CACHE_LIMIT = 10;

function getCache() {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    return cached ? JSON.parse(cached) : [];
  } catch (e) {
    console.warn("Failed to read translation cache from localStorage:", e);
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
          "Storage quota exceeded when saving translation cache, removing oldest cache item.",
          e
        );
        arr.shift();
      } else {
        console.error("Failed to save translation cache to localStorage:", e);
        return;
      }
    }
  }
  // If we get here, nothing could be saved
  console.warn("Unable to save any cache due to storage quota limits.");
}

export default async ({ text = "", fromLang, targetLang }) => {
  let result;

  let cacheArr = getCache();

  // Find cached result
  const cachedTranslationResult = cacheArr.find(
    (item) =>
      item.text === text &&
      item.fromLang === fromLang &&
      item.targetLang === targetLang
  );

  if (cachedTranslationResult) {
    result = cachedTranslationResult;
  } else {
    result = await utils.send("translate text", {
      text,
      fromLang,
      targetLang,
    });

    if (result.translation) {
      // Add to cache, keep only last CACHE_LIMIT items
      cacheArr.push({
        text,
        fromLang,
        targetLang,
        translation: result.translation,
      });
      if (cacheArr.length > CACHE_LIMIT) {
        cacheArr.shift();
      }
      setCache(cacheArr);
    }
  }

  if (result.translation) {
    return result;
  } else {
    console.error("No translation received:", result.error || "Unknown error");
    throw new Error(result.error || "Unknown error");
  }
};
