// src/routes/chat.tsx
import { Box, Flex, Input, Button, useColorModeValue, Icon } from '@chakra-ui/react';
import { useChat } from '../hooks/useChat';
import { useSearch } from '@tanstack/react-router';
import CurrentPrediction from "../components/CurrentPrediction";
import { useState, useRef, useEffect } from 'react';
import { ChatIcon, DragHandleIcon } from '@chakra-ui/icons';

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

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatWidth, setChatWidth] = useState(30);
  const chatRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const chatBgColor = useColorModeValue('white', 'gray.800');
  const aiMessageBgColor = useColorModeValue('gray.100', 'gray.700');
  const userMessageBgColor = useColorModeValue('purple.100', 'purple.700');

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging.current && chatRef.current) {
        e.preventDefault();
        const newWidth = 100 - (e.clientX / window.innerWidth) * 100;
        setChatWidth(Math.min(Math.max(newWidth, 20), 80));
      }
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      document.body.style.userSelect = 'auto';
      document.body.style.cursor = 'default';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const handleDragStart = () => {
    isDragging.current = true;
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'ew-resize';
  };

  return (
    <Flex minHeight="calc(100vh - 80px)" bg={bgColor} p={4} position="relative">
      {/* CurrentPrediction */}
      <Box width={isChatOpen ? `${100 - chatWidth}%` : "100%"} pr={4} transition="width 0.3s ease-in-out" position="relative">
        {tarotReading && (
          <CurrentPrediction
            predictionId={search.predictionId}
            prediction={tarotReading.prediction}
            cards={tarotReading.cards}
            question={tarotReading.question}
          />
        )}

        {/* Chat toggle icon */}
        <Flex
          position="absolute"
          right={-6}
          top="50%"
          transform="translateY(-50%)"
          alignItems="center"
          justifyContent="center"
          cursor="pointer"
          onClick={() => setIsChatOpen(!isChatOpen)}
          zIndex={2}
          bg="purple.500"
          color="white"
          borderRadius="full"
          boxSize={12}
          flexDirection="column"
          boxShadow="md"
          transition="all 0.3s"
          _hover={{ bg: "purple.600" }}
        >
          <Icon as={ChatIcon} boxSize={4} mb={1} />
          <Box fontSize="xs" fontWeight="medium">
            {isChatOpen ? "Close" : "Chat"}
          </Box>
        </Flex>
      </Box>

      {/* Chat section */}
      <Box
        ref={chatRef}
        position="fixed"
        right={0}
        top={0}
        width={isChatOpen ? `${chatWidth}%` : "0%"}
        height="100%"
        bg={chatBgColor}
        boxShadow="md"
        transition="width 0.3s ease-in-out"
        overflow="hidden"
      >
        <Flex 
          position="absolute" 
          left={0} 
          top={0} 
          bottom={0} 
          width="8px" 
          cursor="ew-resize"
          onMouseDown={handleDragStart}
          _hover={{ bg: "purple.500" }}
          transition="background-color 0.2s"
        >
          <Icon as={DragHandleIcon} color="gray.400" position="absolute" left="50%" top="50%" transform="translate(-50%, -50%)" />
        </Flex>
        <Flex height="100%" direction="column" p={4}>
          <Box flex={1} overflowY="auto" mb={4}>
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
      </Box>
    </Flex>
  );
}
