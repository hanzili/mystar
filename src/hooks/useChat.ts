// src/hooks/useChat.ts
import { useState, useEffect, useRef } from "react";
import { useToast } from "@chakra-ui/react";
import {
  getSupabaseUserId,
  getChatMessages,
  saveChatMessage,
  getTarotReading,
  generateShareId,
  getTarotReadingByShareId,
} from "../lib/supabase";
import { chatWithAIAstrologist, generateQuestion } from "../lib/api";
import { ChatMessage, TarotReading } from "../types/types";
import { useUser } from "@clerk/clerk-react";
import { readingToFrontendFormat } from "../utils/utils";
import { TimeFrame } from "../lib/supabase_types";

export const useChat = (predictionId: string, shareId?: string) => {
  const { user } = useUser();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const toast = useToast();
  const [tarotReading, setTarotReading] = useState<TarotReading | null>(null);
  const [isGeneratingQuestion, setIsGeneratingQuestion] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  useEffect(() => {
    if (user && predictionId) {
      loadChatMessages();
      loadTarotReading();
    } else if (shareId) {
      loadSharedTarotReading();
    }
  }, [user, predictionId, shareId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadChatMessages = async () => {
    if (user) {
      try {
        const supabaseUserId = await getSupabaseUserId(user.id);
        if (supabaseUserId) {
          const chatMessages = await getChatMessages(
            supabaseUserId,
            predictionId
          );
          setMessages(chatMessages);
        }
      } catch (error) {
        console.error("Error loading chat messages:", error);
        toast({
          title: "Error",
          description: "Failed to load chat messages",
          status: "error",
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
          if (reading) {
            const frontendReading = readingToFrontendFormat(reading);
            setTarotReading(frontendReading);
            setIsOwner(true);
            setShareUrl(reading.share_id ? `${window.location.origin}/chat?shareId=${reading.share_id}` : null);
          } else {
            setIsOwner(false);
          }
        }
      } catch (error) {
        console.error("Error loading tarot reading:", error);
        toast({
          title: "Error",
          description: "Failed to load tarot reading",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  const loadSharedTarotReading = async () => {
    try {
      const reading = await getTarotReadingByShareId(shareId!);
      if (reading) {
        const frontendReading = readingToFrontendFormat(reading);
        setTarotReading(frontendReading);
        setIsOwner(false);
      }
    } catch (error) {
      console.error("Error loading shared tarot reading:", error);
      toast({
        title: "Error",
        description: "Failed to load shared tarot reading",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleSendMessage = async () => {
    if (input.trim() && user && tarotReading) {
      setIsLoading(true);
      try {
        const supabaseUserId = await getSupabaseUserId(user.id);

        if (supabaseUserId) {
          const userMessage: Omit<ChatMessage, "id" | "created_at"> = {
            user_id: supabaseUserId,
            prediction_id: predictionId,
            message: input,
            is_ai_response: false,
          };
          const savedUserMessage = await saveChatMessage(userMessage);
          setMessages((prev) => [...prev, savedUserMessage]);
          setInput("");

          const aiResponse = await chatWithAIAstrologist(
            input,
            user.id,
            predictionId
          );

          const aiMessage: Omit<ChatMessage, "id" | "created_at"> = {
            user_id: supabaseUserId,
            prediction_id: predictionId,
            message: aiResponse,
            is_ai_response: true,
          };
          const savedAiMessage = await saveChatMessage(aiMessage);
          setMessages((prev) => [...prev, savedAiMessage]);
        }
      } catch (error) {
        console.error("Error sending message:", error);
        toast({
          title: "Error",
          description: "Failed to send message",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleQuestionGenerated = async (
    question: string,
    options: string[]
  ) => {
    if (user) {
      try {
        const supabaseUserId = await getSupabaseUserId(user.id);
        if (supabaseUserId) {
          const aiMessageData: Omit<ChatMessage, "id" | "created_at"> = {
            user_id: supabaseUserId,
            prediction_id: predictionId,
            message: question,
            is_ai_response: true,
            metadata: {
              options: options,
            },
          };
          // Save the message and get the complete message back
          const savedAiMessage = await saveChatMessage(aiMessageData);
          // Update the state with the complete message
          setMessages((prev) => [...prev, savedAiMessage]);
        }
      } catch (error) {
        console.error("Error handling generated question:", error);
        toast({
          title: "Error",
          description: "Failed to process generated question",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  const handleGenerateQuestion = async (timeFrame: TimeFrame) => {
    if (!predictionId || !user) {
      console.error("Prediction ID is missing or user is null");
      return;
    }

    setIsGeneratingQuestion(true);
    try {
      const supabaseUserId = await getSupabaseUserId(user.id);
      if (supabaseUserId) {
        const generatedQuestion = await generateQuestion(
          supabaseUserId,
          predictionId,
          timeFrame
        );
        await handleQuestionGenerated(
          generatedQuestion.question,
          generatedQuestion.options
        );
      } else {
        throw new Error("User ID is null");
      }
    } catch (error) {
      console.error("Error generating question:", error);
      toast({
        title: "Error",
        description: "Failed to generate question. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsGeneratingQuestion(false);
    }
  };

  const handleShare = async () => {
    if (user && predictionId) {
      try {
        const supabaseUserId = await getSupabaseUserId(user.id);
        if (supabaseUserId) {
          let shareId = shareUrl ? new URL(shareUrl).searchParams.get('shareId') : null;

          if (!shareId) {
            shareId = await generateShareId(supabaseUserId, predictionId);
          }

          if (shareId) {
            const newShareUrl = `${window.location.origin}/chat?shareId=${shareId}`;
            setShareUrl(newShareUrl);
            await navigator.clipboard.writeText(newShareUrl);
            toast({
              title: "Share URL Copied",
              description: "Share URL has been copied to clipboard",
              status: "success",
              duration: 5000,
              isClosable: true,
            });
          } else {
            throw new Error("Failed to generate or retrieve share ID");
          }
        }
      } catch (error) {
        console.error("Error sharing prediction:", error);
        toast({
          title: "Error",
          description: "Failed to share prediction",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  return {
    messages,
    input,
    setInput,
    isLoading,
    handleSendMessage,
    messagesEndRef,
    tarotReading,
    handleQuestionGenerated,
    handleGenerateQuestion,
    isGeneratingQuestion,
    isOwner,
    shareUrl,
    handleShare,
  };
};
