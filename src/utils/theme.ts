import { extendTheme } from '@chakra-ui/react';

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
  },
  styles: {
    global: (props: any) => ({
      body: {
        bg: props.colorMode === 'dark' ? 'gray.900' : 'gray.50',
        color: props.colorMode === 'dark' ? 'white' : 'gray.800',
      },
    }),
  },
});

export default theme;