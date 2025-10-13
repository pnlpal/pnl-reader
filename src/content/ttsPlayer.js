import { h } from "preact";
import htm from "htm";
import { useCallback } from "preact/hooks";
import AudioPlayer from "react-h5-audio-player";

import MaleIcon from "../images/male.png";
import FemaleIcon from "../images/female.png";

const html = htm.bind(h);

const voices = [
  { id: "male", title: "Male Voice", icon: MaleIcon },
  { id: "female", title: "Female Voice", icon: FemaleIcon },
];

const repeatModes = [
  { id: "none", label: "No Repeat", title: "No Repeat" },
  { id: "sentence", label: "Repeat Sentence", title: "Repeat Sentence" },
  { id: "paragraph", label: "Repeat Paragraph", title: "Repeat Paragraph" },
];

const speeds = [0.5, 1, 1.2, 1.5, 2];

const TTSPlayer = ({ src, settings, saveSettings, onExit }) => {
  const {
    voice = "male",
    repeat = "none",
    speed = 1,
    volume = 1,
  } = settings || {};

  const currentIndex = voices.findIndex((v) => v.id === voice);
  const prevVoice = () => {
    const idx = (currentIndex - 1 + voices.length) % voices.length;
    saveSettings && saveSettings({ voice: voices[idx].id });
  };
  const nextVoice = () => {
    const idx = (currentIndex + 1) % voices.length;
    saveSettings && saveSettings({ voice: voices[idx].id });
  };

  const setVoice = useCallback(
    (v) => saveSettings && saveSettings({ voice: v }),
    [saveSettings]
  );
  const setRepeat = useCallback(
    (r) => saveSettings && saveSettings({ repeat: r }),
    [saveSettings]
  );
  const setSpeed = useCallback(
    (s) => saveSettings && saveSettings({ speed: s }),
    [saveSettings]
  );
  const setVolume = useCallback(
    (v) => saveSettings && saveSettings({ volume: v }),
    [saveSettings]
  );

  return html`
    <div class="tts-player-bar">
      <div class="tts-voice-carousel">
        <button
          class="tts-voice-carousel-btn"
          onClick=${prevVoice}
          title="Previous Voice"
          aria-label="Previous Voice"
        >
          ←
        </button>
        <span class="tts-voice-icon" title=${voices[currentIndex].title}>
          <img
            src=${voices[currentIndex].icon}
            alt=${voices[currentIndex].title}
          />
        </span>
        <button
          class="tts-voice-carousel-btn"
          onClick=${nextVoice}
          title="Next Voice"
          aria-label="Next Voice"
        >
          →
        </button>
      </div>
      <span class="tts-voice-label">${voices[currentIndex].title}</span>
      <div style="flex:1;min-width:0;">
        <${AudioPlayer}
          src=${src}
          autoPlayAfterSrcChange=${true}
          showJumpControls=${false}
          showDownloadProgress=${false}
          customAdditionalControls=${[]}
          customVolumeControls=${[]}
          style=${{ background: "transparent", boxShadow: "none" }}
          volume=${volume}
          playbackRate=${speed}
          onVolumeChange=${(e) => setVolume(e.target.volume)}
        />
      </div>
      <select
        class="tts-player-select"
        value=${repeat}
        onChange=${(e) => setRepeat(e.target.value)}
        title="Repeat"
      >
        ${repeatModes.map(
          (r) =>
            html`<option value=${r.id} selected=${repeat === r.id}>
              ${r.label}
            </option>`
        )}
      </select>
      <select
        class="tts-player-select"
        value=${speed}
        onChange=${(e) => setSpeed(Number(e.target.value))}
        title="Speed"
      >
        ${speeds.map(
          (s) => html`<option value=${s} selected=${speed === s}>${s}x</option>`
        )}
      </select>
      <button
        class="tts-player-btn tts-exit-btn"
        title="Exit Voice Mode"
        onClick=${onExit}
      >
        ❌
      </button>
    </div>
  `;
};

export default TTSPlayer;
