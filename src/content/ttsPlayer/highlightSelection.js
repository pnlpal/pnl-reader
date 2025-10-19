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
  range.surroundContents(span);
}

export { highlightSelection, clearHighlights };
