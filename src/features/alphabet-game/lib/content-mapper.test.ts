import { describe, expect, it } from "vitest";
import { getActiveGameItems, mapWordToGameItem } from "./content-mapper";
import type { WordContent } from "@/features/words/types";

const word: WordContent = {
  id: "word-a",
  active: true,
  colorClass: "bg-yellow-400",
  iconKey: "Bug",
  image: "",
  letter: "a",
  name: "abelha",
  visualType: "icon",
};

describe("alphabet content mapper", () => {
  it("normalizes Firestore words into game items", () => {
    const item = mapWordToGameItem(word);

    expect(item.name).toBe("ABELHA");
    expect(item.letter).toBe("A");
    expect(item.icon).toBeTruthy();
  });

  it("filters inactive words", () => {
    expect(getActiveGameItems([word, { ...word, id: "off", active: false }])).toHaveLength(1);
  });
});
