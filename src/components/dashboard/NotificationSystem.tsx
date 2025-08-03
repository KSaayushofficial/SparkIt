"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Bell,
  CheckCircle,
  AlertTriangle,
  Info,
  AlertCircle,
} from "lucide-react";
import GlassPanel from "@/components/ui/GlassPanel";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "alarm" | "reminder" | "success" | "warning" | "info";
}

interface NotificationSystemProps {
  notifications: Notification[];
  onRemove: (id: string) => void;
}

export default function NotificationSystem({
  notifications,
  onRemove,
}: NotificationSystemProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case "alarm":
        return <Bell className="text-yellow-400" size={20} />;
      case "success":
        return <CheckCircle className="text-green-400" size={20} />;
      case "warning":
        return <AlertTriangle className="text-orange-400" size={20} />;
      case "info":
        return <Info className="text-blue-400" size={20} />;
      default:
        return <AlertCircle className="text-purple-400" size={20} />;
    }
  };

  const getGradient = (type: string) => {
    switch (type) {
      case "alarm":
        return "from-yellow-500/20 to-orange-500/20";
      case "success":
        return "from-green-500/20 to-emerald-500/20";
      case "warning":
        return "from-orange-500/20 to-red-500/20";
      case "info":
        return "from-blue-500/20 to-purple-500/20";
      default:
        return "from-purple-500/20 to-pink-500/20";
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            whileHover={{ scale: 1.02 }}
          >
            <GlassPanel
              className={`p-4 bg-gradient-to-r ${getGradient(
                notification.type
              )}`}
              glow
            >
              <div className="flex items-start gap-3">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {getIcon(notification.type)}
                </motion.div>
                <div className="flex-1">
                  <h4 className="text-white font-medium">
                    {notification.title}
                  </h4>
                  <p className="text-white/70 text-sm mt-1">
                    {notification.message}
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onRemove(notification.id)}
                  className="text-white/50 hover:text-white transition-colors"
                >
                  <X size={16} />
                </motion.button>
              </div>
            </GlassPanel>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
