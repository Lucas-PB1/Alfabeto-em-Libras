import Image from "next/image";
import { cn } from "@/shared/lib/cn";
import { getWordIcon } from "../lib/icon-registry";
import type { WordContent } from "../types";

export function WordPreview({ word }: { word: Pick<WordContent, "colorClass" | "iconKey" | "image" | "name" | "visualType"> }) {
  const Icon = getWordIcon(word.iconKey);

  return (
    <div
      className={cn(
        "relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg border border-slate-200 text-slate-800",
        word.visualType === "icon" && word.colorClass,
      )}
    >
      {word.visualType === "image" && word.image ? (
        <Image src={word.image} alt={word.name} fill className="object-cover" unoptimized />
      ) : (
        <Icon size={24} />
      )}
    </div>
  );
}
