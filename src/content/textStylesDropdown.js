import { h } from "preact";
import htm from "htm";
import "./fontello-embedded.scss";
import FontSizeRange from "./fontSizeRange.js";
import FontSelector from "./fontSelector.js";
import LineSpacingRange from "./lineSpacingRange.js";
import LineWidthRange from "./lineWidthRange.js";
import "./googleFonts/fonts.css";
const html = htm.bind(h);

const TextStylesDropdown = ({ settings, saveSettings }) => {
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
