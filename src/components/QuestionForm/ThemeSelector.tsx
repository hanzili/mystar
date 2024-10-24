import React from "react";
import {
  Box,
  Button,
  Flex,
  IconButton,
  SimpleGrid,
  Select,
  Text,
} from "@chakra-ui/react";
import { RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { themes } from "./themeData";

interface ThemeSelectorProps {
  selectedTheme: string;
  displayedQuestions: string[];
  isMobile: boolean;
  cardBg: string;
  accent: string;
  text: string;
  hover: string;
  onThemeChange: (theme: string) => void;
  onQuestionSelect: (question: string) => void;
  onRefreshQuestions: () => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  selectedTheme,
  displayedQuestions,
  isMobile,
  cardBg,
  accent,
  text,
  hover,
  onThemeChange,
  onQuestionSelect,
  onRefreshQuestions,
}) => {
  return (
    <Box>
      <Text
        fontSize={{ base: "md", md: "xl" }}
        fontWeight="medium"
        mb={isMobile ? 2 : 4}
        color={accent}
        textAlign="center"
      >
        Select a theme for example questions:
      </Text>
      {isMobile ? (
        <Select
          placeholder="Choose a theme"
          onChange={(e) => onThemeChange(e.target.value)}
          value={selectedTheme}
        >
          {themes.map((theme) => (
            <option key={theme.name} value={theme.name}>
              {theme.emoji} {theme.name}
            </option>
          ))}
        </Select>
      ) : (
        <SimpleGrid columns={{ base: 2, md: 3 }} spacing={4}>
          {themes.map((theme) => (
            <Button
              key={theme.name}
              onClick={() => onThemeChange(theme.name)}
              bg={selectedTheme === theme.name ? cardBg : "transparent"}
              _hover={{ bg: hover }}
              leftIcon={<Text fontSize="2xl">{theme.emoji}</Text>}
            >
              {theme.name}
            </Button>
          ))}
        </SimpleGrid>
      )}

      {selectedTheme && (
        <Box mt={4}>
          <Flex
            justifyContent="space-between"
            alignItems="center"
            mb={isMobile ? 2 : 4}
          >
            <Text
              fontSize={{ base: "md", md: "xl" }}
              fontWeight="medium"
              color={accent}
            >
              Example questions for {selectedTheme}:
            </Text>
            <IconButton
              aria-label="Refresh questions"
              icon={<RefreshCw />}
              onClick={onRefreshQuestions}
              size="sm"
              colorScheme="purple"
            />
          </Flex>
          <SimpleGrid columns={1} spacing={isMobile ? 2 : 4}>
            {displayedQuestions.map((q, index) => (
              <Box
                as={motion.div}
                key={index}
                bg={cardBg}
                p={3}
                borderRadius="md"
                cursor="pointer"
                onClick={() => onQuestionSelect(q)}
                _hover={{ bg: hover }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Text fontSize={{ base: "sm", md: "lg" }} color={text}>
                  {q}
                </Text>
              </Box>
            ))}
          </SimpleGrid>
        </Box>
      )}
    </Box>
  );
};
