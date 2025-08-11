"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckSquare, X, Calendar, Timer, Bell } from "lucide-react";
import GlassPanel from "@/components/ui/GlassPanel";
import type { Todo } from "./types";

interface TodoPopupWidgetProps {
  isVisible: boolean;
  todo: Todo | null;
  onClose: () => void;
}

export default function TodoPopupWidget({
  isVisible,
  todo,
  onClose,
}: TodoPopupWidgetProps) {
  if (!todo) return null;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "from-red-500 to-pink-500";
      case "medium":
        return "from-yellow-500 to-orange-500";
      case "low":
        return "from-green-500 to-emerald-500";
      default:
        return "from-blue-500 to-cyan-500";
    }
  };

  const formatAlarmTime = (alarm: string) => {
    const now = new Date();
    const [hours, minutes] = alarm.split(":");
    const alarmDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      Number.parseInt(hours),
      Number.parseInt(minutes)
    );
    return alarmDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 50 }}
          className="fixed bottom-6 right-6 z-50 max-w-sm"
        >
          <GlassPanel className="p-6" glow>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 bg-gradient-to-r ${getPriorityColor(
                    todo.priority
                  )} rounded-full flex items-center justify-center shadow-lg`}
                >
                  <CheckSquare className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Task Added!</h3>
                  <p className="text-white/70 text-sm">
                    Timer started automatically
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-white/50 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                <h4 className="text-white font-semibold mb-2 text-lg">
                  {todo.text}
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-white/80">
                    <div
                      className={`w-3 h-3 rounded-full bg-gradient-to-r ${getPriorityColor(
                        todo.priority
                      )}`}
                    />
                    <span className="capitalize font-medium">
                      {todo.priority} Priority
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-white/80">
                    <span className="font-medium">{todo.category}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {todo.timer && (
                  <div className="flex items-center gap-3 p-3 bg-blue-500/20 rounded-lg border border-blue-400/30">
                    <Timer className="text-blue-300" size={18} />
                    <div>
                      <p className="text-blue-200 font-medium">Focus Timer</p>
                      <p className="text-blue-300 text-sm">
                        {todo.timer} minutes - Now running!
                      </p>
                    </div>
                  </div>
                )}

                {todo.alarm && todo.alarmTime && (
                  <div className="flex items-center gap-3 p-3 bg-orange-500/20 rounded-lg border border-orange-400/30">
                    <Bell className="text-orange-300" size={18} />
                    <div>
                      <p className="text-orange-200 font-medium">Alarm Set</p>
                      <p className="text-orange-300 text-sm">
                        Will notify at {formatAlarmTime(todo.alarmTime)}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 p-3 bg-green-500/20 rounded-lg border border-green-400/30">
                  <Calendar className="text-green-300" size={18} />
                  <div>
                    <p className="text-green-200 font-medium">Created</p>
                    <p className="text-green-300 text-sm">
                      {new Date(todo.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {"Got it! Let's focus! 🎯"}
                </motion.button>
              </div>
            </div>
          </GlassPanel>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
