// "use client";

// import { useState, useEffect, useRef } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   Play,
//   Pause,
//   RotateCcw,
//   Settings,
//   Timer,
//   Coffee,
//   Brain,
//   Target,
// } from "lucide-react";
// import GlassPanel from "@/components/ui/GlassPanel";

// interface FocusSession {
//   id: string;
//   type: "pomodoro" | "deep-work" | "break";
//   duration: number;
//   completedAt: Date;
// }

// interface FocusSectionProps {
//   onNotification: (notification: any) => void;
// }

// const focusModes = {
//   pomodoro: {
//     duration: 25,
//     label: "Pomodoro",
//     color: "from-red-500 to-orange-500",
//     icon: Timer,
//   },
//   "short-break": {
//     duration: 5,
//     label: "Short Break",
//     color: "from-green-500 to-teal-500",
//     icon: Coffee,
//   },
//   "long-break": {
//     duration: 15,
//     label: "Long Break",
//     color: "from-blue-500 to-purple-500",
//     icon: Coffee,
//   },
//   "deep-work": {
//     duration: 90,
//     label: "Deep Work",
//     color: "from-purple-500 to-pink-500",
//     icon: Brain,
//   },
// };

// export default function FocusSection({ onNotification }: FocusSectionProps) {
//   const [timeLeft, setTimeLeft] = useState(25 * 60);
//   const [isRunning, setIsRunning] = useState(false);
//   const [currentMode, setCurrentMode] =
//     useState<keyof typeof focusModes>("pomodoro");
//   const [sessions, setSessions] = useState<FocusSession[]>([]);
//   const [pomodoroCount, setPomodoroCount] = useState(0);
//   const [customDuration, setCustomDuration] = useState(25);
//   const [showSettings, setShowSettings] = useState(false);
//   const intervalRef = useRef<NodeJS.Timeout | null>(null);

//   useEffect(() => {
//     const savedSessions = localStorage.getItem("focus-sessions");
//     if (savedSessions) {
//       setSessions(JSON.parse(savedSessions));
//     }
//   }, []);

//   useEffect(() => {
//     localStorage.setItem("focus-sessions", JSON.stringify(sessions));
//   }, [sessions]);

//   useEffect(() => {
//     if (isRunning && timeLeft > 0) {
//       intervalRef.current = setInterval(() => {
//         setTimeLeft((prev) => {
//           if (prev <= 1) {
//             handleSessionComplete();
//             return 0;
//           }
//           return prev - 1;
//         });
//       }, 1000);
//     } else {
//       if (intervalRef.current) {
//         clearInterval(intervalRef.current);
//       }
//     }

//     return () => {
//       if (intervalRef.current) {
//         clearInterval(intervalRef.current);
//       }
//     };
//   }, [isRunning, timeLeft]);

//   const handleSessionComplete = () => {
//     setIsRunning(false);

//     // Add session to history
//     const newSession: FocusSession = {
//       id: Date.now().toString(),
//       type:
//         currentMode === "pomodoro" || currentMode === "deep-work"
//           ? currentMode
//           : "break",
//       duration: focusModes[currentMode].duration,
//       completedAt: new Date(),
//     };
//     setSessions((prev) => [...prev, newSession]);

//     // Handle pomodoro cycle
//     if (currentMode === "pomodoro") {
//       const newCount = pomodoroCount + 1;
//       setPomodoroCount(newCount);

//       if (newCount % 4 === 0) {
//         setCurrentMode("long-break");
//         setTimeLeft(focusModes["long-break"].duration * 60);
//       } else {
//         setCurrentMode("short-break");
//         setTimeLeft(focusModes["short-break"].duration * 60);
//       }

//       onNotification({
//         type: "success",
//         title: "Pomodoro Complete! 🍅",
//         message: `Great focus session! Time for a ${
//           newCount % 4 === 0 ? "long" : "short"
//         } break.`,
//       });
//     } else if (currentMode === "short-break" || currentMode === "long-break") {
//       setCurrentMode("pomodoro");
//       setTimeLeft(focusModes.pomodoro.duration * 60);

//       onNotification({
//         type: "info",
//         title: "Break Over! ⚡",
//         message: "Ready to focus? Let's start another pomodoro session.",
//       });
//     } else if (currentMode === "deep-work") {
//       onNotification({
//         type: "success",
//         title: "Deep Work Complete! 🧠",
//         message: "Excellent deep focus session! Take a well-deserved break.",
//       });
//     }

//     // Play completion sound
//     try {
//       const audio = new Audio();
//       // Create a simple completion tone
//       const audioContext = new (window.AudioContext ||
//         (window as any).webkitAudioContext)();
//       const oscillator = audioContext.createOscillator();
//       const gainNode = audioContext.createGain();

//       oscillator.connect(gainNode);
//       gainNode.connect(audioContext.destination);

//       oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
//       oscillator.type = "sine";

//       gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
//       gainNode.gain.exponentialRampToValueAtTime(
//         0.01,
//         audioContext.currentTime + 1
//       );

//       oscillator.start(audioContext.currentTime);
//       oscillator.stop(audioContext.currentTime + 1);
//     } catch (error) {
//       console.warn("Could not play completion sound:", error);
//     }
//   };

//   const toggleTimer = () => {
//     setIsRunning(!isRunning);
//   };

//   const resetTimer = () => {
//     setIsRunning(false);
//     setTimeLeft(focusModes[currentMode].duration * 60);
//   };

//   const switchMode = (mode: keyof typeof focusModes) => {
//     setCurrentMode(mode);
//     setTimeLeft(focusModes[mode].duration * 60);
//     setIsRunning(false);
//   };

//   const setCustomTimer = () => {
//     setTimeLeft(customDuration * 60);
//     setIsRunning(false);
//   };

//   const formatTime = (seconds: number) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins.toString().padStart(2, "0")}:${secs
//       .toString()
//       .padStart(2, "0")}`;
//   };

//   const progress =
//     ((focusModes[currentMode].duration * 60 - timeLeft) /
//       (focusModes[currentMode].duration * 60)) *
//     100;

//   const todaySessions = sessions.filter(
//     (session) =>
//       new Date(session.completedAt).toDateString() === new Date().toDateString()
//   );
//   const todayFocusTime = todaySessions.reduce(
//     (total, session) => total + session.duration,
//     0
//   );

//   return (
//     <div className="h-full overflow-y-auto custom-scrollbar">
//       <div className="max-w-4xl mx-auto space-y-6">
//         {/* Header */}
//         <motion.div
//           initial={{ y: -20, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           className="text-center"
//         >
//           <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent mb-2">
//             Focus Timer
//           </h1>
//           <p className="text-white/70">
//             Boost your productivity with focused work sessions
//           </p>
//         </motion.div>

//         {/* Stats */}
//         <motion.div
//           initial={{ y: 20, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ delay: 0.1 }}
//         >
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <GlassPanel className="p-4 text-center" glow>
//               <div className="text-2xl font-bold text-white mb-1">
//                 {Math.floor(todayFocusTime / 60)}h {todayFocusTime % 60}m
//               </div>
//               <div className="text-white/70 text-sm">Today's Focus</div>
//             </GlassPanel>

//             <GlassPanel className="p-4 text-center" glow>
//               <div className="text-2xl font-bold text-white mb-1">
//                 {todaySessions.length}
//               </div>
//               <div className="text-white/70 text-sm">Sessions Today</div>
//             </GlassPanel>

//             <GlassPanel className="p-4 text-center" glow>
//               <div className="text-2xl font-bold text-white mb-1">
//                 {pomodoroCount}
//               </div>
//               <div className="text-white/70 text-sm">Pomodoros</div>
//             </GlassPanel>
//           </div>
//         </motion.div>

//         {/* Main Timer */}
//         <motion.div
//           initial={{ y: 20, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ delay: 0.2 }}
//         >
//           <GlassPanel className="p-8 text-center" glow>
//             <div className="flex items-center justify-between mb-6">
//               <h3 className="text-xl font-semibold text-white">
//                 {focusModes[currentMode].label}
//               </h3>
//               <button
//                 onClick={() => setShowSettings(!showSettings)}
//                 className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
//               >
//                 <Settings size={20} />
//               </button>
//             </div>

//             {/* Circular Progress */}
//             <div className="relative w-48 h-48 mx-auto mb-8">
//               <svg
//                 className="w-full h-full transform -rotate-90"
//                 viewBox="0 0 100 100"
//               >
//                 <circle
//                   cx="50"
//                   cy="50"
//                   r="45"
//                   stroke="rgba(255,255,255,0.1)"
//                   strokeWidth="4"
//                   fill="none"
//                 />
//                 <motion.circle
//                   cx="50"
//                   cy="50"
//                   r="45"
//                   stroke="url(#timerGradient)"
//                   strokeWidth="4"
//                   fill="none"
//                   strokeLinecap="round"
//                   strokeDasharray={`${2 * Math.PI * 45}`}
//                   strokeDashoffset={`${
//                     2 * Math.PI * 45 * (1 - progress / 100)
//                   }`}
//                   initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
//                   animate={{
//                     strokeDashoffset: 2 * Math.PI * 45 * (1 - progress / 100),
//                   }}
//                   transition={{ duration: 0.5 }}
//                 />
//                 <defs>
//                   <linearGradient
//                     id="timerGradient"
//                     x1="0%"
//                     y1="0%"
//                     x2="100%"
//                     y2="100%"
//                   >
//                     <stop offset="0%" stopColor="#F97316" />
//                     <stop offset="100%" stopColor="#EF4444" />
//                   </linearGradient>
//                 </defs>
//               </svg>

//               <div className="absolute inset-0 flex items-center justify-center">
//                 <div className="text-center">
//                   <div className="text-4xl font-bold text-white mb-2">
//                     {formatTime(timeLeft)}
//                   </div>
//                   <div className="text-white/70 text-sm">
//                     {isRunning ? "Focus Time" : "Ready to Start"}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Controls */}
//             <div className="flex justify-center gap-4 mb-6">
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={toggleTimer}
//                 className={`bg-gradient-to-r ${focusModes[currentMode].color} p-4 rounded-full text-white shadow-lg hover:shadow-xl transition-all duration-300`}
//               >
//                 {isRunning ? <Pause size={24} /> : <Play size={24} />}
//               </motion.button>

//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={resetTimer}
//                 className="bg-white/10 p-4 rounded-full text-white hover:bg-white/20 transition-all duration-300"
//               >
//                 <RotateCcw size={24} />
//               </motion.button>
//             </div>

//             {/* Mode Switcher */}
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
//               {Object.entries(focusModes).map(([key, mode]) => (
//                 <motion.button
//                   key={key}
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                   onClick={() => switchMode(key as keyof typeof focusModes)}
//                   className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
//                     currentMode === key
//                       ? `bg-gradient-to-r ${mode.color} text-white shadow-lg`
//                       : "bg-white/10 text-white/70 hover:bg-white/20"
//                   }`}
//                 >
//                   <mode.icon size={16} className="mx-auto mb-1" />
//                   {mode.label}
//                 </motion.button>
//               ))}
//             </div>

//             {/* Settings */}
//             <AnimatePresence>
//               {showSettings && (
//                 <motion.div
//                   initial={{ opacity: 0, height: 0 }}
//                   animate={{ opacity: 1, height: "auto" }}
//                   exit={{ opacity: 0, height: 0 }}
//                   className="mt-6 pt-6 border-t border-white/10"
//                 >
//                   <div className="flex items-center gap-4">
//                     <label className="text-white/70">
//                       Custom Duration (minutes):
//                     </label>
//                     <input
//                       type="number"
//                       value={customDuration}
//                       onChange={(e) =>
//                         setCustomDuration(Number(e.target.value))
//                       }
//                       min="1"
//                       max="180"
//                       className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white w-20 text-center"
//                     />
//                     <button
//                       onClick={setCustomTimer}
//                       className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
//                     >
//                       Set
//                     </button>
//                   </div>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </GlassPanel>
//         </motion.div>

//         {/* Recent Sessions */}
//         <motion.div
//           initial={{ y: 20, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ delay: 0.3 }}
//         >
//           <GlassPanel className="p-6" glow>
//             <h3 className="text-white font-semibold text-lg mb-4">
//               Today's Sessions
//             </h3>

//             {todaySessions.length === 0 ? (
//               <div className="text-center py-8">
//                 <Target className="text-white/30 mx-auto mb-4" size={48} />
//                 <p className="text-white/50">
//                   No sessions completed today. Start your first focus session!
//                 </p>
//               </div>
//             ) : (
//               <div className="space-y-2">
//                 {todaySessions
//                   .slice(-5)
//                   .reverse()
//                   .map((session) => (
//                     <div
//                       key={session.id}
//                       className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
//                     >
//                       <div className="flex items-center gap-3">
//                         <div
//                           className={`w-3 h-3 rounded-full bg-gradient-to-r ${
//                             session.type === "pomodoro"
//                               ? "from-red-500 to-orange-500"
//                               : session.type === "deep-work"
//                               ? "from-purple-500 to-pink-500"
//                               : "from-green-500 to-teal-500"
//                           }`}
//                         />
//                         <span className="text-white capitalize">
//                           {session.type.replace("-", " ")}
//                         </span>
//                       </div>
//                       <div className="text-white/70 text-sm">
//                         {session.duration}m •{" "}
//                         {new Date(session.completedAt).toLocaleTimeString([], {
//                           hour: "2-digit",
//                           minute: "2-digit",
//                         })}
//                       </div>
//                     </div>
//                   ))}
//               </div>
//             )}
//           </GlassPanel>
//         </motion.div>
//       </div>
//     </div>
//   );
// }
