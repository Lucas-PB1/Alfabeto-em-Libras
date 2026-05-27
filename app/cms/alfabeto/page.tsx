"use client";

import Image from "next/image";
import { Upload } from "lucide-react";
import { useState } from "react";
import { useCmsAuth } from "@/features/auth/components/auth-provider";
import { useAlphabetLetters } from "@/features/alphabet/hooks/use-alphabet-letters";
import { uploadCmsImage } from "@/shared/firebase/upload";
import { CmsInput, CmsPageHeader, CmsStatus, CmsTable } from "@/shared/cms/ui";

export default function AlphabetPage() {
  const { authorizedFetch } = useCmsAuth();
  const { error, letters, loading } = useAlphabetLetters();
  const [busyLetter, setBusyLetter] = useState("");

  async function updateLetter(letter: string, body: Record<string, unknown>) {
    setBusyLetter(letter);

    try {
      await authorizedFetch(`/api/cms/alphabet/${encodeURIComponent(letter)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } finally {
      setBusyLetter("");
    }
  }

  async function handleUpload(letter: string, file?: File) {
    if (!file) {
      return;
    }

    setBusyLetter(letter);

    try {
      const url = await uploadCmsImage(file, `cms/alphabet/${letter}`);
      await updateLetter(letter, { librasImage: url });
    } finally {
      setBusyLetter("");
    }
  }

  return (
    <div className="grid gap-5">
      <CmsPageHeader eyebrow="Conteúdo" title="Alfabeto" />
      {loading && <CmsStatus text="Carregando alfabeto..." />}
      {error && <CmsStatus text={error} />}

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
          {letters.map((item) => (
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
                  disabled={busyLetter === item.letter}
                  onBlur={(event) => updateLetter(item.letter, { order: Number(event.target.value) })}
                  className="w-24"
                />
              </td>
              <td className="px-3 py-3">
                <input
                  type="checkbox"
                  checked={item.active}
                  disabled={busyLetter === item.letter}
                  onChange={(event) => updateLetter(item.letter, { active: event.target.checked })}
                  className="h-5 w-5 rounded border-slate-300 text-slate-950"
                />
              </td>
              <td className="px-3 py-3">
                <label className="inline-flex">
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    disabled={busyLetter === item.letter}
                    onChange={(event) => handleUpload(item.letter, event.target.files?.[0])}
                  />
                  <span className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50">
                    <Upload size={16} />
                    Trocar
                  </span>
                </label>
              </td>
            </tr>
          ))}
        </tbody>
      </CmsTable>
    </div>
  );
}
