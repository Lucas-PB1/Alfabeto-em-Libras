"use client";

import { Plus, Upload } from "lucide-react";
import { useState } from "react";
import { useCmsAuth } from "@/features/auth/components/auth-provider";
import { WORD_ICON_OPTIONS } from "@/features/words/lib/icon-registry";
import { WORD_COLOR_OPTIONS } from "@/features/words/lib/style-options";
import { useWords } from "@/features/words/hooks/use-words";
import { WordPreview } from "@/features/words/components/word-preview";
import type { WordContent } from "@/features/words/types";
import { uploadCmsImage } from "@/shared/firebase/upload";
import { CmsButton, CmsField, CmsInput, CmsPageHeader, CmsPanel, CmsSelect, CmsStatus, CmsTable } from "@/shared/cms/ui";

type WordDraft = Omit<WordContent, "createdAt" | "id" | "updatedAt">;

const emptyWord: WordDraft = {
  active: true,
  colorClass: "bg-slate-100",
  iconKey: "Circle",
  image: "",
  letter: "A",
  name: "",
  visualType: "icon",
};

export default function WordsPage() {
  const { authorizedFetch } = useCmsAuth();
  const { error, loading, words } = useWords();
  const [draft, setDraft] = useState(emptyWord);
  const [draftFile, setDraftFile] = useState<File | null>(null);
  const [busy, setBusy] = useState("");

  async function createWord(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy("new");

    try {
      const image = draftFile ? await uploadCmsImage(draftFile, "cms/words") : draft.image;
      await authorizedFetch("/api/cms/words", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...draft, image }),
      });
      setDraft(emptyWord);
      setDraftFile(null);
    } finally {
      setBusy("");
    }
  }

  async function updateWord(id: string, body: Partial<WordContent>) {
    setBusy(id);

    try {
      await authorizedFetch(`/api/cms/words/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } finally {
      setBusy("");
    }
  }

  async function uploadWordImage(word: WordContent, file?: File) {
    if (!file) {
      return;
    }

    const image = await uploadCmsImage(file, `cms/words/${word.id}`);
    await updateWord(word.id, { image, visualType: "image" });
  }

  return (
    <div className="grid gap-5">
      <CmsPageHeader eyebrow="Conteúdo" title="Palavras" />
      <CmsPanel>
        <form onSubmit={createWord} className="grid gap-3 md:grid-cols-[1fr_90px_150px_150px_auto] md:items-end">
          <CmsField label="Nome">
            <CmsInput required value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} />
          </CmsField>
          <CmsField label="Letra">
            <CmsInput required maxLength={2} value={draft.letter} onChange={(event) => setDraft({ ...draft, letter: event.target.value.toUpperCase() })} />
          </CmsField>
          <CmsField label="Visual">
            <CmsSelect value={draft.visualType} onChange={(event) => setDraft({ ...draft, visualType: event.target.value as "icon" | "image" })}>
              <option value="icon">Ícone</option>
              <option value="image">Imagem</option>
            </CmsSelect>
          </CmsField>
          {draft.visualType === "image" ? (
            <CmsField label="Imagem">
              <CmsInput type="file" accept="image/*" onChange={(event) => setDraftFile(event.target.files?.[0] ?? null)} />
            </CmsField>
          ) : (
            <CmsField label="Ícone">
              <IconSelect value={draft.iconKey} onChange={(iconKey) => setDraft({ ...draft, iconKey })} />
            </CmsField>
          )}
          <CmsButton disabled={busy === "new"} type="submit">
            <Plus size={16} />
            Criar
          </CmsButton>
        </form>
      </CmsPanel>

      {loading && <CmsStatus text="Carregando palavras..." />}
      {error && <CmsStatus text={error} />}
      <WordsTable busy={busy} updateWord={updateWord} uploadWordImage={uploadWordImage} words={words} />
    </div>
  );
}

function WordsTable({
  busy,
  updateWord,
  uploadWordImage,
  words,
}: {
  busy: string;
  updateWord: (id: string, body: Partial<WordContent>) => Promise<void>;
  uploadWordImage: (word: WordContent, file?: File) => Promise<void>;
  words: WordContent[];
}) {
  return (
    <CmsTable>
      <thead className="bg-slate-50 text-xs font-black uppercase tracking-wide text-slate-500">
        <tr><th className="px-3 py-3">Visual</th><th className="px-3 py-3">Nome</th><th className="px-3 py-3">Letra</th><th className="px-3 py-3">Tipo</th><th className="px-3 py-3">Ativo</th><th className="px-3 py-3">Imagem</th></tr>
      </thead>
      <tbody className="divide-y divide-slate-100 bg-white">
        {words.map((word) => (
          <tr key={word.id}>
            <td className="px-3 py-3"><WordPreview word={word} /></td>
            <td className="px-3 py-3"><CmsInput defaultValue={word.name} onBlur={(event) => updateWord(word.id, { name: event.target.value })} /></td>
            <td className="px-3 py-3"><CmsInput maxLength={2} defaultValue={word.letter} onBlur={(event) => updateWord(word.id, { letter: event.target.value.toUpperCase() })} className="w-20" /></td>
            <td className="px-3 py-3"><WordControls word={word} disabled={busy === word.id} updateWord={updateWord} /></td>
            <td className="px-3 py-3"><input type="checkbox" checked={word.active} disabled={busy === word.id} onChange={(event) => updateWord(word.id, { active: event.target.checked })} className="h-5 w-5 rounded border-slate-300" /></td>
            <td className="px-3 py-3"><UploadControl word={word} uploadWordImage={uploadWordImage} /></td>
          </tr>
        ))}
      </tbody>
    </CmsTable>
  );
}

function WordControls({ disabled, updateWord, word }: {
  disabled: boolean;
  updateWord: (id: string, body: Partial<WordContent>) => Promise<void>;
  word: WordContent;
}) {
  return (
    <div className="grid gap-2">
      <CmsSelect value={word.visualType} disabled={disabled} onChange={(event) => updateWord(word.id, { visualType: event.target.value as "icon" | "image" })}>
        <option value="icon">Ícone</option><option value="image">Imagem</option>
      </CmsSelect>
      <IconSelect value={word.iconKey} onChange={(iconKey) => updateWord(word.id, { iconKey })} />
      <CmsSelect value={word.colorClass} onChange={(event) => updateWord(word.id, { colorClass: event.target.value })}>
        {WORD_COLOR_OPTIONS.map((color) => <option key={color} value={color}>{color}</option>)}
      </CmsSelect>
    </div>
  );
}

function IconSelect({ onChange, value }: { onChange: (value: string) => void; value: string }) {
  return (
    <CmsSelect value={value} onChange={(event) => onChange(event.target.value)}>
      {WORD_ICON_OPTIONS.map((iconKey) => <option key={iconKey} value={iconKey}>{iconKey}</option>)}
    </CmsSelect>
  );
}

function UploadControl({ uploadWordImage, word }: {
  uploadWordImage: (word: WordContent, file?: File) => Promise<void>;
  word: WordContent;
}) {
  return (
    <label className="inline-flex">
      <input type="file" accept="image/*" className="sr-only" onChange={(event) => uploadWordImage(word, event.target.files?.[0])} />
      <span className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 hover:bg-slate-50">
        <Upload size={16} /> Trocar
      </span>
    </label>
  );
}
