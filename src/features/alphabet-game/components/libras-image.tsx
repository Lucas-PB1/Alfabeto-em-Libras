import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/shared/lib/cn";
import { getLibrasChar, getLocalLibrasSource } from "../lib/libras";

interface LibrasImageProps {
  letter: string;
  alt: string;
  className?: string;
}

type SourceKind = "svg" | "png" | "font";

export function LibrasImage({ alt, className, letter }: LibrasImageProps) {
  const upperLetter = letter.toUpperCase();
  const [sourceKind, setSourceKind] = useState<SourceKind>("svg");
  const isCedilha = upperLetter === "Ç";

  useEffect(() => {
    setSourceKind("svg");
  }, [upperLetter]);

  const source = useMemo(() => {
    return sourceKind === "font" ? null : getLocalLibrasSource(upperLetter, sourceKind);
  }, [sourceKind, upperLetter]);

  const handleError = () => {
    setSourceKind((current) => (current === "svg" ? "png" : "font"));
  };

  return (
    <motion.div
      className="relative w-full h-full flex items-center justify-center select-none"
      animate={isCedilha ? { x: [0, -3, 3, -3, 3, 0] } : {}}
      transition={isCedilha ? { repeat: Infinity, duration: 1.2, ease: "easeInOut", repeatDelay: 0.5 } : {}}
    >
      {source ? (
        <Image
          src={source}
          alt={alt}
          fill
          className={cn("object-contain p-1", className)}
          referrerPolicy="no-referrer"
          onError={handleError}
          unoptimized
        />
      ) : (
        <div className="flex flex-col items-center justify-center text-center p-2">
          <span className="font-libras text-6xl sm:text-7xl md:text-8xl text-[#1E293B] leading-none">
            {getLibrasChar(letter)}
          </span>
          <span className="text-[9px] font-black text-slate-400 mt-1 block uppercase tracking-wider">
            SINAL {letter}
          </span>
        </div>
      )}

      <div className="absolute inset-0 flex items-center justify-center text-6xl sm:text-7xl font-black text-slate-100 z-[-1] opacity-20 select-none pointer-events-none">
        {letter}
      </div>
    </motion.div>
  );
}
