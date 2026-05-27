import { ALPHABET, ACTIVE_ITEM_COUNT, COMPLETION_TARGET, VISIBLE_LETTER_COUNT } from "./constants";
import type { AlphabetItem, GameRound } from "../types";

type RandomSource = () => number;

export function shuffleItems<T>(items: readonly T[], random: RandomSource = Math.random) {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[target]] = [shuffled[target], shuffled[index]];
  }

  return shuffled;
}

export function createRound(
  items: readonly AlphabetItem[],
  completedItemIds: readonly string[],
  random: RandomSource = Math.random,
): GameRound {
  const completedSet = new Set(completedItemIds);
  const remainingItems = items.filter((item) => !completedSet.has(item.id));

  if (remainingItems.length === 0) {
    return { activeItems: [], visibleLetters: [], selectedItem: null };
  }

  const activeItems = shuffleItems(remainingItems, random).slice(0, ACTIVE_ITEM_COUNT);

  return {
    activeItems,
    visibleLetters: [],
    selectedItem: null,
  };
}

export function createVisibleLettersForItem(
  item: AlphabetItem,
  random: RandomSource = Math.random,
) {
  const selectedLetter = item.letter;
  const fillerLetters = shuffleItems(
    ALPHABET.filter((letter) => letter !== selectedLetter),
    random,
  ).slice(0, VISIBLE_LETTER_COUNT - 1);

  return [selectedLetter, ...fillerLetters].sort((a, b) => a.localeCompare(b, "pt-BR"));
}

export function isCorrectLetter(item: AlphabetItem | null, letter: string) {
  return Boolean(item && item.letter === letter);
}

export function isGameComplete(completedCount: number) {
  return completedCount >= COMPLETION_TARGET;
}

export function getCompletionTarget(items: readonly AlphabetItem[]) {
  return Math.min(COMPLETION_TARGET, items.length);
}
