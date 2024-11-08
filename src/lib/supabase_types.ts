export interface User {
  id: string;
  clerk_user_id: string;
  email: string;
}

export interface TarotReading {
  id?: string;
  user_id: string;
  question: string;
  cards: string;
  prediction: string;
  created_at?: string;
  share_id?: string;
}

export interface ChatMessage {
  id?: string;
  user_id: string;
  prediction_id: string;
  message: string;
  is_ai_response: boolean;
  created_at?: string;
}

export enum TimeFrame {
  PAST = 'PAST',
  PRESENT = 'PRESENT',
  FUTURE = 'FUTURE'
}
