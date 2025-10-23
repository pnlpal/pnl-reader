import { h } from "preact";
import htm from "htm";
import { useCallback, useRef, useState, useEffect } from "preact/hooks";

import MaleIcon from "../../images/male.png";
import FemaleIcon from "../../images/female.png";
import {
  PlayIcon,
  PauseIcon,
  RepeatIcon,
  NoRepeatIcon,
  VolumeIcon,
  MutedIcon,
} from "./icons.js";
import text2Audio from "./text2Audio.js";
import getErrorBanner from "./ttsErrorMessages.js";

const html = htm.bind(h);

const voices = [
  { name: "Luna", title: "Female Voice", icon: FemaleIcon },
  { name: "Owen", title: "Male Voice", icon: MaleIcon },
];

const speeds = [0.5, 1, 1.2, 1.5, 2];

const TTSPlayer = ({
  text,
  nextParagraphText,
  lang,
  settings,
  saveSettings,
  exitVoiceMode,
  startTimestamp,
  onAudioPlayEnded,
}) => {
  const {
    voice = "Luna",
    repeat = false,
    speed = 1,
    volume = 1,
  } = settings || {};
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showVolume, setShowVolume] = useState(false);
  const [prevVolume, setPrevVolume] = useState(volume);
  const [audioUrl, setAudioUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showVoiceDropdown, setShowVoiceDropdown] = useState(false);
  const [showSpeedDropdown, setShowSpeedDropdown] = useState(false);
  const [error, setError] = useState(null);

  const currentCharacter = voices.find((v) => v.name === voice) || voices[0];

  // Fetch audio URL when text changes, and only if volume > 0
  useEffect(() => {
    let revokedUrl;
    setAudioUrl(null);
    setError(null);
    if (!text || volume === 0) {
      return;
    }
    setLoading(true);
    text2Audio({ text, lang, voice })
      .then((audioResult) => {
        setAudioUrl(audioResult.url);
        revokedUrl = audioResult.url;
        if (audioResult.isProUser === false) {
          setError({
            type: "in-trial",
            ...audioResult,
          });
        } else {
          setError(null);
        }
      })
      .catch((err) => {
        setAudioUrl(null);
        setError(err);
      })
      .finally(() => setLoading(false));
    return () => {
      if (revokedUrl) {
        URL.revokeObjectURL(revokedUrl);
      }
      if (audioRef.current) {
        audioRef.current.removeEventListener("ended", handleAudioPlayEnded);
      }
    };
  }, [text, voice]);

  // Prefetch the audio for the next paragraph
  useEffect(() => {
    if (!nextParagraphText || volume === 0 || nextParagraphText === text) {
      return;
    }
    text2Audio({ text: nextParagraphText, lang, voice }, true);
  }, [nextParagraphText, voice]);

  // Repeat handler for <audio>
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Set the loop property based on repeat and nextParagraphText
    audio.loop = !!repeat && !nextParagraphText;

    // // Restart playback when repeat is toggled on while paused:
    // if (repeat && audio.paused && audioUrl) {
    //   audio.currentTime = 0;
    //   audio.play().catch(() => {});
    // }
  }, [repeat, audioUrl]);

  // Restart the audio if startTimestamp changed, which means user re-triggered playing again
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.currentTime > 0) {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    }
  }, [startTimestamp]);

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

  const handleAudioPlayEnded = useCallback(() => {
    onAudioPlayEnded && onAudioPlayEnded({ text, voice, startTimestamp });
  }, [text, voice, startTimestamp, onAudioPlayEnded]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.removeEventListener("ended", handleAudioPlayEnded);
    audio.addEventListener("ended", handleAudioPlayEnded);

    return () => {
      audio.removeEventListener("ended", handleAudioPlayEnded);
    };
  }, [audioUrl, startTimestamp, handleAudioPlayEnded]);

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

  const onAudioError = () => {
    const audio = audioRef.current;
    if (audio?.error) {
      if (audio.error.message.includes("Empty src attribute")) {
        // Ignore this error which happens when src is set to null
        return;
      }
      setError(audio.error);
    }
  };

  const handleVolumeBtnClick = () => {
    if (volume === 0) {
      setVolume(prevVolume || 1);
      if (audioRef.current) audioRef.current.volume = prevVolume || 1;
    } else {
      setPrevVolume(volume);
      setVolume(0);
      if (audioRef.current) audioRef.current.volume = 0;
    }
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
    <div>
      ${error && getErrorBanner(error)}
      <div class="tts-player-bar">
        <!-- 1. Voice/avatar selector -->
        <div class="tts-voice-dropdown">
          <details class="dropdown" open=${showVoiceDropdown}>
            <summary
              role="button"
              class="tts-voice-avatar-btn"
              aria-label="Select voice"
              onClick=${(e) => {
                e.preventDefault();
                setShowVoiceDropdown((v) => !v);
              }}
            >
              <img
                src=${currentCharacter.icon}
                alt=${currentCharacter.name}
                class="tts-voice-avatar tts-voice-avatar-round"
              />
            </summary>
            <ul class="tts-voice-dropdown-list-top">
              ${voices.map(
                (v) => html`
                  <li>
                    <a
                      href="#"
                      class="tts-voice-dropdown-item"
                      title="Select ${v.title}"
                      onClick=${(e) => {
                        e.preventDefault();
                        setVoice(v.name);
                        setShowVoiceDropdown(false);
                      }}
                    >
                      <img
                        src=${v.icon}
                        alt=${v.name}
                        class="tts-voice-avatar tts-voice-avatar-round"
                      />
                      <span class="tts-voice-name">${v.name}</span>
                    </a>
                  </li>
                `
              )}
            </ul>
          </details>
        </div>
        <!-- 2. Speed selector -->
        <div class="tts-speed-dropdown">
          <details class="dropdown" open=${showSpeedDropdown}>
            <summary
              role="button"
              class="tts-player-btn tts-speed-btn"
              aria-label="Select speed"
              onClick=${(e) => {
                e.preventDefault();
                setShowSpeedDropdown((v) => !v);
              }}
            >
              <span class="tts-speed-label">
                ${speed}<span class="tts-speed-x">x</span>
              </span>
            </summary>
            <ul class="tts-speed-dropdown-list-top">
              ${speeds.map(
                (s) => html`
                  <li>
                    <a
                      href="#"
                      class="tts-speed-dropdown-item${speed === s
                        ? " selected"
                        : ""}"
                      onClick=${(e) => {
                        e.preventDefault();
                        setSpeed(s);
                        setShowSpeedDropdown(false);
                        if (audioRef.current) audioRef.current.playbackRate = s;
                      }}
                    >
                      ${s}<span class="tts-speed-x">x</span>
                    </a>
                  </li>
                `
              )}
            </ul>
          </details>
        </div>
        <!-- 3. Big play button -->
        <button
          class=${`tts-play-btn ${
            loading ? "tts-loading-spinner" : isPlaying ? "pause" : "play"
          }`}
          title=${isPlaying ? "Pause" : "Play"}
          onClick=${handlePlayPause}
          aria-label=${isPlaying ? "Pause" : "Play"}
          type="button"
          disabled=${loading || !audioUrl}
          data-error=${error && error.type !== "in-trial" ? "true" : "false"}
        >
          ${loading ? PlayIcon() : isPlaying ? PauseIcon() : PlayIcon()}
        </button>
        <!-- 4. Repeat button -->
        <button
          disabled=${!!nextParagraphText}
          class="tts-player-btn tts-repeat-btn"
          title=${repeat ? "Repeat On" : "Repeat Off"}
          aria-pressed=${repeat}
          onClick=${() => setRepeat(!repeat)}
          type="button"
        >
          ${repeat && !nextParagraphText ? RepeatIcon() : NoRepeatIcon()}
        </button>
        <!-- 5. Volume button with hover vertical bar -->
        <div
          class="tts-volume-container"
          onMouseEnter=${() => setShowVolume(true)}
          onMouseLeave=${() => setShowVolume(false)}
        >
          <button
            class="tts-player-btn tts-volume-btn"
            title="Volume"
            onClick=${handleVolumeBtnClick}
            aria-pressed=${volume === 0}
          >
            ${volume == 0 ? MutedIcon() : VolumeIcon()}
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
          />`}
        </div>
        <audio
          ref=${audioRef}
          src=${audioUrl || ""}
          onPlay=${onPlay}
          onPause=${onPause}
          onLoadedMetadata=${onLoadedMetadata}
          onError=${onAudioError}
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
    </div>
  `;
};

export default TTSPlayer;
