// src/main.tsx
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

import router from './router';
import { RouterProvider } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import ThemeProviderWrapper from '@/components/ThemeProviderWrapper';
import './main.css';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProviderWrapper>
        <RouterProvider router={router} />
      </ThemeProviderWrapper>
    </QueryClientProvider>
  </StrictMode>
);