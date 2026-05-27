"use client";

import Image from "next/image";
import { Save, Upload } from "lucide-react";
import { useState } from "react";
import { useCmsAuth } from "@/features/auth/components/auth-provider";
import { uploadCmsImage } from "@/shared/firebase/upload";
import { CmsButton, CmsField, CmsInput, CmsPageHeader, CmsPanel, CmsStatus } from "@/shared/cms/ui";

export default function ProfilePage() {
  const { authorizedFetch, profile, refreshSession, user } = useCmsAuth();
  const [name, setName] = useState(profile?.name ?? "");
  const [photoUrl, setPhotoUrl] = useState(profile?.photoUrl ?? "");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function saveProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");

    try {
      await authorizedFetch("/api/cms/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, photoUrl }),
      });
      await refreshSession(name);
      setMessage("Perfil atualizado.");
    } finally {
      setBusy(false);
    }
  }

  async function uploadPhoto(file?: File) {
    if (!file || !user) {
      return;
    }

    setBusy(true);

    try {
      const url = await uploadCmsImage(file, `users/${user.uid}/profile`);
      setPhotoUrl(url);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-5">
      <CmsPageHeader eyebrow="Conta" title="Perfil" />
      <CmsPanel>
        <form onSubmit={saveProfile} className="grid gap-5 md:grid-cols-[160px_1fr]">
          <div>
            <div className="relative h-32 w-32 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
              {photoUrl ? (
                <Image src={photoUrl} alt={name} fill className="object-cover" unoptimized />
              ) : (
                <div className="flex h-full items-center justify-center text-3xl font-black text-slate-400">
                  {name.slice(0, 1).toUpperCase()}
                </div>
              )}
            </div>
            <label className="mt-3 inline-flex">
              <input type="file" accept="image/*" className="sr-only" onChange={(event) => uploadPhoto(event.target.files?.[0])} />
              <span className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 hover:bg-slate-50">
                <Upload size={16} />
                Foto
              </span>
            </label>
          </div>

          <div className="grid gap-4">
            <CmsField label="Nome">
              <CmsInput required value={name} onChange={(event) => setName(event.target.value)} />
            </CmsField>
            <CmsField label="Email">
              <CmsInput disabled value={profile?.email ?? ""} />
            </CmsField>
            {message && <CmsStatus text={message} />}
            <CmsButton disabled={busy} type="submit" className="w-fit">
              <Save size={16} />
              Salvar perfil
            </CmsButton>
          </div>
        </form>
      </CmsPanel>
    </div>
  );
}
