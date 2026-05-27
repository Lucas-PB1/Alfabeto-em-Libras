import Image from "next/image";
import { cn } from "@/shared/lib/cn";
import type { AlphabetItem } from "../types";

interface WordVisualProps {
  item: AlphabetItem;
  compact?: boolean;
  fill?: boolean;
  className?: string;
}

export function WordVisual({ className, compact = false, fill = false, item }: WordVisualProps) {
  const Icon = item.icon;
  const sizeClass = fill
    ? "h-full w-full rounded-lg"
    : compact
    ? "w-8 h-8 rounded-full"
    : "w-14 h-14 xs:w-16 xs:h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full";
  const iconSizeClass = compact
    ? "h-[70%] w-[70%]"
    : "h-[62%] w-[62%]";

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
        <Image src={item.image} alt={item.name} fill className="object-contain p-1.5" unoptimized />
      ) : (
        <Icon className={iconSizeClass} strokeWidth={3} />
      )}
    </div>
  );
}
