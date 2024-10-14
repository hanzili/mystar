import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useToast } from '@chakra-ui/react';
import {
  saveTarotReading,
  getTarotReadings,
  getOrCreateUser,
  TarotReading,
  User,
} from '../lib/supabase';
import { generateTarotPrediction } from '../lib/api';
interface SelectedCard {
  name: string;
  isReversed: boolean;
}

export const useTarotReading = () => {
  const { user } = useUser();
  const [question, setQuestion] = useState('');
  const [selectedCards, setSelectedCards] = useState<SelectedCard[]>([]);
  const [prediction, setPrediction] = useState('');
  const [predictionId, setPredictionId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pastReadings, setPastReadings] = useState<TarotReading[]>([]);
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
      fetchPastReadings(supabaseUserData.id);
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

  const fetchPastReadings = async (userId: string) => {
    try {
      const readings = await getTarotReadings(userId);
      setPastReadings(readings);
    } catch (error) {
      console.error('Failed to fetch past readings:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch past readings.',
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

      const generatedPrediction = await generateTarotPrediction(question, cardDescriptions, supabaseUser.id);

      if (!generatedPrediction) {
        throw new Error('No prediction received');
      }

      setPrediction(generatedPrediction);
      const reading = await saveTarotReading({
        user_id: supabaseUser.id,
        question,
        cards: cardDescriptions,
        prediction: generatedPrediction,
      });
      setPredictionId(reading.id || '');
      await fetchPastReadings(supabaseUser.id);

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

  return {
    predictionId,
    question,
    selectedCards,
    prediction,
    isLoading,
    pastReadings,
    handleQuestionSubmit,
    handleCardSelection,
  };
};
