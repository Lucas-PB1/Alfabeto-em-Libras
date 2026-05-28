import { getWordIcon } from "@/features/words/lib/icon-registry";
import type { AlphabetLetter } from "@/features/alphabet/types";
import type { WordContent } from "@/features/words/types";
import type { AlphabetItem } from "../types";

export function mapWordToGameItem(word: WordContent, alphabetLetters: readonly AlphabetLetter[] = []): AlphabetItem {
  const letter = normalizeLetter(word.letter);

  return {
    id: word.id,
    name: word.name.trim().normalize("NFC").toUpperCase(),
    letter,
    librasImage: getLibrasImageForLetter(letter, alphabetLetters),
    visualType: word.visualType,
    image: word.image,
    iconKey: word.iconKey,
    icon: getWordIcon(word.iconKey),
    colorClass: word.colorClass,
    active: word.active,
  };
}

export function getActiveGameItems(words: WordContent[], alphabetLetters: readonly AlphabetLetter[] = []) {
  return words
    .filter((word) => word.active)
    .map((word) => mapWordToGameItem(word, alphabetLetters))
    .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
}

function getLibrasImageForLetter(letter: string, alphabetLetters: readonly AlphabetLetter[]) {
  return alphabetLetters.find((item) => normalizeLetter(item.letter) === letter)?.librasImage ?? "";
}

function normalizeLetter(letter: string) {
  return letter.trim().normalize("NFC").toUpperCase();
}
