'use client';

import { SessionProvider } from 'next-auth/react';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { store } from '@/store/store';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <Provider store={store}>
        <ThemeProvider>{children}</ThemeProvider>
      </Provider>
    </SessionProvider>
  );
}
