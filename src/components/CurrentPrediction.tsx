import React from "react";
import {
  Box,
  Heading,
  Text,
  Image,
  SimpleGrid,
  Button,
  VStack,
  HStack,
  Container,
  Stack,
} from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { SelectedCard, Prediction } from "../types/types";
import { tarotCardImages } from "../utils/tarotCards";
import { Clock, Sun, Sunrise, ShareIcon } from "lucide-react";
import { TimeFrame } from "../lib/supabase_types";
import { useCommonColors } from "../utils/theme";

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
  const { accent, text, cardBg, border, predictionBg } = useCommonColors();

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
        px={3}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <VStack spacing={6} align="stretch">
          <Stack
            direction={["column", "row"]}
            justifyContent="space-between"
            alignItems={["flex-start", "center"]}
            spacing={4}
          >
            <Heading as="h2" size="lg" color={accent}>
              {isOwner ? "Your Tarot Prediction" : "Your Friend's Tarot Prediction"}
            </Heading>
            {isOwner && (
              <Button
                leftIcon={<ShareIcon />}
                colorScheme="purple"
                onClick={handleShare}
                width={["100%", "auto"]}
              >
                Share
              </Button>
            )}
          </Stack>

          <MotionBox
            bg={predictionBg}
            p={6}
            borderRadius="lg"
            boxShadow="md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Text fontSize="xl" fontWeight="bold" color={accent} mb={2}>
              Question:
            </Text>
            <Text fontSize="lg" color={text}>
              {question}
            </Text>
          </MotionBox>

          <SimpleGrid columns={columns} spacing={6}>
            {timeFrames.map((tf, index) => (
              <MotionBox
                key={tf.title}
                bg={predictionBg}
                p={4}
                borderRadius="lg"
                boxShadow="md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                display="flex"
                flexDirection="column"
                height="100%"
              >
                <VStack spacing={3} align="stretch" flex={1}>
                  <HStack justify="center">
                    <Box as={tf.icon} size={20} color={accent} />
                    <Text fontSize="lg" fontWeight="bold" color={accent}>
                      {tf.title}
                    </Text>
                  </HStack>
                  <Box
                    bg={cardBg}
                    borderRadius="lg"
                    p={3}
                    textAlign="center"
                    boxShadow="md"
                    border="1px solid"
                    borderColor={border}
                    width="fit-content"
                    mx="auto"
                  >
                    <Image
                      src={tarotCardImages[cards[index].name]}
                      alt={cards[index].name}
                      height={["150px", "200px"]}
                      objectFit="contain"
                      transform={
                        cards[index].isReversed ? "rotate(180deg)" : "none"
                      }
                    />
                    <Text
                      fontSize="sm"
                      fontWeight="semibold"
                      mt={2}
                      color={accent}
                    >
                      {cards[index].name}
                    </Text>
                    <Text fontSize="xs" color={text} fontStyle="italic">
                      {cards[index].isReversed ? "(Reversed)" : "(Upright)"}
                    </Text>
                  </Box>
                  <Text
                    fontSize="sm"
                    color={text}
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
                    mt={3}
                    width="100%"
                  >
                    Discuss {tf.title}
                  </Button>
                )}
              </MotionBox>
            ))}
          </SimpleGrid>

          <MotionBox
            bg={predictionBg}
            p={6}
            borderRadius="lg"
            boxShadow="md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Text fontSize="xl" fontWeight="bold" color={accent} mb={4}>
              Result
            </Text>
            <Text fontSize="md" color={text} lineHeight="tall">
              {prediction.summary}
            </Text>
          </MotionBox>
        </VStack>
      </MotionContainer>
    </AnimatePresence>
  );
};

export default CurrentPrediction;
