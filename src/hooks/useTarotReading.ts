import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useToast } from '@chakra-ui/react';
import {
  saveTarotReading,
  getOrCreateUser,
  saveChatMessage,
} from '../lib/supabase';
import { generateTarotPrediction } from '../lib/api';
import { User, SelectedCard } from '../types/types';
import { useNavigate } from "@tanstack/react-router";

export const useTarotReading = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [question, setQuestion] = useState('');
  const [selectedCards, setSelectedCards] = useState<SelectedCard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
  const toast = useToast();

  useEffect(() => {
    if (user) {
      fetchSupabaseUser();
    }
  }, [user]);

  const fetchSupabaseUser = async () => {
    if (!user) return;
    try {
      const supabaseUserData = await getOrCreateUser(user.id, user.primaryEmailAddress?.emailAddress || '');
      setSupabaseUser(supabaseUserData);
    } catch (error) {
      console.error('Failed to fetch or create Supabase user:', error);
      toast({
        title: 'Error',
        description: 'Failed to initialize user data.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleQuestionSubmit = (submittedQuestion: string) => {
    setQuestion(submittedQuestion);
  };

  const handleCardSelection = (cards: SelectedCard[]) => {
    setSelectedCards(cards);
    generatePrediction(cards);
  };

  const generatePrediction = async (cards: SelectedCard[]) => {
    if (!supabaseUser) return;
    setIsLoading(true);
    try {
      const cardDescriptions = cards
        .map((card) => `${card.name}${card.isReversed ? ' (Reversed)' : ''}`)
        .join(', ');

      const { prediction, firstMessage, summary } = await generateTarotPrediction(question, cardDescriptions, supabaseUser.id);

      if (!prediction) {
        throw new Error('No prediction received');
      }

      const reading = await saveTarotReading({
        user_id: supabaseUser.id,
        question,
        cards: cardDescriptions,
        prediction: prediction,
      });

      // Save AI messages
      await saveChatMessage({
        prediction_id: reading.id!,
        message: `Hello! I'm Celeste, your AI Tarot reader. I've drawn ${cards.length} cards in response to your question: "${question}". \n\nThe cards suggest ${summary}`,
        is_ai_response: true,
        user_id: supabaseUser.id,
      });
      await saveChatMessage({
        prediction_id: reading.id!,
        message: firstMessage,
        is_ai_response: true,
        user_id: supabaseUser.id,
      });
      
      toast({
        title: 'Reading Complete',
        description: 'Your tarot reading has been generated and saved.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      // Redirect to chat page
      navigate({ to: '/chat', search: { predictionId: reading.id } });

    } catch (error) {
      console.error('Error generating prediction:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate prediction. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    question,
    selectedCards,
    isLoading,
    handleQuestionSubmit,
    handleCardSelection,
  };
};
