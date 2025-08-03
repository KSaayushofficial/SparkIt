"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import TodoManager from "./TodoManager";
import ThemeSelector from "./ThemeSelector";
import StatsPanel from "./StatsPanel";
import ProgressRing from "./ProgressRing";
import FloatingTimer from "./FloatingTimer";
import NotificationSystem from "./NotificationSystem";
import DraggablePanel from "./DraggablePanel";
import type { Todo } from "./types";

export default function EnhancedTodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const { theme } = useTheme();

  // Request notification permission
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  const addNotification = (notification: any) => {
    setNotifications((prev) => [...prev, { ...notification, id: Date.now() }]);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const completedTodos = todos.filter((todo) => todo.completed).length;
  const totalTodos = todos.length;
  const completionRate =
    totalTodos > 0 ? (completedTodos / totalTodos) * 100 : 0;

  return (
    <div className="min-h-screen p-4 relative">
      {/* Header */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            TaskFlow Pro
          </h1>
          <p className="text-white/70 mt-1">Advanced productivity workspace</p>
        </div>
        <ThemeSelector />
      </motion.header>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-12 gap-4 h-[calc(100vh-120px)]">
        {/* Left Column - Todo Manager */}
        <div className="col-span-12 lg:col-span-7 xl:col-span-8">
          <TodoManager
            todos={todos}
            setTodos={setTodos}
            onNotification={addNotification}
          />
        </div>

        {/* Right Column - Stats and Controls */}
        <div className="col-span-12 lg:col-span-5 xl:col-span-4 space-y-4">
          {/* Progress Ring */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <ProgressRing
              progress={completionRate}
              completed={completedTodos}
              total={totalTodos}
            />
          </motion.div>

          {/* Stats Panel */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <StatsPanel todos={todos} />
          </motion.div>
        </div>
      </div>

      {/* Floating Components */}
      <DraggablePanel initialPosition={{ x: 20, y: 200 }}>
        <FloatingTimer />
      </DraggablePanel>

      {/* Notification System */}
      <NotificationSystem
        notifications={notifications}
        onRemove={removeNotification}
      />
    </div>
  );
}
