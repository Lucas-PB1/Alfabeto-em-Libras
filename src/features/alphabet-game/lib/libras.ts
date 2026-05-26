export function getLibrasChar(letter: string) {
  const upper = letter.toUpperCase();
  return upper === "Ç" ? "ç" : upper;
}

export function getLocalLibrasSource(letter: string, extension: "svg" | "png") {
  return `/libras/${letter.toUpperCase()}.${extension}`;
}
