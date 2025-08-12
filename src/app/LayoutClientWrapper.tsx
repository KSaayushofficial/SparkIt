"use client";

import { ThemeProvider } from "@/components/theme-provider";
import dynamic from "next/dynamic";

const MusicComponent = dynamic(
  () => import("@/components/audio/MusicComponent"),
  { ssr: false, loading: () => null }
);

export function LayoutClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
      <MusicComponent />
    </ThemeProvider>
  );
}
