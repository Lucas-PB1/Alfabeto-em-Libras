import type { AlphabetItem, FeedbackStatus, GameRound, GameView } from "../types";

export interface AlphabetGameState extends GameRound {
  currentView: GameView;
  completedItemIds: string[];
  feedback: FeedbackStatus;
  wrongLetter: string | null;
  message: string;
}

export type AlphabetGameAction =
  | { type: "navigate"; view: GameView }
  | { type: "start"; round: GameRound }
  | { type: "restart"; round: GameRound }
  | { type: "select-item"; item: AlphabetItem; visibleLetters: string[] }
  | { type: "sync-items"; items: AlphabetItem[]; visibleLetters?: string[] }
  | { type: "show-feedback"; feedback: Exclude<FeedbackStatus, "NONE">; message: string; wrongLetter?: string }
  | { type: "clear-feedback" }
  | { type: "advance"; completedItemIds: string[]; round: GameRound }
  | { type: "celebrate"; completedItemIds: string[] };

export const INITIAL_GAME_STATE: AlphabetGameState = {
  currentView: "HOME",
  selectedItem: null,
  completedItemIds: [],
  feedback: "NONE",
  wrongLetter: null,
  message: "",
  activeItems: [],
  visibleLetters: [],
};

function withClearedFeedback(state: AlphabetGameState): AlphabetGameState {
  return {
    ...state,
    feedback: "NONE",
    wrongLetter: null,
    message: "",
  };
}

export function alphabetGameReducer(
  state: AlphabetGameState,
  action: AlphabetGameAction,
): AlphabetGameState {
  switch (action.type) {
    case "navigate":
      return { ...withClearedFeedback(state), currentView: action.view };
    case "start":
      return { ...INITIAL_GAME_STATE, ...action.round, currentView: "GAME" };
    case "restart":
      return { ...INITIAL_GAME_STATE, ...action.round, currentView: "GAME" };
    case "select-item":
      return {
        ...withClearedFeedback(state),
        selectedItem: action.item,
        visibleLetters: action.visibleLetters,
      };
    case "sync-items": {
      const itemsById = new Map(action.items.map((item) => [item.id, item]));
      const activeItems = state.activeItems
        .map((item) => itemsById.get(item.id) ?? item)
        .filter((item) => item.active);
      const selectedItem = state.selectedItem ? itemsById.get(state.selectedItem.id) ?? null : null;

      if (selectedItem && selectedItem.active) {
        return {
          ...state,
          activeItems,
          selectedItem,
          visibleLetters: action.visibleLetters ?? state.visibleLetters,
        };
      }

      return { ...withClearedFeedback(state), activeItems, selectedItem: null, visibleLetters: [] };
    }
    case "show-feedback":
      return {
        ...state,
        feedback: action.feedback,
        wrongLetter: action.wrongLetter ?? null,
        message: action.message,
      };
    case "clear-feedback":
      return withClearedFeedback(state);
    case "advance":
      return {
        ...withClearedFeedback(state),
        ...action.round,
        completedItemIds: action.completedItemIds,
      };
    case "celebrate":
      return {
        ...withClearedFeedback(state),
        selectedItem: null,
        completedItemIds: action.completedItemIds,
        currentView: "CELEBRATION",
      };
    default:
      return state;
  }
}
