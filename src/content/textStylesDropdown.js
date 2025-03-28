import { h } from "preact";
import htm from "htm";
import { useEffect } from "preact/hooks";
import "./fontello-embedded.scss";
import FontSizeRange from "./fontSizeRange.js";
import FontSelector from "./fontSelector.js";
import LineSpacingRange from "./lineSpacingRange.js";
import LineWidthRange from "./lineWidthRange.js";
import("./googleFonts/fonts.css");
const html = htm.bind(h);

const TextStylesDropdown = ({ settings, saveSettings }) => {
  const defaultTextJustified = true;
  useEffect(() => {
    handleTextJustified(
      settings.textJustified === undefined
        ? defaultTextJustified
        : settings.textJustified
    );
  }, []);

  const handleTextJustified = (textJustified) => {
    const $article = document.getElementById("PNLReaderArticle");
    if (!$article) return;

    $article.style.setProperty(
      "--pnl-reader-text-align",
      textJustified ? "justify" : "initial"
    );
    const $icon = document.getElementById("textJustifiedIcon");
    if (textJustified) {
      $icon.classList.add("icon-align-justify");
      $icon.classList.remove("icon-align-left");
    } else {
      $icon.classList.remove("icon-align-justify");
      $icon.classList.add("icon-align-left");
    }
  };

  return html`
    <details class="dropdown">
      <summary role="button" class="outline secondary">
        <span class="icon-fontsize" title="Type controls"></span>
      </summary>
      <ul>
        <div>
          <article>
            <div class="list-in-row">
              <!-- Dropdown -->
              <span class="pnl-icon icon-fontsize" title="Type controls"></span>
              <span>Font Type</span>

              <${FontSelector}
                settings=${settings}
                saveSettings=${saveSettings}
              />
            </div>
            <div class="list-in-row show-xs">
              <!-- Settings for fontsize -->
              <span class="pnl-icon icon-fontsize-1" title="Font size"></span>
              <span>Font size</span>
              <${FontSizeRange}
                settings=${settings}
                saveSettings=${saveSettings}
              />
            </div>
            <div class="list-in-row">
              <!-- Settings for line-spacing -->
              <span
                class="pnl-icon icon-text-height"
                title="Line spacing"
              ></span>
              <span>Line spacing</span>
              <${LineSpacingRange}
                settings=${settings}
                saveSettings=${saveSettings}
              />
            </div>
            <div class="list-in-row">
              <!-- Settings for line-width -->
              <span class="pnl-icon icon-text-width" title="Line width"></span>
              <span>Line width</span>
              <${LineWidthRange}
                settings=${settings}
                saveSettings=${saveSettings}
              />
            </div>
            <div class="list-in-row">
              <span
                id="textJustifiedIcon"
                class="pnl-icon icon-align-justify"
                title="Justified Alignment"
              ></span>
              <span>Justified Alignment</span>
              <input
                type="checkbox"
                id="textJustified"
                name="textJustified"
                checked=${settings.textJustified === undefined
                  ? defaultTextJustified
                  : settings.textJustified}
                onChange=${(e) => {
                  const textJustified = e.target.checked;
                  handleTextJustified(textJustified);
                  saveSettings({ textJustified: textJustified });
                }}
              />
            </div>
          </article>
        </div>
      </ul>
    </details>
  `;
};

export default TextStylesDropdown;
