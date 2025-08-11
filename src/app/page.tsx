"use client";

import { useState, useEffect } from "react";
import VerticalSidebar from "@/components/dashboard/VerticalSidebar";
import HomeSection from "@/components/dashboard/sections/HomeSection";
import TodoSection from "@/components/dashboard/sections/TodoSection";
import MusicSection from "@/components/dashboard/sections/MusicSection";
import FitnessSection from "@/components/dashboard/sections/FitnessSection";
import StressSection from "@/components/dashboard/sections/StressSection";
import BackgroundSection from "@/components/dashboard/sections/BackgroundSection";
import EffectsSection from "@/components/dashboard/sections/EffectsSection";
import HabitsSection from "@/components/dashboard/sections/HabitsSection";
import GoalsSection from "@/components/dashboard/sections/GoalsSection";
import BackgroundManager from "@/components/background/BackgroundManager";
import EffectsManager from "@/components/dashboard/effects/EffectsManager";
import TodoManager from "@/components/todo/GlobalTodoManager";
import TodoPopupWidget from "@/components/dashboard/TodoPopupWidget";
import type {
  Todo,
  Habit,
  Goal,
  Notification,
  Milestone,
} from "@/components/dashboard/types";


// Define types for the parsed localStorage data
interface ParsedTodo extends Omit<Todo, 'createdAt' | 'completedAt' | 'dueDate'> {
  createdAt: string;
  completedAt?: string;
  dueDate?: string;
}

interface ParsedHabit extends Omit<Habit, 'completedDates'> {
  completedDates: string[];
}

interface ParsedGoal extends Omit<Goal, 'deadline' | 'milestones'> {
  deadline: string;
  milestones: Array<Omit<Milestone, 'dueDate'> & { dueDate: string }>;
}

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState("home");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showTodoPopup, setShowTodoPopup] = useState(false);
  const [latestTodo, setLatestTodo] = useState<Todo | null>(null);

  useEffect(() => {
    // Load saved data
    const savedTodos = localStorage.getItem("dashboard-todos");
    const savedHabits = localStorage.getItem("dashboard-habits");
    const savedGoals = localStorage.getItem("dashboard-goals");

    if (savedTodos) {
      try {
        const parsed: ParsedTodo[] = JSON.parse(savedTodos);
        const todosWithDates = parsed.map((todo) => ({
          ...todo,
          createdAt: new Date(todo.createdAt),
          completedAt: todo.completedAt ? new Date(todo.completedAt) : undefined,
          dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined,
        }));
        setTodos(todosWithDates);
      } catch (error) {
        console.error("Error parsing todos:", error);
      }
    }

    if (savedHabits) {
      try {
        const parsed: ParsedHabit[] = JSON.parse(savedHabits);
        const habitsWithDates = parsed.map((habit) => ({
          ...habit,
          completedDates: habit.completedDates.map((date) => new Date(date)),
        }));
        setHabits(habitsWithDates);
      } catch (error) {
        console.error("Error parsing habits:", error);
      }
    }

    if (savedGoals) {
      try {
        const parsed: ParsedGoal[] = JSON.parse(savedGoals);
        const goalsWithDates = parsed.map((goal) => ({
          ...goal,
          deadline: new Date(goal.deadline),
          milestones: goal.milestones.map((milestone) => ({
            ...milestone,
            dueDate: new Date(milestone.dueDate),
          })),
        }));
        setGoals(goalsWithDates);
      } catch (error) {
        console.error("Error parsing goals:", error);
      }
    }

    initializeGlobalSystems();
    setIsInitialized(true);
  }, []);

  // ... rest of your component code remains the same ...


  useEffect(() => {
    localStorage.setItem("dashboard-todos", JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem("dashboard-habits", JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem("dashboard-goals", JSON.stringify(goals));
  }, [goals]);

  const initializeGlobalSystems = () => {
    // Remove any existing containers to prevent duplicates
    const existingBackground = document.getElementById(
      "global-background-container"
    );
    const existingEffects = document.getElementById("global-effects-container");

    if (existingBackground) existingBackground.remove();
    if (existingEffects) existingEffects.remove();

    // Create global background container
    const backgroundContainer = document.createElement("div");
    backgroundContainer.id = "global-background-container";
    backgroundContainer.className = "fixed inset-0 z-0";
    backgroundContainer.style.pointerEvents = "none";
    document.body.appendChild(backgroundContainer);

    // Create global effects container
    const effectsContainer = document.createElement("div");
    effectsContainer.id = "global-effects-container";
    effectsContainer.className = "fixed inset-0 z-10 pointer-events-none";
    effectsContainer.style.mixBlendMode = "screen";
    document.body.appendChild(effectsContainer);

    // Initialize background and effects
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent("initializeBackground"));
      window.dispatchEvent(new CustomEvent("initializeEffects"));
    }, 100);
  };

  const addNotification = (
    notification: Omit<Notification, "id" | "timestamp">
  ) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    setNotifications((prev) => [...prev, newNotification]);

    // Auto remove after 5 seconds unless it's an alarm
    if (notification.type !== "alarm") {
      setTimeout(() => {
        setNotifications((prev) =>
          prev.filter((n) => n.id !== newNotification.id)
        );
      }, 5000);
    }
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Enhanced setTodos function to handle popup notifications
  const handleSetTodos = (newTodos: Todo[]) => {
    const previousTodosLength = todos.length;
    setTodos(newTodos);

    // Check if a new todo was added
    if (newTodos.length > previousTodosLength) {
      const latestTodo = newTodos[newTodos.length - 1];
      setLatestTodo(latestTodo);
      setShowTodoPopup(true);

      // Auto-hide popup after 4 seconds
      setTimeout(() => {
        setShowTodoPopup(false);
      }, 4000);
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case "home":
        return (
          <HomeSection
            todos={todos}
            habits={habits}
            goals={goals}
            onNotification={addNotification}
          />
        );
      case "todo":
        return (
          <TodoSection
            todos={todos}
            setTodos={handleSetTodos}
            onNotification={addNotification}
          />
        ); 
      case "habits":
        return (
          <HabitsSection
            habits={habits}
            setHabits={setHabits}
            onNotification={addNotification}
          />
        );
      case "goals":
        return (
          <GoalsSection onNotification={addNotification} />
        );
      case "music":
        return <MusicSection onNotification={addNotification} />;
      case "fitness":
        return <FitnessSection onNotification={addNotification} />;
      case "stress":
        return <StressSection onNotification={addNotification} />;
      case "background":
        return <BackgroundSection onNotification={addNotification} />;
      case "effects":
        return <EffectsSection onNotification={addNotification} />;
      default:
        return (
          <HomeSection
            todos={todos}
            habits={habits}
            goals={goals}
            onNotification={addNotification}
          />
        );
    }
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Global Background Manager */}
      <BackgroundManager />

      {/* Global Effects Manager */}
      <EffectsManager />

      {/* Global Todo Manager - Always Active */}
      <TodoManager
        todos={todos}
        setTodos={setTodos}
        onNotification={addNotification}
      />

      {/* Todo Popup Widget */}
      <TodoPopupWidget
        isVisible={showTodoPopup}
        todo={latestTodo}
        onClose={() => setShowTodoPopup(false)}
      />

      {/* Main Layout */}
      <div className="relative z-20 flex h-screen">
        {/* Sidebar */}
        <VerticalSidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-hidden">
          <div className="h-full relative z-10">{renderSection()}</div>
        </main>
      </div>

      {/* Enhanced Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 rounded-lg backdrop-blur-md border shadow-lg max-w-sm transition-all duration-300 ${
              notification.type === "alarm"
                ? "bg-red-500/90 border-red-400 text-white animate-pulse"
                : notification.type === "success"
                ? "bg-green-500/90 border-green-400 text-white"
                : notification.type === "warning"
                ? "bg-yellow-500/90 border-yellow-400 text-white"
                : "bg-blue-500/90 border-blue-400 text-white"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-semibold text-sm flex items-center gap-2">
                  {notification.type === "alarm" && "🔔"}
                  {notification.type === "success" && "✅"}
                  {notification.type === "info" && "ℹ️"}
                  {notification.title}
                </h4>
                <p className="text-sm opacity-90 mt-1">
                  {notification.message}
                </p>
              </div>
              <button
                onClick={() => removeNotification(notification.id)}
                className="ml-2 text-white/70 hover:text-white transition-colors"
              >
                ×
              </button>
            </div>
            {notification.type === "alarm" && (
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => removeNotification(notification.id)}
                  className="px-3 py-1 bg-white/20 rounded text-sm hover:bg-white/30 transition-colors"
                >
                  Dismiss
                </button>
                <button
                  onClick={() => {
                    // Snooze for 5 minutes
                    removeNotification(notification.id);
                    setTimeout(() => {
                      addNotification({
                        type: "alarm",
                        title: "Snoozed Reminder",
                        message: notification.message,
                      });
                    }, 5 * 60 * 1000);
                  }}
                  className="px-3 py-1 bg-yellow-500/20 rounded text-sm hover:bg-yellow-500/30 transition-colors"
                >
                  Snooze 5min
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}