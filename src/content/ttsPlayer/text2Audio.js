"use strict";
import utils from "utils";
import getSynthesisVoices from "../getSynthesisVoices.js";

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
          e,
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

// Create a synthesis voice player that can be controlled like an audio element
export async function createSynthesisPlayer(
  text,
  synthesisVoice,
  options = {},
) {
  const { rate = 1, volume = 1 } = options;
  let utterance;
  try {
    utterance = new SpeechSynthesisUtterance(text);
    const voices = await getSynthesisVoices(synthesisVoice.lang, true);
    const matchedVoice = voices.find(
      (v) => v.name === synthesisVoice.name && v.lang === synthesisVoice.lang,
    );
    // const matchedVoice = voices.find((v) => v.name === "Google US English");
    if (matchedVoice) {
      console.log("Using synthesis voice:", matchedVoice);
      utterance.voice = matchedVoice;
    } else {
      console.warn(
        "Requested synthesis voice not found, using default voice:",
        synthesisVoice,
      );
    }
    utterance.rate = rate;
    utterance.volume = volume;
  } catch (e) {
    console.error("Error creating SpeechSynthesisUtterance:", e);
    throw new Error("Speech synthesis is not supported in this browser.");
  }

  return {
    utterance,
    play: () => {
      if (speechSynthesis.paused) {
        console.log("Resuming paused speech synthesis");
        speechSynthesis.resume();
      } else {
        console.log("Starting new speech synthesis");
        speechSynthesis.speak(utterance);
      }
    },
    pause: () => {
      speechSynthesis.pause();
      console.log("Speech synthesis paused");
    },
    resume: () => {
      console.log("Resuming speech synthesis");
      speechSynthesis.resume();
    },
    cancel: () => {
      console.log("Cancelling speech synthesis");
      speechSynthesis.cancel();
    },
    isPaused: () => speechSynthesis.paused,
    isSpeaking: () => speechSynthesis.speaking,
    setRate: (r) => {
      utterance.rate = r;
    },
    setVolume: (v) => {
      utterance.volume = v;
    },
    onEnd: (callback) => {
      utterance.onend = callback;
    },
    onError: (callback) => {
      utterance.onerror = callback;
    },
  };
}

export default async (
  { text = "", lang = "en", voice = "Luna" },
  prefetch = false,
) => {
  let speakResult;

  let cacheArr = getCache();

  // Find cached result
  const cachedSpeakResult = cacheArr.find(
    (item) => item.text === text && item.voice === voice,
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
      synthesisVoices: await getSynthesisVoices(lang),
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
    if (speakResult.audio || speakResult.synthesisVoice) {
      cacheArr.push({
        text,
        voice,
        audio: speakResult.audio,
        synthesisVoice: speakResult.synthesisVoice,
      });
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
      type: "audio",
      url,
      trialsUsed: speakResult.trialsUsed,
      isProUser: speakResult.isProUser,
      trialsMaxAllowed: speakResult.trialsMaxAllowed,
    };
  } else if (speakResult.synthesisVoice) {
    if (prefetch) {
      return;
    }
    // Return synthesis voice info for ttsPlayer to control
    return {
      type: "synthesis",
      text,
      synthesisVoice: speakResult.synthesisVoice,
    };
  } else {
    console.error("No audio received:", speakResult.error || "Unknown error");
    throw new Error(speakResult.error || "Unknown error");
  }
};
