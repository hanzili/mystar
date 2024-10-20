import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  VStack,
  Image,
  useColorModeValue,
  Fade,
  Flex,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { motion } from "framer-motion";
import { SelectedCard } from "../types/types";
import { tarotCardImages } from "../utils/tarotCards";

const glowAnimation = keyframes`
  0% { box-shadow: 0 0 5px #f6e05e, 0 0 10px #f6e05e, 0 0 15px #f6e05e, 0 0 20px #f6e05e; }
  50% { box-shadow: 0 0 10px #f6e05e, 0 0 20px #f6e05e, 0 0 30px #f6e05e, 0 0 40px #f6e05e; }
  100% { box-shadow: 0 0 5px #f6e05e, 0 0 10px #f6e05e, 0 0 15px #f6e05e, 0 0 20px #f6e05e; }
`;

const MotionBox = motion(Box);

const LoadingAnimation: React.FC<{
  question: string;
  selectedCards: SelectedCard[];
}> = ({ question, selectedCards }) => {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [selectedCardIndex, setSelectedCardIndex] = useState(0);
  const bgColor = useColorModeValue("rgba(0, 0, 0, 0.7)", "rgba(255, 255, 255, 0.1)");
  const textColor = useColorModeValue("yellow.300", "yellow.200");

  const phases = [
    "Take a deep breath and clear your mind...",
    "Focus on your question: '{question}'",
    "Visualize your desired outcome...",
    "Feel the energy of the universe flowing through you...",
    "The cards are revealing their wisdom...",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPhase((prev) => (prev + 1) % phases.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleCardClick = (index: number) => {
    setSelectedCardIndex(index);
  };

  return (
    <Flex
      position="fixed"
      top="0"
      left="0"
      right="0"
      bottom="0"
      bg={bgColor}
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      zIndex="9999"
    >
      <VStack spacing={8} align="center" maxWidth="80%" textAlign="center">
        <Fade in={true} key={currentPhase}>
          <Text
            fontSize="2xl"
            fontWeight="bold"
            color={textColor}
          >
            {phases[currentPhase].replace("{question}", question)}
          </Text>
        </Fade>

        <MotionBox
          width="300px"
          height="450px"
          cursor="pointer"
          animate={{ rotateY: selectedCardIndex !== -1 ? 180 : 0 }}
          transition={{ duration: 0.6 }}
          style={{ transformStyle: "preserve-3d" }}
        >
          <Box
            position="absolute"
            width="100%"
            height="100%"
            animation={`${glowAnimation} 2s infinite`}
          >
            <Image
              src="/images/tarot/card-back.png"
              alt="Tarot Card Back"
              objectFit="cover"
              width="100%"
              height="100%"
              borderRadius="lg"
            />
          </Box>
          <Box
            position="absolute"
            width="100%"
            height="100%"
            transform="rotateY(180deg)"
          >
            <Image
              src={tarotCardImages[selectedCards[selectedCardIndex]?.name] || "/images/tarot/card-back.png"}
              alt={selectedCards[selectedCardIndex]?.name || "Tarot Card"}
              objectFit="cover"
              width="100%"
              height="100%"
              borderRadius="lg"
              transform={selectedCards[selectedCardIndex]?.isReversed ? "rotate(180deg)" : "none"}
            />
          </Box>
        </MotionBox>

        <Text fontSize="lg" color={textColor} mt={4}>
          {selectedCardIndex !== -1
            ? `Card ${selectedCardIndex + 1}: ${selectedCards[selectedCardIndex]?.name}`
            : "Click a card below to reveal its details"}
        </Text>

        <Flex justify="center" flexWrap="wrap" mt={4}>
          {selectedCards.map((card, index) => (
            <Box
              key={index}
              m={1}
              cursor="pointer"
              onClick={() => handleCardClick(index)}
              border={selectedCardIndex === index ? "2px solid yellow" : "none"}
              borderRadius="md"
            >
              <Image
                src={tarotCardImages[card.name]}
                alt={card.name}
                boxSize="50px"
                objectFit="cover"
                borderRadius="md"
                transform={card.isReversed ? "rotate(180deg)" : "none"}
                opacity={selectedCardIndex === index ? 1 : 0.7}
              />
            </Box>
          ))}
        </Flex>
      </VStack>
    </Flex>
  );
};

export default LoadingAnimation;
