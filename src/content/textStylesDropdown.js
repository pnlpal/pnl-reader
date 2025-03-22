import { h } from "preact";
import { useEffect, useRef } from "preact/hooks";
import htm from "htm";
import "./fontello-embedded.scss";
import FontSizeRange from "./fontSizeRange.js";
import "./googleFonts/fonts.css";
const html = htm.bind(h);

const TextStylesDropdown = ({ settings, saveSettings }) => {
  const fontType = settings.fontType || "system-ui";
  const changeFontType = (e) => {
    const newFontType = e.target.value;
    const $article = document.getElementById("PNLReaderArticle");
    if ($article) {
      const fontFamily_ = `${newFontType}, Roboto, Oxygen, Ubuntu, Cantarell, Helvetica, Arial, sans-serif`;
      $article.style.setProperty("--pico-font-family", fontFamily_);
      saveSettings({ fontType: newFontType });
    }
  };

  // init the font family
  useEffect(() => {
    changeFontType({ target: { value: fontType } });
  }, []);

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

              <!-- Select -->
              <select
                id="fontType"
                name="fontType"
                aria-label="Select Font"
                onChange=${changeFontType}
                value=${fontType}
              >
                <option value="system-ui" style="font-family: system-ui;">
                  System UI
                </option>
                <option
                  value="'Source Serif 4'"
                  style="font-family: 'Source Serif 4';"
                >
                  Source Serif 4
                </option>
                <option value="'Segoe UI'" style="font-family: 'Segoe UI';">
                  Segoe UI
                </option>
                <option value="Calibri" style="font-family: Calibri;">
                  Calibri
                </option>
                <option value="Georgia" style="font-family: Georgia;">
                  Georgia
                </option>
                <option value="Merriweather" style="font-family: Merriweather;">
                  Merriweather
                </option>
                <option
                  value="'Times New Roman'"
                  style="font-family: 'Times New Roman';"
                >
                  Times New Roman
                </option>
                <option value="Roboto" style="font-family: Roboto;">
                  Roboto
                </option>
                <option value="'Open Sans'" style="font-family: 'Open Sans';">
                  Open Sans
                </option>
                <option
                  value="'Courier New'"
                  style="font-family: 'Courier New';"
                >
                  Courier New
                </option>
                <option
                  value="'Comic Sans MS', cursive"
                  style="font-family: 'Comic Sans MS', cursive;"
                >
                  Comic Sans MS
                </option>
                <option
                  value="'Patrick Hand'"
                  style="font-family: 'Patrick Hand';"
                >
                  Patrick Hand
                </option>
                <option value="Fredoka" style="font-family: Fredoka;">
                  Fredoka
                </option>
                <option value="'Baloo 2'" style="font-family: 'Baloo 2';">
                  Baloo 2
                </option>
                <option value="'Chewy'" style="font-family: 'Chewy';">
                  Chewy
                </option>
                <option
                  value="'Gloria Hallelujah'"
                  style="font-family: 'Gloria Hallelujah';"
                >
                  Gloria Hallelujah
                </option>
                <option
                  value="'Permanent Marker'"
                  style="font-family: 'Permanent Marker';"
                >
                  Permanent Marker
                </option>
                <option
                  value="'Luckiest Guy'"
                  style="font-family: 'Luckiest Guy';"
                >
                  Luckiest Guy
                </option>
                <option value="Bangers" style="font-family: Bangers;">
                  Bangers
                </option>
                <option value="Caveat" style="font-family: Caveat;">
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
