"use client";

import { useEffect, useRef } from "react";
import type { Todo, Notification } from "@/components/dashboard/types";

interface GlobalTodoManagerProps {
  todos: Todo[];
  setTodos: (todos: Todo[] | ((prevTodos: Todo[]) => Todo[])) => void;
  onNotification: (
    notification: Omit<Notification, "id" | "timestamp">
  ) => void;
}

export default function GlobalTodoManager({
  todos,
  setTodos,
  onNotification,
}: GlobalTodoManagerProps) {
  const timersRef = useRef<{ [key: string]: NodeJS.Timeout }>({});
  const alarmCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const triggeredAlarmsRef = useRef<Set<string>>(new Set());

  // Create a simple beep sound programmatically
  const createBeepSound = () => {
    if (typeof window !== "undefined" && "AudioContext" in window) {
      try {
        const audioContext = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.type = "sine";

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + 0.5
        );

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
      } catch (error) {
        console.warn("Could not create audio context for beep sound:", error);
      }
    }
  };

  const playAlarmSound = () => {
    // Play multiple beeps for alarm
    createBeepSound();
    setTimeout(() => createBeepSound(), 200);
    setTimeout(() => createBeepSound(), 400);
  };

  const checkForAlarms = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeString = `${currentHour
      .toString()
      .padStart(2, "0")}:${currentMinute.toString().padStart(2, "0")}`;

    todos.forEach((todo) => {
      if (
        typeof todo.alarm === "string" &&
        !todo.completed &&
        todo.alarm === currentTimeString
      ) {
        const alarmKey = `${todo.id}-${now.toDateString()}`;

        // Check if we haven't already triggered this alarm today
        if (!triggeredAlarmsRef.current.has(alarmKey)) {
          triggeredAlarmsRef.current.add(alarmKey);

          // Play alarm sound
          playAlarmSound();

          // Show browser notification if permission granted
          if (
            typeof window !== "undefined" &&
            "Notification" in window &&
            Notification.permission === "granted"
          ) {
            new Notification(`🔔 Todo Timer Complete: ${todo.text}`, {
              body: `Your ${todo.timer || 25} minute timer for "${
                todo.text
              }" has finished!`,
              icon: "/favicon.ico",
              requireInteraction: true,
            });
          }

          // Show app notification with enhanced details
          onNotification({
            type: "alarm",
            title: "⏰ Todo Timer Complete!",
            message: `"${todo.text}" - ${
              todo.timer || 25
            } min timer finished! Time to take action!`,
          });

          // Update todo to stop timer
          setTodos(
            todos.map((t: Todo) =>
              t.id === todo.id ? { ...t, isTimerRunning: false } : t
            )
          );

          // Create visual alarm indicator
          const todoElement = document.getElementById(`todo-${todo.id}`);
          if (todoElement) {
            todoElement.classList.add("animate-pulse");
            todoElement.style.boxShadow = "0 0 20px rgba(59, 130, 246, 0.8)";
            todoElement.style.borderColor = "rgb(59, 130, 246)";
            setTimeout(() => {
              todoElement.classList.remove("animate-pulse");
              todoElement.style.boxShadow = "";
              todoElement.style.borderColor = "";
            }, 10000);
          }
        }
      }
    });
  };

  useEffect(() => {
    // Request notification permission on mount
    if (
      typeof window !== "undefined" &&
      "Notification" in window &&
      Notification.permission === "default"
    ) {
      Notification.requestPermission();
    }

    // Check for alarms every minute
    alarmCheckIntervalRef.current = setInterval(checkForAlarms, 60000);

    // Also check immediately
    checkForAlarms();

    return () => {
      if (alarmCheckIntervalRef.current) {
        clearInterval(alarmCheckIntervalRef.current);
      }
    };
  }, [todos, onNotification]);

  // Clear triggered alarms at midnight
  useEffect(() => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const timeUntilMidnight = tomorrow.getTime() - now.getTime();

    const midnightTimer = setTimeout(() => {
      triggeredAlarmsRef.current.clear();

      // Set up daily clearing
      const dailyTimer = setInterval(() => {
        triggeredAlarmsRef.current.clear();
      }, 24 * 60 * 60 * 1000);

      return () => clearInterval(dailyTimer);
    }, timeUntilMidnight);

    return () => clearTimeout(midnightTimer);
  }, []);

  const startTimer = (todoId: string, duration: number) => {
    // Clear existing timer if any
    if (timersRef.current[todoId]) {
      clearTimeout(timersRef.current[todoId]);
    }

    // Update todo to show timer is running
    setTodos(
      todos.map((todo: Todo) =>
        todo.id === todoId ? { ...todo, isTimerRunning: true } : todo
      )
    );

    // Start new timer
    timersRef.current[todoId] = setTimeout(() => {
      playAlarmSound();

      const todo = todos.find((t) => t.id === todoId);

      // Enhanced notification with more details
      onNotification({
        type: "success",
        title: "🎯 Timer Complete!",
        message: `"${todo?.text || "Unknown task"}" - ${Math.round(
          duration / 60
        )} minute timer finished! Great focus session!`,
      });

      // Show browser notification
      if (
        typeof window !== "undefined" &&
        "Notification" in window &&
        Notification.permission === "granted"
      ) {
        new Notification(`🎯 Timer Complete: ${todo?.text}`, {
          body: `Your ${Math.round(
            duration / 60
          )} minute focus session is complete!`,
          icon: "/favicon.ico",
        });
      }

      // Update todo to stop timer
      setTodos((prevTodos: Todo[]) =>
        prevTodos.map((t: Todo) =>
          t.id === todoId ? { ...t, isTimerRunning: false } : t
        )
      );

      // Remove timer from ref
      delete timersRef.current[todoId];

      // Visual feedback
      const todoElement = document.getElementById(`todo-${todoId}`);
      if (todoElement) {
        todoElement.style.boxShadow = "0 0 20px rgba(34, 197, 94, 0.8)";
        todoElement.style.borderColor = "rgb(34, 197, 94)";
        setTimeout(() => {
          todoElement.style.boxShadow = "";
          todoElement.style.borderColor = "";
        }, 5000);
      }
    }, duration * 1000);
  };

  const stopTimer = (todoId: string) => {
    if (timersRef.current[todoId]) {
      clearTimeout(timersRef.current[todoId]);
      delete timersRef.current[todoId];
    }

    // Update todo to show timer is stopped
    setTodos((prevTodos: Todo[]) =>
      prevTodos.map((todo: Todo) =>
        todo.id === todoId ? { ...todo, isTimerRunning: false } : todo
      )
    );

    onNotification({
      type: "info",
      title: "⏸️ Timer Stopped",
      message: "Focus session paused. You can restart it anytime!",
    });
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      Object.values(timersRef.current).forEach((timer) => clearTimeout(timer));
      if (alarmCheckIntervalRef.current) {
        clearInterval(alarmCheckIntervalRef.current);
      }
    };
  }, []);

  // Expose timer functions globally for other components to use
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).todoTimers = {
        start: startTimer,
        stop: stopTimer,
      };
    }
  }, []);

  return null; // This component doesn't render anything visible
}
