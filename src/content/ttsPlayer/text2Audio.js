"use strict";
import utils from "utils";

export default async (text = "", lang = "en") => {
  let speakResult;

  // check the cache first
  const cached = localStorage.getItem("PNLReader-tts");
  const cachedObj = cached ? JSON.parse(cached) : null;
  const cachedSpeakResult = cachedObj?.text === text ? cachedObj : null;
  if (cachedSpeakResult) {
    console.log("Speaking text:", text);
    console.log("Using cached TTS audio.");
    speakResult = cachedSpeakResult;
  } else {
    console.log("Speaking text:", text, "lang:", lang);
    speakResult = await utils.send("speak text", {
      text,
      lang,
    });
    console.log("Got speak result:", speakResult);
  }

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
