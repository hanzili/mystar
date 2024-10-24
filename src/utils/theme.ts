import { extendTheme, useColorModeValue } from '@chakra-ui/react';

const theme = extendTheme({
  config: {
    initialColorMode: 'system',
    useSystemColorMode: true,
  },
  colors: {
    brand: {
      50: '#f5e9ff',
      100: '#dac1ff',
      200: '#c098ff',
      300: '#a56eff',
      400: '#8b45ff',
      500: '#721bff',
      600: '#5a00e6',
      700: '#4400b3',
      800: '#2e0080',
      900: '#19004d',
    },
    // Global colors
    global: {
      bg: {
        light: 'gray.50',
        dark: 'gray.900',
      },
      text: {
        light: 'gray.800',
        dark: 'white',
      },
      accent: {
        light: 'purple.500',
        dark: 'purple.300',
      },
      border: {
        light: 'purple.200',
        dark: 'purple.500',
      },
      hover: {
        light: 'purple.100',
        dark: 'purple.600',
      },
      loginBg: {
        light: 'purple.50',
        dark: 'gray.900',
      },
      loginHeading: {
        light: 'purple.600',
        dark: 'purple.300',
      },
      loginButton: {
        bg: {
          light: 'purple.500',
          dark: 'purple.400',
        },
        hover: {
          light: 'purple.600',
          dark: 'purple.500',
        },
      },
      loadingOverlay: {
        light: 'rgba(0, 0, 0, 0.7)',
        dark: 'rgba(255, 255, 255, 0.1)',
      },
      loadingText: {
        light: 'yellow.300',
        dark: 'yellow.200',
      },
    },
    // Component-specific colors
    components: {
      card: {
        bg: {
          light: 'white',
          dark: 'gray.700',
        },
      },
      prediction: {
        bg: {
          light: 'purple.50',
          dark: 'gray.800',
        },
      },
      summary: {
        bg: {
          light: 'purple.50',
          dark: 'purple.900',
        },
      },
      badge: {
        bg: {
          light: 'purple.100',
          dark: 'purple.700',
        },
        text: {
          light: 'purple.800',
          dark: 'purple.100',
        },
      },
      chat: {
        bg: {
          light: 'white',
          dark: 'gray.800',
        },
        aiMessage: {
          bg: {
            light: 'gray.100',
            dark: 'gray.700',
          },
        },
        userMessage: {
          bg: {
            light: 'purple.100',
            dark: 'purple.700',
          },
        },
      },
    },
  },
});

export const useCommonColors = () => {
  return {
    // Global colors
    bg: useColorModeValue(theme.colors.global.bg.light, theme.colors.global.bg.dark),
    text: useColorModeValue(theme.colors.global.text.light, theme.colors.global.text.dark),
    accent: useColorModeValue(theme.colors.global.accent.light, theme.colors.global.accent.dark),
    border: useColorModeValue(theme.colors.global.border.light, theme.colors.global.border.dark),
    hover: useColorModeValue(theme.colors.global.hover.light, theme.colors.global.hover.dark),
    loginBg: useColorModeValue(theme.colors.global.loginBg.light, theme.colors.global.loginBg.dark),
    loginHeading: useColorModeValue(theme.colors.global.loginHeading.light, theme.colors.global.loginHeading.dark),
    loginButtonBg: useColorModeValue(theme.colors.global.loginButton.bg.light, theme.colors.global.loginButton.bg.dark),
    loginButtonHoverBg: useColorModeValue(theme.colors.global.loginButton.hover.light, theme.colors.global.loginButton.hover.dark),
    loadingOverlay: useColorModeValue(theme.colors.global.loadingOverlay.light, theme.colors.global.loadingOverlay.dark),
    loadingText: useColorModeValue(theme.colors.global.loadingText.light, theme.colors.global.loadingText.dark),

    // Component-specific colors
    cardBg: useColorModeValue(theme.colors.components.card.bg.light, theme.colors.components.card.bg.dark),
    predictionBg: useColorModeValue(theme.colors.components.prediction.bg.light, theme.colors.components.prediction.bg.dark),
    summaryBg: useColorModeValue(theme.colors.components.summary.bg.light, theme.colors.components.summary.bg.dark),
    badgeBg: useColorModeValue(theme.colors.components.badge.bg.light, theme.colors.components.badge.bg.dark),
    badgeText: useColorModeValue(theme.colors.components.badge.text.light, theme.colors.components.badge.text.dark),
    chatBg: useColorModeValue(theme.colors.components.chat.bg.light, theme.colors.components.chat.bg.dark),
    aiMessageBg: useColorModeValue(theme.colors.components.chat.aiMessage.bg.light, theme.colors.components.chat.aiMessage.bg.dark),
    userMessageBg: useColorModeValue(theme.colors.components.chat.userMessage.bg.light, theme.colors.components.chat.userMessage.bg.dark),
  };
};

export default theme;
