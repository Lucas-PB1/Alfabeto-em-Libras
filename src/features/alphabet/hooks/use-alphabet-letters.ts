"use client";

import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { getFirebaseDb, isFirebaseConfigured } from "@/shared/firebase/client";
import { FALLBACK_ALPHABET_LETTERS } from "@/features/alphabet-game/data/fallback-alphabet";
import type { AlphabetLetter } from "../types";
import { mapAlphabetDoc, sortAlphabetLetters } from "../lib/mappers";

export function useAlphabetLetters() {
  const [letters, setLetters] = useState<AlphabetLetter[]>(FALLBACK_ALPHABET_LETTERS);
  const [loading, setLoading] = useState(isFirebaseConfigured);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      collection(getFirebaseDb(), "alphabet"),
      (snapshot) => {
        const mappedLetters = snapshot.docs.map((doc) => mapAlphabetDoc(doc.id, doc.data()));
        setLetters(sortAlphabetLetters(mappedLetters));
        setLoading(false);
      },
      () => {
        setError("Não foi possível carregar o alfabeto.");
        setLoading(false);
      },
    );

    return unsubscribe;
  }, []);

  return { letters, loading, error };
}
