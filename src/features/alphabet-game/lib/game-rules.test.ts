import { describe, expect, it } from "vitest";
import { ALPHABET_ITEMS } from "../data/alphabet-items";
import { ACTIVE_ITEM_COUNT, COMPLETION_TARGET, VISIBLE_LETTER_COUNT } from "./constants";
import { createRound, createVisibleLettersForItem, isGameComplete } from "./game-rules";
import { getLibrasChar, getLocalLibrasSource } from "./libras";

const stableRandom = () => 0.42;

describe("alphabet game rules", () => {
  it("uses only items that were not completed", () => {
    const completedIds = ALPHABET_ITEMS.slice(0, 24).map((item) => item.id);
    const round = createRound(ALPHABET_ITEMS, completedIds, stableRandom);

    expect(round.activeItems).toHaveLength(2);
    expect(round.activeItems.every((item) => !completedIds.includes(item.id))).toBe(true);
  });

  it("selects a broad picture board for a round", () => {
    const round = createRound(ALPHABET_ITEMS, [], stableRandom);

    expect(round.activeItems.length).toBeGreaterThan(0);
    expect(round.activeItems.length).toBeLessThanOrEqual(ACTIVE_ITEM_COUNT);
    expect(round.selectedItem).toBeNull();
    expect(round.visibleLetters).toEqual([]);
  });

  it("builds a focused keyboard only after choosing an item", () => {
    const round = createRound(ALPHABET_ITEMS, [], stableRandom);
    const selectedItem = round.activeItems[0];
    const visibleLetters = createVisibleLettersForItem(selectedItem, stableRandom);

    expect(visibleLetters).toContain(selectedItem.letter);
    expect(visibleLetters).toHaveLength(VISIBLE_LETTER_COUNT);
  });

  it("does not duplicate visible letters", () => {
    const round = createRound(ALPHABET_ITEMS, [], stableRandom);
    const visibleLetters = createVisibleLettersForItem(round.activeItems[0], stableRandom);
    const uniqueLetters = new Set(visibleLetters);

    expect(uniqueLetters.size).toBe(visibleLetters.length);
  });

  it("keeps the completion target at five correct answers", () => {
    expect(COMPLETION_TARGET).toBe(5);
    expect(isGameComplete(COMPLETION_TARGET - 1)).toBe(false);
    expect(isGameComplete(COMPLETION_TARGET)).toBe(true);
  });

  it("maps cedilha to the Libras fallback font character", () => {
    expect(getLibrasChar("Ç")).toBe("ç");
    expect(getLibrasChar("C\u0327")).toBe("ç");
  });

  it("encodes cedilha local image paths", () => {
    expect(getLocalLibrasSource("Ç", "svg")).toBe("/libras/%C3%87.svg");
    expect(getLocalLibrasSource("C\u0327", "svg")).toBe("/libras/%C3%87.svg");
  });
});
