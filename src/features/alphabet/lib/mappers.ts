import { toIsoDate } from "@/shared/lib/firestore-date";
import type { AlphabetLetter } from "../types";

interface AlphabetDoc {
  letter?: string;
  librasImage?: string;
  active?: boolean;
  order?: number;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export function mapAlphabetDoc(id: string, data: AlphabetDoc): AlphabetLetter {
  return {
    id,
    letter: (data.letter ?? id).normalize("NFC").toUpperCase(),
    librasImage: data.librasImage ?? "",
    active: data.active ?? true,
    order: data.order ?? 0,
    createdAt: toIsoDate(data.createdAt),
    updatedAt: toIsoDate(data.updatedAt),
  };
}

export function sortAlphabetLetters(letters: AlphabetLetter[]) {
  return [...letters].sort((a, b) => a.order - b.order || a.letter.localeCompare(b.letter, "pt-BR"));
}
