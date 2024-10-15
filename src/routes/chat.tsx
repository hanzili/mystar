// src/routes/chat.tsx
import { Box, Flex, Input, Button, useColorModeValue } from '@chakra-ui/react';
import { useChat } from '../hooks/useChat';
import { useSearch } from '@tanstack/react-router';
import CurrentPrediction from "../components/CurrentPrediction";

export default function Chat() {
  const search = useSearch({ from: '/chat' }) as { predictionId: string };
  const { 
    messages, 
    input, 
    setInput, 
    isLoading, 
    handleSendMessage, 
    messagesEndRef,
    tarotReading
  } = useChat(search.predictionId);

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const chatBgColor = useColorModeValue('white', 'gray.800');
  const aiMessageBgColor = useColorModeValue('gray.100', 'gray.700');
  const userMessageBgColor = useColorModeValue('purple.100', 'purple.700');

  return (
    <Flex minHeight="calc(100vh - 80px)" bg={bgColor} p={4}>
      {/* Left side: CurrentPrediction */}
      <Box width="40%" pr={4}>
        {tarotReading && (
          <CurrentPrediction
            predictionId={search.predictionId}
            prediction={tarotReading.prediction}
            cards={tarotReading.cards}
            question={tarotReading.question}
          />
        )}
      </Box>

      {/* Right side: Chat */}
      <Flex width="60%" direction="column">
        <Box
          bg={chatBgColor}
          borderRadius="md"
          p={4}
          height="calc(100vh - 200px)"
          overflowY="auto"
          boxShadow="md"
          mb={4}
        >
          {messages.map((message, index) => (
            <Flex key={index} justifyContent={message.is_ai_response ? 'flex-start' : 'flex-end'} mb={2}>
              <Box
                bg={message.is_ai_response ? aiMessageBgColor : userMessageBgColor}
                color={useColorModeValue('gray.800', 'white')}
                borderRadius="lg"
                px={3}
                py={2}
                maxWidth="70%"
              >
                {message.message}
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
                handleSendMessage();
              }
            }}
          />
          <Button onClick={handleSendMessage} colorScheme="purple" isLoading={isLoading}>
            Send
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
}
