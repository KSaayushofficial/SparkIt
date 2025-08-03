"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Music,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
} from "lucide-react";
import GlassPanel from "@/components/ui/GlassPanel";

export default function MusicPlayer() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-full shadow-lg backdrop-blur-xl z-50"
      >
        <Music size={24} className="text-white" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md"
            >
              <GlassPanel className="p-6" glow>
                <div className="text-center">
                  <div className="mb-6">
                    <motion.img
                      animate={{ rotate: isPlaying ? 360 : 0 }}
                      transition={{
                        duration: 10,
                        repeat: isPlaying ? Number.POSITIVE_INFINITY : 0,
                        ease: "linear",
                      }}
                      src="/placeholder.svg?height=200&width=200"
                      alt="Album Cover"
                      className="w-full h-48 object-cover rounded-xl"
                    />
                  </div>

                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-white mb-1">
                      Peaceful Waves
                    </h3>
                    <p className="text-white/70">Nature Sounds</p>
                  </div>

                  <div className="flex justify-center gap-4 mb-6">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-3 rounded-full bg-white/10 text-white hover:bg-white/20"
                    >
                      <SkipBack size={20} />
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="p-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                    >
                      {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-3 rounded-full bg-white/10 text-white hover:bg-white/20"
                    >
                      <SkipForward size={20} />
                    </motion.button>
                  </div>

                  <div className="flex items-center gap-2">
                    <Volume2 size={16} className="text-white/70" />
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={volume}
                      onChange={(e) =>
                        setVolume(Number.parseFloat(e.target.value))
                      }
                      className="flex-1 accent-purple-500"
                    />
                  </div>
                </div>
              </GlassPanel>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
