import { getWordIcon } from "@/features/words/lib/icon-registry";
import type { WordContent } from "@/features/words/types";
import type { AlphabetItem } from "../types";

export function mapWordToGameItem(word: WordContent): AlphabetItem {
  return {
    id: word.id,
    name: word.name.trim().toUpperCase(),
    letter: word.letter.trim().toUpperCase(),
    visualType: word.visualType,
    image: word.image,
    iconKey: word.iconKey,
    icon: getWordIcon(word.iconKey),
    colorClass: word.colorClass,
    active: word.active,
  };
}

export function getActiveGameItems(words: WordContent[]) {
  return words
    .filter((word) => word.active)
    .map(mapWordToGameItem)
    .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
}
