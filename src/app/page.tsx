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
import BackgroundManager from "@/components/background/BackgroundManager";
import EffectsManager from "@/components/dashboard/effects/EffectsManager";
import type { Todo, Notification } from "@/components/dashboard/types";

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState("home");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const savedTodos = localStorage.getItem("dashboard-todos");
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }

    // Initialize the global systems
    initializeGlobalSystems();
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("dashboard-todos", JSON.stringify(todos));
  }, [todos]);

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

    // Auto remove after 5 seconds
    setTimeout(() => {
      setNotifications((prev) =>
        prev.filter((n) => n.id !== newNotification.id)
      );
    }, 5000);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const renderSection = () => {
    switch (activeSection) {
      case "home":
        return <HomeSection todos={todos} onNotification={addNotification} />;
      case "todo":
        return (
          <TodoSection
            todos={todos}
            setTodos={setTodos}
            onNotification={addNotification}
          />
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
        return <HomeSection todos={todos} onNotification={addNotification} />;
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

      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 rounded-lg backdrop-blur-md border shadow-lg max-w-sm transition-all duration-300 ${
              notification.type === "alarm"
                ? "bg-red-500/90 border-red-400 text-white"
                : notification.type === "success"
                ? "bg-green-500/90 border-green-400 text-white"
                : notification.type === "warning"
                ? "bg-yellow-500/90 border-yellow-400 text-white"
                : "bg-blue-500/90 border-blue-400 text-white"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-semibold text-sm">{notification.title}</h4>
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
              <button
                onClick={() => removeNotification(notification.id)}
                className="mt-2 px-3 py-1 bg-white/20 rounded text-sm hover:bg-white/30 transition-colors"
              >
                Cancel Alarm
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
