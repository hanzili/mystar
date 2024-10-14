// src/components/CardSelection.tsx
import React from "react";
import { Box, Grid, Heading, Text, VStack, Image } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { tarotCards, tarotCardImages } from "../utils/tarotCards";
import { useCardSelection } from "../hooks/useCardSelections";

interface CardSelectionProps {
  onSelect: (cards: { name: string; isReversed: boolean }[]) => void;
}

const MotionBox = motion(Box);

const CardSelection: React.FC<CardSelectionProps> = ({ onSelect }) => {
  const { selectedCards, flippedCards, isRevealing, handleCardClick } =
    useCardSelection(onSelect);

  return (
    <VStack spacing={6} width="100%">
      <Heading as="h2" size="xl" color="yellow.300" textAlign="center">
        {isRevealing ? "Revealing Your Cards" : "Select 3 Cards"}
      </Heading>
      <Grid
        templateColumns="repeat(auto-fill, minmax(120px, 1fr))"
        gap={4}
        width="100%"
      >
        {tarotCards.map((card, index) => (
          <MotionBox
            key={index}
            onClick={() => handleCardClick(card)}
            width="120px"
            height="200px"
            position="relative"
            cursor="pointer"
            initial={false}
            animate={{ rotateY: flippedCards.includes(card) ? 180 : 0 }}
            transition={{ duration: 0.6 }}
            style={{ transformStyle: "preserve-3d" }}
            _hover={{ transform: "scale(1.05)" }}
          >
            {/* Card Back */}
            <Box
              position="absolute"
              width="100%"
              height="100%"
              borderRadius="md"
              bg="purple.600"
              border="2px solid"
              borderColor={
                selectedCards.some((c) => c.name === card)
                  ? "yellow.400"
                  : "purple.300"
              }
              style={{ backfaceVisibility: "hidden" }}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Image
                src="/images/tarot/card-back.png"
                alt="Card Back"
                objectFit="cover"
              />
            </Box>

            {/* Card Front */}
            <Box
              position="absolute"
              width="100%"
              height="100%"
              borderRadius="md"
              bg="white"
              border="2px solid"
              borderColor="purple.600"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
              display="flex"
              alignItems="center"
              justifyContent="center"
              overflow="hidden"
            >
              <Image
                src={tarotCardImages[card]}
                alt={card}
                objectFit="cover"
                transform={
                  selectedCards.find((c) => c.name === card)?.isReversed
                    ? "rotate(180deg)"
                    : "none"
                }
              />
            </Box>
          </MotionBox>
        ))}
      </Grid>
      <Text fontSize="lg" fontWeight="medium" color="yellow.300">
        {isRevealing
          ? "Preparing your reading..."
          : `${selectedCards.length}/3 cards selected`}
      </Text>
    </VStack>
  );
};

export default CardSelection;
