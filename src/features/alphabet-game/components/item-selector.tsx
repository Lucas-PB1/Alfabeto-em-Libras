import { cn } from "@/shared/lib/cn";
import { MOBILE_ITEM_COUNT } from "../lib/constants";
import type { AlphabetItem } from "../types";
import { WordVisual } from "./word-visual";

interface ItemSelectorProps {
  children: React.ReactNode;
  completedCount: number;
  items: AlphabetItem[];
  selectedItemId?: string;
  targetCount: number;
  onSelect: (item: AlphabetItem) => void;
}

interface ItemButtonProps {
  compact?: boolean;
  index: number;
  item: AlphabetItem;
  selected: boolean;
  onSelect: (item: AlphabetItem) => void;
}

const frameColors = ["border-orange-400", "border-sky-500", "border-red-500", "border-lime-700", "border-purple-600"];

function ItemButton({ compact = false, index, item, onSelect, selected }: ItemButtonProps) {
  return (
    <button
      type="button"
      aria-label={`Escolher desenho ${item.name}`}
      aria-pressed={selected}
      onClick={() => onSelect(item)}
      className={cn(
        "relative h-full w-full overflow-hidden rounded-xl border-2 bg-white transition-all cursor-pointer select-none focus-visible:outline focus-visible:outline-4 focus-visible:outline-yellow-300",
        compact ? "min-h-0 p-0.5" : "min-h-[54px] p-1",
        selected
          ? "border-[#FACC15] bg-[#FFFBEB] shadow-[0_0_0_4px_rgba(250,204,21,0.35)] scale-[1.04] z-10"
          : cn(frameColors[index % frameColors.length], "shadow-sm hover:scale-[1.03]"),
      )}
    >
      <WordVisual fill item={item} className="border-0 shadow-none" />
    </button>
  );
}

export function ItemSelector({
  children,
  completedCount,
  items,
  onSelect,
  selectedItemId,
  targetCount,
}: ItemSelectorProps) {
  const frame = splitFrameItems(items);
  const mobileItems = getMobileItems(items, selectedItemId);

  return (
    <div className="h-full min-h-0 rounded-xl border-4 border-[#0D5EA6] bg-white p-1.5 shadow-inner md:rounded-2xl md:border-[6px] md:p-2">
      <div className="hidden h-full min-h-0 grid-rows-[92px_1fr_92px] gap-2 md:grid lg:grid-rows-[112px_1fr_112px]">
        <FrameRow items={frame.top} selectedItemId={selectedItemId} startIndex={0} onSelect={onSelect} />
        <div className="grid min-h-0 grid-cols-[104px_1fr_104px] gap-2 lg:grid-cols-[128px_1fr_128px]">
          <FrameColumn items={frame.left} selectedItemId={selectedItemId} startIndex={frame.top.length} onSelect={onSelect} />
          <div className="relative min-h-0 rounded-xl bg-white">
            <ProgressBadge completedCount={completedCount} targetCount={targetCount} />
            {children}
          </div>
          <FrameColumn items={frame.right} selectedItemId={selectedItemId} startIndex={frame.top.length + frame.left.length} onSelect={onSelect} />
        </div>
        <FrameRow items={frame.bottom} selectedItemId={selectedItemId} startIndex={items.length - frame.bottom.length} onSelect={onSelect} />
      </div>

      <div
        className={cn(
          "grid h-full min-h-0 gap-2 md:hidden",
          selectedItemId ? "grid-rows-[88px_1fr]" : "grid-rows-[112px_1fr]",
        )}
      >
        <div className="grid min-h-0 grid-cols-3 grid-rows-2 gap-1.5 overflow-hidden rounded-xl">
          {mobileItems.map((item, index) => (
            <FrameTile compact key={item.id} index={index} item={item} selectedItemId={selectedItemId} onSelect={onSelect} />
          ))}
        </div>
        <div className="relative min-h-0 rounded-xl bg-white">
          <ProgressBadge completedCount={completedCount} targetCount={targetCount} />
          {children}
        </div>
      </div>
    </div>
  );
}

function FrameRow({ items, onSelect, selectedItemId, startIndex }: FrameGroupProps) {
  return (
    <div className="grid min-h-0 gap-2" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}>
      {items.map((item, index) => (
        <FrameTile
          key={item.id}
          index={startIndex + index}
          item={item}
          selectedItemId={selectedItemId}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

function FrameColumn({ items, onSelect, selectedItemId, startIndex }: FrameGroupProps) {
  return (
    <div className="grid min-h-0 gap-2" style={{ gridTemplateRows: `repeat(${items.length}, minmax(0, 1fr))` }}>
      {items.map((item, index) => (
        <FrameTile
          key={item.id}
          index={startIndex + index}
          item={item}
          selectedItemId={selectedItemId}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

function FrameTile({ compact = false, index, item, onSelect, selectedItemId }: FrameTileProps) {
  return (
    <ItemButton
      compact={compact}
      index={index}
      item={item}
      selected={selectedItemId === item.id}
      onSelect={onSelect}
    />
  );
}

function ProgressBadge({ completedCount, targetCount }: { completedCount: number; targetCount: number }) {
  return (
    <div className="absolute left-3 top-3 z-10 rounded-full bg-[#0D5EA6] px-3 py-1 text-xs font-black text-white">
      {completedCount} / {targetCount}
    </div>
  );
}

function getMobileItems(items: AlphabetItem[], selectedItemId?: string) {
  const visibleItems = items.slice(0, MOBILE_ITEM_COUNT);

  if (!selectedItemId || visibleItems.some((item) => item.id === selectedItemId)) {
    return visibleItems;
  }

  const selectedItem = items.find((item) => item.id === selectedItemId);
  return selectedItem ? [...visibleItems.slice(0, MOBILE_ITEM_COUNT - 1), selectedItem] : visibleItems;
}

function splitFrameItems(items: AlphabetItem[]) {
  const topCount = Math.min(8, Math.max(1, Math.ceil(items.length * 0.34)));
  const rightCount = Math.min(6, Math.max(0, Math.ceil((items.length - topCount) * 0.34)));
  const bottomCount = Math.min(8, Math.max(0, Math.ceil((items.length - topCount - rightCount) * 0.55)));

  return {
    top: items.slice(0, topCount),
    right: items.slice(topCount, topCount + rightCount),
    bottom: items.slice(topCount + rightCount, topCount + rightCount + bottomCount),
    left: items.slice(topCount + rightCount + bottomCount),
  };
}

interface FrameGroupProps {
  items: AlphabetItem[];
  selectedItemId?: string;
  startIndex: number;
  onSelect: (item: AlphabetItem) => void;
}

interface FrameTileProps {
  compact?: boolean;
  index: number;
  item: AlphabetItem;
  selectedItemId?: string;
  onSelect: (item: AlphabetItem) => void;
}
