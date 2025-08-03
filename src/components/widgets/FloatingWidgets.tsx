"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music, Timer, Calendar, Cloud, Quote, Settings } from "lucide-react";

export default function FloatingWidgets() {
  const [isExpanded, setIsExpanded] = useState(false);

  const widgets = [
    { icon: Music, label: "Music", color: "from-purple-500 to-pink-500" },
    { icon: Timer, label: "Timer", color: "from-blue-500 to-cyan-500" },
    { icon: Calendar, label: "Calendar", color: "from-green-500 to-teal-500" },
    { icon: Cloud, label: "Weather", color: "from-orange-500 to-red-500" },
    { icon: Quote, label: "Quotes", color: "from-indigo-500 to-purple-500" },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute bottom-16 right-0 space-y-3"
          >
            {widgets.map((widget, index) => (
              <motion.button
                key={widget.label}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.1, x: -10 }}
                className={`flex items-center gap-3 bg-gradient-to-r ${widget.color} p-3 rounded-full shadow-lg backdrop-blur-xl`}
              >
                <widget.icon size={20} className="text-white" />
                <span className="text-white text-sm font-medium pr-2">
                  {widget.label}
                </span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsExpanded(!isExpanded)}
        className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-full shadow-lg backdrop-blur-xl"
      >
        <motion.div
          animate={{ rotate: isExpanded ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <Settings size={24} className="text-white" />
        </motion.div>
      </motion.button>
    </div>
  );
}
