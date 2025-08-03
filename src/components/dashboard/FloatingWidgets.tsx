"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Grip } from "lucide-react";
import NotesWidget from "./NotesWidget";
import type { Note } from "./types";

interface FloatingWidgetsProps {
  notes: Note[];
  setNotes: (notes: Note[]) => void;
}

export default function FloatingWidgets({
  notes,
  setNotes,
}: FloatingWidgetsProps) {
  const [widgets, setWidgets] = useState([
    {
      id: "notes",
      component: "notes",
      position: { x: 100, y: 200 },
      visible: true,
    },
  ]);

  return (
    <>
      {widgets.map((widget) => (
        <motion.div
          key={widget.id}
          drag
          dragMomentum={false}
          initial={widget.position}
          whileDrag={{ scale: 1.05, rotate: 2, zIndex: 1000 }}
          dragConstraints={{
            top: 0,
            left: 0,
            right: window.innerWidth - 320,
            bottom: window.innerHeight - 400,
          }}
          className="fixed z-40"
        >
          <div className="relative">
            <div className="absolute -top-2 -right-2 cursor-move">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="p-1 rounded-full bg-white/10 backdrop-blur-sm"
              >
                <Grip size={12} className="text-white/70" />
              </motion.div>
            </div>
            {widget.component === "notes" && (
              <NotesWidget notes={notes} setNotes={setNotes} />
            )}
          </div>
        </motion.div>
      ))}
    </>
  );
}
