import { CopyMinus } from 'lucide-react';
import { getSupabaseUserId, getChatMessages, getTarotReading } from './supabase';
import { TimeFrame } from './supabase_types'; // Make sure to create this enum if it doesn't exist

export async function generateTarotPrediction(question: string, cards: string, userId: string) {
  try {
    const response = await fetch(
      'https://didojidulfoxymrtnesc.supabase.co/functions/v1/generate-tarot-prediction',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ question, cards, userId }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to generate prediction');
    }

    const data = await response.json();
    return {
      prediction: {
        past: data.prediction.past,
        present: data.prediction.present,
        future: data.prediction.future,
        summary: data.summary,
      },
      firstMessage: data.firstMessage,
    };
  } catch (error) {
    console.error('Error generating prediction:', error);
    throw error;
  }
}

export async function chatWithAIAstrologist(message: string, userId: string, predictionId: string) {
  try {
    const supabaseUserId = await getSupabaseUserId(userId);
    if (!supabaseUserId) {
      throw new Error('Failed to get Supabase user ID');
    }

    const chatHistory = await getChatMessages(supabaseUserId, predictionId);
    const tarotPrediction = await getTarotReading(supabaseUserId, predictionId);

    const response = await fetch(
      'https://didojidulfoxymrtnesc.supabase.co/functions/v1/ai-astrologist-chat',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ 
          message, 
          userId: supabaseUserId,
          predictionId,
          chatHistory,
          tarotPrediction,
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to get AI response');
    }

    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error('Error chatting with AI Astrologist:', error);
    throw error;
  }
}

export async function generateQuestion(supabaseUserId: string, predictionId: string, timeFrame: TimeFrame) {
  try {
    const tarotPrediction = await getTarotReading(supabaseUserId, predictionId);
    const chatHistory = await getChatMessages(supabaseUserId, predictionId);

    const preprocessedTarotPrediction = {
      prediction: JSON.parse(tarotPrediction?.prediction || '{}'),
      cards: tarotPrediction?.cards || ''
    };
    const preprocessedChatHistory = chatHistory?.map(msg => ({
      role: msg.is_ai_response ? 'assistant' : 'user',
      content: msg.message
    })) || [];

    console.log(preprocessedTarotPrediction);
    console.log(preprocessedChatHistory);
    
    const response = await fetch(
      'https://didojidulfoxymrtnesc.supabase.co/functions/v1/generate-question',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ tarotPrediction: preprocessedTarotPrediction, chatHistory: preprocessedChatHistory, timeFrame }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to generate question');
    }

    const data = await response.json();
    return {
      question: data.question,
      options: data.options,
    };
  } catch (error) {
    console.error('Error generating question:', error);
    throw error;
  }
}
