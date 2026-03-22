function getVoices() {
  return new Promise((resolve) => {
    const voices = speechSynthesis.getVoices();
    if (voices.length > 0) {
      resolve(voices);
      return;
    }

    // Wait for voiceschanged event
    const handleVoicesChanged = () => {
      const voices = speechSynthesis.getVoices();
      if (voices.length > 0) {
        speechSynthesis.removeEventListener(
          "voiceschanged",
          handleVoicesChanged,
        );
        resolve(voices);
      }
    };

    speechSynthesis.addEventListener("voiceschanged", handleVoicesChanged);

    // Fallback timeout in case voiceschanged never fires
    setTimeout(() => {
      const voices = speechSynthesis.getVoices();
      speechSynthesis.removeEventListener("voiceschanged", handleVoicesChanged);
      resolve(voices);
    }, 1000);
  });
}

function checkSameLang(lang1, lang2, strictRegion = true) {
  if (!lang1 || !lang2) return false;
  if (strictRegion) {
    return (
      lang1.replace("_", "-").toLowerCase() ===
      lang2.replace("_", "-").toLowerCase()
    );
  } else {
    const base1 = lang1.split("-")[0];
    const base2 = lang2.split("-")[0];
    return base1 === base2;
  }
}

export default async (lang, unfiltered = false) => {
  const voices = await getVoices();
  return unfiltered
    ? voices
    : voices
        .filter((voice) => {
          return checkSameLang(voice.lang, lang, false);
        })
        .map((voice) => {
          return {
            name: voice.name,
            lang: voice.lang,
          };
        });
};
