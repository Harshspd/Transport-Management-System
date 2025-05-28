import { Outfit } from 'next/font/google';
import './globals.css';

import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/middleware/AuthProvider';

const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
      <AuthProvider
          config={{
            backendType: process.env.NEXT_PUBLIC_AUTH_BACKEND as any || 'node',
            apiUrl: process.env.NEXT_PUBLIC_API_URL || '/api/auth',
          }}
        >
        <ThemeProvider>
          <SidebarProvider>{children}</SidebarProvider>
        </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
