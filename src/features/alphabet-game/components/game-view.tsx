import type { AlphabetGameState } from "../hooks/use-alphabet-game";
import type { AlphabetItem } from "../types";
import { ChallengeCard } from "./challenge-card";
import { FeedbackToast } from "./feedback-toast";
import { GameHeader } from "./game-header";
import { ItemSelector } from "./item-selector";
import { LetterKeyboard } from "./letter-keyboard";

interface GameViewProps {
  progressTarget: number;
  state: AlphabetGameState;
  onChooseLetter: (letter: string) => void;
  onExit: () => void;
  onRestart: () => void;
  onSelectItem: (item: AlphabetItem) => void;
}

export function GameView({
  onChooseLetter,
  onExit,
  onRestart,
  onSelectItem,
  progressTarget,
  state,
}: GameViewProps) {
  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      <GameHeader
        completedCount={state.completedItemIds.length}
        targetCount={progressTarget}
        onExit={onExit}
        onRestart={onRestart}
      />

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0 bg-[#FFFBEB]">
        <ItemSelector
          completedCount={state.completedItemIds.length}
          items={state.activeItems}
          selectedItemId={state.selectedItem?.id}
          targetCount={progressTarget}
          onSelect={onSelectItem}
        />

        <div className="flex-1 flex flex-col items-center justify-center p-2.5 xs:p-3 sm:p-4 md:p-6 relative overflow-hidden bg-[#FFFBEB] min-h-0">
          <ChallengeCard feedback={state.feedback} selectedItem={state.selectedItem} />
          <FeedbackToast feedback={state.feedback} message={state.message} />
        </div>
      </div>

      <LetterKeyboard
        feedback={state.feedback}
        letters={state.visibleLetters}
        selectedItem={state.selectedItem}
        wrongLetter={state.wrongLetter}
        onChooseLetter={onChooseLetter}
      />
    </div>
  );
}
