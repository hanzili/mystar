import React from 'react';
import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  useColorModeValue,
} from '@chakra-ui/react';
import { useNavigate } from '@tanstack/react-router';
import { TarotReading } from '../lib/supabase';

interface PredictionResultProps {
  predictionId: string;
  prediction: string;
  pastReadings: TarotReading[];
}

const PredictionResult: React.FC<PredictionResultProps> = ({
  predictionId,
  prediction,
  pastReadings,
}) => {
  const navigate = useNavigate();
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('purple.200', 'purple.600');
  const headingColor = useColorModeValue('purple.600', 'purple.300');
  const textColor = useColorModeValue('gray.800', 'gray.100');
  const accordionBgColor = useColorModeValue('purple.50', 'purple.900');

  const handleChatWithAstrologist = () => {
    console.log('redirecting to chat with predictionId', predictionId)
    navigate({ 
      to: '/chat',
      search: { predictionId: predictionId }
    });
  };

  return (
    <Box bg={bgColor} borderRadius="lg" boxShadow="md" p={6} width="100%">
      <VStack spacing={6} align="stretch">
        {prediction && (
          <>
            <Heading as="h2" size="xl" color={headingColor} textAlign="center">
              Your Tarot Prediction
            </Heading>
            <Text fontSize="lg" lineHeight="tall" color={textColor}>
              {prediction}
            </Text>
            <Box textAlign="center">
              <Button
                onClick={() => window.location.reload()}
                colorScheme="purple"
                size="lg"
                mr={4}
                _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                transition="all 0.2s"
              >
                Start New Reading
              </Button>
              <Button
                onClick={handleChatWithAstrologist}
                colorScheme="teal"
                size="lg"
                _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                transition="all 0.2s"
              >
                Chat with AI Astrologist
              </Button>
            </Box>
          </>
        )}

        {pastReadings.length > 0 && (
          <>
            <Heading as="h3" size="lg" color={headingColor} mt={8}>
              Past Readings
            </Heading>
            <Accordion allowMultiple>
              {pastReadings.map((reading, index) => (
                <AccordionItem
                  key={index}
                  border="1px solid"
                  borderColor={borderColor}
                  borderRadius="md"
                  mb={2}
                >
                  <h2>
                    <AccordionButton _expanded={{ bg: accordionBgColor }}>
                      <Box flex="1" textAlign="left" fontWeight="medium">
                        {reading.question}
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    <Text>
                      <strong>Cards:</strong> {reading.cards}
                    </Text>
                    <Text mt={2}>
                      <strong>Prediction:</strong> {reading.prediction}
                    </Text>
                    <Text
                      mt={2}
                      fontSize="sm"
                      color={useColorModeValue('gray.600', 'gray.400')}
                    >
                      {new Date(reading.created_at!).toLocaleString()}
                    </Text>
                  </AccordionPanel>
                </AccordionItem>
              ))}
            </Accordion>
          </>
        )}
      </VStack>
    </Box>
  );
};

export default PredictionResult;