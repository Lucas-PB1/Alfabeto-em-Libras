import { motion } from "motion/react";
import type { ConfettiPiece } from "../types";

interface CelebrationViewProps {
  confetti: ConfettiPiece[];
  onExit: () => void;
  onRestart: () => void;
}

export function CelebrationView({ confetti, onExit, onRestart }: CelebrationViewProps) {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 text-center bg-[#F8FAFC] select-none"
    >
      <motion.div
        animate={{ rotate: [0, 8, -8, 8, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
        className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4 drop-shadow-md"
        aria-hidden="true"
      >
        🏆
      </motion.div>
      <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold mb-1 sm:mb-2 text-[#1E293B]">
        Parabéns!
      </h2>
      <p className="text-sm sm:text-base font-bold mb-6 sm:mb-8 max-w-xs sm:max-w-md text-slate-600">
        Você completou o jogo. Você é muito inteligente!
      </p>

      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md px-3">
        <button
          type="button"
          onClick={onRestart}
          className="flex-1 py-2.5 sm:py-3.5 bg-[#FACC15] text-[#1E293B] rounded-xl text-sm sm:text-base font-black shadow-sm active:translate-y-0.5 transition-all cursor-pointer focus-visible:outline focus-visible:outline-4 focus-visible:outline-sky-400"
        >
          JOGAR DE NOVO
        </button>
        <button
          type="button"
          onClick={onExit}
          className="flex-1 py-2.5 sm:py-3.5 bg-white border border-slate-200 text-slate-500 rounded-xl text-sm sm:text-base font-black shadow-sm active:scale-95 transition-all cursor-pointer focus-visible:outline focus-visible:outline-4 focus-visible:outline-sky-400"
        >
          SAIR
        </button>
      </div>

      <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
        {confetti.map((piece) => (
          <motion.div
            key={piece.id}
            initial={{ y: -100, x: piece.x, rotate: 0 }}
            animate={{ y: 800, rotate: 360 }}
            transition={{ duration: piece.duration, repeat: Infinity, delay: piece.delay }}
            className="absolute text-xl sm:text-2xl"
          >
            {piece.emoji}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
