// "use client";

// import { useState, useRef, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   Play,
//   Pause,
//   Volume2,
//   VolumeX,
//   SkipBack,
//   SkipForward,
//   Shuffle,
//   Repeat,
// } from "lucide-react";
// import GlassPanel from "@/components/ui/GlassPanel";

// interface MusicEffectsProps {
//   isPlaying: boolean;
//   setIsPlaying: (playing: boolean) => void;
//   currentTrack: string;
//   setCurrentTrack: (track: string) => void;
//   onNotification: (notification: any) => void;
// }

// const ambientSounds = [
//   {
//     id: "rain",
//     name: "Rain Sounds",
//     url: "/sounds/rain.mp3",
//     color: "from-blue-500 to-indigo-500",
//   },
//   {
//     id: "ocean",
//     name: "Ocean Waves",
//     url: "/sounds/ocean.mp3",
//     color: "from-cyan-500 to-blue-500",
//   },
//   {
//     id: "forest",
//     name: "Forest Birds",
//     url: "/sounds/forest.mp3",
//     color: "from-green-500 to-teal-500",
//   },
//   {
//     id: "thunder",
//     name: "Thunder Storm",
//     url: "/sounds/thunder.mp3",
//     color: "from-purple-500 to-indigo-500",
//   },
//   {
//     id: "fire",
//     name: "Crackling Fire",
//     url: "/sounds/fire.mp3",
//     color: "from-orange-500 to-red-500",
//   },
//   {
//     id: "wind",
//     name: "Wind Chimes",
//     url: "/sounds/wind.mp3",
//     color: "from-teal-500 to-cyan-500",
//   },
//   {
//     id: "cafe",
//     name: "Coffee Shop",
//     url: "/sounds/cafe.mp3",
//     color: "from-amber-500 to-orange-500",
//   },
//   {
//     id: "library",
//     name: "Library Ambience",
//     url: "/sounds/library.mp3",
//     color: "from-gray-500 to-slate-500",
//   },
//   {
//     id: "night",
//     name: "Night Crickets",
//     url: "/sounds/night.mp3",
//     color: "from-indigo-500 to-purple-500",
//   },
//   {
//     id: "meditation",
//     name: "Meditation Bells",
//     url: "/sounds/meditation.mp3",
//     color: "from-pink-500 to-purple-500",
//   },
//   {
//     id: "waterfall",
//     name: "Waterfall",
//     url: "/sounds/waterfall.mp3",
//     color: "from-blue-400 to-cyan-400",
//   },
//   {
//     id: "birds",
//     name: "Morning Birds",
//     url: "/sounds/birds.mp3",
//     color: "from-yellow-500 to-green-500",
//   },
//   {
//     id: "piano",
//     name: "Soft Piano",
//     url: "/sounds/piano.mp3",
//     color: "from-purple-400 to-pink-400",
//   },
//   {
//     id: "white-noise",
//     name: "White Noise",
//     url: "/sounds/white-noise.mp3",
//     color: "from-gray-400 to-gray-600",
//   },
//   {
//     id: "brown-noise",
//     name: "Brown Noise",
//     url: "/sounds/brown-noise.mp3",
//     color: "from-amber-600 to-orange-600",
//   },
//   {
//     id: "pink-noise",
//     name: "Pink Noise",
//     url: "/sounds/pink-noise.mp3",
//     color: "from-pink-400 to-rose-400",
//   },
//   {
//     id: "space",
//     name: "Space Ambience",
//     url: "/sounds/space.mp3",
//     color: "from-indigo-600 to-purple-600",
//   },
//   {
//     id: "underwater",
//     name: "Underwater",
//     url: "/sounds/underwater.mp3",
//     color: "from-blue-600 to-teal-600",
//   },
//   {
//     id: "mountain",
//     name: "Mountain Wind",
//     url: "/sounds/mountain.mp3",
//     color: "from-slate-500 to-blue-500",
//   },
//   {
//     id: "zen",
//     name: "Zen Garden",
//     url: "/sounds/zen.mp3",
//     color: "from-green-400 to-teal-400",
//   },
// ];

// export default function MusicEffects({
//   isPlaying,
//   setIsPlaying,
//   currentTrack,
//   setCurrentTrack,
//   onNotification,
// }: MusicEffectsProps) {
//   const [volume, setVolume] = useState(0.5);
//   const [isMuted, setIsMuted] = useState(false);
//   const [isShuffled, setIsShuffled] = useState(false);
//   const [isRepeating, setIsRepeating] = useState(false);
//   const [currentTime, setCurrentTime] = useState(0);
//   const [duration, setDuration] = useState(0);
//   const audioRef = useRef<HTMLAudioElement>(null);

//   const currentSound =
//     ambientSounds.find((sound) => sound.id === currentTrack) ||
//     ambientSounds[0];

//   useEffect(() => {
//     if (audioRef.current) {
//       audioRef.current.volume = isMuted ? 0 : volume;
//     }
//   }, [volume, isMuted]);

//   useEffect(() => {
//     const audio = audioRef.current;
//     if (!audio) return;

//     const updateTime = () => setCurrentTime(audio.currentTime);
//     const updateDuration = () => setDuration(audio.duration);

//     audio.addEventListener("timeupdate", updateTime);
//     audio.addEventListener("loadedmetadata", updateDuration);
//     audio.addEventListener("ended", handleTrackEnd);

//     return () => {
//       audio.removeEventListener("timeupdate", updateTime);
//       audio.removeEventListener("loadedmetadata", updateDuration);
//       audio.removeEventListener("ended", handleTrackEnd);
//     };
//   }, [currentTrack]);

//   const handleTrackEnd = () => {
//     if (isRepeating) {
//       audioRef.current?.play();
//     } else {
//       playNext();
//     }
//   };

//   const togglePlay = () => {
//     if (audioRef.current) {
//       if (isPlaying) {
//         audioRef.current.pause();
//       } else {
//         audioRef.current.play();
//       }
//       setIsPlaying(!isPlaying);
//     }
//   };

//   const playTrack = (trackId: string) => {
//     setCurrentTrack(trackId);
//     setIsPlaying(true);
//     onNotification({
//       title: "Now Playing",
//       message: `${ambientSounds.find((s) => s.id === trackId)?.name}`,
//       type: "info",
//     });
//   };

//   const playNext = () => {
//     const currentIndex = ambientSounds.findIndex(
//       (sound) => sound.id === currentTrack
//     );
//     let nextIndex;

//     if (isShuffled) {
//       nextIndex = Math.floor(Math.random() * ambientSounds.length);
//     } else {
//       nextIndex = (currentIndex + 1) % ambientSounds.length;
//     }

//     playTrack(ambientSounds[nextIndex].id);
//   };

//   const playPrevious = () => {
//     const currentIndex = ambientSounds.findIndex(
//       (sound) => sound.id === currentTrack
//     );
//     const prevIndex =
//       currentIndex === 0 ? ambientSounds.length - 1 : currentIndex - 1;
//     playTrack(ambientSounds[prevIndex].id);
//   };

//   const formatTime = (seconds: number) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = Math.floor(seconds % 60);
//     return `${mins}:${secs.toString().padStart(2, "0")}`;
//   };

//   return (
//     <div className="grid grid-cols-12 gap-6 h-[calc(100vh-140px)]">
//       {/* Sound Library */}
//       <div className="col-span-12 lg:col-span-8">
//         <GlassPanel className="p-6 h-full" glow>
//           <h2 className="text-2xl font-bold text-white mb-6">
//             Ambient Sounds Library
//           </h2>

//           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 h-[calc(100%-80px)] overflow-y-auto custom-scrollbar">
//             <AnimatePresence>
//               {ambientSounds.map((sound, index) => (
//                 <motion.div
//                   key={sound.id}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: index * 0.05 }}
//                   whileHover={{ scale: 1.05, y: -5 }}
//                   whileTap={{ scale: 0.95 }}
//                   onClick={() => playTrack(sound.id)}
//                   className={`relative p-4 rounded-xl cursor-pointer transition-all duration-300 ${
//                     currentTrack === sound.id
//                       ? `bg-gradient-to-br ${sound.color} shadow-lg shadow-blue-500/25`
//                       : "bg-white/5 hover:bg-white/10"
//                   } backdrop-blur-sm border border-white/10`}
//                 >
//                   <div className="text-center">
//                     <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-white/10 flex items-center justify-center">
//                       {isPlaying && currentTrack === sound.id ? (
//                         <motion.div
//                           animate={{ scale: [1, 1.2, 1] }}
//                           transition={{
//                             duration: 1,
//                             repeat: Number.POSITIVE_INFINITY,
//                           }}
//                         >
//                           <Volume2 size={20} className="text-white" />
//                         </motion.div>
//                       ) : (
//                         <Play size={20} className="text-white/70" />
//                       )}
//                     </div>
//                     <h3 className="text-white text-sm font-medium">
//                       {sound.name}
//                     </h3>
//                   </div>

//                   {currentTrack === sound.id && (
//                     <motion.div
//                       initial={{ scale: 0 }}
//                       animate={{ scale: 1 }}
//                       className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
//                     >
//                       <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
//                     </motion.div>
//                   )}
//                 </motion.div>
//               ))}
//             </AnimatePresence>
//           </div>
//         </GlassPanel>
//       </div>

//       {/* Music Player */}
//       <div className="col-span-12 lg:col-span-4">
//         <GlassPanel className="p-6 h-full flex flex-col" glow>
//           <h3 className="text-xl font-bold text-white mb-6">Now Playing</h3>

//           <div className="flex-1 flex flex-col justify-center">
//             {/* Album Art */}
//             <div className="relative mb-6">
//               <motion.div
//                 animate={{ rotate: isPlaying ? 360 : 0 }}
//                 transition={{
//                   duration: 20,
//                   repeat: isPlaying ? Number.POSITIVE_INFINITY : 0,
//                   ease: "linear",
//                 }}
//                 className={`w-32 h-32 mx-auto rounded-full bg-gradient-to-br ${currentSound.color} flex items-center justify-center shadow-lg`}
//               >
//                 <Volume2 size={40} className="text-white" />
//               </motion.div>
//               {isPlaying && (
//                 <motion.div
//                   animate={{ scale: [1, 1.1, 1] }}
//                   transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
//                   className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent"
//                 />
//               )}
//             </div>

//             {/* Track Info */}
//             <div className="text-center mb-6">
//               <h4 className="text-lg font-semibold text-white mb-1">
//                 {currentSound.name}
//               </h4>
//               <p className="text-white/70 text-sm">Ambient Sounds</p>
//             </div>

//             {/* Progress Bar */}
//             <div className="mb-6">
//               <div className="flex justify-between text-xs text-white/70 mb-2">
//                 <span>{formatTime(currentTime)}</span>
//                 <span>{formatTime(duration)}</span>
//               </div>
//               <div className="h-2 bg-white/10 rounded-full overflow-hidden">
//                 <motion.div
//                   className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
//                   style={{
//                     width: `${
//                       duration > 0 ? (currentTime / duration) * 100 : 0
//                     }%`,
//                   }}
//                 />
//               </div>
//             </div>

//             {/* Controls */}
//             <div className="flex items-center justify-center gap-4 mb-6">
//               <motion.button
//                 whileHover={{ scale: 1.1 }}
//                 whileTap={{ scale: 0.9 }}
//                 onClick={() => setIsShuffled(!isShuffled)}
//                 className={`p-2 rounded-full transition-colors ${
//                   isShuffled
//                     ? "bg-blue-500 text-white"
//                     : "bg-white/10 text-white/70 hover:bg-white/20"
//                 }`}
//               >
//                 <Shuffle size={16} />
//               </motion.button>

//               <motion.button
//                 whileHover={{ scale: 1.1 }}
//                 whileTap={{ scale: 0.9 }}
//                 onClick={playPrevious}
//                 className="p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
//               >
//                 <SkipBack size={20} />
//               </motion.button>

//               <motion.button
//                 whileHover={{ scale: 1.1 }}
//                 whileTap={{ scale: 0.9 }}
//                 onClick={togglePlay}
//                 className="p-4 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
//               >
//                 {isPlaying ? <Pause size={24} /> : <Play size={24} />}
//               </motion.button>

//               <motion.button
//                 whileHover={{ scale: 1.1 }}
//                 whileTap={{ scale: 0.9 }}
//                 onClick={playNext}
//                 className="p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
//               >
//                 <SkipForward size={20} />
//               </motion.button>

//               <motion.button
//                 whileHover={{ scale: 1.1 }}
//                 whileTap={{ scale: 0.9 }}
//                 onClick={() => setIsRepeating(!isRepeating)}
//                 className={`p-2 rounded-full transition-colors ${
//                   isRepeating
//                     ? "bg-blue-500 text-white"
//                     : "bg-white/10 text-white/70 hover:bg-white/20"
//                 }`}
//               >
//                 <Repeat size={16} />
//               </motion.button>
//             </div>

//             {/* Volume Control */}
//             <div className="flex items-center gap-3">
//               <motion.button
//                 whileHover={{ scale: 1.1 }}
//                 whileTap={{ scale: 0.9 }}
//                 onClick={() => setIsMuted(!isMuted)}
//                 className="text-white/70 hover:text-white transition-colors"
//               >
//                 {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
//               </motion.button>
//               <input
//                 type="range"
//                 min="0"
//                 max="1"
//                 step="0.1"
//                 value={volume}
//                 onChange={(e) => setVolume(Number.parseFloat(e.target.value))}
//                 className="flex-1 accent-blue-500"
//               />
//               <span className="text-white/70 text-sm w-8">
//                 {Math.round(volume * 100)}
//               </span>
//             </div>
//           </div>

//           {/* Hidden Audio Element */}
//           <audio ref={audioRef} src={currentSound.url} loop={isRepeating} />
//         </GlassPanel>
//       </div>
//     </div>
//   );
// }
