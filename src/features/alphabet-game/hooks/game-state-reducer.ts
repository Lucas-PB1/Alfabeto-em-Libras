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
  | { type: "select-item"; item: AlphabetItem }
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
      return { ...withClearedFeedback(state), selectedItem: action.item };
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
