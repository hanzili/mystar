import React, { useEffect, useReducer, useCallback } from "react";
import {
  Box,
  Button,
  FormControl,
  Input,
  VStack,
  Text,
  Flex,
  Tooltip,
  Icon,
  useBreakpointValue,
  Container,
  InputGroup,
  InputRightElement,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { Sparkles, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useCommonColors } from "../../utils/theme";
import { GoodQuestionGuidelines } from "./GoodQuestionGuidelines";
import { ThemeSelector } from "./ThemeSelector";
import { initialState, reducer } from "./questionReducer";
import { questionsByTheme } from "./themeData";

interface QuestionFormProps {
  onSubmit: (question: string) => void;
}

const MotionText = motion(Text);
const MotionBox = motion(Box);

const textVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 2 },
};

const charVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.2 },
};

const TypingText = ({ text, ...props }: { text: string }) => (
  <MotionText {...textVariants} {...props}>
    {Array.from(text).map((char, index) => (
      <motion.span
        key={index}
        {...charVariants}
        transition={{ ...charVariants.transition, delay: index * 0.1 }}
      >
        {char}
      </motion.span>
    ))}
  </MotionText>
);

const QuestionForm: React.FC<QuestionFormProps> = ({ onSubmit }) => {
  const [{ question, selectedTheme, displayedQuestions }, dispatch] =
    useReducer(reducer, initialState);
  const { text, accent, cardBg, border, hover } = useCommonColors();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, md: false });

  const handleQuestionChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch({ type: "SET_QUESTION", payload: e.target.value });
    },
    []
  );

  const handleThemeChange = useCallback((theme: string) => {
    dispatch({ type: "SET_THEME", payload: theme });
  }, []);

  const handleQuestionSelect = useCallback((question: string) => {
    dispatch({ type: "SET_QUESTION", payload: question });
  }, []);

  const refreshQuestions = useCallback(() => {
    if (selectedTheme) {
      const allQuestions =
        questionsByTheme[selectedTheme as keyof typeof questionsByTheme];
      const shuffled = allQuestions.sort(() => 0.5 - Math.random());
      dispatch({
        type: "SET_DISPLAYED_QUESTIONS",
        payload: shuffled.slice(0, 4),
      });
    }
  }, [selectedTheme]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (selectedTheme) refreshQuestions();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [selectedTheme, refreshQuestions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim()) {
      onSubmit(question);
    }
  };

  return (
    <Container maxW="container.xl" centerContent py={isMobile ? 5 : 10}>
      <MotionBox
        as="form"
        onSubmit={handleSubmit}
        width="100%"
        maxWidth="800px"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <VStack spacing={isMobile ? 4 : 8} align="stretch">
          <Flex alignItems="center" justifyContent="center">
            <Icon
              as={Sparkles}
              w={isMobile ? 6 : 8}
              h={isMobile ? 6 : 8}
              color={accent}
              mr={2}
            />
            <TypingText
              text="What would you like to know?"
              fontSize={{ base: "xl", md: "3xl" }}
              fontWeight="bold"
              color={accent}
              textAlign="center"
            />
          </Flex>
          <FormControl>
            <InputGroup size={isMobile ? "md" : "lg"}>
              <Input
                id="question"
                value={question}
                onChange={handleQuestionChange}
                placeholder="Enter your question..."
                bg={cardBg}
                color={text}
                borderColor={border}
                borderWidth={2}
                _hover={{ borderColor: accent }}
                _focus={{
                  borderColor: accent,
                  boxShadow: `0 0 0 1px ${accent}`,
                }}
                fontSize={isMobile ? "lg" : "xl"}
                height={isMobile ? "50px" : "60px"}
                pr="4.5rem"
              />
              <InputRightElement
                width="4.5rem"
                height={isMobile ? "50px" : "60px"}
              >
                {isMobile ? (
                  <IconButton
                    aria-label="How to ask a good question"
                    icon={<HelpCircle />}
                    size="sm"
                    colorScheme="purple"
                    variant="ghost"
                    onClick={onOpen}
                  />
                ) : (
                  <Tooltip
                    label={<GoodQuestionGuidelines />}
                    placement="top-end"
                    hasArrow
                  >
                    <IconButton
                      aria-label="How to ask a good question"
                      icon={<HelpCircle />}
                      size="sm"
                      colorScheme="purple"
                      variant="ghost"
                    />
                  </Tooltip>
                )}
              </InputRightElement>
            </InputGroup>
          </FormControl>
          <Button
            type="submit"
            colorScheme="purple"
            size={isMobile ? "md" : "lg"}
            height={isMobile ? "50px" : "60px"}
            width="full"
            fontSize={isMobile ? "lg" : "xl"}
            _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
            transition="all 0.2s"
            leftIcon={<Icon as={Sparkles} />}
          >
            Ask the Tarot
          </Button>

          {/* ThemeSelector */}
          <ThemeSelector
            selectedTheme={selectedTheme}
            displayedQuestions={displayedQuestions}
            isMobile={isMobile || false}
            cardBg={cardBg}
            accent={accent}
            text={text}
            hover={hover}
            onThemeChange={handleThemeChange}
            onQuestionSelect={handleQuestionSelect}
            onRefreshQuestions={refreshQuestions}
          />
        </VStack>
      </MotionBox>

      {/* Modal for mobile devices */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>How to Ask a Good Question</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <GoodQuestionGuidelines />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="purple" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default React.memo(QuestionForm);
