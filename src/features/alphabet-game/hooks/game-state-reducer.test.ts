import { describe, expect, it } from "vitest";
import { ALPHABET_ITEMS } from "../data/alphabet-items";
import { INITIAL_GAME_STATE, alphabetGameReducer } from "./game-state-reducer";

describe("alphabet game reducer", () => {
  it("syncs active and selected item media from fresh CMS content", () => {
    const item = ALPHABET_ITEMS[0];
    const updatedItem = {
      ...item,
      image: "https://example.com/abelha.webp",
      librasImage: "https://example.com/a.webp",
      visualType: "image" as const,
    };
    const state = alphabetGameReducer({
      ...INITIAL_GAME_STATE,
      currentView: "GAME",
      activeItems: [item],
      selectedItem: item,
      visibleLetters: ["A"],
    }, {
      type: "sync-items",
      items: [updatedItem],
    });

    expect(state.activeItems[0].image).toBe(updatedItem.image);
    expect(state.selectedItem?.librasImage).toBe(updatedItem.librasImage);
  });
});
