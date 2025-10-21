import { h } from "preact";
import htm from "htm";
import { useState, useEffect } from "preact/hooks";

const html = htm.bind(h);

const allThemes = [
  { value: "auto", label: "Auto" },
  { value: "dark", label: "Dark" },
  { value: "light", label: "Light" },
  { value: "solarized dark", label: "Solarized Dark" },
  { value: "solarized light", label: "Solarized Light" },
  { value: "dracula dark", label: "Dracula Dark" },
  { value: "dracula light", label: "Dracula Light" },
  { value: "monokai dark", label: "Monokai Dark" },
  { value: "monokai light", label: "Monokai Light" },
  { value: "iceberg dark", label: "Iceberg Dark" },
  { value: "iceberg light", label: "Iceberg Light" },
  { value: "typewriter dark", label: "Typewriter Dark" },
  { value: "typewriter light", label: "Typewriter Light" },
];

function getThemeBackgroundColor(themeValue) {
  const defaultMap = {
    dark: "#181c25",
    light: "#ffffff",
  };
  return (
    defaultMap[themeValue] ||
    getComputedStyle(document.documentElement)
      .getPropertyValue(
        `--theme-${themeValue.replace(" ", "-")}-background-color`
      )
      .trim() ||
    "#333"
  );
}

const ThemeSelector = ({ settings, saveSettings }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const currentTheme = settings.colorAndTheme || "auto";
  const currentThemeLabel =
    allThemes.find((t) => t.value === currentTheme)?.label || "Auto";

  const changeTheme = (value) => {
    if (!value) return;
    const [colorScheme, theme] =
      value.split(" ").length === 2
        ? value.toLowerCase().split(" ")
        : ["", value];
    document.documentElement.setAttribute("data-color-scheme", colorScheme);
    if (theme === "auto") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", theme);
    }
    saveSettings({ colorAndTheme: value });
    setShowDropdown(false);
  };
  // Ensure theme is applied on load using useEffect to avoid side effects during render
  useEffect(() => {
    changeTheme(currentTheme);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTheme]);

  return html`
    <div class="theme-dropdown">
      <details class="dropdown" open=${showDropdown}>
        <summary
          role="button"
          class="theme-dropdown-btn outline secondary"
          aria-label="Select theme"
          onClick=${(e) => {
            e.preventDefault();
            setShowDropdown((v) => !v);
          }}
        >
          <span>${currentThemeLabel}</span>
        </summary>
        <ul class="theme-dropdown-list-top">
          ${allThemes.map(
            (theme) => html`
              <li>
                <a
                  href="#"
                  class="theme-dropdown-item"
                  title="Select ${theme.label}"
                  onClick=${(e) => {
                    e.preventDefault();
                    changeTheme(theme.value);
                  }}
                >
                  <span
                    class="theme-preview-circle"
                    data-value=${theme.value}
                    style="
                      background: ${getThemeBackgroundColor(theme.value)};
                      
                    "
                  ></span>
                  <span>${theme.label}</span>
                </a>
              </li>
            `
          )}
        </ul>
      </details>
    </div>
  `;
};

export default ThemeSelector;
