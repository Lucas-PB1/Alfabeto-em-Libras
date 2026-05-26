import { RotateCcw, X } from "lucide-react";

interface GameHeaderProps {
  completedCount: number;
  targetCount: number;
  onExit: () => void;
  onRestart: () => void;
}

export function GameHeader({ completedCount, onExit, onRestart, targetCount }: GameHeaderProps) {
  return (
    <div className="w-full flex justify-between items-center px-3 py-2 sm:px-5 sm:py-2.5 bg-[#1E293B] text-white border-b-2 border-[#FACC15] shadow-sm shrink-0">
      <div className="flex items-center gap-2 sm:gap-3 overflow-hidden select-none">
        <h1 className="text-base sm:text-lg md:text-xl font-display font-extrabold tracking-tight truncate">
          Alfabeto Manual
        </h1>
        <div className="inline-flex items-center gap-1 bg-[#0F172A] border border-slate-700 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold text-[#FACC15] w-fit shrink-0">
          <span>{completedCount}/{targetCount}</span>
          <span aria-hidden="true">✅</span>
        </div>
      </div>

      <div className="flex gap-1.5 sm:gap-2 shrink-0">
        <button
          type="button"
          onClick={onRestart}
          className="px-2.5 py-1 sm:px-3.5 sm:py-1.5 bg-[#334155] hover:bg-[#475569] text-white rounded-lg active:translate-y-0.5 transition-all flex items-center gap-1 font-bold text-[11px] sm:text-xs uppercase cursor-pointer focus-visible:outline focus-visible:outline-4 focus-visible:outline-sky-400"
        >
          <RotateCcw size={12} />
          <span>Reiniciar</span>
        </button>
        <button
          type="button"
          onClick={onExit}
          className="px-2.5 py-1 sm:px-3.5 sm:py-1.5 bg-[#EF4444] hover:bg-[#DC2626] text-white rounded-lg active:translate-y-0.5 transition-all flex items-center gap-1 font-bold text-[11px] sm:text-xs uppercase cursor-pointer focus-visible:outline focus-visible:outline-4 focus-visible:outline-yellow-300"
        >
          <X size={12} />
          <span>Sair</span>
        </button>
      </div>
    </div>
  );
}
