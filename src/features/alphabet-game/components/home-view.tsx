import { Hand, Play } from "lucide-react";
import { motion } from "motion/react";

interface HomeViewProps {
  contentError?: string;
  loading?: boolean;
  onOpenReference: () => void;
  onStart: () => void;
}

export function HomeView({ contentError = "", loading = false, onOpenReference, onStart }: HomeViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex-1 flex flex-col items-center justify-center p-6 gap-5 text-center py-12 md:py-24 w-full max-w-md mx-auto"
    >
      <div className="relative">
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 text-3xl sm:text-4xl select-none"
          aria-hidden="true"
        >
          🎨
        </motion.div>
        <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-display font-black text-[#1E293B] leading-none tracking-tight drop-shadow-sm">
          ALFABETO <br />
          <span className="text-[#FACC15] drop-shadow-[2px_2px_0px_rgba(0,0,0,0.1)] sm:drop-shadow-[3px_3px_0px_rgba(0,0,0,0.1)]">
            MANUAL
          </span>
        </h1>
      </div>

      <p className="text-sm sm:text-base font-bold text-slate-600 bg-white/70 px-4 py-1.5 rounded-full border border-dashed border-[#FACC15] shadow-sm">
        Aprendendo o ABC e Libras!
      </p>

      <div className="flex flex-col gap-3 w-full mt-4">
        <button
          type="button"
          onClick={onStart}
          className="group flex items-center justify-between px-5 py-3 sm:px-6 sm:py-4 bg-[#FACC15] text-[#1E293B] rounded-xl sm:rounded-2xl text-base sm:text-lg font-black border-2 border-[#CA8A04] shadow-[0px_3px_0px_0px_rgba(202,138,4,1)] active:shadow-none active:translate-y-0.5 transition-all cursor-pointer select-none focus-visible:outline focus-visible:outline-4 focus-visible:outline-sky-400"
        >
          <span>JOGAR</span>
          <Play size={18} className="fill-current shrink-0" />
        </button>

        <button
          type="button"
          onClick={onOpenReference}
          className="group flex items-center justify-between px-5 py-3 sm:px-6 sm:py-4 bg-[#38BDF8] text-white rounded-xl sm:rounded-2xl text-base sm:text-lg font-black border-2 border-[#0284C7] shadow-[0px_3px_0px_0px_rgba(2,132,199,1)] active:shadow-none active:translate-y-0.5 transition-all cursor-pointer select-none focus-visible:outline focus-visible:outline-4 focus-visible:outline-yellow-300"
        >
          <span>ALFABETO LIBRAS</span>
          <Hand size={18} className="shrink-0" />
        </button>
      </div>

      {contentError && (
        <p className="text-xs font-bold text-rose-600 bg-rose-50 px-3 py-2 rounded-lg border border-rose-100">
          {contentError}
        </p>
      )}
      {loading && !contentError && (
        <p className="text-[11px] font-black uppercase tracking-wide text-slate-400">
          Sincronizando conteúdo
        </p>
      )}
    </motion.div>
  );
}
