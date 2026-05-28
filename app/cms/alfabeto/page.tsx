"use client";

import Image from "next/image";
import { Upload } from "lucide-react";
import { useState } from "react";
import { useCmsAuth } from "@/features/auth/components/auth-provider";
import { useAlphabetLetters } from "@/features/alphabet/hooks/use-alphabet-letters";
import { uploadCmsImage } from "@/shared/firebase/upload";
import { CmsInput, CmsPageHeader, CmsSpinner, CmsStatus, CmsTable } from "@/shared/cms/ui";

type BusyState = { label: string; letter: string } | null;
type Feedback = { text: string; tone: "danger" | "success" };

export default function AlphabetPage() {
  const { authorizedFetch } = useCmsAuth();
  const { error, letters, loading } = useAlphabetLetters();
  const [busy, setBusy] = useState<BusyState>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  async function updateLetter(letter: string, body: Record<string, unknown>) {
    setBusy({ letter, label: "Salvando..." });
    setFeedback(null);

    try {
      await authorizedFetch(`/api/cms/alphabet/${encodeURIComponent(letter)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      setFeedback({ text: "Letra atualizada.", tone: "success" });
    } catch (updateError) {
      setFeedback({ text: getErrorMessage(updateError), tone: "danger" });
    } finally {
      setBusy(null);
    }
  }

  async function handleUpload(letter: string, file?: File) {
    if (!file) {
      return;
    }

    setBusy({ letter, label: "Enviando..." });
    setFeedback(null);

    try {
      const url = await uploadCmsImage(file, `cms/alphabet/${letter}`);
      await authorizedFetch(`/api/cms/alphabet/${encodeURIComponent(letter)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ librasImage: url }),
      });
      setFeedback({ text: "Imagem da letra atualizada.", tone: "success" });
    } catch (uploadError) {
      setFeedback({ text: getErrorMessage(uploadError), tone: "danger" });
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="grid gap-5">
      <CmsPageHeader eyebrow="Conteúdo" title="Alfabeto" />
      {loading && <CmsStatus text="Carregando alfabeto..." />}
      {error && <CmsStatus tone="danger" text={error} />}
      {feedback && <CmsStatus tone={feedback.tone} text={feedback.text} />}

      <CmsTable>
        <thead className="bg-slate-50 text-xs font-black uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-3 py-3">Letra</th>
            <th className="px-3 py-3">Sinal em Libras</th>
            <th className="px-3 py-3">Ordem</th>
            <th className="px-3 py-3">Ativo</th>
            <th className="px-3 py-3">Imagem</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {letters.map((item) => {
            const rowBusy = busy?.letter === item.letter;
            const busyLabel = rowBusy ? busy.label : "";

            return (
              <tr key={item.id}>
                <td className="px-3 py-3 text-2xl font-black text-slate-950">{item.letter}</td>
                <td className="px-3 py-3">
                  <div className="relative h-16 w-16 rounded-lg border border-slate-200 bg-white">
                    <Image src={item.librasImage} alt={`Sinal ${item.letter}`} fill className="object-contain p-1" unoptimized />
                  </div>
                </td>
                <td className="px-3 py-3">
                  <CmsInput
                    type="number"
                    min={0}
                    defaultValue={item.order}
                    disabled={rowBusy}
                    onBlur={(event) => updateLetter(item.letter, { order: Number(event.target.value) })}
                    className="w-24"
                  />
                </td>
                <td className="px-3 py-3">
                  <input
                    type="checkbox"
                    checked={item.active}
                    disabled={rowBusy}
                    onChange={(event) => updateLetter(item.letter, { active: event.target.checked })}
                    className="h-5 w-5 rounded border-slate-300 text-slate-950"
                  />
                </td>
                <td className="px-3 py-3">
                  <UploadControl
                    busyLabel={busyLabel}
                    disabled={rowBusy}
                    letter={item.letter}
                    onUpload={handleUpload}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </CmsTable>
    </div>
  );
}

function UploadControl({
  busyLabel,
  disabled,
  letter,
  onUpload,
}: {
  busyLabel: string;
  disabled: boolean;
  letter: string;
  onUpload: (letter: string, file?: File) => Promise<void>;
}) {
  async function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const file = input.files?.[0];

    try {
      await onUpload(letter, file);
    } finally {
      input.value = "";
    }
  }

  return (
    <label className="inline-flex">
      <input
        type="file"
        accept="image/*"
        className="sr-only"
        disabled={disabled}
        onChange={handleChange}
      />
      <span className={`inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition ${disabled ? "cursor-not-allowed opacity-60" : "hover:bg-slate-50"}`}>
        {disabled ? <CmsSpinner /> : <Upload size={16} />}
        {disabled ? busyLabel || "Aguarde..." : "Trocar"}
      </span>
    </label>
  );
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Não foi possível concluir a ação.";
}
