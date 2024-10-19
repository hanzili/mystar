// src/components/CardSelection.tsx
import React from "react";
import { Box, Grid, Heading, Text, VStack, Image, useBreakpointValue, chakra } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { tarotCards, tarotCardImages } from "../utils/tarotCards";
import { useCardSelection } from "../hooks/useCardSelections";
import { keyframes } from "@emotion/react";

const MotionBox = chakra(motion.div);

interface CardSelectionProps {
  onSelect: (cards: { name: string; isReversed: boolean }[]) => void;
}

const glowAnimation = keyframes`
  0% { box-shadow: 0 0 5px #f6e05e, 0 0 10px #f6e05e, 0 0 15px #f6e05e, 0 0 20px #f6e05e; }
  100% { box-shadow: 0 0 10px #f6e05e, 0 0 20px #f6e05e, 0 0 30px #f6e05e, 0 0 40px #f6e05e; }
`;

const CardSelection: React.FC<CardSelectionProps> = ({ onSelect }) => {
  const { selectedCards, flippedCards, isRevealing, handleCardClick } =
    useCardSelection(onSelect);

  const cardSize = useBreakpointValue({
    base: { width: "40px", height: "60px" },
    sm: { width: "50px", height: "75px" },
    md: { width: "60px", height: "90px" },
    lg: { width: "70px", height: "105px" },
    xl: { width: "80px", height: "120px" },
  });

  return (
    <VStack spacing={4} width="100%">
      <Heading as="h2" size="xl" color="purple.600" textAlign="center">
        {isRevealing ? "Revealing Your Cards" : "Select 3 Cards"}
      </Heading>
      <Text fontSize="lg" fontWeight="medium" color="purple.600">
        {isRevealing
          ? "Preparing your reading..."
          : `${selectedCards.length}/3 cards selected`}
      </Text>
      <Grid
        templateColumns={`repeat(auto-fill, minmax(${cardSize?.width}, 1fr))`}
        gap={1}
        width="100%"
        justifyContent="center"
      >
        {tarotCards.map((card, index) => (
          <MotionBox
            key={index}
            onClick={() => handleCardClick(card)}
            width={cardSize?.width}
            height={cardSize?.height}
            position="relative"
            cursor="pointer"
            initial={false}
            animate={{ 
              rotateY: flippedCards.includes(card) ? 180 : 0,
              // Add glow animation when selected
              animation: selectedCards.some((c) => c.name === card)
                ? `${glowAnimation} 1.5s ease-in-out infinite alternate`
                : "none"
            }}
            transition="0.6s"
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
                width="100%"
                height="100%"
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
                width="100%"
                height="100%"
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
    </VStack>
  );
};

export default CardSelection;
