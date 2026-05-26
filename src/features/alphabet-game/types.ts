import type { LucideIcon } from "lucide-react";

export type GameView = "HOME" | "REFERENCE" | "GAME" | "CELEBRATION";

export type FeedbackStatus = "NONE" | "CORRECT" | "WRONG";

export interface AlphabetItem {
  id: number;
  name: string;
  letter: string;
  icon: LucideIcon;
  colorClass: string;
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
