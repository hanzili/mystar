import { useTarotReading } from "../hooks/useTarotReading";
import { Box, VStack, useColorModeValue } from "@chakra-ui/react";
import QuestionForm from "../components/QuestionForm";
import CardSelection from "../components/CardSelection";
import CurrentPrediction from "../components/CurrentPrediction";
import LoadingAnimation from "../components/LoadingAnimation";

export default function Prediction() {
  const {
    predictionId,
    question,
    selectedCards,
    prediction,
    isLoading,
    handleQuestionSubmit,
    handleCardSelection,
    resetReading, // Use reset function to restart the reading process
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

        {/* Step 4: Show the Prediction */}
        {prediction && (
          <CurrentPrediction
            predictionId={predictionId}
            prediction={prediction}
            onStartNewReading={resetReading} // Reset the state to start from the question form
            cards={selectedCards}
            question={question}
          />
        )}
      </Box>
    </VStack>
  );
}
