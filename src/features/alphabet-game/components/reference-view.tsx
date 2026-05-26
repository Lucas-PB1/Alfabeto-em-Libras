import { motion } from "motion/react";
import { ALPHABET } from "../lib/constants";
import { LibrasImage } from "./libras-image";

interface ReferenceViewProps {
  onBack: () => void;
}

export function ReferenceView({ onBack }: ReferenceViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-4xl px-4 py-4 sm:py-6 mt-4 sm:mt-8 flex flex-col items-center gap-4 sm:gap-6 select-none"
    >
      <div className="flex justify-between w-full items-center gap-4 border-b-2 border-slate-200 pb-3">
        <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold text-[#1E293B]">
          Referência Libras
        </h2>
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-1.5 bg-[#334155] hover:bg-[#475569] text-white text-xs sm:text-sm font-black rounded-lg shadow-sm border-2 border-[#1E293B] active:translate-y-0.5 transition-all cursor-pointer focus-visible:outline focus-visible:outline-4 focus-visible:outline-sky-400"
        >
          VOLTAR AO MENU
        </button>
      </div>

      <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-2 sm:gap-3 w-full pb-10">
        {ALPHABET.map((letter) => (
          <motion.div
            key={letter}
            whileHover={{ scale: 1.04 }}
            className="bg-white border-2 border-dashed border-[#38BDF8] p-2 sm:p-3 rounded-xl sm:rounded-2xl aspect-square shadow-sm flex flex-col items-center justify-center gap-1 relative group overflow-hidden"
          >
            <div className="text-sm sm:text-base font-black text-[#F43F5E] absolute top-1 right-2">
              {letter}
            </div>
            <div className="relative w-full h-full p-1">
              <LibrasImage letter={letter} alt={`Sinal da letra ${letter}`} className="object-contain" />
            </div>
            <div className="absolute inset-0 border-2 border-[#38BDF8] rounded-xl sm:rounded-2xl opacity-10 pointer-events-none group-hover:opacity-30 transition-opacity" />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
