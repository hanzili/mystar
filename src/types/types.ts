export interface User {
  id: string;
  clerk_user_id: string;
  email: string;
}

export interface TarotReading {
  id?: string;
  user_id: string;
  question: string;
  cards: SelectedCard[];
  prediction: Prediction;
  created_at?: string;
}

export interface ChatMessage {
  id?: string;
  user_id: string;
  prediction_id: string;
  message: string;
  is_ai_response: boolean;
  created_at?: string;
}

export interface SelectedCard {
  name: string;
  isReversed: boolean;
}

export interface Prediction {
  past: string;
  present: string;
  future: string;
}
