"use client";

import { Plus } from "lucide-react";
import { useRef, useState } from "react";
import { useCmsAuth } from "@/features/auth/components/auth-provider";
import { useWords } from "@/features/words/hooks/use-words";
import { WordIconSelect, WordsTable, type WordBusyState } from "@/features/words/components/cms-words-table";
import type { WordContent } from "@/features/words/types";
import { uploadCmsImage } from "@/shared/firebase/upload";
import { CmsButton, CmsField, CmsInput, CmsPageHeader, CmsPanel, CmsSelect, CmsStatus } from "@/shared/cms/ui";

type WordDraft = Omit<WordContent, "createdAt" | "id" | "updatedAt">;
type Feedback = { text: string; tone: "danger" | "success" };

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
  const [busy, setBusy] = useState<WordBusyState>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const draftFileInputRef = useRef<HTMLInputElement>(null);
  const isCreating = busy?.key === "new";

  async function createWord(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy({ key: "new", label: draftFile ? "Enviando..." : "Criando..." });
    setFeedback(null);

    try {
      const image = draftFile ? await uploadCmsImage(draftFile, "cms/words") : draft.image;
      await authorizedFetch("/api/cms/words", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...draft, image }),
      });
      setDraft(emptyWord);
      setDraftFile(null);
      if (draftFileInputRef.current) {
        draftFileInputRef.current.value = "";
      }
      setFeedback({ text: "Palavra criada.", tone: "success" });
    } catch (createError) {
      setFeedback({ text: getErrorMessage(createError), tone: "danger" });
    } finally {
      setBusy(null);
    }
  }

  async function updateWord(id: string, body: Partial<WordContent>) {
    setBusy({ key: id, label: "Salvando..." });
    setFeedback(null);

    try {
      await authorizedFetch(`/api/cms/words/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      setFeedback({ text: "Palavra atualizada.", tone: "success" });
    } catch (updateError) {
      setFeedback({ text: getErrorMessage(updateError), tone: "danger" });
    } finally {
      setBusy(null);
    }
  }

  async function uploadWordImage(word: WordContent, file?: File) {
    if (!file) {
      return;
    }

    setBusy({ key: word.id, label: "Enviando..." });
    setFeedback(null);

    try {
      const image = await uploadCmsImage(file, `cms/words/${word.id}`);
      await authorizedFetch(`/api/cms/words/${word.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image, visualType: "image" }),
      });
      setFeedback({ text: "Imagem da palavra atualizada.", tone: "success" });
    } catch (uploadError) {
      setFeedback({ text: getErrorMessage(uploadError), tone: "danger" });
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="grid gap-5">
      <CmsPageHeader eyebrow="Conteúdo" title="Palavras" />
      <CmsPanel>
        <form onSubmit={createWord} className="grid gap-3 md:grid-cols-[1fr_90px_150px_150px_auto] md:items-end">
          <CmsField label="Nome">
            <CmsInput required disabled={isCreating} value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} />
          </CmsField>
          <CmsField label="Letra">
            <CmsInput required disabled={isCreating} maxLength={2} value={draft.letter} onChange={(event) => setDraft({ ...draft, letter: event.target.value.toUpperCase() })} />
          </CmsField>
          <CmsField label="Visual">
            <CmsSelect disabled={isCreating} value={draft.visualType} onChange={(event) => setDraft({ ...draft, visualType: event.target.value as "icon" | "image" })}>
              <option value="icon">Ícone</option>
              <option value="image">Imagem</option>
            </CmsSelect>
          </CmsField>
          {draft.visualType === "image" ? (
            <CmsField label="Imagem">
              <CmsInput ref={draftFileInputRef} disabled={isCreating} type="file" accept="image/*" onChange={(event) => setDraftFile(event.target.files?.[0] ?? null)} />
            </CmsField>
          ) : (
            <CmsField label="Ícone">
              <WordIconSelect disabled={isCreating} value={draft.iconKey} onChange={(iconKey) => setDraft({ ...draft, iconKey })} />
            </CmsField>
          )}
          <CmsButton loading={isCreating} loadingText={busy?.label} type="submit">
            <Plus size={16} />
            Criar
          </CmsButton>
        </form>
      </CmsPanel>

      {loading && <CmsStatus text="Carregando palavras..." />}
      {error && <CmsStatus tone="danger" text={error} />}
      {feedback && <CmsStatus tone={feedback.tone} text={feedback.text} />}
      <WordsTable busy={busy} updateWord={updateWord} uploadWordImage={uploadWordImage} words={words} />
    </div>
  );
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Não foi possível concluir a ação.";
}
