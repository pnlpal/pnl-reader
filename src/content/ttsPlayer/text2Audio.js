"use strict";
import utils from "utils";

export default async (text = "") => {
  console.log("Speaking text:", text);

  // check the cache first
  const cached = localStorage.getItem("PNLReader-tts");
  const cachedObj = cached ? JSON.parse(cached) : null;
  const speakResult =
    cachedObj?.text === text
      ? cachedObj
      : await utils.send("speak text", { text });
  if (cachedObj?.text === text) {
    console.log("Using cached TTS audio.");
  }

  console.log("Speak result:", speakResult);
  if (speakResult.audio) {
    // cache the result in local storage
    localStorage.setItem(
      "PNLReader-tts",
      JSON.stringify({ text, audio: speakResult.audio })
    );

    const uint8 = new Uint8Array(speakResult.audio);
    const blob = new Blob([uint8], { type: "audio/mpeg" });
    const url = URL.createObjectURL(blob);

    return url;
  } else {
    console.error(
      "No audio URL received.",
      speakResult.error || "Unknown error"
    );
    throw new Error(speakResult.error || "Unknown error");
  }
};
