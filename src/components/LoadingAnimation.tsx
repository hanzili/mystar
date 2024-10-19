import React from "react";
import { Box, Text, VStack, HStack, Image, useColorModeValue } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { SelectedCard } from "../types/types";
import { tarotCardImages } from "../utils/tarotCards";

const MotionBox = motion(Box);
const MotionText = motion(Text);

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
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
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
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />
        </Box>
        
        <MotionText
          fontSize="2xl"
          fontWeight="bold"
          color={textColor}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Consulting the spirits...
        </MotionText>

        <MotionText
          fontSize="xl"
          fontWeight="medium"
          color={questionColor}
          textAlign="center"
          animate={{ y: [0, -10, 0], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          "{question}"
        </MotionText>

        <HStack spacing={4} justify="center">
          {selectedCards.map((card, index) => (
            <MotionBox
              key={index}
              animate={{ 
                y: [0, -5, 0],
                rotate: [-5, 5, -5]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                delay: index * 0.5 
              }}
            >
              <Image 
                src={tarotCardImages[card.name]} 
                alt={card.name} 
                boxSize="60px" 
                objectFit="cover" 
                borderRadius="md"
                boxShadow="md"
              />
            </MotionBox>
          ))}
        </HStack>
      </VStack>
    </Box>
  );
};

export default LoadingAnimation;
