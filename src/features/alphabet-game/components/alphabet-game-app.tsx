"use client";

import { AnimatePresence } from "motion/react";
import { cn } from "@/shared/lib/cn";
import { useAlphabetContent } from "../hooks/use-alphabet-content";
import { useAlphabetGame } from "../hooks/use-alphabet-game";
import { CelebrationView } from "./celebration-view";
import { GameView } from "./game-view";
import { HomeView } from "./home-view";
import { ReferenceView } from "./reference-view";

export function AlphabetGameApp() {
  const { content, error, loading } = useAlphabetContent();
  const { actions, confetti, progressTarget, state } = useAlphabetGame(content.words);

  return (
    <main
      className={cn(
        "min-h-screen bg-[#FFFBEB] text-[#0F172A] flex flex-col items-center overflow-x-hidden font-sans",
        state.currentView === "GAME" && "h-screen max-h-screen overflow-hidden",
      )}
    >
      <AnimatePresence mode="wait">
        {state.currentView === "HOME" && (
          <HomeView
            key="home"
            contentError={error}
            loading={loading}
            onOpenReference={() => actions.navigateTo("REFERENCE")}
            onStart={actions.startGame}
          />
        )}

        {state.currentView === "REFERENCE" && (
          <ReferenceView
            key="reference"
            letters={content.letters}
            onBack={() => actions.navigateTo("HOME")}
          />
        )}

        {state.currentView === "GAME" && (
          <GameView
            key="game"
            progressTarget={progressTarget}
            state={state}
            onChooseLetter={actions.chooseLetter}
            onExit={() => actions.navigateTo("HOME")}
            onRestart={actions.restartGame}
            onSelectItem={actions.selectItem}
          />
        )}

        {state.currentView === "CELEBRATION" && (
          <CelebrationView
            key="celebration"
            confetti={confetti}
            onExit={() => actions.navigateTo("HOME")}
            onRestart={actions.restartGame}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
