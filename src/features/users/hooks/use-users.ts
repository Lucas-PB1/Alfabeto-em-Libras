"use client";

import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { getFirebaseDb, isFirebaseConfigured } from "@/shared/firebase/client";
import type { UserProfile } from "../types";
import { mapUserDoc } from "../lib/mappers";

export function useUsers(enabled = true) {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(enabled && isFirebaseConfigured);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!enabled || !isFirebaseConfigured) {
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      collection(getFirebaseDb(), "users"),
      (snapshot) => {
        const mappedUsers = snapshot.docs.map((doc) => mapUserDoc(doc.id, doc.data()));
        setUsers(mappedUsers.sort((a, b) => a.email.localeCompare(b.email)));
        setLoading(false);
      },
      () => {
        setError("Não foi possível carregar usuários.");
        setLoading(false);
      },
    );

    return unsubscribe;
  }, [enabled]);

  return { users, loading, error };
}
