"use client";

import type React from "react";

import { cn } from "@/lib/utils";

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}

export default function GlassPanel({
  children,
  className,
  glow = false,
}: GlassPanelProps) {
  return (
    <div
      className={cn(
        "backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl",
        glow && "shadow-2xl shadow-purple-500/20",
        className
      )}
    >
      {children}
    </div>
  );
}
