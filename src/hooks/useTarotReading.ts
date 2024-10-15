import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useToast } from '@chakra-ui/react';
import {
  saveTarotReading,
  getOrCreateUser,
  saveChatMessage,
} from '../lib/supabase';
import { generateTarotPrediction } from '../lib/api';
import { User } from '../lib/types';
import { SelectedCard } from '../lib/types';

export const useTarotReading = () => {
  const { user } = useUser();
  const [question, setQuestion] = useState('');
  const [selectedCards, setSelectedCards] = useState<SelectedCard[]>([]);
  const [prediction, setPrediction] = useState('');
  const [predictionId, setPredictionId] = useState('');
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

      const { prediction, firstMessage } = await generateTarotPrediction(question, cardDescriptions, supabaseUser.id);

      if (!prediction) {
        throw new Error('No prediction received');
      }

      setPrediction(prediction);
      const reading = await saveTarotReading({
        user_id: supabaseUser.id,
        question,
        cards: cardDescriptions,
        prediction: prediction,
      });
      console.log('Reading saved:', JSON.stringify(reading));
      setPredictionId(reading.id ?? '');

      // insert AI message
      await saveChatMessage({
        prediction_id: reading.id!,
        message: `Hello! I'm Celeste, your AI Tarot reader. I've drawn ${cards.length} cards in response to your question: "${question}". \n\nThe cards suggest ${prediction}`,
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

    } catch (error) {
      console.error('Error generating prediction:', error);
      setPrediction(
        'An error occurred while generating your prediction. Please try again.'
      );
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

  // New function to reset the reading process
  const resetReading = () => {
    setQuestion('');
    setSelectedCards([]);
    setPrediction('');
    setPredictionId('');
  };

  return {
    predictionId,
    question,
    selectedCards,
    prediction,
    isLoading,
    handleQuestionSubmit,
    handleCardSelection,
    resetReading, // Return the reset function
  };
};
