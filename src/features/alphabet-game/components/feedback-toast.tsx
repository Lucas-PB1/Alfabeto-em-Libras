import { Info, Trophy } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/shared/lib/cn";
import type { FeedbackStatus } from "../types";

interface FeedbackToastProps {
  feedback: FeedbackStatus;
  message: string;
}

export function FeedbackToast({ feedback, message }: FeedbackToastProps) {
  if (!message) {
    return null;
  }

  const Icon = feedback === "CORRECT" ? Trophy : Info;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className={cn(
          "absolute bottom-3 left-1/2 -translate-x-1/2 px-4 py-2 sm:px-6 sm:py-3 rounded-2xl sm:rounded-full border-2 text-xs sm:text-sm font-extrabold shadow-md z-30 text-center flex items-center gap-1.5 sm:gap-2 w-[calc(100%-1.5rem)] max-w-xl justify-center select-none",
          feedback === "CORRECT"
            ? "bg-[#D1FAE5] text-[#059669] border-[#059669]"
            : "bg-[#FEE2E2] text-[#B91C1C] border-[#B91C1C]",
        )}
      >
        <Icon size={14} className="shrink-0" />
        <span className="break-words">{message}</span>
      </motion.div>
    </AnimatePresence>
  );
}
