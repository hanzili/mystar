// src/components/CurrentPredictionDisplay.tsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Image,
  useColorModeValue,
  Container,
  Divider,
  Flex,
  Button
} from "@chakra-ui/react";
import { SelectedCard, Prediction } from "../types/types";
import { tarotCardImages } from "../utils/tarotCards";
import { Clock, Sun, Sunrise } from "lucide-react";
import { TimeFrame } from "../lib/supabase_types";

interface CurrentPredictionDisplayProps {
  prediction: Prediction;
  predictionId: string;
  cards: SelectedCard[];
  question: string;
  isChatOpen: boolean;
  handleGenerateQuestion: (timeFrame: TimeFrame) => void;
  chatIsGeneratingQuestion: boolean;
}

const CurrentPrediction: React.FC<CurrentPredictionDisplayProps> = ({
  prediction,
  cards,
  question,
  isChatOpen,
  handleGenerateQuestion,
  chatIsGeneratingQuestion,
}) => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const headingColor = useColorModeValue("purple.600", "purple.300");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const cardBgColor = useColorModeValue("white", "gray.700");
  const cardBorderColor = useColorModeValue("purple.200", "purple.500");
  const predictionBgColor = useColorModeValue("purple.50", "gray.800");


  const getHighlightColor = (index: number) => {
    if (hoveredCard === index) {
      return useColorModeValue("yellow.100", "yellow.700");
    }
    return "transparent";
  };

  const PredictionSection = ({ title, content, icon, index, timeFrame }: { title: string, content: string, icon: React.ElementType, index: number, timeFrame: TimeFrame }) => (
    <Box
      bg={getHighlightColor(index)}
      p={4}
      borderRadius="md"
      transition="background-color 0.3s"
      boxShadow="md"
    >
      <Flex align="center" mb={2}>
        <Box as={icon} size={24} color={headingColor} mr={2} />
        <Text fontSize="lg" fontWeight="bold" color={headingColor}>
          {title}
        </Text>
      </Flex>
      <Text fontSize="md" color={textColor} lineHeight="tall">
        {content}
      </Text>
      {isChatOpen && (
        <Button
          mt={4}
          colorScheme="purple"
          size="sm"
          onClick={() => handleGenerateQuestion(timeFrame)}
          isLoading={chatIsGeneratingQuestion}
        >
          Discuss
        </Button>
      )}
    </Box>
  );

  return (
    <Container maxW="4xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading as="h2" size="xl" color={headingColor} textAlign="center">
          Your Tarot Prediction
        </Heading>
        
        <Box bg={predictionBgColor} p={6} borderRadius="lg" boxShadow="md">
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
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
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
          <VStack align="stretch" spacing={4} bg={predictionBgColor} p={6} borderRadius="lg">
            <PredictionSection
              title="Past"
              content={prediction.past}
              icon={Clock}
              index={0}
              timeFrame={TimeFrame.PAST}
            />
            <PredictionSection
              title="Present"
              content={prediction.present}
              icon={Sun}
              index={1}
              timeFrame={TimeFrame.PRESENT}
            />
            <PredictionSection
              title="Future"
              content={prediction.future}
              icon={Sunrise}
              index={2}
              timeFrame={TimeFrame.FUTURE}
            />
          </VStack>
        </Box>

        {/* <Box textAlign="center" mt={6}>
          <Button
            onClick={handleChatWithAstrologist}
            colorScheme="teal"
            size="lg"
            _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
            transition="all 0.2s"
          >
            Chat with AI Astrologist
          </Button>
        </Box> */}
      </VStack>
    </Container>
  );
};

export default CurrentPrediction;
