import { h } from "preact";
import htm from "htm";
import "./arrow.scss";

const html = htm.bind(h);

const Arrow = ({ direction, tooltip, href, onClick }) => html`
  <a
    class="arrow"
    data-direction=${direction}
    data-tooltip=${tooltip}
    href=${href}
    onClick=${onClick}
  >
    <div class="arrow-top"></div>
    <div class="arrow-bottom"></div>
  </a>
`;

export default Arrow;
