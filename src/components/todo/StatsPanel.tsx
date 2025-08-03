"use client";

import { motion } from "framer-motion";
import { TrendingUp, Clock, Target, Zap } from "lucide-react";
import GlassPanel from "@/components/ui/GlassPanel";
import type { Todo } from "./types";

interface StatsPanelProps {
  todos: Todo[];
}

export default function StatsPanel({ todos }: StatsPanelProps) {
  const totalTime = todos.reduce((acc, todo) => acc + (todo.timer || 0), 0);
  const avgTime = todos.length > 0 ? totalTime / todos.length : 0;
  const highPriorityTasks = todos.filter(
    (t) => t.priority === "high" && !t.completed
  ).length;
  const todayCompleted = todos.filter(
    (t) =>
      t.completed &&
      t.completedAt &&
      new Date(t.completedAt).toDateString() === new Date().toDateString()
  ).length;

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const stats = [
    {
      icon: Clock,
      label: "Total Time",
      value: formatTime(totalTime),
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: TrendingUp,
      label: "Avg Time",
      value: formatTime(avgTime),
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Target,
      label: "High Priority",
      value: highPriorityTasks.toString(),
      color: "from-red-500 to-pink-500",
    },
    {
      icon: Zap,
      label: "Today Done",
      value: todayCompleted.toString(),
      color: "from-yellow-500 to-orange-500",
    },
  ];

  return (
    <GlassPanel className="p-6" glow>
      <h3 className="text-lg font-semibold text-white mb-4">Statistics</h3>

      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.color}`}>
                <stat.icon size={16} className="text-white" />
              </div>
            </div>
            <div className="text-xl font-bold text-white">{stat.value}</div>
            <div className="text-xs text-white/70">{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </GlassPanel>
  );
}
