'use client';

import { QueryProvider } from "@/providers/query-provider";
import { NextIntlClientProvider } from "next-intl";

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
      <QueryProvider>
            {children}
      </QueryProvider>
    </NextIntlClientProvider>
  );
}
