"use client";

import Image from "next/image";
import { Save, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import { useCmsAuth } from "@/features/auth/components/auth-provider";
import { uploadCmsImage } from "@/shared/firebase/upload";
import { CmsButton, CmsField, CmsInput, CmsPageHeader, CmsPanel, CmsSpinner, CmsStatus } from "@/shared/cms/ui";

type BusyAction = "" | "photo" | "save";
type Feedback = { text: string; tone: "danger" | "success" };

export default function ProfilePage() {
  const { authorizedFetch, profile, refreshSession, user } = useCmsAuth();
  const [name, setName] = useState(profile?.name ?? "");
  const [photoUrl, setPhotoUrl] = useState(profile?.photoUrl ?? "");
  const [busyAction, setBusyAction] = useState<BusyAction>("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const busy = Boolean(busyAction);

  useEffect(() => {
    setName(profile?.name ?? "");
    setPhotoUrl(profile?.photoUrl ?? "");
  }, [profile?.name, profile?.photoUrl]);

  async function saveProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusyAction("save");
    setFeedback(null);

    try {
      await authorizedFetch("/api/cms/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, photoUrl }),
      });
      await refreshSession(name);
      setFeedback({ text: "Perfil atualizado.", tone: "success" });
    } catch (saveError) {
      setFeedback({ text: getErrorMessage(saveError), tone: "danger" });
    } finally {
      setBusyAction("");
    }
  }

  async function uploadPhoto(file?: File) {
    if (!file || !user) {
      return;
    }

    setBusyAction("photo");
    setFeedback(null);

    try {
      const url = await uploadCmsImage(file, `users/${user.uid}/profile`);
      setPhotoUrl(url);
      setFeedback({ text: "Foto enviada. Salve o perfil para gravar a alteração.", tone: "success" });
    } catch (uploadError) {
      setFeedback({ text: getErrorMessage(uploadError), tone: "danger" });
    } finally {
      setBusyAction("");
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
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                disabled={busy}
                onChange={async (event) => {
                  const input = event.currentTarget;

                  try {
                    await uploadPhoto(input.files?.[0]);
                  } finally {
                    input.value = "";
                  }
                }}
              />
              <span className={`inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition ${busy ? "cursor-not-allowed opacity-60" : "hover:bg-slate-50"}`}>
                {busyAction === "photo" ? <CmsSpinner /> : <Upload size={16} />}
                {busyAction === "photo" ? "Enviando..." : "Foto"}
              </span>
            </label>
          </div>

          <div className="grid gap-4">
            <CmsField label="Nome">
              <CmsInput required disabled={busy} value={name} onChange={(event) => setName(event.target.value)} />
            </CmsField>
            <CmsField label="Email">
              <CmsInput disabled value={profile?.email ?? ""} />
            </CmsField>
            {feedback && <CmsStatus tone={feedback.tone} text={feedback.text} />}
            <CmsButton disabled={busyAction === "photo"} loading={busyAction === "save"} loadingText="Salvando..." type="submit" className="w-fit">
              <Save size={16} />
              Salvar perfil
            </CmsButton>
          </div>
        </form>
      </CmsPanel>
    </div>
  );
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Não foi possível concluir a ação.";
}
