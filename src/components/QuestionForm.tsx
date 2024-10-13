import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, VStack, useColorModeValue } from '@chakra-ui/react';

interface QuestionFormProps {
  onSubmit: (question: string) => void;
}

const QuestionForm: React.FC<QuestionFormProps> = ({ onSubmit }) => {
  const [question, setQuestion] = useState('');
  const labelColor = useColorModeValue('purple.600', 'purple.300')
  const inputBg = useColorModeValue('white', 'gray.700')
  const inputColor = useColorModeValue('gray.800', 'white')
  const inputBorderColor = useColorModeValue('purple.300', 'purple.500')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim()) {
      onSubmit(question);
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit} width="100%">
      <VStack spacing={6}>
        <FormControl>
          <FormLabel htmlFor="question" fontSize="lg" color={labelColor}>
            What would you like to know?
          </FormLabel>
          <Input
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Enter your question..."
            size="lg"
            bg={inputBg}
            color={inputColor}
            borderColor={inputBorderColor}
            _hover={{ borderColor: 'purple.400' }}
            _focus={{ borderColor: 'purple.500', boxShadow: '0 0 0 1px purple.500' }}
          />
        </FormControl>
        <Button
          type="submit"
          colorScheme="purple"
          size="lg"
          width="full"
          _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
          transition="all 0.2s"
        >
          Ask the Tarot
        </Button>
      </VStack>
    </Box>
  );
};

export default QuestionForm;