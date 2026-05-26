import type { ConfettiPiece } from "../types";

const CONFETTI_EMOJIS = ["✨", "⭐", "🎈", "🎉"];

export function createConfettiPieces(count = 20): ConfettiPiece[] {
  return Array.from({ length: count }, (_, index) => ({
    id: index,
    x: (index * 50) % 1000 - 500,
    duration: 3 + (index % 3),
    delay: (index % 5) * 0.4,
    emoji: CONFETTI_EMOJIS[index % CONFETTI_EMOJIS.length],
  }));
}
