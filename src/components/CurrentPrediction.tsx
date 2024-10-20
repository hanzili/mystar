import React from "react";
import {
  Box,
  Heading,
  Text,
  Image,
  useColorModeValue,
  SimpleGrid,
  Flex,
  Button,
  VStack,
  HStack,
  Container,
  Divider,
} from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { SelectedCard, Prediction } from "../types/types";
import { tarotCardImages } from "../utils/tarotCards";
import { Clock, Sun, Sunrise } from "lucide-react";
import { TimeFrame } from "../lib/supabase_types";

interface CurrentPredictionProps {
  prediction: Prediction;
  predictionId: string;
  cards: SelectedCard[];
  question: string;
  isChatOpen: boolean;
  handleGenerateQuestion: (timeFrame: TimeFrame) => void;
  chatIsGeneratingQuestion: boolean;
  isLargerThan768: boolean;
}

const MotionBox = motion(Box);
const MotionContainer = motion(Container);

const CurrentPrediction: React.FC<CurrentPredictionProps> = ({
  prediction,
  cards,
  question,
  handleGenerateQuestion,
  chatIsGeneratingQuestion,
}) => {
  const headingColor = useColorModeValue("purple.600", "purple.300");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const cardBgColor = useColorModeValue("white", "gray.700");
  const cardBorderColor = useColorModeValue("purple.200", "purple.500");
  const predictionBgColor = useColorModeValue("purple.50", "gray.800");

  const timeFrames = [
    { title: "Past", content: prediction.past, icon: Clock, timeFrame: TimeFrame.PAST },
    { title: "Present", content: prediction.present, icon: Sun, timeFrame: TimeFrame.PRESENT },
    { title: "Future", content: prediction.future, icon: Sunrise, timeFrame: TimeFrame.FUTURE },
  ];

  return (
    <AnimatePresence>
      <MotionContainer
        maxW="container.xl"
        py={8}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <VStack spacing={8} align="stretch">
          <Heading as="h2" size="xl" color={headingColor} textAlign="center">
            Your Tarot Prediction
          </Heading>
          
          <MotionBox
            bg={predictionBgColor}
            p={6}
            borderRadius="lg"
            boxShadow="md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Text fontSize="xl" fontWeight="bold" color={headingColor} mb={2}>
              Question:
            </Text>
            <Text fontSize="lg" color={textColor}>
              {question}
            </Text>
          </MotionBox>

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            {timeFrames.map((tf, index) => (
              <MotionBox
                key={tf.title}
                bg={predictionBgColor}
                p={6}
                borderRadius="lg"
                boxShadow="md"
                display="flex"
                flexDirection="column"
                height="100%"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              >
                <VStack align="stretch" spacing={4} flex={1}>
                  <HStack justify="center">
                    <Box as={tf.icon} size={24} color={headingColor} />
                    <Text fontSize="xl" fontWeight="bold" color={headingColor}>
                      {tf.title}
                    </Text>
                  </HStack>
                  <Box
                    bg={cardBgColor}
                    borderRadius="lg"
                    p={4}
                    textAlign="center"
                    boxShadow="md"
                    border="1px solid"
                    borderColor={cardBorderColor}
                    width="fit-content"
                    mx="auto"
                  >
                    <Image
                      src={tarotCardImages[cards[index].name]}
                      alt={cards[index].name}
                      boxSize="120px"
                      objectFit="contain"
                      transform={cards[index].isReversed ? "rotate(180deg)" : "none"}
                    />
                    <Text fontSize="sm" fontWeight="semibold" mt={2} color={headingColor}>
                      {cards[index].name}
                    </Text>
                    <Text fontSize="xs" color={textColor} fontStyle="italic">
                      {cards[index].isReversed ? "(Reversed)" : "(Upright)"}
                    </Text>
                  </Box>
                  <Text fontSize="sm" color={textColor} lineHeight="tall" flex={1}>
                    {tf.content}
                  </Text>
                </VStack>
                <Button
                  colorScheme="purple"
                  size="sm"
                  onClick={() => handleGenerateQuestion(tf.timeFrame)}
                  isLoading={chatIsGeneratingQuestion}
                  mt={4}
                >
                  Discuss {tf.title}
                </Button>
              </MotionBox>
            ))}
          </SimpleGrid>

          <MotionBox
            bg={predictionBgColor}
            p={6}
            borderRadius="lg"
            boxShadow="md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Text fontSize="xl" fontWeight="bold" color={headingColor} mb={4}>
              Result
            </Text>
            <Text fontSize="md" color={textColor} lineHeight="tall">
              {prediction.summary}
            </Text>
          </MotionBox>
        </VStack>
      </MotionContainer>
    </AnimatePresence>
  );
};

export default CurrentPrediction;
