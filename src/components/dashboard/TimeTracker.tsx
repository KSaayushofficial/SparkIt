// "use client";

// import { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import { Play, Pause, Square, Clock } from "lucide-react";
// import GlassPanel from "@/components/ui/GlassPanel";

// export default function TimeTracker() {
//   const [isTracking, setIsTracking] = useState(false);
//   const [currentTime, setCurrentTime] = useState(0);
//   const [totalTime, setTotalTime] = useState(0);
//   const [currentProject, setCurrentProject] = useState("General");

//   const projects = ["General", "Work", "Learning", "Exercise", "Reading"];

//   useEffect(() => {
//     let interval: NodeJS.Timeout;
//     if (isTracking) {
//       interval = setInterval(() => {
//         setCurrentTime((prev) => prev + 1);
//       }, 1000);
//     }
//     return () => clearInterval(interval);
//   }, [isTracking]);

//   const startTracking = () => {
//     setIsTracking(true);
//   };

//   const pauseTracking = () => {
//     setIsTracking(false);
//   };

//   const stopTracking = () => {
//     setIsTracking(false);
//     setTotalTime((prev) => prev + currentTime);
//     setCurrentTime(0);
//   };

//   const formatTime = (seconds: number) => {
//     const hours = Math.floor(seconds / 3600);
//     const mins = Math.floor((seconds % 3600) / 60);
//     const secs = seconds % 60;
//     return `${hours.toString().padStart(2, "0")}:${mins
//       .toString()
//       .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
//   };

//   return (
//     <GlassPanel className="p-6 h-full flex flex-col" glow>
//       <div className="flex items-center gap-2 mb-4">
//         <Clock size={18} className="text-cyan-400" />
//         <h3 className="text-lg font-semibold text-white">Time Tracker</h3>
//       </div>

//       <div className="flex-1 flex flex-col justify-center space-y-4">
//         <select
//           value={currentProject}
//           onChange={(e) => setCurrentProject(e.target.value)}
//           className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 backdrop-blur-sm"
//         >
//           {projects.map((project) => (
//             <option key={project} value={project}>
//               {project}
//             </option>
//           ))}
//         </select>

//         <div className="text-center">
//           <div className="text-3xl font-bold text-white mb-2">
//             {formatTime(currentTime)}
//           </div>
//           <div className="text-sm text-white/70">Current Session</div>
//         </div>

//         <div className="flex justify-center gap-2">
//           {!isTracking ? (
//             <motion.button
//               whileHover={{
//                 scale: 1.1,
//                 boxShadow: "0 0 20px rgba(6, 182, 212, 0.5)",
//               }}
//               whileTap={{ scale: 0.95 }}
//               onClick={startTracking}
//               className="bg-gradient-to-r from-cyan-500 to-blue-500 p-3 rounded-full text-white shadow-lg transition-all duration-300"
//             >
//               <Play size={20} />
//             </motion.button>
//           ) : (
//             <>
//               <motion.button
//                 whileHover={{ scale: 1.1 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={pauseTracking}
//                 className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-full text-white shadow-lg transition-all duration-300"
//               >
//                 <Pause size={20} />
//               </motion.button>
//               <motion.button
//                 whileHover={{ scale: 1.1 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={stopTracking}
//                 className="bg-gradient-to-r from-gray-500 to-gray-600 p-3 rounded-full text-white shadow-lg transition-all duration-300"
//               >
//                 <Square size={20} />
//               </motion.button>
//             </>
//           )}
//         </div>

//         <div className="text-center">
//           <div className="text-lg font-semibold text-white">
//             {formatTime(totalTime)}
//           </div>
//           <div className="text-xs text-white/70">Total Today</div>
//         </div>
//       </div>
//     </GlassPanel>
//   );
// }
