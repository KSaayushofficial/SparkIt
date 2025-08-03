"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Target, Calendar, TrendingUp } from "lucide-react";
import GlassPanel from "@/components/ui/GlassPanel";
import type { Goal } from "./types";

interface GoalsWidgetProps {
  goals: Goal[];
  setGoals: (goals: Goal[]) => void;
}

export default function GoalsWidget({ goals, setGoals }: GoalsWidgetProps) {
  const [newGoal, setNewGoal] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const addGoal = () => {
    if (newGoal.trim()) {
      const goal: Goal = {
        id: Date.now().toString(),
        title: newGoal,
        description: "",
        progress: 0,
        target: 100,
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        category: "Personal",
        priority: "medium",
        milestones: [],
      };
      setGoals([...goals, goal]);
      setNewGoal("");
      setShowAddForm(false);
    }
  };

  const updateProgress = (id: string, progress: number) => {
    setGoals(
      goals.map((goal) => (goal.id === id ? { ...goal, progress } : goal))
    );
  };

  return (
    <GlassPanel className="p-6 h-full flex flex-col" glow>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Goals</h3>
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowAddForm(!showAddForm)}
          className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg transition-all duration-300"
        >
          <Plus size={16} />
        </motion.button>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4"
          >
            <div className="flex gap-2">
              <input
                type="text"
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addGoal()}
                placeholder="New goal..."
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 backdrop-blur-sm"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={addGoal}
                className="bg-blue-500 px-3 py-2 rounded-lg text-white text-sm hover:bg-blue-600 transition-colors"
              >
                Add
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3">
        <AnimatePresence>
          {goals.map((goal) => (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              whileHover={{
                scale: 1.02,
                boxShadow: "0 0 20px rgba(255, 255, 255, 0.1)",
              }}
              className="bg-white/5 border border-white/10 rounded-lg p-3 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Target size={14} className="text-blue-400" />
                  <span className="text-white text-sm font-medium flex-1">
                    {goal.title}
                  </span>
                  <span className="text-xs text-white/70">
                    {Math.round(goal.progress)}%
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${goal.progress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-white/70">
                    <div className="flex items-center gap-1">
                      <Calendar size={10} />
                      <span>
                        {new Date(goal.deadline).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp size={10} />
                      <span>{goal.priority}</span>
                    </div>
                  </div>
                </div>

                <input
                  type="range"
                  min="0"
                  max="100"
                  value={goal.progress}
                  onChange={(e) =>
                    updateProgress(goal.id, Number.parseInt(e.target.value))
                  }
                  className="w-full accent-blue-500"
                />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </GlassPanel>
  );
}
