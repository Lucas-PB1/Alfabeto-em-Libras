import { Hand } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/shared/lib/cn";
import type { AlphabetItem, FeedbackStatus } from "../types";
import { LibrasImage } from "./libras-image";
import { WordVisual } from "./word-visual";

interface ChallengeCardProps {
  feedback: FeedbackStatus;
  selectedItem: AlphabetItem | null;
}

export function ChallengeCard({ feedback, selectedItem }: ChallengeCardProps) {
  return (
    <motion.div className="w-full max-w-xl max-h-full bg-white border-2 md:border-4 border-[#1E293B] rounded-2xl md:rounded-3xl shadow-md flex flex-col items-center justify-center text-center p-3.5 sm:p-5 md:p-6 relative overflow-y-auto no-scrollbar shrink min-h-0">
      <CornerStars />

      {selectedItem ? (
        <SelectedChallenge feedback={feedback} item={selectedItem} />
      ) : (
        <EmptyChallenge />
      )}

      <AnimatePresence>
        {feedback !== "NONE" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: feedback === "CORRECT" ? 0.3 : 0.2 }}
            exit={{ opacity: 0 }}
            className={cn(
              "absolute inset-0 z-0 pointer-events-none",
              feedback === "CORRECT" ? "bg-[#22C55E]" : "bg-[#EF4444]",
            )}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function SelectedChallenge({ feedback, item }: { feedback: FeedbackStatus; item: AlphabetItem }) {
  return (
    <motion.div
      key={item.id}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="flex flex-col gap-2 sm:gap-3.5 items-center z-10 w-full min-h-0 shrink"
    >
      <span className="text-[10px] sm:text-xs font-black text-rose-500 uppercase tracking-widest bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200 shadow-sm animate-pulse shrink-0">
        Qual a letra inicial do desenho?
      </span>

      <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-black text-[#1E293B] uppercase tracking-wider flex items-center justify-center gap-1.5 sm:gap-2 shrink-0 select-none">
        <span
          className={cn(
            "border-b-4 pb-0.5 transition-all text-center min-w-[28px] xs:min-w-[34px]",
            feedback === "CORRECT"
              ? "text-emerald-500 border-emerald-500 font-extrabold animate-bounce"
              : "text-rose-500 border-rose-500 animate-pulse font-extrabold",
          )}
        >
          {feedback === "CORRECT" ? item.letter : "_"}
        </span>
        <span className="text-slate-700 tracking-wide">{item.name.substring(1)}</span>
      </h2>

      <div className="flex flex-row gap-3 sm:gap-8 md:gap-10 items-center justify-center mt-1 sm:mt-2.5 w-full max-w-full min-h-0 shrink">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="transition-transform"
        >
          <WordVisual item={item} className="border-2 sm:border-4 border-[#1E293B] shadow-md" />
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="w-[90px] h-[115px] xs:w-[105px] xs:h-[135px] sm:w-[135px] sm:h-[168px] md:w-[155px] md:h-[192px] bg-white border-2 border-dashed border-[#38BDF8] rounded-2xl flex flex-col items-center justify-center p-1.5 sm:p-2 shadow-inner relative overflow-hidden shrink-0 transition-transform"
        >
          <div className="relative w-full h-full min-h-0">
            <LibrasImage letter={item.letter} imageUrl={item.librasImage} alt={`Sinal Libras para ${item.letter}`} />
          </div>
          <span className="text-[7.5px] xs:text-[8.5px] sm:text-[10px] font-black uppercase tracking-widest text-[#0284C7] mt-1.5 select-none shrink-0 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-100">
            Sinal: {item.letter}
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}

function EmptyChallenge() {
  return (
    <div className="flex flex-col items-center gap-2 sm:gap-4 shrink min-h-0">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="w-12 h-12 xs:w-16 xs:h-16 sm:w-20 sm:h-20 bg-white border-2 border-dashed border-[#FACC15] rounded-full flex items-center justify-center shadow-md select-none shrink-0"
      >
        <Hand className="w-6 h-6 xs:w-8 xs:h-8 sm:w-10 sm:h-10 text-[#FACC15] rotate-12" />
      </motion.div>
      <p className="text-sm xs:text-base sm:text-lg md:text-xl font-bold text-[#1E293B] px-4 uppercase tracking-tighter select-none">
        Escolha um desenho!
      </p>
    </div>
  );
}

function CornerStars() {
  return (
    <>
      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 text-xs sm:text-base text-[#FACC15] select-none" aria-hidden="true">⭐</div>
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 text-xs sm:text-base text-[#FACC15] select-none" aria-hidden="true">⭐</div>
      <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 text-xs sm:text-base text-[#FACC15] select-none" aria-hidden="true">⭐</div>
      <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 text-xs sm:text-base text-[#FACC15] select-none" aria-hidden="true">⭐</div>
    </>
  );
}
