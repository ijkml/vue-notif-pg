import { defineConfig } from 'windicss/helpers';

export default defineConfig({
  darkMode: 'class',
  shortcuts: {},
  theme: {
    extend: {
      borderRadius: {
        inherit: 'inherit',
      },
      colors: {
        skye: {
          surface: '#E5F9FF',
          lightest: '#B7E1ED',
          lighter: '#95CDDE',
          light: '#71A2B0',
          DEFAULT: '#497A87',
          dark: '#255461',
          darker: '#003543',
          darkest: '#012A35',
          black: '#001E26',
        },
      },
    },
  },
});
