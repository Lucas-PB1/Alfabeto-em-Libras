import type { AlphabetLetter } from "@/features/alphabet/types";
import { ALPHABET } from "../lib/constants";
import { getLocalLibrasSource } from "../lib/libras";

export const FALLBACK_ALPHABET_LETTERS: AlphabetLetter[] = ALPHABET.map((letter, index) => ({
  id: letter,
  letter,
  librasImage: getLocalLibrasSource(letter, "svg"),
  active: true,
  order: index,
}));
