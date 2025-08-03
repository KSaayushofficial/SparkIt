"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface DraggablePanelProps {
  children: ReactNode;
  initialPosition: { x: number; y: number };
}

export default function DraggablePanel({
  children,
  initialPosition,
}: DraggablePanelProps) {
  return (
    <motion.div
      drag
      dragMomentum={false}
      initial={initialPosition}
      whileDrag={{ scale: 1.05, rotate: 5 }}
      className="fixed z-40 cursor-move"
      dragConstraints={{
        top: 0,
        left: 0,
        right: window.innerWidth - 200,
        bottom: window.innerHeight - 200,
      }}
    >
      {children}
    </motion.div>
  );
}
