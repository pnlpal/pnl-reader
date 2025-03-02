import { h } from "preact";
import htm from "htm";

const html = htm.bind(h);

const ThemeSelector = ({ settings, saveSettings }) => {
  const changeTheme = (colorAndTheme = "auto") => {
    const [colorScheme, theme] =
      colorAndTheme.split(" ").length === 2
        ? colorAndTheme.toLowerCase().split(" ")
        : ["", colorAndTheme];
    document.documentElement.setAttribute("data-color-scheme", colorScheme);
    if (theme === "auto") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", theme);
    }
    saveSettings({ colorAndTheme: colorAndTheme });
  };
  changeTheme(settings.colorAndTheme);

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

  return html`
    <select id="theme" onChange=${(e) => changeTheme(e.target.value)}>
      ${allThemes.map(
        (theme) =>
          html`
            <option
              value=${theme.value}
              selected=${settings.colorAndTheme === theme.value}
            >
              ${theme.label}
            </option>
          `
      )}
    </select>
  `;
};

export default ThemeSelector;
