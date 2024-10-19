import React from "react";
import { Box, Text, VStack, HStack, Image, useColorModeValue, chakra } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { SelectedCard } from "../types/types";
import { tarotCardImages } from "../utils/tarotCards";

const MotionBox = chakra(motion.div);
const MotionText = chakra(motion.p);

const LoadingAnimation: React.FC<{ question: string, selectedCards: SelectedCard[] }> = ({ question, selectedCards }) => {
  const bgColor = useColorModeValue("rgba(0, 0, 0, 0.05)", "rgba(255, 255, 255, 0.05)");
  const textColor = useColorModeValue("purple.700", "yellow.300");
  const questionColor = useColorModeValue("purple.500", "yellow.100");

  return (
    <Box p={6} borderRadius="lg" bg={bgColor}>
      <VStack spacing={6} align="center">
        <Box position="relative" width="150px" height="150px">
          <MotionBox
            position="absolute"
            top="0"
            left="0"
            right="0"
            bottom="0"
            borderRadius="full"
            border="4px solid"
            borderColor={textColor}
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 360]
            }}
            transition="4s linear infinite"
          />
          <MotionBox
            position="absolute"
            top="0"
            left="0"
            right="0"
            bottom="0"
            borderRadius="full"
            border="4px solid"
            borderColor={questionColor}
            animate={{ 
              scale: [1.1, 1, 1.1],
              rotate: [360, 0]
            }}
            transition="4s linear infinite"
          />
        </Box>
        
        <MotionText
          fontSize="2xl"
          fontWeight="bold"
          color={textColor}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition="2s infinite"
        >
          Consulting the spirits...
        </MotionText>

        <Text
          fontSize="xl"
          fontWeight="medium"
          color={questionColor}
          textAlign="center"
        >
          "{question}"
        </Text>

        <HStack spacing={4} justify="center">
          {selectedCards.map((card, index) => (
            <Box key={index}>
              <Image 
                src={tarotCardImages[card.name]} 
                alt={card.name} 
                boxSize="60px" 
                objectFit="cover" 
                borderRadius="md"
                boxShadow="md"
              />
            </Box>
          ))}
        </HStack>
      </VStack>
    </Box>
  );
};

export default LoadingAnimation;
