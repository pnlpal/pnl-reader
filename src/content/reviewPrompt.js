import { h } from "preact";
import htm from "htm";
import { useState, useEffect } from "preact/hooks";
import utils from "utils";

const html = htm.bind(h);

// BROWSER is set at build time: Chrome, Edge or Firefox
const REVIEW_LINKS = {
  Chrome:
    "https://chromewebstore.google.com/detail/pnl-reader/amdebfiljmlhfkenbhhpckmmpkonpdfh",
  Firefox: "https://addons.mozilla.org/en-US/firefox/addon/pnl-reader/",
  Edge: "https://microsoftedge.microsoft.com/addons/detail/pnl-reader/gdpndpkknkgkmoikgpldekejoabkplmd",
};
const reviewLink = REVIEW_LINKS[process.env.BROWSER] || REVIEW_LINKS.Chrome;

// Wait a moment so the prompt doesn't pop up before the user starts reading.
const SHOW_DELAY = 3000;

export default function ReviewPrompt() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let timer;
    utils
      .send("should show review prompt")
      .then((shouldShow) => {
        if (shouldShow) {
          timer = setTimeout(() => setOpen(true), SHOW_DELAY);
        }
      })
      .catch((e) => console.warn("Failed to check review prompt", e));
    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    setOpen(false);
    utils
      .send("dismiss review prompt")
      .catch((e) => console.warn("Failed to dismiss review prompt", e));
  };

  if (!open) return null;

  return html`
    <dialog open onCancel=${dismiss}>
      <article>
        <header>
          <button aria-label="Close" rel="prev" onClick=${dismiss}></button>
          <p><strong>Hi, I'm River 👋</strong></p>
        </header>
        <p>
          I'm the indie developer behind PNL Reader. There's no team or company
          here, just me: I write the code, chase down the bugs, and quietly
          high-five myself when something finally works.
        </p>
        <p>
          If PNL Reader has made your reading a little nicer, would you leave a
          quick review? It only takes a minute, and it really helps other
          readers find it, and helps keep this little project alive.
        </p>
        <p>Thanks for reading with me. 💛</p>
        <footer
          style="display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 1rem;"
        >
          <button class="secondary" onClick=${dismiss}>No thanks</button>
          <a
            role="button"
            href=${reviewLink}
            target="_blank"
            rel="noreferrer"
            onClick=${dismiss}
            >Leave a review</a
          >
        </footer>
      </article>
    </dialog>
  `;
}
