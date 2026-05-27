"use client";

import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { getFirebaseDb, isFirebaseConfigured } from "@/shared/firebase/client";
import { ALPHABET_ITEMS } from "@/features/alphabet-game/data/alphabet-items";
import type { WordContent } from "../types";
import { mapWordDoc, sortWords } from "../lib/mappers";

const fallbackWords: WordContent[] = ALPHABET_ITEMS.map(({ icon, ...item }) => item);

export function useWords() {
  const [words, setWords] = useState<WordContent[]>(fallbackWords);
  const [loading, setLoading] = useState(isFirebaseConfigured);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      collection(getFirebaseDb(), "words"),
      (snapshot) => {
        const mappedWords = snapshot.docs.map((doc) => mapWordDoc(doc.id, doc.data()));
        setWords(sortWords(mappedWords));
        setLoading(false);
      },
      () => {
        setError("Não foi possível carregar palavras.");
        setLoading(false);
      },
    );

    return unsubscribe;
  }, []);

  return { words, loading, error };
}
