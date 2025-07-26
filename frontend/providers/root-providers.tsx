'use client';

import { QueryProvider } from "@/providers/query-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { NextIntlClientProvider } from "next-intl";
import { Toaster } from "sonner";
import { ThemeProvider } from "./theme-provider";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function Providers({
  children,
  locale,
  messages,
}: {
  children: React.ReactNode;
  locale: string;
  messages: Record<string, Record<string, string>>;
}) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        <QueryProvider>
          <AuthProvider>
            <ProtectedRoute>
              {children}
            </ProtectedRoute>
            <Toaster richColors position="top-right" />
          </AuthProvider>
        </QueryProvider>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
