import { h } from "preact";
import htm from "htm";

const html = htm.bind(h);

export default function ReaderApp({ articleContent, onToggle }) {
  return html`
    <div class="pnl-read-mode-wrapper">
      <header>
        <nav class="topbar">
          <h1 class="title">PNL Reader</h1>
          <button
            id="toggleReadModeBtn"
            class="toggle-button"
            onClick=${onToggle}
          >
            Toggle Read Mode
          </button>
        </nav>
      </header>
      <main>
        <article
          class="container"
          dangerouslySetInnerHTML=${{ __html: articleContent }}
        ></article>
      </main>
    </div>
  `;
}
