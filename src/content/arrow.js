import { h } from "preact";
import { useEffect, useRef } from "preact/hooks";
import htm from "htm";

const html = htm.bind(h);

const Arrow = ({ direction, tooltip, href, onClick }) => {
  const arrowRef = useRef(null);
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowLeft" && direction === "left") {
        arrowRef.current.click();
      } else if (event.key === "ArrowRight" && direction === "right") {
        arrowRef.current.click();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [direction]);

  return html`
    <a
      ref=${arrowRef}
      class="arrow"
      data-direction=${direction}
      data-tooltip=${tooltip}
      title=${tooltip}
      href=${href}
      onClick=${onClick}
      hidden=${!href}
    >
      <div class="arrow-top"></div>
      <div class="arrow-bottom"></div>
    </a>
  `;
};

export default Arrow;
