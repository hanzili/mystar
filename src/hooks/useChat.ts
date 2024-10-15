// src/hooks/useChat.ts
import { useState, useEffect, useRef } from 'react';
import { useToast } from '@chakra-ui/react';
import { getSupabaseUserId, getChatMessages, saveChatMessage, getTarotReading } from '../lib/supabase';
import { chatWithAIAstrologist } from '../lib/api';
import { ChatMessage, TarotReading } from '../types/types';
import { useUser } from '@clerk/clerk-react';
import { readingToFrontendFormat } from '../utils/utils';

export const useChat = (predictionId: string) => {
  const { user } = useUser();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const toast = useToast();
  const [tarotReading, setTarotReading] = useState<TarotReading | null>(null);

  useEffect(() => {
    if (user && predictionId) {
      loadChatMessages();
      loadTarotReading();
    }
  }, [user, predictionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadChatMessages = async () => {
    if (user) {
      try {
        const supabaseUserId = await getSupabaseUserId(user.id);
        if (supabaseUserId) {
          const chatMessages = await getChatMessages(supabaseUserId, predictionId);
          setMessages(chatMessages);
        }
      } catch (error) {
        console.error('Error loading chat messages:', error);
        toast({
          title: 'Error',
          description: 'Failed to load chat messages',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  const loadTarotReading = async () => {
    if (user) {
      try {
        const supabaseUserId = await getSupabaseUserId(user.id);
        if (supabaseUserId) {
          const reading = await getTarotReading(supabaseUserId, predictionId);
          const frontendReading = readingToFrontendFormat(reading);
          setTarotReading(frontendReading);
        }
      } catch (error) {
        console.error('Error loading tarot reading:', error);
        toast({
          title: 'Error',
          description: 'Failed to load tarot reading',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  const handleSendMessage = async () => {
    if (input.trim() && user && tarotReading) {
      setIsLoading(true);
      try {
        const supabaseUserId = await getSupabaseUserId(user.id);

        if (supabaseUserId) {
          const userMessage: Omit<ChatMessage, 'id' | 'created_at'> = {
            user_id: supabaseUserId,
            prediction_id: predictionId,
            message: input,
            is_ai_response: false,
          };
          setMessages(prev => [...prev, userMessage as ChatMessage]);
          setInput('');
          await saveChatMessage(userMessage);

          const aiResponse = await chatWithAIAstrologist(input, supabaseUserId, predictionId);

          const aiMessage: Omit<ChatMessage, 'id' | 'created_at'> = {
            user_id: supabaseUserId,
            prediction_id: predictionId,
            message: aiResponse,
            is_ai_response: true,
          };
          await saveChatMessage(aiMessage);
          setMessages(prev => [...prev, aiMessage as ChatMessage]);     
        }
      } catch (error) {
        console.error('Error sending message:', error);
        toast({
          title: 'Error',
          description: 'Failed to send message',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return { messages, input, setInput, isLoading, handleSendMessage, messagesEndRef, tarotReading };
};
