import { describe, expect, it } from "vitest";
import { DEFAULT_WORD_ICON, WORD_ICON_OPTIONS, getWordIcon } from "./icon-registry";

describe("word icon registry", () => {
  it("returns configured icons", () => {
    expect(getWordIcon("Apple")).toBeTruthy();
    expect(WORD_ICON_OPTIONS).toContain("Apple");
  });

  it("falls back to the default icon", () => {
    expect(getWordIcon("Unknown")).toBe(getWordIcon(DEFAULT_WORD_ICON));
  });
});
