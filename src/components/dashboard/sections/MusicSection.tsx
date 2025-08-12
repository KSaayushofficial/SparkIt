"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
} from "lucide-react";
import GlassPanel from "@/components/ui/GlassPanel";

// interface Notification {
//   title: string;
//   message: string;
//   type: "info" | "success" | "error" | "warning";
// }

interface MusicSectionProps {
  onNotification: (notification: any) => void;
}

interface AmbientSound {
  id: string;
  name: string;
  color: string;
  duration: number; // seconds
}

const ambientSounds: AmbientSound[] = [
  {
    id: "rain",
    name: "Rain Sounds",
    color: "from-blue-500 to-indigo-500",
    duration: 180,
  },
  {
    id: "ocean",
    name: "Ocean Waves",
    color: "from-cyan-500 to-blue-500",
    duration: 240,
  },
  {
    id: "forest",
    name: "Forest Birds",
    color: "from-green-500 to-teal-500",
    duration: 200,
  },
  {
    id: "thunder",
    name: "Thunder Storm",
    color: "from-purple-500 to-indigo-500",
    duration: 300,
  },
  {
    id: "fire",
    name: "Crackling Fire",
    color: "from-orange-500 to-red-500",
    duration: 220,
  },
  {
    id: "wind",
    name: "Wind Chimes",
    color: "from-teal-500 to-cyan-500",
    duration: 160,
  },
  {
    id: "cafe",
    name: "Coffee Shop",
    color: "from-amber-500 to-orange-500",
    duration: 280,
  },
  {
    id: "library",
    name: "Library Ambience",
    color: "from-gray-500 to-slate-500",
    duration: 320,
  },
  {
    id: "night",
    name: "Night Crickets",
    color: "from-indigo-500 to-purple-500",
    duration: 190,
  },
  {
    id: "meditation",
    name: "Meditation Bells",
    color: "from-pink-500 to-purple-500",
    duration: 150,
  },
  {
    id: "waterfall",
    name: "Waterfall",
    color: "from-blue-400 to-cyan-400",
    duration: 210,
  },
  {
    id: "birds",
    name: "Morning Birds",
    color: "from-yellow-500 to-green-500",
    duration: 170,
  },
];

export default function MusicSection({ onNotification }: MusicSectionProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<string>(ambientSounds[0].id);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentSound =
    ambientSounds.find((sound) => sound.id === currentTrack) ||
    ambientSounds[0];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Memoize playTrack so it has stable identity
  const playTrack = useCallback(
    (trackId: string) => {
      setCurrentTrack(trackId);
      setCurrentTime(0);
      setIsPlaying(true);
      onNotification({
        title: "Now Playing",
        message: ambientSounds.find((s) => s.id === trackId)?.name || "",
        type: "info",
      });
    },
    [onNotification]
  );

  // Memoize playNext with dependencies including playTrack
  const playNext = useCallback(() => {
    const currentIndex = ambientSounds.findIndex(
      (sound) => sound.id === currentTrack
    );
    let nextIndex: number;

    if (isShuffled) {
      nextIndex = Math.floor(Math.random() * ambientSounds.length);
    } else {
      nextIndex = (currentIndex + 1) % ambientSounds.length;
    }

    playTrack(ambientSounds[nextIndex].id);
  }, [currentTrack, isShuffled, playTrack]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= currentSound.duration) {
            if (isRepeating) {
              return 0;
            } else {
              playNext();
              return 0;
            }
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentSound, isRepeating, playNext]);

  const togglePlay = () => {
    setIsPlaying((prev) => {
      const newState = !prev;
      if (newState) {
        onNotification({
          title: "Now Playing",
          message: currentSound.name,
          type: "info",
        });
      }
      return newState;
    });
  };

  const playPrevious = () => {
    const currentIndex = ambientSounds.findIndex(
      (sound) => sound.id === currentTrack
    );
    const prevIndex =
      currentIndex === 0 ? ambientSounds.length - 1 : currentIndex - 1;
    playTrack(ambientSounds[prevIndex].id);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="h-full overflow-y-auto custom-scrollbar">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold text-white mb-2">Ambient Sounds</h1>
          <p className="text-white/70">
            Focus with nature sounds and ambient music
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sound Library */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <GlassPanel className="p-6" glow>
                <h2 className="text-xl font-semibold text-white mb-4">
                  Sound Library
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto custom-scrollbar">
                  <AnimatePresence>
                    {ambientSounds.map((sound, index) => (
                      <motion.div
                        key={sound.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.05, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => playTrack(sound.id)}
                        className={`relative p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                          currentTrack === sound.id
                            ? `bg-gradient-to-br ${sound.color} shadow-lg`
                            : "bg-white/5 hover:bg-white/10"
                        } backdrop-blur-sm border border-white/10`}
                      >
                        <div className="text-center">
                          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-white/10 flex items-center justify-center">
                            {isPlaying && currentTrack === sound.id ? (
                              <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 1, repeat: Infinity }}
                              >
                                <Volume2 size={20} className="text-white" />
                              </motion.div>
                            ) : (
                              <Play size={20} className="text-white/70" />
                            )}
                          </div>
                          <h3 className="text-white text-sm font-medium">
                            {sound.name}
                          </h3>
                          <div className="text-white/60 text-xs mt-1">
                            {formatTime(sound.duration)}
                          </div>
                        </div>

                        {currentTrack === sound.id && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                          >
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </GlassPanel>
            </motion.div>
          </div>

          {/* Music Player */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <GlassPanel className="p-6 h-full" glow>
                <h3 className="text-xl font-semibold text-white mb-6">
                  Now Playing
                </h3>

                <div className="flex flex-col items-center space-y-6">
                  {/* Album Art */}
                  <div className="relative">
                    <motion.div
                      animate={{ rotate: isPlaying ? 360 : 0 }}
                      transition={{
                        duration: 20,
                        repeat: isPlaying ? Infinity : 0,
                        ease: "linear",
                      }}
                      className={`w-32 h-32 rounded-full bg-gradient-to-br ${currentSound.color} flex items-center justify-center shadow-lg`}
                    >
                      <Volume2 size={40} className="text-white" />
                    </motion.div>
                    {isPlaying && (
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent"
                      />
                    )}
                  </div>

                  {/* Track Info */}
                  <div className="text-center">
                    <h4 className="text-lg font-semibold text-white mb-1">
                      {currentSound.name}
                    </h4>
                    <p className="text-white/70 text-sm">Ambient Sounds</p>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full">
                    <div className="flex justify-between text-xs text-white/70 mb-2">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(currentSound.duration)}</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                        style={{
                          width: `${
                            (currentTime / currentSound.duration) * 100
                          }%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-center gap-4">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsShuffled(!isShuffled)}
                      className={`p-2 rounded-full transition-colors ${
                        isShuffled
                          ? "bg-blue-500 text-white"
                          : "bg-white/10 text-white/70 hover:bg-white/20"
                      }`}
                    >
                      <Shuffle size={16} />
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={playPrevious}
                      className="p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                    >
                      <SkipBack size={20} />
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={togglePlay}
                      className="p-4 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
                    >
                      {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={playNext}
                      className="p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                    >
                      <SkipForward size={20} />
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsRepeating(!isRepeating)}
                      className={`p-2 rounded-full transition-colors ${
                        isRepeating
                          ? "bg-blue-500 text-white"
                          : "bg-white/10 text-white/70 hover:bg-white/20"
                      }`}
                    >
                      <Repeat size={16} />
                    </motion.button>
                  </div>

                  {/* Volume Control */}
                  <div className="w-full flex items-center gap-3">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsMuted(!isMuted)}
                      className="text-white/70 hover:text-white transition-colors"
                    >
                      {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </motion.button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={volume}
                      onChange={(e) => setVolume(parseFloat(e.target.value))}
                      className="flex-1 accent-blue-500"
                    />
                    <span className="text-white/70 text-sm w-8">
                      {Math.round(volume * 100)}
                    </span>
                  </div>
                </div>
              </GlassPanel>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
