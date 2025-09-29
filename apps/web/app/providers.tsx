"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";

export default function SessionProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      {children}
      <Toaster duration={4000} theme="dark" richColors />
    </SessionProvider>
  );
}
