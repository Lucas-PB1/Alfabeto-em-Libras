"use client";

import { Upload } from "lucide-react";
import { WORD_ICON_OPTIONS } from "@/features/words/lib/icon-registry";
import { WORD_COLOR_OPTIONS } from "@/features/words/lib/style-options";
import type { WordContent } from "@/features/words/types";
import { CmsInput, CmsSelect, CmsSpinner, CmsTable } from "@/shared/cms/ui";
import { WordPreview } from "./word-preview";

export type WordBusyState = { key: string; label: string } | null;

export function WordsTable({
  busy,
  updateWord,
  uploadWordImage,
  words,
}: {
  busy: WordBusyState;
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
        {words.map((word) => {
          const rowBusy = busy?.key === word.id;
          const busyLabel = rowBusy ? busy.label : "";

          return (
            <tr key={word.id}>
              <td className="px-3 py-3"><WordPreview word={word} /></td>
              <td className="px-3 py-3"><CmsInput disabled={rowBusy} defaultValue={word.name} onBlur={(event) => updateWord(word.id, { name: event.target.value })} /></td>
              <td className="px-3 py-3"><CmsInput disabled={rowBusy} maxLength={2} defaultValue={word.letter} onBlur={(event) => updateWord(word.id, { letter: event.target.value.toUpperCase() })} className="w-20" /></td>
              <td className="px-3 py-3"><WordControls word={word} disabled={rowBusy} updateWord={updateWord} /></td>
              <td className="px-3 py-3"><input type="checkbox" checked={word.active} disabled={rowBusy} onChange={(event) => updateWord(word.id, { active: event.target.checked })} className="h-5 w-5 rounded border-slate-300" /></td>
              <td className="px-3 py-3"><UploadControl busyLabel={busyLabel} disabled={rowBusy} word={word} uploadWordImage={uploadWordImage} /></td>
            </tr>
          );
        })}
      </tbody>
    </CmsTable>
  );
}

export function WordIconSelect({
  disabled = false,
  onChange,
  value,
}: {
  disabled?: boolean;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <CmsSelect disabled={disabled} value={value} onChange={(event) => onChange(event.target.value)}>
      {WORD_ICON_OPTIONS.map((iconKey) => <option key={iconKey} value={iconKey}>{iconKey}</option>)}
    </CmsSelect>
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
      <WordIconSelect disabled={disabled} value={word.iconKey} onChange={(iconKey) => updateWord(word.id, { iconKey })} />
      <CmsSelect disabled={disabled} value={word.colorClass} onChange={(event) => updateWord(word.id, { colorClass: event.target.value })}>
        {WORD_COLOR_OPTIONS.map((color) => <option key={color} value={color}>{color}</option>)}
      </CmsSelect>
    </div>
  );
}

function UploadControl({ busyLabel, disabled, uploadWordImage, word }: {
  busyLabel: string;
  disabled: boolean;
  uploadWordImage: (word: WordContent, file?: File) => Promise<void>;
  word: WordContent;
}) {
  async function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const file = input.files?.[0];

    try {
      await uploadWordImage(word, file);
    } finally {
      input.value = "";
    }
  }

  return (
    <label className="inline-flex">
      <input type="file" accept="image/*" className="sr-only" disabled={disabled} onChange={handleChange} />
      <span className={`inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition ${disabled ? "cursor-not-allowed opacity-60" : "hover:bg-slate-50"}`}>
        {disabled ? <CmsSpinner /> : <Upload size={16} />}
        {disabled ? busyLabel || "Aguarde..." : "Trocar"}
      </span>
    </label>
  );
}
