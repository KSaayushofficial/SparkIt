"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, X } from "lucide-react";
import GlassPanel from "@/components/ui/GlassPanel";

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

export default function TodoWidget() {
  const pathname = usePathname();
  const [latestTask, setLatestTask] = useState<Todo | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("latest-todo");
    if (stored) {
      const parsed = JSON.parse(stored);
      setLatestTask(parsed);
    }
  }, []);

  useEffect(() => {
    const shouldShow =
      latestTask && pathname !== "/todo" && pathname !== "/loading";
    setShow(!!shouldShow);
  }, [pathname, latestTask]);

  const dismiss = () => setShow(false);

  return (
    <AnimatePresence>
      {show && latestTask && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-4 right-4 z-50"
        >
          <GlassPanel className="p-4 rounded-xl shadow-lg w-64 flex flex-col gap-2 border border-white/10 bg-white/10 backdrop-blur">
            <div className="flex justify-between items-center">
              <p className="text-sm text-white/80">Task Added</p>
              <button
                onClick={dismiss}
                className="text-white/50 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="text-green-400" size={20} />
              <p className="text-white text-sm line-clamp-2">
                {latestTask.text}
              </p>
            </div>
          </GlassPanel>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
