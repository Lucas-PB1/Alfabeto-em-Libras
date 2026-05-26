import { describe, expect, it } from "vitest";
import { ALPHABET_ITEMS } from "../data/alphabet-items";
import { COMPLETION_TARGET } from "./constants";
import { createRound, isGameComplete } from "./game-rules";
import { getLibrasChar } from "./libras";

const stableRandom = () => 0.42;

describe("alphabet game rules", () => {
  it("uses only items that were not completed", () => {
    const completedIds = ALPHABET_ITEMS.slice(0, 24).map((item) => item.id);
    const round = createRound(ALPHABET_ITEMS, completedIds, stableRandom);

    expect(round.activeItems).toHaveLength(2);
    expect(round.activeItems.every((item) => !completedIds.includes(item.id))).toBe(true);
  });

  it("selects up to three active items for a round", () => {
    const round = createRound(ALPHABET_ITEMS, [], stableRandom);

    expect(round.activeItems.length).toBeGreaterThan(0);
    expect(round.activeItems.length).toBeLessThanOrEqual(3);
    expect(round.selectedItem).toBe(round.activeItems[0]);
  });

  it("includes all required letters in the visible keyboard", () => {
    const round = createRound(ALPHABET_ITEMS, [], stableRandom);
    const requiredLetters = round.activeItems.map((item) => item.letter);

    expect(round.visibleLetters).toEqual(expect.arrayContaining(requiredLetters));
    expect(round.visibleLetters).toHaveLength(10);
  });

  it("does not duplicate visible letters", () => {
    const round = createRound(ALPHABET_ITEMS, [], stableRandom);
    const uniqueLetters = new Set(round.visibleLetters);

    expect(uniqueLetters.size).toBe(round.visibleLetters.length);
  });

  it("keeps the completion target at five correct answers", () => {
    expect(COMPLETION_TARGET).toBe(5);
    expect(isGameComplete(COMPLETION_TARGET - 1)).toBe(false);
    expect(isGameComplete(COMPLETION_TARGET)).toBe(true);
  });

  it("maps cedilha to the Libras fallback font character", () => {
    expect(getLibrasChar("Ç")).toBe("ç");
  });
});
