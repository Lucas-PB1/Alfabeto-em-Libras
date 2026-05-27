"use client";

import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getFirebaseAuth, isFirebaseConfigured } from "@/shared/firebase/client";
import type { UserProfile } from "@/features/users/types";

interface CmsAuthContextValue {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string;
  authorizedFetch: (path: string, init?: RequestInit) => Promise<Response>;
  refreshSession: (name?: string) => Promise<UserProfile | null>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const CmsAuthContext = createContext<CmsAuthContextValue | null>(null);

export function CmsAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refreshSession = useCallback(async (name?: string) => {
    const currentUser = getFirebaseAuth().currentUser;

    if (!currentUser) {
      return null;
    }

    const idToken = await currentUser.getIdToken(true);
    const response = await fetch("/api/cms/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken, name }),
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error ?? "Não foi possível validar o acesso.");
    }

    setProfile(data.profile);
    return data.profile as UserProfile;
  }, []);

  const authorizedFetch = useCallback(async (path: string, init: RequestInit = {}) => {
    const currentUser = getFirebaseAuth().currentUser;

    if (!currentUser) {
      throw new Error("Sessão expirada.");
    }

    const token = await currentUser.getIdToken();
    const headers = new Headers(init.headers);
    headers.set("Authorization", `Bearer ${token}`);

    return fetch(path, { ...init, headers });
  }, []);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setError("Configure o Firebase para acessar o CMS.");
      setLoading(false);
      return;
    }

    return onAuthStateChanged(getFirebaseAuth(), async (authUser) => {
      setUser(authUser);
      setProfile(null);

      if (!authUser) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        await refreshSession();
        setError("");
      } catch (sessionError) {
        setError(sessionError instanceof Error ? sessionError.message : "Erro de autenticação.");
      } finally {
        setLoading(false);
      }
    });
  }, [refreshSession]);

  const value = useMemo<CmsAuthContextValue>(() => ({
    user,
    profile,
    loading,
    error,
    authorizedFetch,
    refreshSession,
    signIn: async (email, password) => {
      await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
    },
    signUp: async (name, email, password) => {
      const credential = await createUserWithEmailAndPassword(getFirebaseAuth(), email, password);
      await updateProfile(credential.user, { displayName: name });
      await refreshSession(name);
    },
    signOut: async () => {
      await firebaseSignOut(getFirebaseAuth());
      setProfile(null);
    },
  }), [authorizedFetch, error, loading, profile, refreshSession, user]);

  return <CmsAuthContext.Provider value={value}>{children}</CmsAuthContext.Provider>;
}

export function useCmsAuth() {
  const context = useContext(CmsAuthContext);

  if (!context) {
    throw new Error("useCmsAuth must be used within CmsAuthProvider.");
  }

  return context;
}
