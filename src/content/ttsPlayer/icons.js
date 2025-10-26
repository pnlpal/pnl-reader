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
        x2="23"
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

const ReadPageIcon = () => html`
  <svg
    width="40px"
    height="40px"
    viewBox="0 0 24 24"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
  >
    <title>voice_fill</title>
    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
      <g
        id="Media"
        transform="translate(-960.000000, -144.000000)"
        fill-rule="nonzero"
      >
        <g id="voice_fill" transform="translate(960.000000, 144.000000)">
          <path
            d="M24,0 L24,24 L0,24 L0,0 L24,0 Z M12.5934901,23.257841 L12.5819402,23.2595131 L12.5108777,23.2950439 L12.4918791,23.2987469 L12.4918791,23.2987469 L12.4767152,23.2950439 L12.4056548,23.2595131 C12.3958229,23.2563662 12.3870493,23.2590235 12.3821421,23.2649074 L12.3780323,23.275831 L12.360941,23.7031097 L12.3658947,23.7234994 L12.3769048,23.7357139 L12.4804777,23.8096931 L12.4953491,23.8136134 L12.4953491,23.8136134 L12.5071152,23.8096931 L12.6106902,23.7357139 L12.6232938,23.7196733 L12.6232938,23.7196733 L12.6266527,23.7031097 L12.609561,23.275831 C12.6075724,23.2657013 12.6010112,23.2592993 12.5934901,23.257841 L12.5934901,23.257841 Z M12.8583906,23.1452862 L12.8445485,23.1473072 L12.6598443,23.2396597 L12.6498822,23.2499052 L12.6498822,23.2499052 L12.6471943,23.2611114 L12.6650943,23.6906389 L12.6699349,23.7034178 L12.6699349,23.7034178 L12.678386,23.7104931 L12.8793402,23.8032389 C12.8914285,23.8068999 12.9022333,23.8029875 12.9078286,23.7952264 L12.9118235,23.7811639 L12.8776777,23.1665331 C12.8752882,23.1545897 12.8674102,23.1470016 12.8583906,23.1452862 L12.8583906,23.1452862 Z M12.1430473,23.1473072 C12.1332178,23.1423925 12.1221763,23.1452606 12.1156365,23.1525954 L12.1099173,23.1665331 L12.0757714,23.7811639 C12.0751323,23.7926639 12.0828099,23.8018602 12.0926481,23.8045676 L12.108256,23.8032389 L12.3092106,23.7104931 L12.3186497,23.7024347 L12.3186497,23.7024347 L12.3225043,23.6906389 L12.340401,23.2611114 L12.337245,23.2485176 L12.337245,23.2485176 L12.3277531,23.2396597 L12.1430473,23.1473072 Z"
            id="MingCute"
            fill-rule="nonzero"
          ></path>
          <path
            d="M12,2.5 C12.7796706,2.5 13.4204457,3.09488554 13.4931332,3.85553954 L13.5,4 L13.5,20 C13.5,20.8284 12.8284,21.5 12,21.5 C11.2203294,21.5 10.5795543,20.9050879 10.5068668,20.1444558 L10.5,20 L10.5,4 C10.5,3.17157 11.1716,2.5 12,2.5 Z M8,5.5 C8.82843,5.5 9.5,6.17157 9.5,7 L9.5,17 C9.5,17.8284 8.82843,18.5 8,18.5 C7.17157,18.5 6.5,17.8284 6.5,17 L6.5,7 C6.5,6.17157 7.17157,5.5 8,5.5 Z M16,5.5 C16.8284,5.5 17.5,6.17157 17.5,7 L17.5,17 C17.5,17.8284 16.8284,18.5 16,18.5 C15.1716,18.5 14.5,17.8284 14.5,17 L14.5,7 C14.5,6.17157 15.1716,5.5 16,5.5 Z M4,8.5 C4.82843,8.5 5.5,9.17157 5.5,10 L5.5,14 C5.5,14.8284 4.82843,15.5 4,15.5 C3.17157,15.5 2.5,14.8284 2.5,14 L2.5,10 C2.5,9.17157 3.17157,8.5 4,8.5 Z M20,8.5 C20.7796706,8.5 21.4204457,9.09488554 21.4931332,9.85553954 L21.5,10 L21.5,14 C21.5,14.8284 20.8284,15.5 20,15.5 C19.2203294,15.5 18.5795543,14.9050879 18.5068668,14.1444558 L18.5,14 L18.5,10 C18.5,9.17157 19.1716,8.5 20,8.5 Z"
            fill="#09244B"
          ></path>
        </g>
      </g>
    </g>
  </svg>
`;

const AutoReadNextPageIcon = () => html`
  <svg viewBox="-4 -4 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M14 10C14 9.44771 13.5523 9 13 9H12.5C9.46243 9 7 11.4624 7 14.5C7 17.5376 9.46243 20 12.5 20H17.5C20.5376 20 23 17.5376 23 14.5C23 12.0091 21.3441 9.90488 19.073 9.22823C18.5098 9.06042 18 9.52887 18 10.1166V10.1683C18 10.6659 18.3745 11.0735 18.8345 11.2634C20.1055 11.788 21 13.0395 21 14.5C21 16.433 19.433 18 17.5 18H12.5C10.567 18 9 16.433 9 14.5C9 12.567 10.567 11 12.5 11H13C13.5523 11 14 10.5523 14 10Z"
      fill="#6fcf97"
    />
    <path
      d="M11.5 4C14.5376 4 17 6.46243 17 9.5C17 12.5376 14.5376 15 11.5 15H11C10.4477 15 10 14.5523 10 14C10 13.4477 10.4477 13 11 13H11.5C13.433 13 15 11.433 15 9.5C15 7.567 13.433 6 11.5 6H6.5C4.567 6 3 7.567 3 9.5C3 10.9605 3.89451 12.212 5.16553 12.7366C5.62548 12.9264 6 13.3341 6 13.8317V13.8834C6 14.4711 5.49024 14.9396 4.92699 14.7718C2.65592 14.0951 1 11.9909 1 9.5C1 6.46243 3.46243 4 6.5 4H11.5Z"
      fill="#6fcf97"
    />
  </svg>
`;

export {
  PlayIcon,
  PauseIcon,
  RepeatIcon,
  NoRepeatIcon,
  VolumeIcon,
  MutedIcon,
  ReadPageIcon,
  AutoReadNextPageIcon,
};
