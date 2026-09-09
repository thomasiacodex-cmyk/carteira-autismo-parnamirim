"use client";

import { Toaster as SonnerToaster } from "sonner";
import { useTheme } from "next-themes";

export function Toaster() {
  const { theme } = useTheme();
  return (
    <SonnerToaster
      theme={theme as "light" | "dark" | "system"}
      richColors
      position="top-right"
      toastOptions={{
        style: {
          borderRadius: "0.75rem",
        },
      }}
    />
  );
}
