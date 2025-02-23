import { h } from "preact";
import htm from "htm";

const html = htm.bind(h);

export default function ReaderApp({
  article: { title, byline, publishedTime, content, length },
  onToggle,
}) {
  return html`
    <div id="PNLReader">
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
        <article class="container">
          <header>
            <details open>
              <summary class="title">${title}</summary>
              <p class="byline">
                ${byline ? html`<span>By ${byline}</span>` : ""}
              </p>
              <p class="published-time" datetime=${publishedTime}>
                ${new Date(publishedTime).toLocaleString()}
              </p>
              <p class="length">${length} words</p>
            </details>
          </header>
          <section
            class="content"
            dangerouslySetInnerHTML=${{ __html: content }}
          ></section>
        </article>
      </main>
    </div>
  `;
}
