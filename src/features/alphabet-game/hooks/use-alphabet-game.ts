import { useCallback, useEffect, useMemo, useReducer, useRef } from "react";
import { ALPHABET_ITEMS } from "../data/alphabet-items";
import { createConfettiPieces } from "../lib/confetti";
import { FEEDBACK_CLEAR_DELAY } from "../lib/constants";
import { createRound, getCompletionTarget, isCorrectLetter } from "../lib/game-rules";
import type { AlphabetItem, GameView } from "../types";
import { INITIAL_GAME_STATE, alphabetGameReducer } from "./game-state-reducer";
export type { AlphabetGameState } from "./game-state-reducer";

export function useAlphabetGame(items: AlphabetItem[] = ALPHABET_ITEMS) {
  const [state, dispatch] = useReducer(alphabetGameReducer, INITIAL_GAME_STATE);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const confetti = useMemo(() => createConfettiPieces(), []);
  const progressTarget = useMemo(() => getCompletionTarget(items), [items]);

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  const schedule = useCallback((callback: () => void, delay: number) => {
    const timer = setTimeout(callback, delay);
    timers.current.push(timer);
  }, []);

  const buildRound = useCallback((completedItemIds: string[] = []) => {
    return createRound(items, completedItemIds);
  }, [items]);

  const navigateTo = useCallback((view: GameView) => {
    clearTimers();
    dispatch({ type: "navigate", view });
  }, [clearTimers]);

  const startGame = useCallback(() => {
    clearTimers();
    dispatch({ type: "start", round: buildRound([]) });
  }, [buildRound, clearTimers]);

  const restartGame = useCallback(() => {
    clearTimers();
    dispatch({ type: "restart", round: buildRound([]) });
  }, [buildRound, clearTimers]);

  const selectItem = useCallback((item: AlphabetItem) => {
    clearTimers();
    dispatch({ type: "select-item", item });
  }, [clearTimers]);

  const chooseLetter = useCallback((letter: string) => {
    if (state.feedback !== "NONE") {
      return;
    }

    clearTimers();

    if (!state.selectedItem) {
      dispatch({
        type: "show-feedback",
        feedback: "WRONG",
        message: "Escolha um desenho listado primeiro!",
      });
      schedule(() => dispatch({ type: "clear-feedback" }), FEEDBACK_CLEAR_DELAY.noSelection);
      return;
    }

    if (!isCorrectLetter(state.selectedItem, letter)) {
      dispatch({
        type: "show-feedback",
        feedback: "WRONG",
        wrongLetter: letter,
        message: `Não é a letra "${letter}". Qual a inicial de "${state.selectedItem.name}"?`,
      });
      schedule(() => dispatch({ type: "clear-feedback" }), FEEDBACK_CLEAR_DELAY.wrong);
      return;
    }

    const completedItemIds = Array.from(new Set([...state.completedItemIds, state.selectedItem.id]));

    dispatch({
      type: "show-feedback",
      feedback: "CORRECT",
      message: `Muito bem! Letra "${state.selectedItem.letter}" é de ${state.selectedItem.name}!`,
    });

    schedule(() => {
      if (completedItemIds.length >= progressTarget) {
        dispatch({ type: "celebrate", completedItemIds });
        return;
      }

      dispatch({
        type: "advance",
        completedItemIds,
        round: buildRound(completedItemIds),
      });
    }, FEEDBACK_CLEAR_DELAY.correct);
  }, [buildRound, clearTimers, progressTarget, schedule, state]);

  useEffect(() => clearTimers, [clearTimers]);

  useEffect(() => {
    if (state.currentView === "GAME" && state.activeItems.length === 0 && items.length > 0) {
      dispatch({ type: "restart", round: createRound(items, []) });
    }
  }, [items, state.activeItems.length, state.currentView]);

  return {
    state,
    confetti,
    progressTarget,
    actions: {
      chooseLetter,
      navigateTo,
      restartGame,
      selectItem,
      startGame,
    },
  };
}
