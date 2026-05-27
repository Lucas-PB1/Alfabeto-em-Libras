import Image from "next/image";
import { cn } from "@/shared/lib/cn";
import type { AlphabetItem } from "../types";

interface WordVisualProps {
  item: AlphabetItem;
  compact?: boolean;
  className?: string;
}

export function WordVisual({ className, compact = false, item }: WordVisualProps) {
  const Icon = item.icon;
  const sizeClass = compact
    ? "w-8 h-8 rounded-full"
    : "w-14 h-14 xs:w-16 xs:h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full";

  return (
    <div
      className={cn(
        sizeClass,
        "relative flex items-center justify-center border border-slate-100 shrink-0 text-slate-800 shadow-sm overflow-hidden",
        item.visualType === "icon" && item.colorClass,
        className,
      )}
    >
      {item.visualType === "image" && item.image ? (
        <Image src={item.image} alt={item.name} fill className="object-cover" unoptimized />
      ) : (
        <Icon className={compact ? "w-[18px] h-[18px]" : "w-7 h-7 xs:w-9 xs:h-9 sm:w-14 sm:h-14 md:w-16 md:h-16"} />
      )}
    </div>
  );
}
