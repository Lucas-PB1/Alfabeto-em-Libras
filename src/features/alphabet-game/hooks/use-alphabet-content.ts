"use client";

import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { mapAlphabetDoc, sortAlphabetLetters } from "@/features/alphabet/lib/mappers";
import type { AlphabetLetter } from "@/features/alphabet/types";
import { mapWordDoc, sortWords } from "@/features/words/lib/mappers";
import type { WordContent } from "@/features/words/types";
import { getFirebaseDb, isFirebaseConfigured } from "@/shared/firebase/client";
import { ALPHABET_ITEMS } from "../data/alphabet-items";
import { FALLBACK_ALPHABET_LETTERS } from "../data/fallback-alphabet";
import { getActiveGameItems } from "../lib/content-mapper";

const fallbackWords: WordContent[] = ALPHABET_ITEMS.map(({ icon, ...item }) => item);
const CONTENT_LOAD_TIMEOUT_MS = 2500;
type ContentCollection = "alphabet" | "words";

export function useAlphabetContent() {
  const [letters, setLetters] = useState<AlphabetLetter[]>(FALLBACK_ALPHABET_LETTERS);
  const [words, setWords] = useState<WordContent[]>(fallbackWords);
  const [loading, setLoading] = useState(isFirebaseConfigured);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setLoading(false);
      return;
    }

    const db = getFirebaseDb();
    const loadedCollections = new Set<ContentCollection>();
    const timeout = setTimeout(() => setLoading(false), CONTENT_LOAD_TIMEOUT_MS);
    const finishLoad = (collectionName: ContentCollection) => {
      loadedCollections.add(collectionName);
      setLoading(loadedCollections.size < 2);

      if (loadedCollections.size >= 2) {
        clearTimeout(timeout);
      }
    };
    const failLoad = () => {
      setError("Usando conteúdo local enquanto o Firebase não responde.");
      setLoading(false);
      clearTimeout(timeout);
    };
    const unsubscribeAlphabet = onSnapshot(collection(db, "alphabet"), (snapshot) => {
      const mappedLetters = snapshot.docs.map((doc) => mapAlphabetDoc(doc.id, doc.data()));
      const activeLetters = sortAlphabetLetters(mappedLetters).filter((letter) => letter.active);
      setLetters(activeLetters.length > 0 ? activeLetters : FALLBACK_ALPHABET_LETTERS);
      finishLoad("alphabet");
    }, failLoad);
    const unsubscribeWords = onSnapshot(collection(db, "words"), (snapshot) => {
      const mappedWords = snapshot.docs.map((doc) => mapWordDoc(doc.id, doc.data()));
      const sortedWords = sortWords(mappedWords);
      setWords(sortedWords.length > 0 ? sortedWords : fallbackWords);
      finishLoad("words");
    }, failLoad);

    return () => {
      clearTimeout(timeout);
      unsubscribeAlphabet();
      unsubscribeWords();
    };
  }, []);

  return useMemo(() => ({
    content: { letters, words: getActiveGameItems(words, letters) },
    error,
    loading,
  }), [error, letters, loading, words]);
}
