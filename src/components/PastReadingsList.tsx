// src/components/PastReadingsList.tsx
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Text,
  useColorModeValue,
  Button,
} from "@chakra-ui/react";
import { TarotReading } from "../lib/types";
import { useNavigate } from "@tanstack/react-router";

interface PastReadingsListProps {
  pastReadings: TarotReading[];
}

const PastReadingsList: React.FC<PastReadingsListProps> = ({
  pastReadings,
}) => {
  const navigate = useNavigate();
  const borderColor = useColorModeValue("purple.200", "purple.600");
  const accordionBgColor = useColorModeValue("purple.50", "purple.900");

  const handleChatWithAstrologist = (predictionId: string) => {
    navigate({
      to: "/chat",
      search: { predictionId },
    });
  };

  return (
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
              color={useColorModeValue("gray.600", "gray.400")}
            >
              {new Date(reading.created_at!).toLocaleString()}
            </Text>
            <Button
              mt={4}
              colorScheme="purple"
              size="sm"
              onClick={() => handleChatWithAstrologist(reading.id!)}
            >
              Chat with AI Astrologist
            </Button>
          </AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default PastReadingsList;
