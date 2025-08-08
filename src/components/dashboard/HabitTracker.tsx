"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Check, Flame } from "lucide-react";
import GlassPanel from "@/components/ui/GlassPanel";
import type { Habit } from "./types";

interface HabitTrackerProps {
  habits: Habit[];
  setHabits: (habits: Habit[]) => void;
}

export default function HabitTracker({ habits, setHabits }: HabitTrackerProps) {
  const [newHabit, setNewHabit] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const addHabit = () => {
    if (newHabit.trim()) {
      const habit: Habit = {
        id: Date.now().toString(),
        name: newHabit,
        description: "",
        streak: 0,
        bestStreak: 0,
        completedDates: [],
        target: 1,
        category: "Personal",
        color: "from-purple-500 to-pink-500",
        isCompleted: false,
        frequency: "daily", // or another default value as per your Habit type
        difficulty: "easy", // or another default value as per your Habit type
        createdAt: new Date(),
      };
      setHabits([...habits, habit]);
      setNewHabit("");
      setShowAddForm(false);
    }
  };

  const toggleHabit = (id: string) => {
    const today = new Date().toDateString();
    setHabits(
      habits.map((habit) => {
        if (habit.id === id) {
          const alreadyCompleted = habit.completedDates.some(
            (date) => new Date(date).toDateString() === today
          );

          if (alreadyCompleted) {
            return {
              ...habit,
              completedDates: habit.completedDates.filter(
                (date) => new Date(date).toDateString() !== today
              ),
              streak: Math.max(0, habit.streak - 1),
              isCompleted: false,
            };
          } else {
            return {
              ...habit,
              completedDates: [...habit.completedDates, new Date()],
              streak: habit.streak + 1,
              isCompleted: true,
            };
          }
        }
        return habit;
      })
    );
  };

  const isCompletedToday = (habit: Habit) => {
    const today = new Date().toDateString();
    return habit.completedDates.some(
      (date) => new Date(date).toDateString() === today
    );
  };

  return (
    <GlassPanel className="p-6 h-full flex flex-col" glow>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Habits</h3>
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowAddForm(!showAddForm)}
          className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg transition-all duration-300"
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
                value={newHabit}
                onChange={(e) => setNewHabit(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addHabit()}
                placeholder="New habit..."
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 backdrop-blur-sm"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={addHabit}
                className="bg-green-500 px-3 py-2 rounded-lg text-white text-sm hover:bg-green-600 transition-colors"
              >
                Add
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3">
        <AnimatePresence>
          {habits.map((habit) => (
            <motion.div
              key={habit.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              whileHover={{
                scale: 1.02,
                boxShadow: "0 0 20px rgba(255, 255, 255, 0.1)",
              }}
              className="bg-white/5 border border-white/10 rounded-lg p-3 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
            >
              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => toggleHabit(habit.id)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                    isCompletedToday(habit)
                      ? "bg-green-500 border-green-500 shadow-lg shadow-green-500/25"
                      : "border-white/30 hover:border-purple-400"
                  }`}
                >
                  {isCompletedToday(habit) && (
                    <Check size={14} className="text-white" />
                  )}
                </motion.button>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-white text-sm font-medium">
                      {habit.name}
                    </span>
                    <div className="flex items-center gap-1 text-orange-400">
                      <Flame size={12} />
                      <span className="text-xs">{habit.streak}</span>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-white/70">
                  {isCompletedToday(habit) ? "Done!" : "Pending"}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </GlassPanel>
  );
}
