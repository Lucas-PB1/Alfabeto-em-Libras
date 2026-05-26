import { cn } from "@/shared/lib/cn";
import type { AlphabetItem, FeedbackStatus } from "../types";

interface LetterKeyboardProps {
  feedback: FeedbackStatus;
  letters: string[];
  selectedItem: AlphabetItem | null;
  wrongLetter: string | null;
  onChooseLetter: (letter: string) => void;
}

export function LetterKeyboard({
  feedback,
  letters,
  onChooseLetter,
  selectedItem,
  wrongLetter,
}: LetterKeyboardProps) {
  const disabled = feedback !== "NONE";

  return (
    <div className="w-full bg-[#1E293B] border-t-2 border-[#FACC15] py-2 sm:py-3.5 px-3 sm:px-4 flex items-center shrink-0 shadow-[0px_-4px_20px_rgba(0,0,0,0.25)] select-none animate-fade-in-up">
      <div className="w-full max-w-4xl mx-auto flex flex-col gap-1.5 xs:gap-2">
        <div className="text-center text-[9px] xs:text-[10px] sm:text-xs font-black text-[#FACC15] uppercase tracking-wider animate-pulse select-none">
          {selectedItem ? `👉 Toque na letra de "${selectedItem.name}":` : "👈 Toque em um desenho acima para começar!"}
        </div>

        <div className="grid grid-cols-5 gap-1.5 md:hidden">
          {letters.map((letter) => (
            <LetterButton
              key={letter}
              disabled={disabled}
              feedback={feedback}
              letter={letter}
              selectedLetter={selectedItem?.letter}
              wrongLetter={wrongLetter}
              onChooseLetter={onChooseLetter}
            />
          ))}
        </div>

        <div className="hidden md:flex md:justify-center md:gap-2 md:flex-wrap">
          {letters.map((letter) => (
            <LetterButton
              key={letter}
              desktop
              disabled={disabled}
              feedback={feedback}
              letter={letter}
              selectedLetter={selectedItem?.letter}
              wrongLetter={wrongLetter}
              onChooseLetter={onChooseLetter}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface LetterButtonProps {
  desktop?: boolean;
  disabled: boolean;
  feedback: FeedbackStatus;
  letter: string;
  selectedLetter?: string;
  wrongLetter: string | null;
  onChooseLetter: (letter: string) => void;
}

function LetterButton({
  desktop = false,
  disabled,
  feedback,
  letter,
  onChooseLetter,
  selectedLetter,
  wrongLetter,
}: LetterButtonProps) {
  const isCorrect = selectedLetter === letter && feedback === "CORRECT";
  const isWrong = wrongLetter === letter;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onChooseLetter(letter)}
      aria-label={`Escolher letra ${letter}`}
      className={cn(
        "rounded-xl flex items-center justify-center font-black transition-all select-none border-b-4 cursor-pointer disabled:cursor-wait focus-visible:outline focus-visible:outline-4 focus-visible:outline-sky-400",
        desktop ? "w-[38px] h-[48px] lg:w-[44px] lg:h-[55px] text-base lg:text-lg" : "w-full h-10 xs:h-11 text-sm xs:text-base",
        isCorrect
          ? "bg-emerald-500 border-emerald-700 text-white translate-y-[2px] border-b-2"
          : isWrong
            ? "bg-rose-500 border-b-rose-700 text-white animate-shake"
            : "bg-[#FACC15] border-[#CA8A04] hover:bg-[#FDE047] text-[#1E293B] active:translate-y-[2px] active:border-b-2",
      )}
    >
      {letter}
    </button>
  );
}
