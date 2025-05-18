import { createGlobalStyle } from 'styled-components';
import { ThemeType } from '@/helpers/themes';

export const GlobalStyle = createGlobalStyle<{ theme?: ThemeType }>`
  body {
      background-color: ${({ theme }) => theme.background};
  }
`;
