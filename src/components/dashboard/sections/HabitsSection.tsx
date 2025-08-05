"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Flame, Award, CheckCircle2, Circle, Target } from "lucide-react";
import GlassPanel from "@/components/ui/GlassPanel";
import type {Habit} from "../types";


interface HabitsSectionProps {
  habits: Habit[];
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
  onNotification: (
    notification: Omit<Notification, "id" | "timestamp">
  ) => void;
}

const categories = [
  "Health",
  "Productivity",
  "Learning",
  "Fitness",
  "Mindfulness",
  "Social",
  "Creative",
];
const colors = [
  "from-blue-500 to-cyan-500",
  "from-green-500 to-emerald-500",
  "from-purple-500 to-pink-500",
  "from-orange-500 to-red-500",
  "from-indigo-500 to-purple-500",
  "from-teal-500 to-cyan-500",
  "from-rose-500 to-pink-500",
];

export default function HabitsSection({ 
      habits,
      setHabits,
       onNotification }: HabitsSectionProps) {
  const [newHabit, setNewHabit] = useState("");
  const [newCategory, setNewCategory] = useState("Health");
  const [newDifficulty, setNewDifficulty] = useState<
    "easy" | "medium" | "hard"
  >("medium");
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    const savedHabits = localStorage.getItem("habits");
    if (savedHabits) {
      setHabits(JSON.parse(savedHabits));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("habits", JSON.stringify(habits));
  }, [habits]);

  const addHabit = () => {
    if (newHabit.trim()) {
      const habit: Habit = {
        id: Date.now().toString(),
        name: newHabit,
        description: "",
        category: newCategory,
        streak: 0,
        bestStreak: 0,
        completedDates: [],
        target: 1,
        isCompleted: false,
        frequency: "daily",
        color: colors[Math.floor(Math.random() * colors.length)],
        difficulty: newDifficulty,
        createdAt: new Date(),
      };
      setHabits([...habits, habit]);
      setNewHabit("");
      setShowAddForm(false);

      onNotification({
        type: "success",
        title: "Habit Added",
        message: `"${newHabit}" has been added to your habits`,
      });
    }
  };

  const toggleHabit = (id: string) => {
    const today = new Date().toDateString();
    setHabits(
      habits.map((habit) => {
        if (habit.id === id) {
          const alreadyCompleted = habit.completedDates.includes(today);

          if (alreadyCompleted) {
            return {
              ...habit,
              completedDates: habit.completedDates.filter(
                (date) => date !== today
              ),
              streak: Math.max(0, habit.streak - 1),
            };
          } else {
            const newStreak = habit.streak + 1;
            return {
              ...habit,
              completedDates: [...habit.completedDates, today],
              streak: newStreak,
              bestStreak: Math.max(habit.bestStreak, newStreak),
            };
          }
        }
        return habit;
      })
    );

    const habit = habits.find((h) => h.id === id);
    if (habit) {
      const isCompleted = habit.completedDates.includes(today);
      if (!isCompleted) {
        onNotification({
          type: "success",
          title: "Habit Completed! 🎉",
          message: `Great job completing "${habit.name}"! Streak: ${
            habit.streak + 1
          }`,
        });
      }
    }
  };

  const isCompletedToday = (habit: Habit) => {
    const today = new Date().toDateString();
    return habit.completedDates.includes(today);
  };

  const getCompletionRate = (habit: Habit) => {
    const daysSinceCreated =
      Math.floor(
        (Date.now() - new Date(habit.createdAt).getTime()) /
          (1000 * 60 * 60 * 24)
      ) + 1;
    return Math.round((habit.completedDates.length / daysSinceCreated) * 100);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "text-green-400 bg-green-500/20";
      case "medium":
        return "text-yellow-400 bg-yellow-500/20";
      case "hard":
        return "text-red-400 bg-red-500/20";
      default:
        return "text-gray-400 bg-gray-500/20";
    }
  };

  const totalHabits = habits.length;
  const completedToday = habits.filter(isCompletedToday).length;
  const averageStreak =
    habits.length > 0
      ? Math.round(habits.reduce((sum, h) => sum + h.streak, 0) / habits.length)
      : 0;

  return (
    <div className="h-full overflow-y-auto custom-scrollbar">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            Habit Tracker
          </h1>
          <p className="text-white/70">
            Build lasting habits and track your progress over time
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <GlassPanel className="p-6 text-center" glow>
              <div className="text-3xl font-bold text-white mb-2">
                {completedToday}/{totalHabits}
              </div>
              <div className="text-white/70">Completed Today</div>
              <div className="w-full bg-white/10 rounded-full h-2 mt-3">
                <div
                  className="bg-gradient-to-r from-green-400 to-emerald-400 h-2 rounded-full transition-all duration-500"
                  style={{
                    width:
                      totalHabits > 0
                        ? `${(completedToday / totalHabits) * 100}%`
                        : "0%",
                  }}
                />
              </div>
            </GlassPanel>

            <GlassPanel className="p-6 text-center" glow>
              <div className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-2">
                <Flame className="text-orange-400" size={32} />
                {averageStreak}
              </div>
              <div className="text-white/70">Average Streak</div>
            </GlassPanel>

            <GlassPanel className="p-6 text-center" glow>
              <div className="text-3xl font-bold text-white mb-2">
                {Math.max(...habits.map((h) => h.bestStreak), 0)}
              </div>
              <div className="text-white/70">Best Streak</div>
              <Award className="text-yellow-400 mx-auto mt-2" size={24} />
            </GlassPanel>
          </div>
        </motion.div>

        {/* Add Habit Form */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <GlassPanel className="p-6" glow>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold text-lg">
                Add New Habit
              </h3>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="p-2 rounded-lg bg-purple-500 hover:bg-purple-600 text-white transition-colors"
              >
                <Plus size={20} />
              </button>
            </div>

            <AnimatePresence>
              {showAddForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      value={newHabit}
                      onChange={(e) => setNewHabit(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addHabit()}
                      placeholder="Habit name..."
                      className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    />

                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat} className="bg-gray-800">
                          {cat}
                        </option>
                      ))}
                    </select>

                    <select
                      value={newDifficulty}
                      onChange={(e) => setNewDifficulty(e.target.value as any)}
                      className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    >
                      <option value="easy" className="bg-gray-800">
                        Easy
                      </option>
                      <option value="medium" className="bg-gray-800">
                        Medium
                      </option>
                      <option value="hard" className="bg-gray-800">
                        Hard
                      </option>
                    </select>
                  </div>

                  <button
                    onClick={addHabit}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 rounded-lg font-medium transition-all duration-200"
                  >
                    Add Habit
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </GlassPanel>
        </motion.div>

        {/* Habits List */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <GlassPanel className="p-6" glow>
            <h3 className="text-white font-semibold text-lg mb-6">
              Your Habits
            </h3>

            {habits.length === 0 ? (
              <div className="text-center py-12">
                <Target className="text-white/30 mx-auto mb-4" size={48} />
                <p className="text-white/50">
                  No habits yet. Add your first habit to get started!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence>
                  {habits.map((habit) => (
                    <motion.div
                      key={habit.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      whileHover={{ scale: 1.02 }}
                      className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div
                          className={`px-2 py-1 rounded-full text-xs ${getDifficultyColor(
                            habit.difficulty
                          )}`}
                        >
                          {habit.difficulty}
                        </div>
                        <div className="flex items-center gap-1 text-orange-400">
                          <Flame size={16} />
                          <span className="text-sm font-medium">
                            {habit.streak}
                          </span>
                        </div>
                      </div>

                      <h4 className="text-white font-medium mb-2">
                        {habit.name}
                      </h4>
                      <p className="text-white/70 text-sm mb-3">
                        {habit.category}
                      </p>

                      <div className="flex items-center justify-between mb-4">
                        <div className="text-xs text-white/70">
                          Completion: {getCompletionRate(habit)}%
                        </div>
                        <div className="text-xs text-white/70">
                          Best: {habit.bestStreak}
                        </div>
                      </div>

                      <button
                        onClick={() => toggleHabit(habit.id)}
                        className={`w-full py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                          isCompletedToday(habit)
                            ? "bg-green-500 hover:bg-green-600 text-white"
                            : "bg-white/10 hover:bg-white/20 text-white border border-white/20"
                        }`}
                      >
                        {isCompletedToday(habit) ? (
                          <>
                            <CheckCircle2 size={20} />
                            Completed Today
                          </>
                        ) : (
                          <>
                            <Circle size={20} />
                            Mark Complete
                          </>
                        )}
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </GlassPanel>
        </motion.div>
      </div>
    </div>
  );
}
