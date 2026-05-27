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
  const canChooseLetter = Boolean(state.selectedItem && state.visibleLetters.length > 0);

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      <GameHeader
        completedCount={state.completedItemIds.length}
        targetCount={progressTarget}
        onExit={onExit}
        onRestart={onRestart}
      />

      <div className="flex-1 overflow-hidden min-h-0 bg-[#F8F5E8] p-2 sm:p-3 md:p-4">
        <ItemSelector
          completedCount={state.completedItemIds.length}
          items={state.activeItems}
          selectedItemId={state.selectedItem?.id}
          targetCount={progressTarget}
          onSelect={onSelectItem}
        >
          <div className="relative flex h-full min-h-[180px] w-full items-center justify-center p-2 md:min-h-[220px] md:p-3">
            <ChallengeCard feedback={state.feedback} selectedItem={state.selectedItem} />
            <FeedbackToast feedback={state.feedback} message={state.message} />
          </div>
        </ItemSelector>
      </div>

      {canChooseLetter && (
        <LetterKeyboard
          feedback={state.feedback}
          letters={state.visibleLetters}
          selectedItem={state.selectedItem}
          wrongLetter={state.wrongLetter}
          onChooseLetter={onChooseLetter}
        />
      )}
    </div>
  );
}
