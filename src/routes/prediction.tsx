import { useTarotReading } from "../hooks/useTarotReading";
import { Box, VStack, useColorModeValue } from "@chakra-ui/react";
import QuestionForm from "../components/QuestionForm";
import CardSelection from "../components/CardSelection";
import LoadingAnimation from "../components/LoadingAnimation";

export default function Prediction() {
  const {
    question,
    selectedCards,
    isLoading,
    handleQuestionSubmit,
    handleCardSelection,
  } = useTarotReading();

  return (
    <VStack spacing={8} align="stretch">
      <Box bg={useColorModeValue('white', 'gray.700')} p={6} borderRadius="lg" boxShadow="md">
        {/* Step 1: Show Question Form */}
        {!question && <QuestionForm onSubmit={handleQuestionSubmit} />}
        
        {/* Step 2: Show Card Selection after Question */}
        {question && !selectedCards.length && (
          <CardSelection onSelect={handleCardSelection} />
        )}

        {/* Step 3: Show Loading Animation if prediction is being calculated */}
        {isLoading && <LoadingAnimation />}
      </Box>
    </VStack>
  );
}
