import { describe, expect, it } from "vitest";
import { wordWriteSchema } from "./schemas";

describe("word schemas", () => {
  it("accepts icon words without an image", () => {
    const word = wordWriteSchema.parse({
      active: true,
      colorClass: "bg-slate-100",
      iconKey: "Circle",
      image: "",
      letter: "A",
      name: "Abelha",
      visualType: "icon",
    });

    expect(word.name).toBe("Abelha");
  });

  it("requires an image for image words", () => {
    expect(() => wordWriteSchema.parse({
      active: true,
      colorClass: "bg-slate-100",
      iconKey: "Circle",
      image: "",
      letter: "A",
      name: "Abelha",
      visualType: "image",
    })).toThrow();
  });
});
