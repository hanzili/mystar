interface State {
  question: string;
  selectedTheme: string;
  displayedQuestions: string[];
}

type Action =
  | { type: "SET_QUESTION"; payload: string }
  | { type: "SET_THEME"; payload: string }
  | { type: "SET_DISPLAYED_QUESTIONS"; payload: string[] };

export const initialState: State = {
  question: "",
  selectedTheme: "",
  displayedQuestions: [],
};

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_QUESTION":
      return { ...state, question: action.payload };
    case "SET_THEME":
      return { ...state, selectedTheme: action.payload };
    case "SET_DISPLAYED_QUESTIONS":
      return { ...state, displayedQuestions: action.payload };
    default:
      return state;
  }
}
