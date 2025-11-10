import { h } from "preact";
import htm from "htm";
import { useEffect } from "preact/hooks";
import FontSizeRange from "./fontSizeRange.js";
import FontSelector from "./fontSelector.js";
import LineSpacingRange from "./lineSpacingRange.js";
import LineWidthRange from "./lineWidthRange.js";
import utils from "utils";

const html = htm.bind(h);

const TextStylesDropdown = ({ settings, saveSettings }) => {
  const defaultTextJustified = true;
  const isOnOptionsPage =
    window.location.href.includes("extension://") &&
    window.location.href.includes("/options.html");

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

  const handleHideAudioIcons = (hideAudioIcons) => {
    const $article = document.getElementById("PNLReaderArticle");
    if (!$article) return;

    if (hideAudioIcons) {
      $article.classList.add("hide-audio-icons");
    } else {
      $article.classList.remove("hide-audio-icons");
    }
  };

  const handleHideTranslateIcons = (hideTranslateIcons) => {
    const $article = document.getElementById("PNLReaderArticle");
    if (!$article) return;

    if (hideTranslateIcons) {
      $article.classList.add("hide-translate-icons");
    } else {
      $article.classList.remove("hide-translate-icons");
    }
  };

  return html`
    <details class="dropdown">
      <summary role="button" class="outline secondary">
        <span class="icon-sliders" title="More settings"></span>
      </summary>
      <ul class="text-styles-dropdown-list">
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
            <div class="list-in-row show-sm">
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
            <div class="list-in-row">
              <span class="pnl-icon icon-pin" title="Sticky Header">📌</span>
              <span>Sticky Header</span>
              <input
                type="checkbox"
                id="stickyHeader"
                name="stickyHeader"
                data-tooltip="Keep the header visible when scrolling"
                data-placement="left"
                checked=${settings.stickyHeader ?? false}
                onChange=${(e) => {
                  const stickyHeader = e.target.checked;
                  saveSettings({ stickyHeader });
                }}
              />
            </div>
            <div class="list-in-row">
              <span class="pnl-icon icon-volume-off" title="Hide Audio Icons"
                >🔊</span
              >
              <span>Hide Audio Icons</span>
              <input
                type="checkbox"
                id="hideAudioIcons"
                name="hideAudioIcons"
                data-tooltip="Hide text-to-speech speaker icons in front of paragraphs"
                data-placement="left"
                checked=${settings.hideAudioIcons ?? false}
                onChange=${(e) => {
                  const hideAudioIcons = e.target.checked;
                  handleHideAudioIcons(hideAudioIcons);
                  saveSettings({ hideAudioIcons });
                }}
              />
            </div>
            <div class="list-in-row">
              <span class="pnl-icon icon-translate" title="Hide Translate Icons"
                >🌐</span
              >
              <span>Hide Translate Icons</span>
              <input
                type="checkbox"
                id="hideTranslateIcons"
                name="hideTranslateIcons"
                data-tooltip="Hide translation icons in the end of paragraphs"
                data-placement="left"
                checked=${settings.hideTranslateIcons ?? false}
                onChange=${(e) => {
                  const hideTranslateIcons = e.target.checked;
                  handleHideTranslateIcons(hideTranslateIcons);
                  saveSettings({ hideTranslateIcons });
                }}
              />
            </div>

            ${!isOnOptionsPage &&
            html`
              <div class="list-in-row">
                <a
                  id="goToGlobalSettings"
                  class="contrast"
                  onClick=${() => {
                    utils.send("open global settings");
                  }}
                  data-tooltip="Current settings are site-specific. Access global settings to apply changes across all websites."
                  data-placement="left"
                >
                  ⚙️ Go to global settings
                </a>
              </div>
            `}
          </article>
        </div>
      </ul>
    </details>
  `;
};

export default TextStylesDropdown;
