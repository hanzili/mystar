import {
  Box,
  Flex,
  Input,
  Button,
  useColorModeValue,
  Icon,
  useMediaQuery,
} from "@chakra-ui/react";
import { useChat } from "../hooks/useChat";
import { useSearch } from "@tanstack/react-router";
import CurrentPrediction from "../components/CurrentPrediction";
import { useState, useRef, useEffect } from "react";
import { ChatIcon, DragHandleIcon } from "@chakra-ui/icons";
import { TimeFrame } from "../lib/supabase_types";

export default function Chat() {
  const search = useSearch({ from: "/chat" }) as { predictionId: string };
  const {
    messages,
    input,
    setInput,
    isLoading,
    handleSendMessage,
    messagesEndRef,
    tarotReading,
    handleGenerateQuestion,
    isGeneratingQuestion,
  } = useChat(search.predictionId);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatWidth, setChatWidth] = useState(30);
  const chatRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const bgColor = useColorModeValue("gray.50", "gray.900");
  const chatBgColor = useColorModeValue("white", "gray.800");
  const aiMessageBgColor = useColorModeValue("gray.100", "gray.700");
  const userMessageBgColor = useColorModeValue("purple.100", "purple.700");
  const messageTextColor = useColorModeValue("gray.800", "white"); // Moved here

  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");

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
      document.body.style.userSelect = "auto";
      document.body.style.cursor = "default";
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const handleDragStart = () => {
    isDragging.current = true;
    document.body.style.userSelect = "none";
    document.body.style.cursor = "ew-resize";
  };

  const handleOptionClick = (option: string) => {
    setInput(option);
    handleSendMessage();
  };

  const handleDiscuss = (timeFrame: TimeFrame) => {
    setIsChatOpen(true);
    handleGenerateQuestion(timeFrame);
  };

  return (
    <Flex minHeight="calc(100vh - 80px)" bg={bgColor} p={4} position="relative">
      {/* CurrentPrediction */}
      <Box
        width={isLargerThan768 && isChatOpen ? `${100 - chatWidth}%` : "100%"}
        pr={isLargerThan768 ? 4 : 0}
        transition="width 0.3s ease-in-out"
        position="relative"
      >
        {tarotReading && (
          <CurrentPrediction
            predictionId={search.predictionId}
            prediction={tarotReading.prediction}
            cards={tarotReading.cards}
            question={tarotReading.question}
            isChatOpen={isChatOpen}
            handleGenerateQuestion={handleDiscuss}
            chatIsGeneratingQuestion={isGeneratingQuestion}
            isLargerThan768={isLargerThan768}
          />
        )}

        {/* Chat toggle icon */}
        <Flex
          position="fixed"
          right={4}
          bottom={4}
          alignItems="center"
          justifyContent="center"
          cursor="pointer"
          onClick={() => setIsChatOpen(!isChatOpen)}
          zIndex={2}
          bg="purple.500"
          color="white"
          borderRadius="full"
          boxSize={16}
          flexDirection="column"
          boxShadow="0 0 20px rgba(128, 0, 128, 0.5)"
          transition="all 0.3s"
          _hover={{
            bg: "purple.600",
            boxShadow: "0 0 30px rgba(128, 0, 128, 0.7)",
          }}
          overflow="hidden"
        >
          {/* Crystal ball effect */}
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            borderRadius="full"
            bg="linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0.1) 100%)"
          />
          <Icon as={ChatIcon} boxSize={6} mb={1} zIndex={1} />
          <Box fontSize="xs" fontWeight="medium" zIndex={1}>
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
        width={isLargerThan768 ? (isChatOpen ? `${chatWidth}%` : "0%") : "100%"}
        height="100%"
        bg={chatBgColor}
        boxShadow="md"
        transition="width 0.3s ease-in-out"
        overflow="hidden"
        zIndex={3}
        display={isLargerThan768 || isChatOpen ? "block" : "none"}
      >
        {isLargerThan768 && (
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
            <Icon
              as={DragHandleIcon}
              color="gray.400"
              position="absolute"
              left="50%"
              top="50%"
              transform="translate(-50%, -50%)"
            />
          </Flex>
        )}
        <Flex height="100%" direction="column" p={4}>
          <Flex justifyContent="flex-end" mb={4}>
            <Button onClick={() => setIsChatOpen(false)} size="sm">
              Close
            </Button>
          </Flex>
          <Box flex={1} overflowY="auto" mb={4}>
            {messages.map((message, index) => (
              <Flex
                key={message.id}
                direction="column"
                alignItems={message.is_ai_response ? "flex-start" : "flex-end"}
                mb={2}
              >
                <Box
                  bg={
                    message.is_ai_response
                      ? aiMessageBgColor
                      : userMessageBgColor
                  }
                  color={messageTextColor} // Use the variable here
                  borderRadius="lg"
                  px={3}
                  py={2}
                  maxWidth="70%"
                >
                  {message.message}
                </Box>
                {message.is_ai_response &&
                  message.metadata?.options &&
                  index === messages.length - 1 && (
                    <Flex mt={2} flexWrap="wrap" justifyContent="flex-start">
                      {message.metadata.options.map((option, optionIndex) => (
                        <Button
                          key={optionIndex}
                          size="sm"
                          colorScheme="purple"
                          variant="outline"
                          onClick={() => handleOptionClick(option)}
                          mr={2}
                          mb={2}
                          maxWidth="70%"
                          whiteSpace="normal"
                          height="auto"
                          textAlign="left"
                          lineHeight="short"
                          p={1.5}
                        >
                          {option}
                        </Button>
                      ))}
                    </Flex>
                  )}
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
                if (e.key === "Enter" && !isLoading) {
                  handleSendMessage();
                }
              }}
            />
            <Button
              onClick={handleSendMessage}
              colorScheme="purple"
              isLoading={isLoading}
            >
              Send
            </Button>
          </Flex>
        </Flex>
      </Box>
    </Flex>
  );
}
