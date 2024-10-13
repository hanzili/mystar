import React from 'react'
import { Box, VStack, useColorModeValue } from '@chakra-ui/react'
import QuestionForm from '../components/QuestionForm'
import CardSelection from '../components/CardSelection'
import PredictionResult from '../components/PredictionResult'
import LoadingAnimation from '../components/LoadingAnimation'
import { useTarotReading } from '../hooks/useTarotReading'

export default function Prediction() {
  const {
    question,
    selectedCards,
    prediction,
    isLoading,
    handleQuestionSubmit,
    handleCardSelection,
  } = useTarotReading()

  return (
    <VStack spacing={8} align="stretch">
      <Box bg={useColorModeValue('white', 'gray.700')} p={6} borderRadius="lg" boxShadow="md">
        {!question && <QuestionForm onSubmit={handleQuestionSubmit} />}
        {question && !selectedCards.length && (
          <CardSelection onSelect={handleCardSelection} />
        )}
        {isLoading && <LoadingAnimation />}
        {prediction && (
          <PredictionResult
            prediction={prediction}
            pastReadings={[]}
          />
        )}
      </Box>
    </VStack>
  )
}