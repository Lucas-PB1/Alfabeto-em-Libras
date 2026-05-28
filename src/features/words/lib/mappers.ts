import { toIsoDate } from "@/shared/lib/firestore-date";
import type { WordContent } from "../types";

interface WordDoc {
  name?: string;
  letter?: string;
  visualType?: WordContent["visualType"];
  image?: string;
  iconKey?: string;
  colorClass?: string;
  active?: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export function mapWordDoc(id: string, data: WordDoc): WordContent {
  return {
    id,
    name: (data.name ?? "").normalize("NFC").toUpperCase(),
    letter: (data.letter ?? "").normalize("NFC").toUpperCase(),
    visualType: data.visualType ?? "icon",
    image: data.image ?? "",
    iconKey: data.iconKey ?? "Circle",
    colorClass: data.colorClass ?? "bg-slate-100",
    active: data.active ?? true,
    createdAt: toIsoDate(data.createdAt),
    updatedAt: toIsoDate(data.updatedAt),
  };
}

export function sortWords(words: WordContent[]) {
  return [...words].sort((a, b) => a.letter.localeCompare(b.letter, "pt-BR") || a.name.localeCompare(b.name));
}
