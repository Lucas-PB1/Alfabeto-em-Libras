import { cn } from "@/shared/lib/cn";
import type { AlphabetItem } from "../types";

interface ItemSelectorProps {
  completedCount: number;
  items: AlphabetItem[];
  selectedItemId?: number;
  targetCount: number;
  onSelect: (item: AlphabetItem) => void;
}

interface ItemButtonProps {
  compact?: boolean;
  item: AlphabetItem;
  selected: boolean;
  onSelect: (item: AlphabetItem) => void;
}

function ItemButton({ compact = false, item, onSelect, selected }: ItemButtonProps) {
  const Icon = item.icon;

  if (compact) {
    return (
      <button
        type="button"
        aria-pressed={selected}
        onClick={() => onSelect(item)}
        className={cn(
          "flex flex-col items-center justify-center py-1.5 px-0.5 border-2 border-b-[4px] rounded-xl transition-all cursor-pointer select-none focus-visible:outline focus-visible:outline-4 focus-visible:outline-sky-400",
          selected
            ? "bg-[#FEF9C3] border-[#FACC15] border-b-[#CA8A04] scale-[1.03] shadow-sm"
            : "bg-white border-slate-200 border-b-slate-300 active:translate-y-[2px] active:border-b-2",
        )}
      >
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center border border-slate-100 shrink-0 text-slate-800 shadow-sm",
          item.colorClass,
        )}>
          <Icon size={18} />
        </div>
        <span className="font-black text-[10px] text-slate-700 tracking-tight uppercase truncate max-w-full mt-1.5">
          {item.name}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={() => onSelect(item)}
      className={cn(
        "flex-shrink-0 flex items-center gap-3 px-4 py-2.5 border-2 rounded-2xl transition-all text-left relative cursor-pointer select-none w-full focus-visible:outline focus-visible:outline-4 focus-visible:outline-sky-400",
        selected
          ? "bg-[#FEF9C3] border-[#FACC15] scale-[1.01] shadow-sm z-10"
          : "bg-white border-slate-200 hover:border-[#FACC15] shadow-sm",
      )}
    >
      <div className={cn(
        "w-11 h-11 rounded-xl flex items-center justify-center border border-slate-100 shrink-0 text-slate-800",
        item.colorClass,
      )}>
        <Icon size={26} />
      </div>
      <span className="font-extrabold text-sm md:text-base text-slate-800 tracking-tight uppercase truncate">
        {item.name}
      </span>
    </button>
  );
}

export function ItemSelector({
  completedCount,
  items,
  onSelect,
  selectedItemId,
  targetCount,
}: ItemSelectorProps) {
  return (
    <>
      <div className="hidden md:block md:w-[240px] lg:w-[280px] bg-white border-r-2 border-[#1E293B] shrink-0 md:h-full min-h-0">
        <div className="flex flex-col p-3 gap-3 overflow-y-auto no-scrollbar justify-start h-full select-none">
          {items.map((item) => (
            <ItemButton
              key={item.id}
              item={item}
              selected={selectedItemId === item.id}
              onSelect={onSelect}
            />
          ))}
          <div className="flex flex-1 items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center text-slate-400 font-bold uppercase text-xs lg:text-sm select-none">
            {completedCount} de {targetCount} concluídos
          </div>
        </div>
      </div>

      <div className="w-full bg-white border-b-2 border-[#1E293B] shrink-0 md:hidden p-2 select-none shadow-sm">
        <div className="grid grid-cols-3 gap-2 h-full">
          {items.map((item) => (
            <ItemButton
              key={item.id}
              compact
              item={item}
              selected={selectedItemId === item.id}
              onSelect={onSelect}
            />
          ))}
        </div>
      </div>
    </>
  );
}
