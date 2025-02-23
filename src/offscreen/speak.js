function playSynthesis(text) {
  if (window.speechSynthesis.speaking || !text) {
    return;
  }

  const msg = new SpeechSynthesisUtterance();
  msg.text = text;

  const voices = window.speechSynthesis.getVoices();

  msg.voice =
    voices.find((x) => x.name === "Google US English") ||
    voices.find((x) => x.lang === "en-US" && x.name === "Samantha") ||
    voices[0];

  window.speechSynthesis.speak(msg);
}

if (!navigator.userAgent.includes("Gecko/")) {
  // Firefox doesn't support offscreen, but it does have window and DOM in the background. So, we need to use the main thread.
  // Chrome supports offscreen, so we can use it.
  chrome.runtime.onMessage.addListener(({ type, text }) => {
    if (type === "speak") {
      playSynthesis(text);
    }
  });
}

export { playSynthesis };
