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

interface MusicSectionProps {
  onNotification: (notification: any) => void;
}

interface AmbientSound {
  id: string;
  name: string;
  color: string;
  duration: number; // seconds
  audioSrc: string;
}

const ambientSounds: AmbientSound[] = [
  {
    id: "rain",
    name: "Rain Sounds",
    color: "from-blue-500 to-indigo-500",
    duration: 180,
    audioSrc: "/rain.mp3",
  },
  {
    id: "ocean",
    name: "Ocean Waves",
    color: "from-cyan-500 to-blue-500",
    duration: 240,
    audioSrc: "/ocean.mp3",
  },
  {
    id: "forest",
    name: "Forest Birds",
    color: "from-green-500 to-teal-500",
    duration: 200,
    audioSrc: "/forest.mp3",
  },
  {
    id: "thunder",
    name: "Thunder Storm",
    color: "from-purple-500 to-indigo-500",
    duration: 300,
    audioSrc: "/thunder.mp3",
  },
  {
    id: "fire",
    name: "Crackling Fire",
    color: "from-orange-500 to-red-500",
    duration: 220,
    audioSrc: "/fire.mp3",
  },
  {
    id: "wind",
    name: "Wind Chimes",
    color: "from-teal-500 to-cyan-500",
    duration: 160,
    audioSrc: "/wind.mp3",
  },
  {
    id: "cafe",
    name: "Coffee Shop",
    color: "from-amber-500 to-orange-500",
    duration: 280,
    audioSrc: "/cafe.mp3",
  },
  {
    id: "library",
    name: "Library Ambience",
    color: "from-gray-500 to-slate-500",
    duration: 320,
    audioSrc: "/library.mp3",
  },
  {
    id: "night",
    name: "Night Crickets",
    color: "from-indigo-500 to-purple-500",
    duration: 190,
    audioSrc: "/night.mp3",
  },
  {
    id: "meditation",
    name: "Meditation Bells",
    color: "from-pink-500 to-purple-500",
    duration: 150,
    audioSrc: "/meditation.mp3",
  },
  {
    id: "waterfall",
    name: "Waterfall",
    color: "from-blue-400 to-cyan-400",
    duration: 210,
    audioSrc: "/waterfall.mp3",
  },
  {
    id: "birds",
    name: "Morning Birds",
    color: "from-yellow-500 to-green-500",
    duration: 170,
    audioSrc: "/birds.mp3",
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

  // Initialize audio element
  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio(currentSound.audioSrc);
      audioRef.current.volume = volume;

      const updateTime = () => {
        if (audioRef.current) {
          setCurrentTime(audioRef.current.currentTime);
        }
      };

      audioRef.current.addEventListener("timeupdate", updateTime);

      const handleEnded = () => {
        if (isRepeating) {
          audioRef.current?.play();
        } else {
          playNext();
        }
      };

      audioRef.current.addEventListener("ended", handleEnded);

      return () => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.removeEventListener("timeupdate", updateTime);
          audioRef.current.removeEventListener("ended", handleEnded);
        }
      };
    }
  }, [currentSound.audioSrc, isRepeating]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const playTrack = useCallback(
    async (trackId: string) => {
      const sound =
        ambientSounds.find((s) => s.id === trackId) || ambientSounds[0];

      if (audioRef.current) {
        // Pause current audio if playing
        audioRef.current.pause();

        // Create new audio element
        audioRef.current = new Audio(sound.audioSrc);
        audioRef.current.volume = isMuted ? 0 : volume;

        try {
          await audioRef.current.play();
          setCurrentTrack(trackId);
          setIsPlaying(true);
          onNotification({
            title: "Now Playing",
            message: sound.name,
            type: "info",
          });
        } catch (err) {
          console.error("Error playing audio:", err);
          setIsPlaying(false);
        }
      }
    },
    [onNotification, isMuted, volume]
  );

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

  const togglePlay = async () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
        onNotification({
          title: "Now Playing",
          message: currentSound.name,
          type: "info",
        });
      } catch (err) {
        console.error("Error playing audio:", err);
        setIsPlaying(false);
      }
    }
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
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  return (
    <div className="h-full overflow-y-auto custom-scrollbar px-2 sm:px-4">
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">
            Ambient Sounds
          </h1>
          <p className="text-sm sm:text-base text-white/70">
            Focus with nature sounds and ambient music
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Sound Library */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <GlassPanel className="p-4 sm:p-6" glow>
                <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">
                  Sound Library
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 max-h-[400px] sm:max-h-[500px] overflow-y-auto custom-scrollbar">
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
                        className={`relative p-3 sm:p-4 rounded-lg sm:rounded-xl cursor-pointer transition-all duration-300 ${
                          currentTrack === sound.id
                            ? `bg-gradient-to-br ${sound.color} shadow-lg`
                            : "bg-white/5 hover:bg-white/10"
                        } backdrop-blur-sm border border-white/10`}
                      >
                        <div className="text-center">
                          <div className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 rounded-full bg-white/10 flex items-center justify-center">
                            {isPlaying && currentTrack === sound.id ? (
                              <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 1, repeat: Infinity }}
                              >
                                <Volume2
                                  size={16}
                                  className="sm:w-5 sm:h-5 text-white"
                                />
                              </motion.div>
                            ) : (
                              <Play
                                size={16}
                                className="sm:w-5 sm:h-5 text-white/70"
                              />
                            )}
                          </div>
                          <h3 className="text-white text-xs sm:text-sm font-medium">
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
                            className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-4 h-4 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center"
                          >
                            <div className="w-1 h-1 sm:w-2 sm:h-2 bg-white rounded-full animate-pulse" />
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
              <GlassPanel className="p-4 sm:p-6 h-full" glow>
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">
                  Now Playing
                </h3>

                <div className="flex flex-col items-center space-y-4 sm:space-y-6">
                  {/* Album Art */}
                  <div className="relative">
                    <motion.div
                      animate={{ rotate: isPlaying ? 360 : 0 }}
                      transition={{
                        duration: 20,
                        repeat: isPlaying ? Infinity : 0,
                        ease: "linear",
                      }}
                      className={`w-20 h-20 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br ${currentSound.color} flex items-center justify-center shadow-lg`}
                    >
                      <Volume2
                        size={24}
                        className="sm:w-10 sm:h-10 text-white"
                      />
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
                    <h4 className="text-base sm:text-lg font-semibold text-white mb-1">
                      {currentSound.name}
                    </h4>
                    <p className="text-white/70 text-xs sm:text-sm">
                      Ambient Sounds
                    </p>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full">
                    <div className="flex justify-between text-xs text-white/70 mb-1 sm:mb-2">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(currentSound.duration)}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max={currentSound.duration}
                      step="0.1"
                      value={currentTime}
                      onChange={handleSeek}
                      className="w-full h-1.5 sm:h-2 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-blue-500 [&::-webkit-slider-thumb]:to-cyan-500"
                    />
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-center gap-2 sm:gap-4">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsShuffled(!isShuffled)}
                      className={`p-1 sm:p-2 rounded-full transition-colors ${
                        isShuffled
                          ? "bg-blue-500 text-white"
                          : "bg-white/10 text-white/70 hover:bg-white/20"
                      }`}
                    >
                      <Shuffle size={14} className="sm:w-4 sm:h-4" />
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={playPrevious}
                      className="p-2 sm:p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                    >
                      <SkipBack size={16} className="sm:w-5 sm:h-5" />
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={togglePlay}
                      className="p-3 sm:p-4 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
                    >
                      {isPlaying ? (
                        <Pause size={20} className="sm:w-6 sm:h-6" />
                      ) : (
                        <Play size={20} className="sm:w-6 sm:h-6" />
                      )}
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={playNext}
                      className="p-2 sm:p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                    >
                      <SkipForward size={16} className="sm:w-5 sm:h-5" />
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsRepeating(!isRepeating)}
                      className={`p-1 sm:p-2 rounded-full transition-colors ${
                        isRepeating
                          ? "bg-blue-500 text-white"
                          : "bg-white/10 text-white/70 hover:bg-white/20"
                      }`}
                    >
                      <Repeat size={14} className="sm:w-4 sm:h-4" />
                    </motion.button>
                  </div>

                  {/* Volume Control */}
                  <div className="w-full flex items-center gap-2 sm:gap-3">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsMuted(!isMuted)}
                      className="text-white/70 hover:text-white transition-colors"
                    >
                      {isMuted ? (
                        <VolumeX size={16} className="sm:w-5 sm:h-5" />
                      ) : (
                        <Volume2 size={16} className="sm:w-5 sm:h-5" />
                      )}
                    </motion.button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={volume}
                      onChange={(e) => setVolume(parseFloat(e.target.value))}
                      className="flex-1 accent-blue-500 h-1.5 sm:h-2"
                    />
                    <span className="text-white/70 text-xs sm:text-sm w-6 sm:w-8">
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
