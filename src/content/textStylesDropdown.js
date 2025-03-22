import { h } from "preact";
import { useEffect, useRef } from "preact/hooks";
import htm from "htm";
import "./arrow.scss";
import "./fontello-embedded.scss";
import FontSizeRange from "./fontSizeRange.js";
const html = htm.bind(h);

const TextStylesDropdown = ({ settings, saveSettings }) => {
  return html`
    <details class="dropdown">
      <summary role="button" class="outline">
        <span class="icon-fontsize" title="Type controls"></span>
      </summary>
      <ul>
        <div>
          <article>
            <div class="list-in-row">
              <!-- Dropdown -->
              <span class="pnl-icon icon-fontsize" title="Type controls"></span>
              <span>Font Type</span>

              <!-- Select -->
              <select name="fontType" aria-label="Select Font" required>
                <option
                  value="'Source Serif Pro', serif"
                  selected
                  style="font-family: 'Source Serif Pro', serif;"
                >
                  Source Serif Pro
                </option>
                <option value="Georgia" style="font-family: Georgia;">
                  Georgia
                </option>
                <option value="Merriweather" style="font-family: Merriweather;">
                  Merriweather
                </option>
                <option
                  value="Times New Roman"
                  style="font-family: 'Times New Roman';"
                >
                  Times New Roman
                </option>
                <option value="Roboto" style="font-family: Roboto;">
                  Roboto
                </option>
                <option value="Open Sans" style="font-family: 'Open Sans';">
                  Open Sans
                </option>
                <option value="Courier New" style="font-family: 'Courier New';">
                  Courier New
                </option>
                <option
                  value="'Comic Sans MS', cursive"
                  style="font-family: 'Comic Sans MS', cursive;"
                >
                  Comic Sans MS
                </option>
                <option
                  value="'Patrick Hand', sans-serif"
                  style="font-family: 'Patrick Hand', sans-serif;"
                >
                  Patrick Hand
                </option>
                <option
                  value="'Fredoka One', sans-serif"
                  style="font-family: 'Fredoka One', sans-serif;"
                >
                  Fredoka One
                </option>
                <option
                  value="'Baloo', cursive"
                  style="font-family: 'Baloo', cursive;"
                >
                  Baloo
                </option>
                <option
                  value="'Chewy', cursive"
                  style="font-family: 'Chewy', cursive;"
                >
                  Chewy
                </option>
                <option
                  value="'Gloria Hallelujah', cursive"
                  style="font-family: 'Gloria Hallelujah', cursive;"
                >
                  Gloria Hallelujah
                </option>
                <option
                  value="'Permanent Marker', cursive"
                  style="font-family: 'Permanent Marker', cursive;"
                >
                  Permanent Marker
                </option>
                <option
                  value="'Luckiest Guy', cursive"
                  style="font-family: 'Luckiest Guy', cursive;"
                >
                  Luckiest Guy
                </option>
                <option
                  value="'Bangers', cursive"
                  style="font-family: 'Bangers', cursive;"
                >
                  Bangers
                </option>
                <option
                  value="'Caveat', cursive"
                  style="font-family: 'Caveat', cursive;"
                >
                  Caveat
                </option>
              </select>
            </div>
            <div class="list-in-row">
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
              <input
                type="range"
                id="lineSpacing"
                name="lineSpacing"
                min="1"
                max="2.5"
                step="0.1"
                value="1.5"
                onInput=${(e) => {
                  const article = document.getElementById("PNLReaderArticle");
                  if (article) {
                    article.style.lineHeight = e.target.value;
                  }
                }}
              />
            </div>
            <div class="list-in-row">
              <!-- Settings for line-width -->
              <span class="pnl-icon icon-text-width" title="Line width"></span>
              <span>Line width</span>
              <input
                type="range"
                id="lineWidth"
                name="lineWidth"
                min="30"
                max="100"
                step="5"
                value="70"
                onInput=${(e) => {
                  const article = document.getElementById("PNLReaderArticle");
                  if (article) {
                    article.style.maxWidth = `${e.target.value}%`;
                  }
                }}
              />
            </div>
            <div class="list-in-row">
              <!-- Settings for text align justify -->
              <span
                class="pnl-icon icon-align-justify"
                title="Text align justify"
              ></span>
              <span>Text align justify</span>
              <input
                type="checkbox"
                id="textAlignJustify"
                name="textAlignJustify"
              />
            </div>
          </article>
        </div>
      </ul>
    </details>
  `;
};

export default TextStylesDropdown;
