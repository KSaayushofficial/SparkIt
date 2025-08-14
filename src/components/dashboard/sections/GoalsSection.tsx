"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Target,
  Calendar,
  Award,
  CheckCircle2,
  Edit3,
  Trash2,
  X,
} from "lucide-react";
import GlassPanel from "@/components/ui/GlassPanel";

interface Goal {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: "low" | "medium" | "high";
  progress: number;
  target: number;
  unit: string;
  deadline: Date;
  milestones: Milestone[];
  createdAt: Date;
  completedAt?: Date;
}

interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  completedAt?: Date;
}

interface GoalsSectionProps {
  onNotification: (notification: any) => void;
}

const categories = [
  "Career",
  "Health",
  "Learning",
  "Finance",
  "Personal",
  "Relationships",
  "Travel",
  "Creative",
];
const priorities = {
  low: { color: "from-green-500 to-emerald-500", label: "Low" },
  medium: { color: "from-yellow-500 to-orange-500", label: "Medium" },
  high: { color: "from-red-500 to-pink-500", label: "High" },
};

export default function GoalsSection({ onNotification }: GoalsSectionProps) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    category: "Personal",
    priority: "medium" as "low" | "medium" | "high",
    target: 100,
    unit: "points",
    deadline: "",
  });

  useEffect(() => {
    const savedGoals = localStorage.getItem("goals");
    if (savedGoals) {
      const parsedGoals = JSON.parse(savedGoals, (key, value) => {
        if (
          key === "deadline" ||
          key === "createdAt" ||
          key === "completedAt"
        ) {
          return new Date(value);
        }
        return value;
      });
      setGoals(parsedGoals);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("goals", JSON.stringify(goals));
  }, [goals]);

  const addGoal = () => {
    if (newGoal.title.trim() && newGoal.deadline) {
      const goal: Goal = {
        id: Date.now().toString(),
        title: newGoal.title,
        description: newGoal.description,
        category: newGoal.category,
        priority: newGoal.priority,
        progress: 0,
        target: newGoal.target,
        unit: newGoal.unit,
        deadline: new Date(newGoal.deadline),
        milestones: [],
        createdAt: new Date(),
      };
      setGoals([...goals, goal]);
      setNewGoal({
        title: "",
        description: "",
        category: "Personal",
        priority: "medium",
        target: 100,
        unit: "points",
        deadline: "",
      });
      setShowAddForm(false);

      onNotification({
        type: "success",
        title: "Goal Added",
        message: `"${newGoal.title}" has been added to your goals`,
      });
    } else {
      onNotification({
        type: "error",
        title: "Missing Information",
        message: "Goal title and deadline are required.",
      });
    }
  };

  const updateProgress = (id: string, progress: number) => {
    setGoals(
      goals.map((goal) => {
        if (goal.id === id) {
          const updatedGoal = { ...goal, progress };
          if (progress >= goal.target && !goal.completedAt) {
            updatedGoal.completedAt = new Date();
            onNotification({
              type: "success",
              title: "🎉 Goal Completed!",
              message: `Congratulations! You've achieved "${goal.title}"`,
            });
          }
          return updatedGoal;
        }
        return goal;
      })
    );
  };

  const updateGoal = () => {
    if (editingGoal) {
      setGoals(
        goals.map((goal) => (goal.id === editingGoal.id ? editingGoal : goal))
      );
      setEditingGoal(null);
      onNotification({
        type: "success",
        title: "Goal Updated",
        message: `"${editingGoal.title}" has been updated.`,
      });
    }
  };

  const deleteGoal = (id: string) => {
    const goal = goals.find((g) => g.id === id);
    setGoals(goals.filter((g) => g.id !== id));
    if (goal) {
      onNotification({
        type: "info",
        title: "Goal Deleted",
        message: `"${goal.title}" has been removed`,
      });
    }
  };

  const getDaysUntilDeadline = (deadline: Date) => {
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getProgressColor = (progress: number, target: number) => {
    const percentage = (progress / target) * 100;
    if (percentage >= 100) return "from-green-500 to-emerald-500";
    if (percentage >= 75) return "from-blue-500 to-cyan-500";
    if (percentage >= 50) return "from-yellow-500 to-orange-500";
    return "from-gray-500 to-slate-500";
  };

  const activeGoals = goals.filter((goal) => !goal.completedAt);
  const completedGoals = goals.filter((goal) => goal.completedAt);
  const overallProgress =
    goals.length > 0
      ? Math.round((completedGoals.length / goals.length) * 100)
      : 0;

  return (
    <div className="h-full overflow-y-auto custom-scrollbar px-2 sm:px-4">
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center"
        >
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-1 sm:mb-2">
            Goal Planner
          </h1>
          <p className="text-sm sm:text-base text-white/70">
            Set ambitious goals and track your journey to success
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
            <GlassPanel className="p-3 sm:p-4 text-center" glow>
              <div className="text-xl sm:text-2xl font-bold text-white mb-1">
                {goals.length}
              </div>
              <div className="text-xs sm:text-sm text-white/70">
                Total Goals
              </div>
            </GlassPanel>

            <GlassPanel className="p-3 sm:p-4 text-center" glow>
              <div className="text-xl sm:text-2xl font-bold text-white mb-1">
                {activeGoals.length}
              </div>
              <div className="text-xs sm:text-sm text-white/70">
                Active Goals
              </div>
            </GlassPanel>

            <GlassPanel className="p-3 sm:p-4 text-center" glow>
              <div className="text-xl sm:text-2xl font-bold text-white mb-1">
                {completedGoals.length}
              </div>
              <div className="text-xs sm:text-sm text-white/70">Completed</div>
            </GlassPanel>

            <GlassPanel className="p-3 sm:p-4 text-center" glow>
              <div className="text-xl sm:text-2xl font-bold text-white mb-1">
                {overallProgress}%
              </div>
              <div className="text-xs sm:text-sm text-white/70">
                Success Rate
              </div>
              <div className="w-full bg-white/10 rounded-full h-1.5 sm:h-2 mt-1 sm:mt-2">
                <div
                  className="bg-gradient-to-r from-indigo-400 to-purple-400 h-1.5 sm:h-2 rounded-full transition-all duration-500"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
            </GlassPanel>
          </div>
        </motion.div>

        {/* Add Goal Form */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <GlassPanel className="p-4 sm:p-6" glow>
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-white font-semibold text-base sm:text-lg">
                Add New Goal
              </h3>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="p-1.5 sm:p-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white transition-colors"
              >
                <Plus size={18} className="sm:w-5 sm:h-5" />
              </button>
            </div>

            <AnimatePresence>
              {showAddForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3 sm:space-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <input
                      type="text"
                      value={newGoal.title}
                      onChange={(e) =>
                        setNewGoal({ ...newGoal, title: e.target.value })
                      }
                      placeholder="Goal title..."
                      className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    />

                    <select
                      value={newGoal.category}
                      onChange={(e) =>
                        setNewGoal({ ...newGoal, category: e.target.value })
                      }
                      className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat} className="bg-gray-800">
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <textarea
                    value={newGoal.description}
                    onChange={(e) =>
                      setNewGoal({ ...newGoal, description: e.target.value })
                    }
                    placeholder="Goal description..."
                    rows={3}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 sm:gap-4">
                    <select
                      value={newGoal.priority}
                      onChange={(e) =>
                        setNewGoal({
                          ...newGoal,
                          priority: e.target.value as "low" | "medium" | "high",
                        })
                      }
                      className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    >
                      {Object.entries(priorities).map(([key, { label }]) => (
                        <option key={key} value={key} className="bg-gray-800">
                          {label} Priority
                        </option>
                      ))}
                    </select>

                    <input
                      type="number"
                      value={newGoal.target}
                      onChange={(e) =>
                        setNewGoal({
                          ...newGoal,
                          target: Number(e.target.value),
                        })
                      }
                      placeholder="Target"
                      min="1"
                      className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    />

                    <input
                      type="text"
                      value={newGoal.unit}
                      onChange={(e) =>
                        setNewGoal({ ...newGoal, unit: e.target.value })
                      }
                      placeholder="Unit (e.g., kg, hours)"
                      className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    />

                    <input
                      type="date"
                      value={newGoal.deadline}
                      onChange={(e) =>
                        setNewGoal({ ...newGoal, deadline: e.target.value })
                      }
                      className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    />
                  </div>

                  <button
                    onClick={addGoal}
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white py-2 sm:py-3 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base"
                  >
                    Add Goal
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </GlassPanel>
        </motion.div>

        {/* Active Goals */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <GlassPanel className="p-4 sm:p-6" glow>
            <h3 className="text-white font-semibold text-base sm:text-lg mb-4 sm:mb-6">
              Active Goals
            </h3>

            {activeGoals.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <Target className="text-white/30 mx-auto mb-3 sm:mb-4 h-10 w-10 sm:h-12 sm:w-12" />
                <p className="text-sm sm:text-base text-white/50">
                  No active goals. Set your first goal to get started!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
                <AnimatePresence>
                  {activeGoals.map((goal) => {
                    const progressPercentage = Math.min(
                      (goal.progress / goal.target) * 100,
                      100
                    );
                    const daysLeft = getDaysUntilDeadline(goal.deadline);
                    const isOverdue = daysLeft < 0;

                    return (
                      <motion.div
                        key={goal.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        whileHover={{ scale: 1.02 }}
                        className="bg-white/5 border border-white/10 rounded-lg sm:rounded-xl p-4 sm:p-6 hover:bg-white/10 transition-all duration-300"
                      >
                        <div className="flex items-start justify-between mb-3 sm:mb-4">
                          <div className="flex-1">
                            <h4 className="text-white font-medium text-base sm:text-lg mb-1 sm:mb-2">
                              {goal.title}
                            </h4>
                            <p className="text-white/70 text-xs sm:text-sm mb-2 sm:mb-3">
                              {goal.description}
                            </p>

                            <div className="flex items-center gap-2 mb-2 sm:mb-3">
                              <span
                                className={`px-2 py-1 rounded-full text-xs bg-gradient-to-r ${
                                  priorities[goal.priority].color
                                } text-white`}
                              >
                                {priorities[goal.priority].label}
                              </span>
                              <span className="px-2 py-1 rounded-full text-xs bg-white/10 text-white/70">
                                {goal.category}
                              </span>
                            </div>
                          </div>

                          <div className="flex gap-1 sm:gap-2">
                            <button
                              onClick={() => setEditingGoal(goal)}
                              className="p-1.5 sm:p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                            >
                              <Edit3 size={14} className="sm:w-4 sm:h-4" />
                            </button>
                            <button
                              onClick={() => deleteGoal(goal.id)}
                              className="p-1.5 sm:p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors"
                            >
                              <Trash2 size={14} className="sm:w-4 sm:h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="space-y-3 sm:space-y-4">
                          <div>
                            <div className="flex items-center justify-between mb-1 sm:mb-2">
                              <span className="text-white/70 text-xs sm:text-sm">
                                Progress
                              </span>
                              <span className="text-white text-xs sm:text-sm font-medium">
                                {goal.progress} / {goal.target} {goal.unit}
                              </span>
                            </div>
                            <div className="w-full bg-white/10 rounded-full h-2 sm:h-3">
                              <div
                                className={`bg-gradient-to-r ${getProgressColor(
                                  goal.progress,
                                  goal.target
                                )} h-2 sm:h-3 rounded-full transition-all duration-500`}
                                style={{ width: `${progressPercentage}%` }}
                              />
                            </div>
                            <div className="text-right mt-1">
                              <span className="text-white/70 text-xs">
                                {Math.round(progressPercentage)}% complete
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 sm:gap-2">
                              <Calendar
                                size={14}
                                className="sm:w-4 sm:h-4 text-white/70"
                              />
                              <span
                                className={`text-xs sm:text-sm ${
                                  isOverdue ? "text-red-400" : "text-white/70"
                                }`}
                              >
                                {isOverdue
                                  ? `${Math.abs(daysLeft)} days overdue`
                                  : `${daysLeft} days left`}
                              </span>
                            </div>
                            <div className="text-white/70 text-xs">
                              {new Date(goal.deadline).toLocaleDateString()}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={goal.progress}
                              onChange={(e) =>
                                updateProgress(goal.id, Number(e.target.value))
                              }
                              min="0"
                              max={goal.target}
                              className="bg-white/10 border border-white/20 rounded-lg px-2 py-1.5 sm:px-3 sm:py-2 text-white text-xs sm:text-sm w-20 sm:w-24"
                            />
                            <span className="text-white/70 text-xs sm:text-sm">
                              / {goal.target} {goal.unit}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </GlassPanel>
        </motion.div>

        {/* Completed Goals */}
        {completedGoals.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <GlassPanel className="p-4 sm:p-6" glow>
              <h3 className="text-white font-semibold text-base sm:text-lg mb-4 sm:mb-6 flex items-center gap-1 sm:gap-2">
                <Award className="text-yellow-400 h-5 w-5 sm:h-6 sm:w-6" />
                Completed Goals
              </h3>

              <div className="space-y-2 sm:space-y-3">
                {completedGoals.slice(-5).map((goal) => (
                  <div
                    key={goal.id}
                    className="flex items-center justify-between p-3 sm:p-4 bg-green-500/10 border border-green-500/20 rounded-lg"
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <CheckCircle2 className="text-green-400 h-4 w-4 sm:h-5 sm:w-5" />
                      <div>
                        <div className="text-white font-medium text-sm sm:text-base">
                          {goal.title}
                        </div>
                        <div className="text-white/70 text-xs sm:text-sm">
                          {goal.category}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-400 text-xs sm:text-sm font-medium">
                        {goal.target} {goal.unit}
                      </div>
                      <div className="text-white/70 text-xs">
                        {goal.completedAt?.toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </GlassPanel>
          </motion.div>
        )}
      </div>

      {/* Edit Goal Modal */}
      <AnimatePresence>
        {editingGoal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-md"
            >
              <GlassPanel className="p-4 sm:p-6 relative">
                <button
                  onClick={() => setEditingGoal(null)}
                  className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1.5 sm:p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <X size={18} className="sm:w-5 sm:h-5 text-white" />
                </button>
                <h3 className="text-white font-semibold text-xl sm:text-2xl mb-3 sm:mb-4">
                  Edit Goal
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="text-white/70 text-xs sm:text-sm">
                      Title
                    </label>
                    <input
                      type="text"
                      value={editingGoal.title}
                      onChange={(e) =>
                        setEditingGoal({
                          ...editingGoal,
                          title: e.target.value,
                        })
                      }
                      className="w-full mt-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    />
                  </div>
                  <div>
                    <label className="text-white/70 text-xs sm:text-sm">
                      Description
                    </label>
                    <textarea
                      value={editingGoal.description}
                      onChange={(e) =>
                        setEditingGoal({
                          ...editingGoal,
                          description: e.target.value,
                        })
                      }
                      rows={3}
                      className="w-full mt-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="text-white/70 text-xs sm:text-sm">
                        Category
                      </label>
                      <select
                        value={editingGoal.category}
                        onChange={(e) =>
                          setEditingGoal({
                            ...editingGoal,
                            category: e.target.value,
                          })
                        }
                        className="w-full mt-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat} className="bg-gray-800">
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-white/70 text-xs sm:text-sm">
                        Priority
                      </label>
                      <select
                        value={editingGoal.priority}
                        onChange={(e) =>
                          setEditingGoal({
                            ...editingGoal,
                            priority: e.target.value as
                              | "low"
                              | "medium"
                              | "high",
                          })
                        }
                        className="w-full mt-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                      >
                        {Object.entries(priorities).map(([key, { label }]) => (
                          <option key={key} value={key} className="bg-gray-800">
                            {label} Priority
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="text-white/70 text-xs sm:text-sm">
                        Target
                      </label>
                      <input
                        type="number"
                        value={editingGoal.target}
                        onChange={(e) =>
                          setEditingGoal({
                            ...editingGoal,
                            target: Number(e.target.value),
                          })
                        }
                        min="1"
                        className="w-full mt-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                      />
                    </div>
                    <div>
                      <label className="text-white/70 text-xs sm:text-sm">
                        Unit
                      </label>
                      <input
                        type="text"
                        value={editingGoal.unit}
                        onChange={(e) =>
                          setEditingGoal({
                            ...editingGoal,
                            unit: e.target.value,
                          })
                        }
                        className="w-full mt-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-white/70 text-xs sm:text-sm">
                      Deadline
                    </label>
                    <input
                      type="date"
                      value={editingGoal.deadline.toISOString().split("T")[0]}
                      onChange={(e) =>
                        setEditingGoal({
                          ...editingGoal,
                          deadline: new Date(e.target.value),
                        })
                      }
                      className="w-full mt-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    />
                  </div>
                  <div className="flex gap-3 sm:gap-4 mt-4 sm:mt-6">
                    <button
                      onClick={() => setEditingGoal(null)}
                      className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 sm:py-3 rounded-lg font-medium transition-colors text-sm sm:text-base"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={updateGoal}
                      className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white py-2 sm:py-3 rounded-lg font-medium transition-colors text-sm sm:text-base"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </GlassPanel>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
