import { useTarotReading } from "../hooks/useTarotReading";
import { Box, VStack } from "@chakra-ui/react";
import QuestionForm from "../components/QuestionForm";
import CardSelection from "../components/CardSelection";
import LoadingAnimation from "../components/LoadingAnimation";
import { useCommonColors } from "../utils/theme";

export default function Prediction() {
  const {
    question,
    selectedCards,
    isLoading,
    handleQuestionSubmit,
    handleCardSelection,
  } = useTarotReading();

  const { cardBg } = useCommonColors();

  return (
    <VStack spacing={8} align="stretch">
      <Box bg={cardBg} p={6} borderRadius="lg" boxShadow="md">
        {/* Step 1: Show Question Form */}
        {!question && <QuestionForm onSubmit={handleQuestionSubmit} />}
        
        {/* Step 2: Show Card Selection after Question */}
        {question && (
          <CardSelection onSelect={handleCardSelection} />
        )}

        {/* Step 3: Show Loading Animation if prediction is being calculated */}
        {isLoading && (
          <Box position="fixed" top="0" left="0" right="0" bottom="0" zIndex="9999">
            <LoadingAnimation question={question} selectedCards={selectedCards} />
          </Box>
        )}
      </Box>
    </VStack>
  );
}
