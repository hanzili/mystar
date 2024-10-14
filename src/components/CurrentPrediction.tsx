// src/components/CurrentPredictionDisplay.tsx
import React from "react";
import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Image,
  useColorModeValue,
  Container,
  Divider,
} from "@chakra-ui/react";
import { useNavigate } from "@tanstack/react-router";
import { SelectedCard } from "../lib/types";
import { tarotCardImages } from "../utils/tarotCards";

interface CurrentPredictionDisplayProps {
  prediction: string;
  predictionId?: string;
  cards: SelectedCard[];
  question: string;
  onStartNewReading: () => void;
}

const CurrentPrediction: React.FC<CurrentPredictionDisplayProps> = ({
  prediction,
  predictionId,
  cards,
  question,
  onStartNewReading,
}) => {
  const navigate = useNavigate();

  const headingColor = useColorModeValue("purple.600", "purple.300");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const cardBgColor = useColorModeValue("white", "gray.700");
  const cardBorderColor = useColorModeValue("purple.200", "purple.500");

  const handleChatWithAstrologist = () => {
    console.log("redirecting to chat with predictionId", predictionId);
    navigate({
      to: "/chat",
      search: { predictionId: predictionId },
    });
  };

  return (
    <Container maxW="4xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading as="h2" size="xl" color={headingColor} textAlign="center">
          Your Tarot Prediction
        </Heading>
        
        <Box bg={useColorModeValue("purple.50", "gray.800")} p={6} borderRadius="lg" boxShadow="md">
          <Text fontSize="xl" fontWeight="bold" color={headingColor} mb={4}>
            Question:
          </Text>
          <Text fontSize="lg" color={textColor}>
            {question}
          </Text>
        </Box>

        <Box>
          <Text fontSize="xl" fontWeight="bold" color={headingColor} mb={4}>
            Your Cards:
          </Text>
          <HStack justify="center" spacing={6} wrap="wrap">
            {cards.map((card, index) => (
              <Box
                key={index}
                bg={cardBgColor}
                borderRadius="lg"
                p={4}
                textAlign="center"
                boxShadow="md"
                border="1px solid"
                borderColor={cardBorderColor}
                transition="all 0.3s"
                _hover={{ transform: "translateY(-5px)", boxShadow: "lg" }}
              >
                <Box position="relative" width="150px" height="150px">
                  <Image
                    src={tarotCardImages[card.name]}
                    alt={card.name}
                    boxSize="150px"
                    objectFit="contain"
                    transform={card.isReversed ? "rotate(180deg)" : "none"}
                    transition="transform 0.3s"
                  />
                </Box>
                <Text fontSize="md" fontWeight="semibold" mt={3} color={headingColor}>
                  {card.name}
                </Text>
                <Text fontSize="sm" color={textColor} fontStyle="italic">
                  {card.isReversed ? "(Reversed)" : "(Upright)"}
                </Text>
              </Box>
            ))}
          </HStack>
        </Box>

        <Divider />

        <Box>
          <Text fontSize="xl" fontWeight="bold" color={headingColor} mb={4}>
            Prediction:
          </Text>
          <Text fontSize="lg" lineHeight="tall" color={textColor}>
            {prediction}
          </Text>
        </Box>

        <Box textAlign="center" mt={6}>
          <Button
            onClick={onStartNewReading}
            colorScheme="purple"
            size="lg"
            mr={4}
            _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
            transition="all 0.2s"
          >
            Start New Reading
          </Button>
          <Button
            onClick={handleChatWithAstrologist}
            colorScheme="teal"
            size="lg"
            _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
            transition="all 0.2s"
          >
            Chat with AI Astrologist
          </Button>
        </Box>
      </VStack>
    </Container>
  );
};

export default CurrentPrediction;
