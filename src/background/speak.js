import message from "./message.js";
import cloud from "./pnl-cloud.js";

message.on("speak text", async ({ text, lang, voice }) => {
  return cloud.ttsSpeak({ text, lang, voice });
});
