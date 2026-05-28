export function getLibrasChar(letter: string) {
  const upper = normalizeLetter(letter);
  return upper === "Ç" ? "ç" : upper;
}

export function getLocalLibrasSource(letter: string, extension: "svg" | "png") {
  return `/libras/${encodeURIComponent(normalizeLetter(letter))}.${extension}`;
}

function normalizeLetter(letter: string) {
  return letter.normalize("NFC").toUpperCase();
}
