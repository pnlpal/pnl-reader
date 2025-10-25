function clearHighlights() {
  document
    .querySelectorAll("#PNLReaderArticleContent .tts-selected-sentence")
    .forEach((span) => {
      span.replaceWith(...span.childNodes);
    });
}
function highlightSelection(selection) {
  // Remove previous highlights
  clearHighlights();

  const range = selection.getRangeAt(0);
  const span = document.createElement("span");
  span.className = "tts-selected-sentence";

  try {
    range.surroundContents(span);
  } catch (e) {
    console.error("Failed to highlight selection:", e);
    // If surroundContents fails (e.g., due to partial selection of non-text nodes), ignore highlighting.
  }
}

export { highlightSelection, clearHighlights };
