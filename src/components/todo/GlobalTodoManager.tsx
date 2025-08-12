"use client";

import { useEffect, useRef, useCallback } from "react";
import type { Todo, Notification } from "@/components/dashboard/types";

interface GlobalTodoManagerProps {
  todos: Todo[];
  setTodos: (todos: Todo[] | ((prevTodos: Todo[]) => Todo[])) => void;
  onNotification: (
    notification: Omit<Notification, "id" | "timestamp">
  ) => void;
}

// Extend Window interface globally for todoTimers and AudioContext vendor prefix
declare global {
  interface Window {
    todoTimers?: {
      start: (todoId: string, durationSeconds: number) => void;
      stop: (todoId: string) => void;
    };
    webkitAudioContext?: typeof AudioContext;
  }
}

export default function GlobalTodoManager({
  todos,
  setTodos,
  onNotification,
}: GlobalTodoManagerProps) {
  // timersRef maps todo ID to timeout handle
  const timersRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const alarmCheckIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null
  );
  const triggeredAlarmsRef = useRef<Set<string>>(new Set());

  // Create beep sound programmatically
  const createBeepSound = () => {
    if (typeof window !== "undefined" && "AudioContext" in window) {
      try {
        // Use prefixed AudioContext for Safari compatibility
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;

        const audioContext = new AudioCtx();
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
    createBeepSound();
    setTimeout(() => createBeepSound(), 200);
    setTimeout(() => createBeepSound(), 400);
  };

  // Wrap checkForAlarms in useCallback so it can be added as effect dependency
  const checkForAlarms = useCallback(() => {
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

        if (!triggeredAlarmsRef.current.has(alarmKey)) {
          triggeredAlarmsRef.current.add(alarmKey);

          playAlarmSound();

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

          onNotification({
            type: "alarm",
            title: "⏰ Todo Timer Complete!",
            message: `"${todo.text}" - ${
              todo.timer || 25
            } min timer finished! Time to take action!`,
          });

          setTodos((prevTodos) =>
            prevTodos.map((t) =>
              t.id === todo.id ? { ...t, isTimerRunning: false } : t
            )
          );

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
  }, [todos, onNotification, setTodos]);

  // Request permission and set interval for alarm checking
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "Notification" in window &&
      Notification.permission === "default"
    ) {
      Notification.requestPermission();
    }

    alarmCheckIntervalRef.current = setInterval(checkForAlarms, 60000);

    // Check immediately on mount
    checkForAlarms();

    return () => {
      if (alarmCheckIntervalRef.current) {
        clearInterval(alarmCheckIntervalRef.current);
      }
    };
  }, [checkForAlarms]);

  // Clear triggered alarms at midnight and daily after
  useEffect(() => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const timeUntilMidnight = tomorrow.getTime() - now.getTime();

    const midnightTimer = setTimeout(() => {
      triggeredAlarmsRef.current.clear();

      const dailyTimer = setInterval(() => {
        triggeredAlarmsRef.current.clear();
      }, 24 * 60 * 60 * 1000);

      return () => clearInterval(dailyTimer);
    }, timeUntilMidnight);

    return () => clearTimeout(midnightTimer);
  }, []);

  // Memoize startTimer and stopTimer for useEffect dependencies
  const startTimer = useCallback(
    (todoId: string, duration: number) => {
      if (timersRef.current[todoId]) {
        clearTimeout(timersRef.current[todoId]);
      }

      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === todoId ? { ...todo, isTimerRunning: true } : todo
        )
      );

      timersRef.current[todoId] = setTimeout(() => {
        playAlarmSound();

        const todo = todos.find((t) => t.id === todoId);

        onNotification({
          type: "success",
          title: "🎯 Timer Complete!",
          message: `"${todo?.text || "Unknown task"}" - ${Math.round(
            duration / 60
          )} minute timer finished! Great focus session!`,
        });

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

        setTodos((prevTodos) =>
          prevTodos.map((t) =>
            t.id === todoId ? { ...t, isTimerRunning: false } : t
          )
        );

        delete timersRef.current[todoId];

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
    },
    [todos, onNotification, setTodos]
  );

  const stopTimer = useCallback(
    (todoId: string) => {
      if (timersRef.current[todoId]) {
        clearTimeout(timersRef.current[todoId]);
        delete timersRef.current[todoId];
      }

      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === todoId ? { ...todo, isTimerRunning: false } : todo
        )
      );

      onNotification({
        type: "info",
        title: "⏸️ Timer Stopped",
        message: "Focus session paused. You can restart it anytime!",
      });
    },
    [setTodos, onNotification]
  );

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      const timers = { ...timersRef.current }; // copy current timers to avoid stale ref in cleanup
      Object.values(timers).forEach((timer) => clearTimeout(timer));
      if (alarmCheckIntervalRef.current) {
        clearInterval(alarmCheckIntervalRef.current);
      }
    };
  }, []);

  // Expose timer functions globally for other components to use
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.todoTimers = {
        start: startTimer,
        stop: stopTimer,
      };
    }
  }, [startTimer, stopTimer]);

  return null; // No UI
}
