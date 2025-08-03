"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Eye,
  EyeOff,
  Music,
} from "lucide-react";
import GlassPanel from "@/components/ui/GlassPanel";

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  audioUrl: string;
  videoUrl?: string;
  cover: string;
}

export default function AudioPlayer() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isRelaxMode, setIsRelaxMode] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [currentTrack] = useState<Track>({
    id: "1",
    title: "Peaceful Waves",
    artist: "Nature Sounds",
    duration: 180,
    audioUrl: "/audio/peaceful-waves.mp3",
    videoUrl: "/video/ocean-waves.mp4",
    cover: "/images/ocean-cover.jpg",
  });

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    audio.addEventListener("timeupdate", updateTime);

    return () => audio.removeEventListener("timeupdate", updateTime);
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    const video = videoRef.current;

    if (isPlaying) {
      audio?.pause();
      if (isRelaxMode && video) {
        video.pause();
      }
    } else {
      audio?.play();
      if (isRelaxMode && video) {
        video.currentTime = audio?.currentTime || 0;
        video.play();
      }
    }
    setIsPlaying(!isPlaying);
  };

  const toggleRelaxMode = () => {
    setIsRelaxMode(!isRelaxMode);
    if (!isRelaxMode && videoRef.current && audioRef.current) {
      videoRef.current.currentTime = audioRef.current.currentTime;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <>
      {/* Floating Player Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-full shadow-lg backdrop-blur-xl z-50"
      >
        <Music size={24} className="text-white" />
      </motion.button>

      {/* Full Player Modal */}
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
                {/* Video Player (Hidden/Visible) */}
                {isRelaxMode && (
                  <div
                    className={`mb-6 rounded-xl overflow-hidden ${
                      showVideo ? "block" : "hidden"
                    }`}
                  >
                    <video
                      ref={videoRef}
                      className="w-full h-48 object-cover"
                      muted
                      loop
                    >
                      <source src={currentTrack.videoUrl} type="video/mp4" />
                    </video>
                  </div>
                )}

                {/* Album Cover */}
                {(!isRelaxMode || !showVideo) && (
                  <div className="mb-6">
                    <motion.img
                      animate={{ rotate: isPlaying ? 360 : 0 }}
                      transition={{
                        duration: 10,
                        repeat: isPlaying ? Number.POSITIVE_INFINITY : 0,
                        ease: "linear",
                      }}
                      src="/placeholder.svg?height=200&width=200"
                      alt={currentTrack.title}
                      className="w-full h-48 object-cover rounded-xl"
                    />
                  </div>
                )}

                {/* Track Info */}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-white mb-1">
                    {currentTrack.title}
                  </h3>
                  <p className="text-white/70">{currentTrack.artist}</p>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-white/70 mb-2">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(currentTrack.duration)}</span>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                      style={{
                        width: `${
                          (currentTime / currentTrack.duration) * 100
                        }%`,
                      }}
                    />
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-4 mb-6">
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
                    onClick={togglePlay}
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

                {/* Additional Controls */}
                <div className="flex items-center justify-between">
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
                      className="w-20 accent-purple-500"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={toggleRelaxMode}
                      className={`p-2 rounded-lg transition-colors ${
                        isRelaxMode
                          ? "bg-purple-500 text-white"
                          : "bg-white/10 text-white/70"
                      }`}
                    >
                      Relax
                    </motion.button>

                    {isRelaxMode && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setShowVideo(!showVideo)}
                        className="p-2 rounded-lg bg-white/10 text-white/70 hover:bg-white/20"
                      >
                        {showVideo ? <EyeOff size={16} /> : <Eye size={16} />}
                      </motion.button>
                    )}
                  </div>
                </div>

                {/* Hidden Audio Element */}
                <audio
                  ref={audioRef}
                  src={currentTrack.audioUrl}
                  volume={volume}
                />
              </GlassPanel>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
