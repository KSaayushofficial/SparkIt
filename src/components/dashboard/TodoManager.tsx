"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Clock,
  Bell,
  Play,
  Pause,
  Trash2,
  Check,
  Tag,
  Filter,
  Volume2,
} from "lucide-react";
import GlassPanel from "@/components/ui/GlassPanel";
import type { Todo } from "./types";

interface TodoManagerProps {
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
  onNotification: (notification: any) => void;
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
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [timers, setTimers] = useState<{ [key: string]: NodeJS.Timeout }>({});
  const [alarmAudio] = useState(new Audio("/notification.mp3"));
  const alarmIntervalRef = useRef<{ [key: string]: NodeJS.Timeout }>({});

  const categories = [
    "Personal",
    "Work",
    "Health",
    "Learning",
    "Shopping",
    "Finance",
  ];
  const priorityColors = {
    low: "from-green-500 to-emerald-500",
    medium: "from-yellow-500 to-orange-500",
    high: "from-red-500 to-pink-500",
  };

  useEffect(() => {
    const interval = setInterval(checkAlarms, 1000); // Check every second for more precision
    return () => clearInterval(interval);
  }, [todos]);

  const checkAlarms = () => {
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
  };

  const triggerAlarm = (todo: Todo) => {
    // Enhanced visual alarm with pulsing effect
    const alarmElement = document.getElementById(`todo-${todo.id}`);
    if (alarmElement) {
      alarmElement.classList.add("animate-pulse-glow", "neon-red");
      setTimeout(() => {
        alarmElement.classList.remove("animate-pulse-glow", "neon-red");
      }, 10000); // Pulse for 10 seconds
    }

    // Enhanced audio alarm - play multiple times
    const playAlarmSound = () => {
      alarmAudio.currentTime = 0;
      alarmAudio.play().catch(() => {});
    };

    playAlarmSound();
    const alarmInterval = setInterval(playAlarmSound, 2000); // Play every 2 seconds
    alarmIntervalRef.current[todo.id] = alarmInterval;

    // Stop alarm after 30 seconds
    setTimeout(() => {
      clearInterval(alarmIntervalRef.current[todo.id]);
      delete alarmIntervalRef.current[todo.id];
    }, 30000);

    // Browser notification
    if (Notification.permission === "granted") {
      const notification = new Notification(`🔔 Task Reminder: ${todo.text}`, {
        body: `It's time to work on your ${todo.priority} priority task!`,
        icon: "/favicon.ico",
        requireInteraction: true,
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    }

    // App notification
    onNotification({
      title: "🚨 Task Alarm!",
      message: `Time to work on: ${todo.text}`,
      type: "alarm",
    });

    // Create floating alarm indicator
    createFloatingAlarm(todo);
  };

  const createFloatingAlarm = (todo: Todo) => {
    const floatingAlarm = document.createElement("div");
    floatingAlarm.className =
      "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-red-500 text-white p-4 rounded-lg shadow-2xl animate-bounce";
    floatingAlarm.innerHTML = `
      <div class="text-center">
        <div class="text-2xl mb-2">🔔</div>
        <div class="font-bold">ALARM!</div>
        <div class="text-sm">${todo.text}</div>
        <button onclick="this.parentElement.parentElement.remove()" class="mt-2 bg-white text-red-500 px-3 py-1 rounded text-sm">
          Dismiss
        </button>
      </div>
    `;
    document.body.appendChild(floatingAlarm);

    setTimeout(() => {
      if (floatingAlarm.parentElement) {
        floatingAlarm.remove();
      }
    }, 15000);
  };

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

    // Stop alarm if task is completed
    if (alarmIntervalRef.current[id]) {
      clearInterval(alarmIntervalRef.current[id]);
      delete alarmIntervalRef.current[id];
    }
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
    if (timers[id]) {
      clearInterval(timers[id]);
      delete timers[id];
    }
    if (alarmIntervalRef.current[id]) {
      clearInterval(alarmIntervalRef.current[id]);
      delete alarmIntervalRef.current[id];
    }
  };

  const toggleTimer = (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    if (todo.isTimerRunning) {
      if (timers[id]) {
        clearInterval(timers[id]);
        delete timers[id];
      }
      setTodos(
        todos.map((t) => (t.id === id ? { ...t, isTimerRunning: false } : t))
      );
    } else {
      const interval = setInterval(() => {
      setTodos((prevTodos: Todo[]) =>
  prevTodos.map((t) =>
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

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  return (
    <GlassPanel className="p-6 h-full flex flex-col" glow>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Tasks</h2>
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() =>
              setFilter(
                filter === "all"
                  ? "active"
                  : filter === "active"
                  ? "completed"
                  : "all"
              )
            }
            className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all duration-300"
          >
            <Filter size={16} />
          </motion.button>
          <div className="text-sm text-white/70">
            {filteredTodos.filter((t) => !t.completed).length} active
          </div>
        </div>
      </div>

      {/* Add Todo Form */}
      <div className="mb-6 space-y-3">
        <div className="flex gap-3">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addTodo()}
            placeholder="Add a new task..."
            className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent backdrop-blur-sm"
          />
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)",
            }}
            whileTap={{ scale: 0.95 }}
            onClick={addTodo}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-xl text-white hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
          >
            <Plus size={20} />
          </motion.button>
        </div>

        <div className="flex gap-3">
          <select
            value={newPriority}
            onChange={(e) => setNewPriority(e.target.value as any)}
            className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 backdrop-blur-sm"
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>

          <select
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 backdrop-blur-sm"
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
          {filteredTodos.map((todo) => (
            <motion.div
              key={todo.id}
              id={`todo-${todo.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              whileHover={{
                scale: 1.02,
                boxShadow: "0 0 20px rgba(255, 255, 255, 0.1)",
              }}
              className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
            >
              <div className="flex items-start gap-3">
                <motion.button
                  whileHover={{
                    scale: 1.2,
                    boxShadow: "0 0 10px rgba(59, 130, 246, 0.5)",
                  }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => toggleTodo(todo.id)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 mt-1 ${
                    todo.completed
                      ? "bg-green-500 border-green-500 shadow-lg shadow-green-500/25"
                      : "border-white/30 hover:border-blue-400"
                  }`}
                >
                  {todo.completed && <Check size={14} className="text-white" />}
                </motion.button>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-white font-medium ${
                        todo.completed ? "line-through opacity-60" : ""
                      }`}
                    >
                      {todo.text}
                    </span>
                    <div
                      className={`px-2 py-1 rounded-full text-xs bg-gradient-to-r ${
                        priorityColors[todo.priority]
                      } text-white shadow-lg`}
                    >
                      {todo.priority}
                    </div>
                    <div className="px-2 py-1 rounded-full text-xs bg-white/10 text-white/70 backdrop-blur-sm">
                      <Tag size={10} className="inline mr-1" />
                      {todo.category}
                    </div>
                    {todo.hasAlarm && (
                      <div className="px-2 py-1 rounded-full text-xs bg-yellow-500/20 text-yellow-400 backdrop-blur-sm flex items-center gap-1">
                        <Volume2 size={10} />
                        Alarm Set
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-sm">
                    {/* Timer */}
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-white/70" />
                      <span className="text-white/70">
                        {formatTime(todo.timer || 0)}
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.2 }}
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

                    {/* Enhanced Alarm */}
                    <div className="flex items-center gap-2">
                      <Bell
                        size={14}
                        className={
                          todo.hasAlarm
                            ? "text-yellow-400 animate-pulse"
                            : "text-white/70"
                        }
                      />
                      <input
                        type="time"
                        value={todo.alarmTime || ""}
                        onChange={(e) => setAlarm(todo.id, e.target.value)}
                        className="bg-white/10 border border-white/20 rounded px-2 py-1 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50 backdrop-blur-sm"
                      />
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{
                    scale: 1.2,
                    boxShadow: "0 0 10px rgba(239, 68, 68, 0.5)",
                  }}
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
      </div>
    </GlassPanel>
  );
}
