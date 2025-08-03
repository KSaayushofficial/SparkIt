"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Play,
  Pause,
  Trash2,
  Clock,
  Bell,
  X,
  CheckCircle2,
  Circle,
  Timer,
} from "lucide-react";
import GlassPanel from "@/components/ui/GlassPanel";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  timer?: number;
  isTimerRunning?: boolean;
  hasAlarm?: boolean;
  alarmTime?: string;
}

interface TodoSectionProps {
  todos: Todo[]; 
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>; 
  onNotification: (notification: any) => void;
}

export default function TodoSection({ onNotification }: TodoSectionProps) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [timerMinutes, setTimerMinutes] = useState(25);
  const [showAlarmModal, setShowAlarmModal] = useState(false);
  const [alarmingTodo, setAlarmingTodo] = useState<Todo | null>(null);
  const timerRefs = useRef<{ [key: string]: NodeJS.Timeout }>({});
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio for alarm
    audioRef.current = new Audio();
    audioRef.current.src =
      "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/Adi4FJnfH8N2QQAo";
    audioRef.current.volume = 0.3;
    audioRef.current.loop = true;

    return () => {
      // Cleanup timers
      Object.values(timerRefs.current).forEach((timer) => clearInterval(timer));
    };
  }, []);

  const addTodo = () => {
    if (newTodo.trim()) {
      const todo: Todo = {
        id: Date.now().toString(),
        text: newTodo,
        completed: false,
        createdAt: new Date(),
        timer: timerMinutes * 60,
        isTimerRunning: false,
        hasAlarm: false,
      };
      setTodos([...todos, todo]);
      setNewTodo("");

      onNotification({
        type: "success",
        title: "Task Added",
        message: `"${newTodo}" added with ${timerMinutes}min timer`,
      });
    }
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) => {
        if (todo.id === id) {
          const updated = { ...todo, completed: !todo.completed };
          if (updated.completed) {
            // Stop timer when completed
            if (timerRefs.current[id]) {
              clearInterval(timerRefs.current[id]);
              delete timerRefs.current[id];
            }
            updated.isTimerRunning = false;

            onNotification({
              type: "success",
              title: "Task Completed!",
              message: `Great job completing "${todo.text}"`,
            });
          }
          return updated;
        }
        return todo;
      })
    );
  };

  const deleteTodo = (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (timerRefs.current[id]) {
      clearInterval(timerRefs.current[id]);
      delete timerRefs.current[id];
    }
    setTodos(todos.filter((todo) => todo.id !== id));

    if (todo) {
      onNotification({
        type: "info",
        title: "Task Deleted",
        message: `"${todo.text}" removed`,
      });
    }
  };

  const toggleTimer = (id: string) => {
    setTodos(
      todos.map((todo) => {
        if (todo.id === id) {
          const updated = { ...todo, isTimerRunning: !todo.isTimerRunning };

          if (updated.isTimerRunning) {
            // Start timer
            timerRefs.current[id] = setInterval(() => {
              setTodos((currentTodos) =>
                currentTodos.map((t) => {
                  if (t.id === id && t.timer && t.timer > 0) {
                    const newTimer = t.timer - 1;

                    if (newTimer === 0) {
                      // Timer finished
                      clearInterval(timerRefs.current[id]);
                      delete timerRefs.current[id];

                      // Show alarm
                      setAlarmingTodo(t);
                      setShowAlarmModal(true);

                      // Play alarm sound
                      if (audioRef.current) {
                        audioRef.current.play().catch(console.error);
                      }

                      return {
                        ...t,
                        timer: 0,
                        isTimerRunning: false,
                        hasAlarm: true,
                      };
                    }

                    return { ...t, timer: newTimer };
                  }
                  return t;
                })
              );
            }, 1000);
          } else {
            // Stop timer
            if (timerRefs.current[id]) {
              clearInterval(timerRefs.current[id]);
              delete timerRefs.current[id];
            }
          }

          return updated;
        }
        return todo;
      })
    );
  };

  const dismissAlarm = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setShowAlarmModal(false);
    setAlarmingTodo(null);

    if (alarmingTodo) {
      setTodos(
        todos.map((todo) =>
          todo.id === alarmingTodo.id ? { ...todo, hasAlarm: false } : todo
        )
      );
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const completedCount = todos.filter((todo) => todo.completed).length;
  const totalCount = todos.length;

  return (
    <div className="h-full overflow-y-auto custom-scrollbar">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Enhanced Todo Manager
          </h1>
          <p className="text-white/70">
            Stay organized with timers and smart notifications
          </p>
        </motion.div>

        {/* Progress Overview */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <GlassPanel className="p-6" glow>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">
                  Today's Progress
                </h3>
                <p className="text-white/70">
                  {completedCount} of {totalCount} tasks completed
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">
                  {totalCount > 0
                    ? Math.round((completedCount / totalCount) * 100)
                    : 0}
                  %
                </div>
                <div className="text-white/70 text-sm">Complete</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4 w-full bg-white/10 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{
                  width:
                    totalCount > 0
                      ? `${(completedCount / totalCount) * 100}%`
                      : "0%",
                }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </GlassPanel>
        </motion.div>

        {/* Add Todo */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <GlassPanel className="p-6" glow>
            <div className="space-y-4">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addTodo()}
                  placeholder="Add a new task..."
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                />
                <div className="flex items-center gap-2">
                  <Timer className="text-white/70" size={20} />
                  <input
                    type="number"
                    value={timerMinutes}
                    onChange={(e) =>
                      setTimerMinutes(
                        Math.max(1, Number.parseInt(e.target.value) || 1)
                      )
                    }
                    min="1"
                    max="120"
                    className="w-16 bg-white/10 border border-white/20 rounded-lg px-2 py-3 text-white text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <span className="text-white/70 text-sm">min</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={addTodo}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
                >
                  <Plus size={20} />
                  Add Task
                </motion.button>
              </div>
            </div>
          </GlassPanel>
        </motion.div>

        {/* Todo List */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <GlassPanel className="p-6" glow>
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <CheckCircle2 className="text-green-400" size={24} />
              Your Tasks
            </h3>

            <div className="space-y-3">
              <AnimatePresence>
                {todos.map((todo) => (
                  <motion.div
                    key={todo.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`p-4 rounded-lg border transition-all duration-200 ${
                      todo.completed
                        ? "bg-green-500/10 border-green-400/30"
                        : todo.hasAlarm
                        ? "bg-red-500/10 border-red-400/30 animate-pulse"
                        : "bg-white/5 border-white/20"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => toggleTodo(todo.id)}
                          className="text-white/70 hover:text-white transition-colors"
                        >
                          {todo.completed ? (
                            <CheckCircle2
                              className="text-green-400"
                              size={24}
                            />
                          ) : (
                            <Circle size={24} />
                          )}
                        </motion.button>

                        <div className="flex-1">
                          <p
                            className={`text-white ${
                              todo.completed ? "line-through opacity-60" : ""
                            }`}
                          >
                            {todo.text}
                          </p>
                          <p className="text-white/50 text-sm">
                            Added {todo.createdAt.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Timer Display */}
                        {todo.timer !== undefined && (
                          <div className="flex items-center gap-2">
                            <div
                              className={`text-sm font-mono px-2 py-1 rounded ${
                                todo.timer === 0
                                  ? "bg-red-500/20 text-red-400"
                                  : todo.isTimerRunning
                                  ? "bg-blue-500/20 text-blue-400"
                                  : "bg-white/10 text-white/70"
                              }`}
                            >
                              {formatTime(todo.timer)}
                            </div>

                            {!todo.completed && (
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => toggleTimer(todo.id)}
                                className={`p-2 rounded-full transition-colors ${
                                  todo.isTimerRunning
                                    ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                                    : "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                                }`}
                              >
                                {todo.isTimerRunning ? (
                                  <Pause size={16} />
                                ) : (
                                  <Play size={16} />
                                )}
                              </motion.button>
                            )}
                          </div>
                        )}

                        {/* Alarm Indicator */}
                        {todo.hasAlarm && (
                          <Bell
                            className="text-red-400 animate-bounce"
                            size={20}
                          />
                        )}

                        {/* Delete Button */}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => deleteTodo(todo.id)}
                          className="p-2 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                        >
                          <Trash2 size={16} />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {todos.length === 0 && (
                <div className="text-center py-12">
                  <Clock className="text-white/30 mx-auto mb-4" size={48} />
                  <p className="text-white/50">
                    No tasks yet. Add one above to get started!
                  </p>
                </div>
              )}
            </div>
          </GlassPanel>
        </motion.div>

        {/* Alarm Modal */}
        <AnimatePresence>
          {showAlarmModal && alarmingTodo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
              onClick={dismissAlarm}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-gradient-to-br from-red-500/20 to-orange-500/20 backdrop-blur-md border border-red-400/30 rounded-2xl p-8 max-w-md mx-4 text-center"
                onClick={(e) => e.stopPropagation()}
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 0.5,
                  }}
                  className="text-red-400 mb-4"
                >
                  <Bell size={48} className="mx-auto" />
                </motion.div>

                <h3 className="text-2xl font-bold text-white mb-2">
                  Time's Up!
                </h3>
                <p className="text-white/80 mb-6">
                  Your timer for "{alarmingTodo.text}" has finished.
                </p>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={dismissAlarm}
                  className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 mx-auto"
                >
                  <X size={20} />
                  Dismiss
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
