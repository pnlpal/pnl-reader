import { h } from "preact";
import htm from "htm";
const html = htm.bind(h);

const PlayIcon = () => html`
  <svg
    viewBox="0 0 48 48"
    width="2.5em"
    height="2.5em"
    fill="currentColor"
    aria-hidden="true"
  >
    <polygon points="16,10 40,24 16,38" />
  </svg>
`;

const PauseIcon = () => html`
  <svg
    viewBox="0 0 48 48"
    width="2.5em"
    height="2.5em"
    fill="currentColor"
    aria-hidden="true"
  >
    <rect x="14" y="12" width="7" height="24" rx="2" />
    <rect x="27" y="12" width="7" height="24" rx="2" />
  </svg>
`;

const RepeatIcon = () => html`
  <svg
    xmlns:dc="http://purl.org/dc/elements/1.1/"
    xmlns:cc="http://creativecommons.org/ns#"
    xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
    xmlns:svg="http://www.w3.org/2000/svg"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
    xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
    width="30"
    height="30"
    viewBox="0 0 30 30"
    version="1.1"
    id="svg822"
    inkscape:version="0.92.4 (f8dce91, 2019-08-02)"
    sodipodi:docname="repeat.svg"
  >
    <defs id="defs816" />
    <sodipodi:namedview
      id="base"
      pagecolor="#ffffff"
      bordercolor="#666666"
      borderopacity="1.0"
      inkscape:pageopacity="0.0"
      inkscape:pageshadow="2"
      inkscape:zoom="32"
      inkscape:cx="14.349319"
      inkscape:cy="19.133748"
      inkscape:document-units="px"
      inkscape:current-layer="layer1"
      showgrid="true"
      units="px"
      inkscape:window-width="1366"
      inkscape:window-height="713"
      inkscape:window-x="0"
      inkscape:window-y="0"
      inkscape:window-maximized="1"
      showguides="false"
    >
      <inkscape:grid type="xygrid" id="grid816" />
    </sodipodi:namedview>
    <metadata id="metadata819">
      <rdf:RDF>
        <cc:Work rdf:about="">
          <dc:format>image/svg+xml</dc:format>
          <dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage" />
          <dc:title> </dc:title>
        </cc:Work>
      </rdf:RDF>
    </metadata>
    <g
      inkscape:label="Layer 1"
      inkscape:groupmode="layer"
      id="layer1"
      transform="translate(0,-289.0625)"
    >
      <path
        style="color:#000000;font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-size:medium;line-height:normal;font-family:sans-serif;font-variant-ligatures:normal;font-variant-position:normal;font-variant-caps:normal;font-variant-numeric:normal;font-variant-alternates:normal;font-feature-settings:normal;text-indent:0;text-align:start;text-decoration:none;text-decoration-line:none;text-decoration-style:solid;text-decoration-color:#000000;letter-spacing:normal;word-spacing:normal;text-transform:none;writing-mode:lr-tb;direction:ltr;text-orientation:mixed;dominant-baseline:auto;baseline-shift:baseline;text-anchor:start;white-space:normal;shape-padding:0;clip-rule:nonzero;display:inline;overflow:visible;visibility:visible;opacity:1;isolation:auto;mix-blend-mode:normal;color-interpolation:sRGB;color-interpolation-filters:linearRGB;solid-color:#000000;solid-opacity:1;vector-effect:none;fill:#36b37e;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1;color-rendering:auto;image-rendering:auto;shape-rendering:auto;text-rendering:auto;enable-background:accumulate"
        d="M 15 3 L 15 6 C 10.041282 6 6 10.04128 6 15 C 6 19.95872 10.041282 24 15 24 C 19.958718 24 24 19.95872 24 15 C 24 13.029943 23.355254 11.209156 22.275391 9.7246094 L 20.849609 11.150391 C 21.575382 12.253869 22 13.575008 22 15 C 22 18.87784 18.877838 22 15 22 C 11.122162 22 8 18.87784 8 15 C 8 11.12216 11.122162 8 15 8 L 15 11 L 20 7 L 15 3 z "
        transform="translate(0,289.0625)"
        id="path852"
      />
    </g>
  </svg>
`;

const NoRepeatIcon = () => html`
  <svg
    xmlns:dc="http://purl.org/dc/elements/1.1/"
    xmlns:cc="http://creativecommons.org/ns#"
    xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
    xmlns:svg="http://www.w3.org/2000/svg"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
    xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
    width="30"
    height="30"
    viewBox="0 0 30 30"
    version="1.1"
    id="svg822"
    inkscape:version="0.92.4 (f8dce91, 2019-08-02)"
    sodipodi:docname="repeat.svg"
  >
    <defs id="defs816" />
    <sodipodi:namedview
      id="base"
      pagecolor="#ffffff"
      bordercolor="#666666"
      borderopacity="1.0"
      inkscape:pageopacity="0.0"
      inkscape:pageshadow="2"
      inkscape:zoom="32"
      inkscape:cx="14.349319"
      inkscape:cy="19.133748"
      inkscape:document-units="px"
      inkscape:current-layer="layer1"
      showgrid="true"
      units="px"
      inkscape:window-width="1366"
      inkscape:window-height="713"
      inkscape:window-x="0"
      inkscape:window-y="0"
      inkscape:window-maximized="1"
      showguides="false"
    >
      <inkscape:grid type="xygrid" id="grid816" />
    </sodipodi:namedview>
    <metadata id="metadata819">
      <rdf:RDF>
        <cc:Work rdf:about="">
          <dc:format>image/svg+xml</dc:format>
          <dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage" />
          <dc:title> </dc:title>
        </cc:Work>
      </rdf:RDF>
    </metadata>
    <g
      inkscape:label="Layer 1"
      inkscape:groupmode="layer"
      id="layer1"
      transform="translate(0,-289.0625)"
    >
      <path
        style="color:#000000;font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-size:medium;line-height:normal;font-family:sans-serif;font-variant-ligatures:normal;font-variant-position:normal;font-variant-caps:normal;font-variant-numeric:normal;font-variant-alternates:normal;font-feature-settings:normal;text-indent:0;text-align:start;text-decoration:none;text-decoration-line:none;text-decoration-style:solid;text-decoration-color:#000000;letter-spacing:normal;word-spacing:normal;text-transform:none;writing-mode:lr-tb;direction:ltr;text-orientation:mixed;dominant-baseline:auto;baseline-shift:baseline;text-anchor:start;white-space:normal;shape-padding:0;clip-rule:nonzero;display:inline;overflow:visible;visibility:visible;opacity:1;isolation:auto;mix-blend-mode:normal;color-interpolation:sRGB;color-interpolation-filters:linearRGB;solid-color:#000000;solid-opacity:1;vector-effect:none;fill:#888;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1;color-rendering:auto;image-rendering:auto;shape-rendering:auto;text-rendering:auto;enable-background:accumulate"
        d="M 15 3 L 15 6 C 10.041282 6 6 10.04128 6 15 C 6 19.95872 10.041282 24 15 24 C 19.958718 24 24 19.95872 24 15 C 24 13.029943 23.355254 11.209156 22.275391 9.7246094 L 20.849609 11.150391 C 21.575382 12.253869 22 13.575008 22 15 C 22 18.87784 18.877838 22 15 22 C 11.122162 22 8 18.87784 8 15 C 8 11.12216 11.122162 8 15 8 L 15 11 L 20 7 L 15 3 z "
        transform="translate(0,289.0625)"
        id="path852"
      />
      <!-- Red slash for no-repeat -->
      <line
        x1="10"
        y1="314"
        x2="20"
        y2="296"
        stroke="#fa9a9aff"
        stroke-width="2.5"
        stroke-linecap="round"
        opacity="0.6"
      />
    </g>
  </svg>
`;

const VolumeIcon = () => html`
  <svg
    viewBox="0 0 48 48"
    width="2.5em"
    height="2.5em"
    fill="currentColor"
    aria-hidden="true"
  >
    <polygon points="12,18 20,18 28,10 28,38 20,30 12,30" />
    <path
      d="M34 18a6 6 0 010 12"
      fill="none"
      stroke="currentColor"
      stroke-width="3"
    />
    <path
      d="M38 14a12 12 0 010 20"
      fill="none"
      stroke="currentColor"
      stroke-width="3"
    />
  </svg>
`;

const MutedIcon = () => html`
  <svg
    viewBox="0 0 48 48"
    width="2.5em"
    height="2.5em"
    fill="currentColor"
    aria-hidden="true"
  >
    <polygon points="12,18 20,18 28,10 28,38 20,30 12,30" />
    <line
      x1="36"
      y1="16"
      x2="44"
      y2="32"
      stroke="currentColor"
      stroke-width="4"
    />
    <line
      x1="44"
      y1="16"
      x2="36"
      y2="32"
      stroke="currentColor"
      stroke-width="4"
    />
  </svg>
`;

export { PlayIcon, PauseIcon, RepeatIcon, NoRepeatIcon, VolumeIcon, MutedIcon };
