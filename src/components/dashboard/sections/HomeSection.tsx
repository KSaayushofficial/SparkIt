"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Quote,
  RefreshCw,
  Calendar,
  Clock,
  Target,
  TrendingUp,
} from "lucide-react";
import GlassPanel from "@/components/ui/GlassPanel";
import type {
  Todo,
  Habit,
  Goal,
  Notification,
} from "@/components/dashboard/types";

interface HomeSectionProps {
  todos: Todo[];
  habits: Habit[];
  goals: Goal[];
  onNotification: (
    notification: Omit<Notification, "id" | "timestamp">
  ) => void;
}

const motivationalQuotes = [
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    category: "motivation",
  },
  {
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
    category: "perseverance",
  },
  {
    text: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt",
    category: "dreams",
  },
  {
    text: "It is during our darkest moments that we must focus to see the light.",
    author: "Aristotle",
    category: "resilience",
  },
  {
    text: "Your limitation—it&apos;s only your imagination.",
    author: "Unknown",
    category: "potential",
  },
  {
    text: "Push yourself, because no one else is going to do it for you.",
    author: "Unknown",
    category: "self-motivation",
  },
  {
    text: "Great things never come from comfort zones.",
    author: "Unknown",
    category: "growth",
  },
  {
    text: "Dream it. Wish it. Do it.",
    author: "Unknown",
    category: "action",
  },
  {
    text: "Success doesn&apos;t just find you. You have to go out and get it.",
    author: "Unknown",
    category: "achievement",
  },
  {
    text: "The harder you work for something, the greater you&apos;ll feel when you achieve it.",
    author: "Unknown",
    category: "effort",
  },
  {
    text: "Don&apos;t stop when you&apos;re tired. Stop when you&apos;re done.",
    author: "Unknown",
    category: "persistence",
  },
  {
    text: "Wake up with determination. Go to bed with satisfaction.",
    author: "Unknown",
    category: "daily-motivation",
  },
];

const categoryColors = {
  motivation: "from-blue-500 to-cyan-500",
  perseverance: "from-green-500 to-emerald-500",
  dreams: "from-purple-500 to-pink-500",
  resilience: "from-orange-500 to-red-500",
  potential: "from-yellow-500 to-orange-500",
  "self-motivation": "from-indigo-500 to-purple-500",
  growth: "from-teal-500 to-green-500",
  action: "from-red-500 to-pink-500",
  achievement: "from-amber-500 to-yellow-500",
  effort: "from-violet-500 to-purple-500",
  persistence: "from-rose-500 to-pink-500",
  "daily-motivation": "from-sky-500 to-blue-500",
};

export default function HomeSection({ onNotification }: HomeSectionProps) {
  const [currentQuote, setCurrentQuote] = useState(motivationalQuotes[0]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const refreshQuote = () => {
    setIsRefreshing(true);

    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
      const newQuote = motivationalQuotes[randomIndex];

      // Ensure we don't get the same quote twice in a row
      if (
        newQuote.text === currentQuote.text &&
        motivationalQuotes.length > 1
      ) {
        const filteredQuotes = motivationalQuotes.filter(
          (q) => q.text !== currentQuote.text
        );
        const randomFilteredIndex = Math.floor(
          Math.random() * filteredQuotes.length
        );
        setCurrentQuote(filteredQuotes[randomFilteredIndex]);
      } else {
        setCurrentQuote(newQuote);
      }

      setIsRefreshing(false);

      onNotification({
        type: "info",
        title: "New Inspiration",
        message: "Fresh motivation delivered!",
      });
    }, 500);
  };

  useEffect(() => {
    // Update time every second
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Auto-refresh quote every 5 minutes
    const quoteInterval = setInterval(() => {
      refreshQuote();
    }, 300000); // 5 minutes

    return () => {
      clearInterval(timeInterval);
      clearInterval(quoteInterval);
    };
  }, [refreshQuote]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="min-h-screen w-full px-6 py-4 flex flex-col justify-between">
      <div className="flex flex-col gap-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            {getGreeting()}!
          </h1>
          <p className="text-white/70">
            Welcome to your productivity sanctuary
          </p>
        </div>

        <div className="flex flex-wrap gap-6">
          <div className="grid grid-cols-2 gap-4 flex-1 min-w-[300px] max-w-[50%]">
            <GlassPanel className="p-4 text-center" glow>
              <Clock className="text-blue-400 mx-auto mb-2" size={24} />
              <p className="text-white font-semibold">
                {formatTime(currentTime)}
              </p>
              <p className="text-white/70 text-xs">{formatDate(currentTime)}</p>
            </GlassPanel>

            <GlassPanel className="p-4 text-center" glow>
              <Target className="text-green-400 mx-auto mb-2" size={24} />
              <p className="text-white font-semibold">Stay Focused</p>
              <p className="text-white/70 text-xs">Your goals await</p>
            </GlassPanel>

            <GlassPanel className="p-4 text-center" glow>
              <TrendingUp className="text-purple-400 mx-auto mb-2" size={24} />
              <p className="text-white font-semibold">Keep Growing</p>
              <p className="text-white/70 text-xs">Every step counts</p>
            </GlassPanel>

            <GlassPanel className="p-4 text-center" glow>
              <Calendar className="text-orange-400 mx-auto mb-2" size={24} />
              <p className="text-white font-semibold">
                {currentTime.getDate()}
              </p>
              <p className="text-white/70 text-xs">
                {currentTime.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </GlassPanel>
          </div>

          <GlassPanel className="p-6 flex-1 min-w-[300px]" glow>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-white font-semibold text-base">
                <Quote size={18} />
                Inspiration
              </div>
              <motion.button
                whileHover={{ rotate: 180, scale: 1.05 }}
                onClick={refreshQuote}
                disabled={isRefreshing}
                className="p-1 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-50 transition"
              >
                <RefreshCw
                  className={`${isRefreshing ? "animate-spin" : ""}`}
                  size={14}
                />
              </motion.button>
            </div>

            <div className="text-center">
              <blockquote className="text-sm text-white italic leading-relaxed">
                &quot;{currentQuote.text}&quot;
              </blockquote>
              <div className="text-white/70 text-xs mt-2">
                — {currentQuote.author}
              </div>
              <div
                className={`mt-1 inline-block px-2 py-0.5 rounded-full text-white text-xs bg-gradient-to-r ${
                  categoryColors[
                    currentQuote.category as keyof typeof categoryColors
                  ]
                }`}
              >
                {currentQuote.category.replace("-", " ")}
              </div>
            </div>
          </GlassPanel>
        </div>
      </div>
    </div>
  );
}
