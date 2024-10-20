import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  Input,
  VStack,
  Text,
  useColorModeValue,
  Flex,
  Tooltip,
  Icon,
  useBreakpointValue,
  List,
  ListItem,
  ListIcon,
  Container,
  SimpleGrid,
  IconButton,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import {
  Sparkles,
  CheckCircle,
  XCircle,
  RefreshCw,
  HelpCircle,
} from "lucide-react";
import { motion, useAnimation } from "framer-motion";

interface QuestionFormProps {
  onSubmit: (question: string) => void;
}

const MotionText = motion(Text);
const MotionBox = motion(Box);

const themes = [
  { emoji: "💼", name: "Career" },
  { emoji: "❤️", name: "Relationships" },
  { emoji: "🌱", name: "Personal Growth" },
  { emoji: "💰", name: "Finance" },
  { emoji: "🏡", name: "Home & Family" },
  { emoji: "🧘", name: "Spirituality" },
];

const questionsByTheme = {
  Career: [
    "🚀 What does my career path look like in the next six months?",
    "💼 How can I improve my leadership skills at work?",
    "🌟 What hidden talents should I leverage in my career?",
    "🎯 What steps should I take to achieve my professional goals?",
    "🤝 How can I build better relationships with my colleagues?",
    "📚 What new skills should I learn to advance in my field?",
  ],
  Relationships: [
    "❤️ How can I improve my current relationship?",
    "💕 What qualities should I look for in a potential partner?",
    "🗣️ How can I communicate better with my loved ones?",
    "🤗 What can I do to strengthen my friendships?",
    "💑 How can I maintain a healthy work-life balance?",
    "🚩 What red flags should I be aware of in my relationships?",
    "🛏️ When will I get laid?",
  ],
  "Personal Growth": [
    "🌱 What should I focus on for personal growth?",
    "🧠 How can I overcome my limiting beliefs?",
    "🏋️ What habits should I develop to improve my well-being?",
    "📚 What area of knowledge should I explore next?",
    "🎭 How can I become more authentic in my daily life?",
    "🧘 What practices can help me achieve inner peace?",
  ],
  Finance: [
    "💰 What energies surround my financial situation?",
    "💼 How can I increase my income in the next year?",
    "💳 What steps should I take to improve my financial stability?",
    "🏦 Is it a good time to make a major investment?",
    "📊 How can I better manage my expenses?",
    "🎯 What financial goals should I set for myself?",
  ],
  "Home & Family": [
    "🏡 Is it the right time to make a major life change?",
    "👨‍👩‍👧‍👦 How can I strengthen my family bonds?",
    "🏠 What can I do to create a more harmonious home environment?",
    "🌱 How can I support my children's growth and development?",
    "👵👴 How can I better care for my aging parents?",
    "🐾 Is it a good time to add a pet to our family?",
  ],
  Spirituality: [
    "🧘 What can I do to improve my spiritual well-being?",
    "🌟 How can I connect more deeply with my inner self?",
    "🙏 What spiritual practices would benefit me most?",
    "🌈 How can I align my actions with my spiritual beliefs?",
    "🕯️ What steps can I take to find more meaning in life?",
    "🌎 How can I contribute positively to the world around me?",
  ],
};

const QuestionForm: React.FC<QuestionFormProps> = ({ onSubmit }) => {
  const [question, setQuestion] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("");
  const [displayedQuestions, setDisplayedQuestions] = useState<string[]>([]);

  const borderColor = useColorModeValue("purple.200", "purple.500");
  const labelColor = useColorModeValue("purple.600", "purple.300");
  const inputBg = useColorModeValue("white", "gray.700");
  const inputColor = useColorModeValue("gray.800", "white");
  const exampleBg = useColorModeValue("purple.50", "gray.700");
  const iconColor = useColorModeValue("purple.500", "purple.300");
  const themeBg = useColorModeValue("purple.100", "gray.600");

  const controls = useAnimation();
  const motionBoxHoverBg = useColorModeValue("purple.100", "gray.600");

  useEffect(() => {
    controls.start({
      opacity: 1,
      transition: { duration: 1 },
    });
    controls.start((i) => ({
      opacity: 1,
      transition: { delay: i * 0.05 },
    }));
  }, [controls]);

  useEffect(() => {
    if (selectedTheme) {
      refreshQuestions();
    }
  }, [selectedTheme]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim()) {
      onSubmit(question);
    }
  };

  const refreshQuestions = () => {
    if (selectedTheme) {
      const allQuestions =
        questionsByTheme[selectedTheme as keyof typeof questionsByTheme];
      const shuffled = allQuestions.sort(() => 0.5 - Math.random());
      setDisplayedQuestions(shuffled.slice(0, 4));
    }
  };

  const goodQuestionGuidelines = (
    <Box p={4} borderRadius="lg">
      <Text fontSize="md" fontWeight="medium" mb={2}>
        How to Ask a Good Question:
      </Text>
      <List spacing={2} fontSize="sm">
        <ListItem>
          <ListIcon as={CheckCircle} color="green.500" />
          Be specific and focus on one topic
        </ListItem>
        <ListItem>
          <ListIcon as={CheckCircle} color="green.500" />
          Ask open-ended questions
        </ListItem>
        <ListItem>
          <ListIcon as={CheckCircle} color="green.500" />
          Frame positively, focus on what you can control
        </ListItem>
        <ListItem>
          <ListIcon as={XCircle} color="red.500" />
          Avoid repeating questions frequently
        </ListItem>
        <ListItem>
          <ListIcon as={XCircle} color="red.500" />
          Don't ask about others' private matters
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Container maxW="container.xl" centerContent py={10}>
      <MotionBox
        as="form"
        onSubmit={handleSubmit}
        width="100%"
        maxWidth="800px"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <VStack spacing={8} align="stretch">
          <Flex alignItems="center" justifyContent="center">
            <Icon as={Sparkles} w={8} h={8} color={iconColor} mr={3} />
            <MotionText
              fontSize={{ base: "2xl", md: "3xl" }}
              fontWeight="bold"
              color={labelColor}
              textAlign="center"
              initial={{ opacity: 0 }}
              animate={controls}
            >
              {"What would you like to know?".split("").map((char, index) => (
                <motion.span
                  key={index}
                  custom={index}
                  initial={{ opacity: 0 }}
                  animate={controls}
                >
                  {char}
                </motion.span>
              ))}
            </MotionText>
          </Flex>
          <FormControl>
            <InputGroup size="lg">
              <Input
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Enter your question..."
                bg={inputBg}
                color={inputColor}
                borderColor={borderColor}
                borderWidth={2}
                _hover={{ borderColor: "purple.400" }}
                _focus={{
                  borderColor: "purple.500",
                  boxShadow: "0 0 0 1px purple.500",
                }}
                fontSize="xl"
                height="60px"
                pr="4.5rem"
              />
              <InputRightElement width="4.5rem" height="60px">
                <Tooltip
                  label={goodQuestionGuidelines}
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
              </InputRightElement>
            </InputGroup>
          </FormControl>
          <Button
            type="submit"
            colorScheme="purple"
            size="lg"
            height="60px"
            width="full"
            fontSize="xl"
            _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
            transition="all 0.2s"
            leftIcon={<Icon as={Sparkles} />}
          >
            Ask the Tarot
          </Button>
          <Box>
            <Text
              fontSize={{ base: "lg", md: "xl" }}
              fontWeight="medium"
              mb={4}
              color={labelColor}
              textAlign="center"
            >
              Select a theme for example questions:
            </Text>
            <SimpleGrid columns={{ base: 2, md: 3 }} spacing={4}>
              {themes.map((theme) => (
                <Button
                  key={theme.name}
                  onClick={() => setSelectedTheme(theme.name)}
                  bg={selectedTheme === theme.name ? themeBg : "transparent"}
                  _hover={{ bg: themeBg }}
                  leftIcon={<Text fontSize="2xl">{theme.emoji}</Text>}
                >
                  {theme.name}
                </Button>
              ))}
            </SimpleGrid>
          </Box>
          {selectedTheme && (
            <Box>
              <Flex justifyContent="space-between" alignItems="center" mb={4}>
                <Text
                  fontSize={{ base: "lg", md: "xl" }}
                  fontWeight="medium"
                  color={labelColor}
                >
                  Example questions for {selectedTheme}:
                </Text>
                <IconButton
                  aria-label="Refresh questions"
                  icon={<RefreshCw />}
                  onClick={refreshQuestions}
                  size="sm"
                  colorScheme="purple"
                />
              </Flex>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                {displayedQuestions.map((q, index) => (
                  <MotionBox
                    key={index}
                    bg={exampleBg}
                    p={4}
                    borderRadius="md"
                    cursor="pointer"
                    onClick={() => setQuestion(q)}
                    _hover={{ bg: motionBoxHoverBg }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Text fontSize={{ base: "md", md: "lg" }}>{q}</Text>
                  </MotionBox>
                ))}
              </SimpleGrid>
            </Box>
          )}
        </VStack>
      </MotionBox>
    </Container>
  );
};

export default QuestionForm;
