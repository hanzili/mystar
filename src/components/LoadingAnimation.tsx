import React from "react";
import { Box, Text, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

const LoadingAnimation: React.FC = () => {
  return (
    <VStack spacing={6}>
      <Box position="relative" width="100px" height="100px">
        <MotionBox
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          borderRadius="full"
          border="4px solid"
          borderColor="yellow.300"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <MotionBox
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          borderRadius="full"
          border="4px solid"
          borderColor="yellow.500"
          animate={{ scale: [1.1, 1, 1.1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </Box>
      <Text fontSize="2xl" fontWeight="medium" color="yellow.300">
        Consulting the cards...
      </Text>
    </VStack>
  );
};

export default LoadingAnimation;
