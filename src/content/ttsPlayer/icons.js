import { h } from "preact";
import htm from "htm";
const html = htm.bind(h);

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

const RepeatIcon = ({ active = false } = {}) => html`
  <svg
    viewBox="0 0 48 48"
    width="2.5em"
    height="2.5em"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M12 24c0-6.627 5.373-12 12-12h8V8l8 8-8 8v-4h-8a8 8 0 100 16h12v4H24c-6.627 0-12-5.373-12-12z"
      stroke=${active ? "#36b37e" : "currentColor"}
      stroke-width="3"
      fill=${active ? "#e6fff2" : "none"}
    />
  </svg>
`;

const VolumeIcon = () => html`
  <svg
    viewBox="0 0 48 48"
    width="2.5em"
    height="2.5em"
    fill="currentColor"
    aria-hidden="true"
  >
    <polygon points="12,18 20,18 28,10 28,38 20,30 12,30" />
    <path
      d="M34 18a6 6 0 010 12"
      fill="none"
      stroke="currentColor"
      stroke-width="3"
    />
    <path
      d="M38 14a12 12 0 010 20"
      fill="none"
      stroke="currentColor"
      stroke-width="3"
    />
  </svg>
`;

const MutedIcon = () => html`
  <svg
    viewBox="0 0 48 48"
    width="2.5em"
    height="2.5em"
    fill="currentColor"
    aria-hidden="true"
  >
    <polygon points="12,18 20,18 28,10 28,38 20,30 12,30" />
    <line
      x1="36"
      y1="16"
      x2="44"
      y2="32"
      stroke="currentColor"
      stroke-width="4"
    />
    <line
      x1="44"
      y1="16"
      x2="36"
      y2="32"
      stroke="currentColor"
      stroke-width="4"
    />
  </svg>
`;

export { PlayIcon, PauseIcon, RepeatIcon, VolumeIcon, MutedIcon };
