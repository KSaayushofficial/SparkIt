"use client";

import { motion } from "framer-motion";
import {
  Home,
  CheckSquare,
  Music,
  Dumbbell,
  Brain,
  ImageIcon,
  Sparkles,
} from "lucide-react";

interface VerticalSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const sidebarItems = [
  { id: "home", icon: Home, label: "Home", color: "from-blue-500 to-cyan-500" },
  {
    id: "todo",
    icon: CheckSquare,
    label: "To-Do",
    color: "from-green-500 to-emerald-500",
  },
  {
    id: "music",
    icon: Music,
    label: "Music",
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "fitness",
    icon: Dumbbell,
    label: "Fitness",
    color: "from-orange-500 to-red-500",
  },
  {
    id: "stress",
    icon: Brain,
    label: "Wellness",
    color: "from-teal-500 to-cyan-500",
  },
  {
    id: "background",
    icon: ImageIcon,
    label: "Background",
    color: "from-indigo-500 to-purple-500",
  },
  {
    id: "effects",
    icon: Sparkles,
    label: "Effects",
    color: "from-pink-500 to-rose-500",
  },
];

export default function VerticalSidebar({
  activeSection,
  setActiveSection,
}: VerticalSidebarProps) {
  return (
    <div className="w-20 flex flex-col items-center py-8 bg-black/20 backdrop-blur-md border-r border-white/10">
      <div className="space-y-4">
        {sidebarItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
            >
              <motion.button
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveSection(item.id)}
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  isActive
                    ? `bg-gradient-to-br ${item.color} shadow-lg shadow-${
                        item.color.split("-")[1]
                      }-500/25`
                    : "bg-white/10 hover:bg-white/20"
                }`}
              >
                <Icon
                  size={20}
                  className={isActive ? "text-white" : "text-white/70"}
                />
              </motion.button>

              {/* Tooltip */}
              <div className="absolute left-16 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                <div className="bg-black/80 backdrop-blur-sm text-white text-sm px-3 py-1 rounded-lg whitespace-nowrap">
                  {item.label}
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-black/80 rotate-45" />
                </div>
              </div>

              {/* Active Indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
