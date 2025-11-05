export default (node) => {
  const textNodes = Array.from(node.childNodes).filter(
    (child) =>
      child.nodeType === Node.TEXT_NODE ||
      (child.nodeType === Node.ELEMENT_NODE &&
        !child.classList.contains("tts-speaker-icon") &&
        !child.classList.contains("pnl-reader-translate-icon") &&
        !child.classList.contains("paragraph-translator-container") &&
        child.offsetParent !== null) // Only visible elements
  );

  return textNodes
    .map((n) => n.textContent.trim())
    .filter((t) => t.length > 2)
    .join(" ");
};
