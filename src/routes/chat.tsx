import React, { useState, useRef, useEffect } from 'react'
import { Box, VStack, Input, Button, Text, Flex, useColorModeValue, useToast } from '@chakra-ui/react'
import { useUser } from '@clerk/clerk-react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { supabase, ChatMessage, getSupabaseUserId, getChatMessages, saveChatMessage } from '../lib/supabase'
import { chatWithAIAstrologist } from '../lib/api'

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { user, isSignedIn } = useUser()
  const navigate = useNavigate()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const toast = useToast()

  const search = useSearch({ from: '/chat' }) as { predictionId: string };
  const predictionId = search.predictionId;

  console.log('predictionId', predictionId)

  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const chatBgColor = useColorModeValue('white', 'gray.800')
  const userMsgBgColor = useColorModeValue('purple.100', 'purple.700')
  const aiMsgBgColor = useColorModeValue('gray.100', 'gray.700')

  useEffect(() => {
    if (!isSignedIn) {
      navigate({ to: '/' })
    } else {
      loadChatMessages()
    }
  }, [isSignedIn, navigate])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const loadChatMessages = async () => {
    if (user) {
      try {
        const supabaseUserId = await getSupabaseUserId(user.id)
        if (supabaseUserId) {
          const chatMessages = await getChatMessages(supabaseUserId, predictionId)
          setMessages(chatMessages)
        }
      } catch (error) {
        console.error('Error loading chat messages:', error)
        toast({
          title: 'Error',
          description: 'Failed to load chat messages',
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      }
    }
  }

  const handleSendMessage = async () => {
    if (input.trim() && user) {
      setIsLoading(true);
      try {
        const supabaseUserId = await getSupabaseUserId(user.id);

        // Save user message in the frontend
        if (supabaseUserId) {
          const userMessage: Omit<ChatMessage, 'id' | 'created_at'> = {
            user_id: supabaseUserId,
            prediction_id: predictionId,
            message: input,
            is_ai_response: false,
          };
          setMessages(prev => [...prev, userMessage as ChatMessage]);
          setInput('');

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

  return (
    <Box minHeight="calc(100vh - 80px)" bg={bgColor} p={4}>
      <VStack spacing={4} align="stretch" maxWidth="800px" margin="0 auto">
        <Box
          bg={chatBgColor}
          borderRadius="md"
          p={4}
          height="calc(100vh - 200px)"
          overflowY="auto"
          boxShadow="md"
        >
          {messages.map((message, index) => (
            <Flex
              key={index}
              justifyContent={message.is_ai_response ? 'flex-start' : 'flex-end'}
              mb={2}
            >
              <Box
                bg={message.is_ai_response ? aiMsgBgColor : userMsgBgColor}
                color={useColorModeValue('gray.800', 'white')}
                borderRadius="lg"
                px={3}
                py={2}
                maxWidth="70%"
              >
                <Text>{message.message}</Text>
              </Box>
            </Flex>
          ))}
          <div ref={messagesEndRef} />
        </Box>
        <Flex>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            mr={2}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !isLoading) {
                handleSendMessage()
              }
            }}
          />
          <Button onClick={handleSendMessage} colorScheme="purple" isLoading={isLoading}>
            Send
          </Button>
        </Flex>
      </VStack>
    </Box>
  )
}
