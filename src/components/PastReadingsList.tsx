import React from "react";
import {
  Box,
  Text,
  VStack,
  SimpleGrid,
  Heading,
  Button,
  Flex,
  Image,
  Badge,
  Tooltip,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { TarotReading } from "../lib/supabase_types";
import { useNavigate } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";
import { tarotCardImages } from "../utils/tarotCards";
import { useCommonColors } from "../utils/theme";

const MotionBox = motion(Box);

interface PastReadingsListProps {
  pastReadings: TarotReading[];
}

const PastReadingsList: React.FC<PastReadingsListProps> = ({ pastReadings }) => {
  const navigate = useNavigate();
  const { cardBg, border, text, accent, summaryBg, badgeBg, badgeText } = useCommonColors();

  const handleChatWithAstrologist = (predictionId: string) => {
    navigate({
      to: "/chat",
      search: { predictionId },
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderCards = (cards: string) => {
    const cardList = cards.split(", ");
    return (
      <Flex justifyContent="center" flexWrap="wrap" mt={4}>
        {cardList.map((card, index) => {
          const [cardName, orientation] = card.split(" (");
          const isReversed = orientation === "Reversed)";
          return (
            <Tooltip key={index} label={`${cardName}${isReversed ? " (Reversed)" : ""}`} placement="top">
              <Box
                position="relative"
                width="40px"
                height="60px"
                m={1}
                transition="transform 0.3s"
                _hover={{ transform: "scale(1.1)" }}
              >
                <Image
                  src={tarotCardImages[cardName]}
                  alt={card}
                  objectFit="cover"
                  width="100%"
                  height="100%"
                  borderRadius="md"
                  transform={isReversed ? "rotate(180deg)" : "none"}
                />
                {isReversed && (
                  <Badge
                    position="absolute"
                    top="-6px"
                    right="-6px"
                    bg={badgeBg}
                    color={badgeText}
                    borderRadius="full"
                    fontSize="0.6em"
                    p={1}
                    boxShadow="0 0 0 2px rgba(0, 0, 0, 0.1)"
                  >
                    R
                  </Badge>
                )}
              </Box>
            </Tooltip>
          );
        })}
      </Flex>
    );
  };

  return (
    <VStack spacing={8} align="stretch">
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {pastReadings.map((reading, index) => (
          <MotionBox
            key={reading.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Box
              bg={cardBg}
              borderColor={border}
              p={4}
              boxShadow="md"
              height="100%"
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
              _hover={{ boxShadow: "lg" }}
              transition="all 0.3s"
            >
              <VStack align="stretch" spacing={3}>
                <Flex justifyContent="space-between" alignItems="center">
                  <Badge colorScheme="purple" fontSize="0.7em" px={2} py={1}>
                    {formatDate(reading.created_at!)}
                  </Badge>
                  <Button
                    leftIcon={<MessageCircle size={14} />}
                    colorScheme="purple"
                    size="xs"
                    variant="outline"
                    onClick={() => handleChatWithAstrologist(reading.id!)}
                  >
                    Explore
                  </Button>
                </Flex>
                <Heading as="h3" size="sm" color={accent}>
                  {reading.question}
                </Heading>
                {renderCards(reading.cards)}
                <Box bg={summaryBg} p={2} borderRadius="md">
                  <Text fontSize="xs" fontWeight="bold" color={accent} mb={1}>
                    Summary:
                  </Text>
                  <Text fontSize="xs" color={text}>
                    {JSON.parse(reading.prediction).summary}
                  </Text>
                </Box>
              </VStack>
            </Box>
          </MotionBox>
        ))}
      </SimpleGrid>
    </VStack>
  );
};

export default PastReadingsList;
