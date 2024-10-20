import React from "react";
import {
  Box,
  Heading,
  Text,
  Image,
  useColorModeValue,
  SimpleGrid,
  Button,
  VStack,
  HStack,
  Container,
  Flex,
} from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { SelectedCard, Prediction } from "../types/types";
import { tarotCardImages } from "../utils/tarotCards";
import { Clock, Sun, Sunrise, ShareIcon } from "lucide-react";
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
  availableWidth: number;
  isOwner: boolean;
  shareUrl: string | null;
  handleShare: () => void;
}

const MotionBox = motion(Box);
const MotionContainer = motion(Container);

const CurrentPrediction: React.FC<CurrentPredictionProps> = ({
  prediction,
  cards,
  question,
  handleGenerateQuestion,
  chatIsGeneratingQuestion,
  isLargerThan768,
  availableWidth,
  isOwner,
  shareUrl,
  handleShare,
}) => {
  const headingColor = useColorModeValue("purple.600", "purple.300");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const cardBgColor = useColorModeValue("white", "gray.700");
  const cardBorderColor = useColorModeValue("purple.200", "purple.500");
  const predictionBgColor = useColorModeValue("purple.50", "gray.800");

  const timeFrames = [
    {
      title: "Past",
      content: prediction.past,
      icon: Clock,
      timeFrame: TimeFrame.PAST,
    },
    {
      title: "Present",
      content: prediction.present,
      icon: Sun,
      timeFrame: TimeFrame.PRESENT,
    },
    {
      title: "Future",
      content: prediction.future,
      icon: Sunrise,
      timeFrame: TimeFrame.FUTURE,
    },
  ];

  // Determine the number of columns based on available width
  const columns = isLargerThan768 && availableWidth > 66 ? 3 : 1;

  const handleCopyShareUrl = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      // You might want to show a toast notification here
    }
  };

  return (
    <AnimatePresence>
      <MotionContainer
        maxW={columns === 1 ? "container.sm" : "container.xl"}
        py={5}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <VStack spacing={6} align="stretch">
          <Flex justifyContent="space-between" alignItems="center" flexWrap="wrap">
            <Heading as="h2" size="lg" color={headingColor}>
              {isOwner ? "Your Tarot Prediction" : "Your Friend's Tarot Prediction"}
            </Heading>
            {isOwner && (
              <Button
                leftIcon={<ShareIcon />}
                colorScheme="purple"
                onClick={handleShare}
              >
                Share
              </Button>
            )}
          </Flex>

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

          <SimpleGrid columns={columns} spacing={6}>
            {timeFrames.map((tf, index) => (
              <MotionBox
                key={tf.title}
                bg={predictionBgColor}
                p={6}
                borderRadius="lg"
                boxShadow="md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                display="flex"
                flexDirection="column"
                height="100%"
              >
                <VStack spacing={4} align="stretch" flex={1}>
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
                      height="200px"
                      objectFit="contain"
                      transform={
                        cards[index].isReversed ? "rotate(180deg)" : "none"
                      }
                    />
                    <Text
                      fontSize="sm"
                      fontWeight="semibold"
                      mt={2}
                      color={headingColor}
                    >
                      {cards[index].name}
                    </Text>
                    <Text fontSize="xs" color={textColor} fontStyle="italic">
                      {cards[index].isReversed ? "(Reversed)" : "(Upright)"}
                    </Text>
                  </Box>
                  <Text
                    fontSize="sm"
                    color={textColor}
                    lineHeight="tall"
                    flex={1}
                  >
                    {tf.content}
                  </Text>
                </VStack>
                {isOwner && (
                  <Button
                    colorScheme="purple"
                    size="sm"
                    onClick={() => handleGenerateQuestion(tf.timeFrame)}
                    isLoading={chatIsGeneratingQuestion}
                    mt={4}
                  >
                    Discuss {tf.title}
                  </Button>
                )}
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
