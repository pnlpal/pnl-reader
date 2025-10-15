import { h } from "preact";
import htm from "htm";
import { useCallback, useRef, useState, useEffect } from "preact/hooks";

import MaleIcon from "../../images/male.png";
import FemaleIcon from "../../images/female.png";
import text2Audio from "./text2Audio.js";

const html = htm.bind(h);

const voices = [
  { id: "male", title: "Male Voice", icon: MaleIcon },
  { id: "female", title: "Female Voice", icon: FemaleIcon },
];

const repeatModes = [
  { id: "none", label: "⏹️", title: "No Repeat" },
  { id: "sentence", label: "🔁", title: "Repeat Sentence" },
  { id: "paragraph", label: "🔂", title: "Repeat Paragraph" },
];

const speeds = [0.5, 1, 1.2, 1.5, 2];

const PlayIcon = () => html`
  <svg
    viewBox="0 0 48 48"
    width="2.5em"
    height="2.5em"
    fill="currentColor"
    aria-hidden="true"
  >
    <polygon points="16,10 40,24 16,38" />
  </svg>
`;

const PauseIcon = () => html`
  <svg
    viewBox="0 0 48 48"
    width="2.5em"
    height="2.5em"
    fill="currentColor"
    aria-hidden="true"
  >
    <rect x="14" y="12" width="7" height="24" rx="2" />
    <rect x="27" y="12" width="7" height="24" rx="2" />
  </svg>
`;

const TTSPlayer = ({ text, settings, saveSettings, exitVoiceMode }) => {
  const {
    voice = "male",
    repeat = "none",
    speed = 1,
    volume = 1,
  } = settings || {};
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showVolume, setShowVolume] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch audio URL when text changes
  useEffect(() => {
    let revokedUrl;
    if (!text) {
      setAudioUrl(null);
      return;
    }
    setLoading(true);
    text2Audio(text)
      .then((url) => {
        setAudioUrl(url);
        revokedUrl = url;
      })
      .catch(() => setAudioUrl(null))
      .finally(() => setLoading(false));
    return () => {
      if (revokedUrl) URL.revokeObjectURL(revokedUrl);
    };
  }, [text]);

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

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
  };

  // Sync play/pause state
  const onPlay = () => setIsPlaying(true);
  const onPause = () => setIsPlaying(false);

  // Sync speed and volume
  const onLoadedMetadata = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.playbackRate = speed;
      audio.volume = volume;
      // Auto play when loaded
      audio.play().catch((error) => {
        /* Auto-play might be blocked */
        console.error("Auto-play was prevented:", error);
      });
    }
  };

  // Update speed/volume on change
  const onSpeedChange = (e) => {
    setSpeed(Number(e.target.value));
    if (audioRef.current)
      audioRef.current.playbackRate = Number(e.target.value);
  };
  const onVolumeChange = (e) => {
    setVolume(Number(e.target.value));
    if (audioRef.current) audioRef.current.volume = Number(e.target.value);
  };

  const onExitClicked = () => {
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
    }
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    exitVoiceMode && exitVoiceMode();
  };

  return html`
    <div class="tts-player-bar">
      <!-- 1. Voice/avatar selector -->
      <div class="tts-voice-dropdown">
        <img
          src=${voices.find((v) => v.id === voice).icon}
          alt=${voice}
          class="tts-voice-avatar"
        />
        <select
          class="tts-player-select"
          value=${voice}
          onChange=${(e) => setVoice(e.target.value)}
          title="Voice"
        >
          ${voices.map(
            (v) =>
              html`<option value=${v.id} selected=${voice === v.id}>
                ${v.title}
              </option>`
          )}
        </select>
      </div>
      <!-- 2. Speed selector -->
      <select
        class="tts-player-select tts-speed-select"
        value=${speed}
        onChange=${onSpeedChange}
        title="Speed"
      >
        ${speeds.map(
          (s) => html`<option value=${s} selected=${speed === s}>${s}x</option>`
        )}
      </select>
      <!-- 3. Big play button -->
      <button
        class=${`tts-play-btn ${isPlaying ? "pause" : "play"}`}
        title=${isPlaying ? "Pause" : "Play"}
        onClick=${handlePlayPause}
        aria-label=${isPlaying ? "Pause" : "Play"}
        type="button"
        disabled=${loading || !audioUrl}
      >
        ${loading
          ? html`<span class="tts-loading-spinner"></span>`
          : isPlaying
          ? PauseIcon()
          : PlayIcon()}
      </button>
      <!-- 4. Repeat button -->
      <select
        class="tts-player-select tts-repeat-select"
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
      <!-- 5. Volume button with hover vertical bar -->
      <div
        class="tts-volume-container"
        onMouseEnter=${() => setShowVolume(true)}
        onMouseLeave=${() => setShowVolume(false)}
      >
        <button class="tts-player-btn tts-volume-btn" title="Volume">
          ${volume == 0 ? "🔇" : "🔊"}
        </button>
        ${showVolume &&
        html`<input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value=${volume}
          onInput=${onVolumeChange}
          class="tts-volume-slider"
          orient="vertical"
          style="position:absolute;bottom:2.5em;left:50%;transform:translateX(-50%) rotate(-90deg);height:60px;width:24px;"
        />`}
      </div>
      <audio
        ref=${audioRef}
        src=${audioUrl || ""}
        onPlay=${onPlay}
        onPause=${onPause}
        onLoadedMetadata=${onLoadedMetadata}
        style="display:none"
      />
      <button
        class="tts-player-btn tts-exit-btn"
        title="Exit Voice Mode"
        onClick=${onExitClicked}
      >
        ❌
      </button>
    </div>
  `;
};

export default TTSPlayer;
