"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { Palette, Sun, Moon, Monitor } from "lucide-react";
import GlassPanel from "@/components/ui/GlassPanel";

const themes = [
  {
    name: "dark",
    label: "Dark",
    icon: Moon,
    gradient: "from-slate-800 to-slate-900",
  },
  {
    name: "light",
    label: "Light",
    icon: Sun,
    gradient: "from-white to-gray-100",
  },
  {
    name: "system",
    label: "System",
    icon: Monitor,
    gradient: "from-blue-500 to-purple-500",
  },
];

export default function ThemeSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
      >
        <Palette size={20} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -10 }}
            className="absolute top-full right-0 mt-2 z-50"
          >
            <GlassPanel className="p-4 min-w-[200px]">
              <h3 className="text-white font-medium mb-3">Choose Theme</h3>
              <div className="space-y-2">
                {themes.map((themeOption) => (
                  <motion.button
                    key={themeOption.name}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setTheme(themeOption.name);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                      theme === themeOption.name
                        ? "bg-white/20 border border-white/30"
                        : "hover:bg-white/10"
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg bg-gradient-to-r ${themeOption.gradient}`}
                    >
                      <themeOption.icon size={16} className="text-white" />
                    </div>
                    <span className="text-white text-sm">
                      {themeOption.label}
                    </span>
                  </motion.button>
                ))}
              </div>
            </GlassPanel>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
