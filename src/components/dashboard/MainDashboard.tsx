"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Music,
  Dumbbell,
  Brain,
  CheckSquare,
  Palette,
  Sparkles,
} from "lucide-react";
import HomeSection from "./sections/HomeSection";
import TodoSection from "./sections/TodoSection";
import MusicSection from "./sections/MusicSection";
import FitnessSection from "./sections/FitnessSection";
import StressSection from "./sections/StressSection";
import BackgroundSection from "./sections/BackgroundSection";
import EffectsSection from "./sections/EffectsSection";
import VerticalSidebar from "./VerticalSidebar";
import type { Todo } from "./types";

export default function MainDashboard() {
  const [activeSection, setActiveSection] = useState("home");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);

  // Load saved data
  useEffect(() => {
    const savedTodos = localStorage.getItem("todos");
    if (savedTodos) setTodos(JSON.parse(savedTodos));
  }, []);

  // Save todos
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addNotification = (notification: any) => {
    const newNotification = { ...notification, id: Date.now().toString() };
    setNotifications((prev) => [...prev, newNotification]);
    setTimeout(() => {
      setNotifications((prev) =>
        prev.filter((n) => n.id !== newNotification.id)
      );
    }, 5000);
  };

  const sidebarItems = [
    {
      id: "home",
      icon: Home,
      label: "Home",
      color: "from-blue-500 to-cyan-500",
    },
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
      icon: Palette,
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

  const renderActiveSection = () => {
    switch (activeSection) {
      case "home":
        return <HomeSection todos={todos} onNotification={addNotification} />;
      case "todo":
        return (
          <TodoSection
            todos={todos}
            setTodos={setTodos}
            onNotification={addNotification}
          />
        );
      case "music":
        return <MusicSection onNotification={addNotification} />;
      case "fitness":
        return <FitnessSection onNotification={addNotification} />;
      case "stress":
        return <StressSection onNotification={addNotification} />;
      case "background":
        return <BackgroundSection onNotification={addNotification} />;
      case "effects":
        return <EffectsSection onNotification={addNotification} />;
      default:
        return <HomeSection todos={todos} onNotification={addNotification} />;
    }
  };

  return (
    <div className="min-h-screen flex relative z-10">
      {/* Vertical Sidebar */}
      <VerticalSidebar
        items={sidebarItems}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {/* Main Content */}
      <div className="flex-1 ml-20 p-6 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {renderActiveSection()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-3">
        <AnimatePresence>
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 300, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 300, scale: 0.8 }}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4 max-w-sm"
            >
              <div className="text-white font-medium">{notification.title}</div>
              <div className="text-white/70 text-sm mt-1">
                {notification.message}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
