import message from "./message.js";
import cloud from "./pnl-cloud.js";

message.on("speak text", async ({ text, options }) => {
  return cloud.ttsSpeak(text, options);
});
