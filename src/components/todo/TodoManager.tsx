"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Clock, Bell, Play, Pause, Trash2, Check } from "lucide-react";
import GlassPanel from "@/components/ui/GlassPanel";
import type { Todo } from "./types";

interface NotificationPayload {
  title: string;
  message: string;
  type: "alarm" | "info" | "success" | string;
}

interface TodoManagerProps {
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
  onNotification: (notification: NotificationPayload) => void;
}

export default function TodoManager({
  todos,
  setTodos,
  onNotification,
}: TodoManagerProps) {
  const [newTodo, setNewTodo] = useState("");
  const [newPriority, setNewPriority] = useState<"low" | "medium" | "high">(
    "medium"
  );
  const [newCategory, setNewCategory] = useState("Personal");

  // Use ReturnType<typeof setInterval> for timers
  const [timers, setTimers] = useState<
    Record<string, ReturnType<typeof setInterval>>
  >({});

  const categories = ["Personal", "Work", "Health", "Learning", "Shopping"];
  const priorityColors = {
    low: "from-green-500 to-emerald-500",
    medium: "from-yellow-500 to-orange-500",
    high: "from-red-500 to-pink-500",
  };

  const triggerAlarm = useCallback(
    (todo: Todo) => {
      if (
        typeof window !== "undefined" &&
        Notification.permission === "granted"
      ) {
        new Notification(`Task Reminder: ${todo.text}`, {
          body: `It's time to work on your ${todo.priority} priority task!`,
          icon: "/favicon.ico",
        });
      }

      const audio = new Audio("/notification.mp3");
      audio.play().catch(() => {
        /* ignore play errors */
      });

      onNotification({
        title: "Task Reminder",
        message: `Time to work on: ${todo.text}`,
        type: "alarm",
      });
    },
    [onNotification]
  );

  // Wrap checkAlarms in useCallback so we can add it as a dependency in useEffect
  const checkAlarms = useCallback(() => {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;

    todos.forEach((todo) => {
      if (todo.hasAlarm && todo.alarmTime === currentTime && !todo.completed) {
        triggerAlarm(todo);
      }
    });
  }, [todos, triggerAlarm]);

  useEffect(() => {
    const interval = setInterval(checkAlarms, 60000);
    return () => clearInterval(interval);
  }, [checkAlarms]);

  const addTodo = () => {
    if (newTodo.trim()) {
      const todo: Todo = {
        id: Date.now().toString(),
        text: newTodo,
        completed: false,
        createdAt: new Date(),
        priority: newPriority,
        category: newCategory,
        timer: 0,
        isTimerRunning: false,
        tags: [],
      };
      setTodos([...todos, todo]);
      setNewTodo("");
    }
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              completed: !todo.completed,
              completedAt: !todo.completed ? new Date() : undefined,
            }
          : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
    if (timers[id]) {
      clearInterval(timers[id]);
      setTimers((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    }
  };

  const toggleTimer = (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    if (todo.isTimerRunning) {
      if (timers[id]) {
        clearInterval(timers[id]);
        setTimers((prev) => {
          const copy = { ...prev };
          delete copy[id];
          return copy;
        });
      }
      setTodos(
        todos.map((t) => (t.id === id ? { ...t, isTimerRunning: false } : t))
      );
    } else {
      const interval = setInterval(() => {
        setTodos(
          todos.map((t) =>
            t.id === id ? { ...t, timer: (t.timer ?? 0) + 1 } : t
          )
        );
      }, 1000);

      setTimers({ ...timers, [id]: interval });
      setTodos(
        todos.map((t) => (t.id === id ? { ...t, isTimerRunning: true } : t))
      );
    }
  };

  const setAlarm = (id: string, time: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, alarmTime: time, hasAlarm: !!time } : todo
      )
    );
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const activeTodos = todos.filter((t) => !t.completed);
  const completedTodos = todos.filter((t) => t.completed);

  return (
    <GlassPanel className="p-6 h-full flex flex-col" glow>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Tasks</h2>
        <div className="flex items-center gap-4 text-sm text-white/70">
          <span>{activeTodos.length} active</span>
          <span>{completedTodos.length} completed</span>
        </div>
      </div>

      {/* Add Todo Form */}
      <div className="mb-6 space-y-4">
        <div className="flex gap-3">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addTodo()}
            placeholder="Add a new task..."
            className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={addTodo}
            className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl text-white hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
          >
            <Plus size={20} />
          </motion.button>
        </div>

        <div className="flex gap-3">
          <select
            value={newPriority}
            onChange={(e) =>
              setNewPriority(e.target.value as "low" | "medium" | "high")
            }
            className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>

          <select
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Todo List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3">
        <AnimatePresence>
          {activeTodos.map((todo) => (
            <motion.div
              key={todo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300"
            >
              <div className="flex items-start gap-3">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => toggleTodo(todo.id)}
                  className="w-6 h-6 rounded-full border-2 border-white/30 hover:border-purple-400 flex items-center justify-center transition-all duration-300 mt-1"
                >
                  {todo.completed && <Check size={14} className="text-white" />}
                </motion.button>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">{todo.text}</span>
                    <div
                      className={`px-2 py-1 rounded-full text-xs bg-gradient-to-r ${
                        priorityColors[todo.priority]
                      } text-white`}
                    >
                      {todo.priority}
                    </div>
                    <div className="px-2 py-1 rounded-full text-xs bg-white/10 text-white/70">
                      {todo.category}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm">
                    {/* Timer */}
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-white/70" />
                      <span className="text-white/70">
                        {formatTime(todo.timer || 0)}
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => toggleTimer(todo.id)}
                        className="p-1 rounded hover:bg-white/10 transition-colors"
                      >
                        {todo.isTimerRunning ? (
                          <Pause size={14} className="text-orange-400" />
                        ) : (
                          <Play size={14} className="text-green-400" />
                        )}
                      </motion.button>
                    </div>

                    {/* Alarm */}
                    <div className="flex items-center gap-2">
                      <Bell
                        size={14}
                        className={
                          todo.hasAlarm ? "text-yellow-400" : "text-white/70"
                        }
                      />
                      <input
                        type="time"
                        value={todo.alarmTime || ""}
                        onChange={(e) => setAlarm(todo.id, e.target.value)}
                        className="bg-white/10 border border-white/20 rounded px-2 py-1 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500/50"
                      />
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => deleteTodo(todo.id)}
                  className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors"
                >
                  <Trash2 size={16} />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Completed Tasks */}
        {completedTodos.length > 0 && (
          <div className="mt-6 pt-6 border-t border-white/10">
            <h3 className="text-white/70 text-sm font-medium mb-3">
              Completed ({completedTodos.length})
            </h3>
            <div className="space-y-2">
              {completedTodos.slice(0, 3).map((todo) => (
                <motion.div
                  key={todo.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-3 p-3 bg-white/5 rounded-lg"
                >
                  <Check size={16} className="text-green-400" />
                  <span className="text-white/60 line-through text-sm">
                    {todo.text}
                  </span>
                  <div className="ml-auto text-xs text-white/40">
                    {todo.completedAt?.toLocaleTimeString()}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </GlassPanel>
  );
}
