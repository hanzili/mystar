// src/routes/chat.tsx
import { Box, VStack, Input, Button, Flex, useColorModeValue } from '@chakra-ui/react';
import { useChat } from '../hooks/useChat';
import { useSearch } from '@tanstack/react-router';

export default function Chat() {
  const search = useSearch({ from: '/chat' }) as { predictionId: string };
  const { messages, input, setInput, isLoading, handleSendMessage, messagesEndRef } = useChat(search.predictionId);

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const chatBgColor = useColorModeValue('white', 'gray.800');

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
            <Flex key={index} justifyContent={message.is_ai_response ? 'flex-start' : 'flex-end'} mb={2}>
              <Box
                bg={message.is_ai_response ? 'gray.100' : 'purple.100'}
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
      </VStack>
    </Box>
  );
}
