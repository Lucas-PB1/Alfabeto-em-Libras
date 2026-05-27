import type { LucideIcon } from "lucide-react";
import type { AlphabetLetter } from "../alphabet/types";

export type GameView = "HOME" | "REFERENCE" | "GAME" | "CELEBRATION";

export type FeedbackStatus = "NONE" | "CORRECT" | "WRONG";

export interface AlphabetItem {
  id: string;
  name: string;
  letter: string;
  visualType: "image" | "icon";
  image: string;
  iconKey: string;
  icon: LucideIcon;
  colorClass: string;
  active: boolean;
}

export interface GameRound {
  activeItems: AlphabetItem[];
  visibleLetters: string[];
  selectedItem: AlphabetItem | null;
}

export interface ConfettiPiece {
  id: number;
  x: number;
  duration: number;
  delay: number;
  emoji: string;
}

export interface AlphabetContent {
  letters: AlphabetLetter[];
  words: AlphabetItem[];
}
