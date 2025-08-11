// "use client";

// import { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   Home,
//   Brain,
//   Dumbbell,
//   Music,
//   Cloud,
//   Sun,
//   CloudRain,
//   CloudSnow,
//   Focus,
//   Settings,
//   Palette,
//   Volume2,
//   VolumeX,
// } from "lucide-react";
// import GlassPanel from "@/components/ui/GlassPanel";
// import { useTheme } from "next-themes";

// interface FloatingNavbarProps {
//   activeComponent: string;
//   setActiveComponent: (component: string) => void;
//   weatherEffect: "none" | "rain" | "snow";
//   setWeatherEffect: (effect: "none" | "rain" | "snow") => void;
//   focusMode: boolean;
//   setFocusMode: (focus: boolean) => void;
//   musicPlaying: boolean;
//   onNotification: (notification: any) => void;
// }

// export default function FloatingNavbar({
//   activeComponent,
//   setActiveComponent,
//   weatherEffect,
//   setWeatherEffect,
//   focusMode,
//   setFocusMode,
//   musicPlaying,
//   onNotification,
// }: FloatingNavbarProps) {
//   const [isExpanded, setIsExpanded] = useState(false);
//   const [showWeatherMenu, setShowWeatherMenu] = useState(false);
//   const [showThemeMenu, setShowThemeMenu] = useState(false);
//   const { theme, setTheme } = useTheme();

//   const navItems = [
//     {
//       id: "dashboard",
//       icon: Home,
//       label: "Dashboard",
//       color: "from-blue-500 to-cyan-500",
//     },
//     {
//       id: "stress",
//       icon: Brain,
//       label: "Stress Relief",
//       color: "from-green-500 to-teal-500",
//     },
//     {
//       id: "exercise",
//       icon: Dumbbell,
//       label: "Exercise",
//       color: "from-orange-500 to-red-500",
//     },
//     {
//       id: "music",
//       icon: Music,
//       label: "Music & Sounds",
//       color: "from-purple-500 to-pink-500",
//     },
//   ];

//   const weatherOptions = [
//     {
//       id: "none",
//       icon: Sun,
//       label: "Clear",
//       color: "from-yellow-500 to-orange-500",
//     },
//     {
//       id: "rain",
//       icon: CloudRain,
//       label: "Rain",
//       color: "from-blue-500 to-indigo-500",
//     },
//     {
//       id: "snow",
//       icon: CloudSnow,
//       label: "Snow",
//       color: "from-cyan-500 to-blue-500",
//     },
//   ];

//   const themes = [
//     { id: "dark", label: "Dark Blue", color: "from-slate-800 to-blue-900" },
//     { id: "light", label: "Light", color: "from-white to-gray-100" },
//     { id: "system", label: "System", color: "from-blue-500 to-purple-500" },
//   ];

//   const handleNavClick = (id: string) => {
//     setActiveComponent(id);
//     setIsExpanded(false);
//     onNotification({
//       title: "Navigation",
//       message: `Switched to ${navItems.find((item) => item.id === id)?.label}`,
//       type: "info",
//     });
//   };

//   const handleWeatherChange = (effect: "none" | "rain" | "snow") => {
//     setWeatherEffect(effect);
//     setShowWeatherMenu(false);
//     onNotification({
//       title: "Weather Effect",
//       message: `${
//         effect === "none"
//           ? "Disabled"
//           : effect.charAt(0).toUpperCase() + effect.slice(1)
//       } effect activated`,
//       type: "info",
//     });
//   };

//   return (
//     <>
//       {/* Main Floating Navbar */}
//       <motion.div
//         initial={{ y: 100, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
//       >
//         <GlassPanel className="px-4 py-3" glow>
//           <div className="flex items-center gap-3">
//             {/* Navigation Items */}
//             <AnimatePresence>
//               {(isExpanded ? navItems : navItems.slice(0, 1)).map(
//                 (item, index) => (
//                   <motion.button
//                     key={item.id}
//                     initial={
//                       isExpanded ? { opacity: 0, scale: 0.8, x: -20 } : {}
//                     }
//                     animate={{ opacity: 1, scale: 1, x: 0 }}
//                     exit={{ opacity: 0, scale: 0.8, x: -20 }}
//                     transition={{ delay: index * 0.1 }}
//                     whileHover={{ scale: 1.1, y: -5 }}
//                     whileTap={{ scale: 0.95 }}
//                     onClick={() => handleNavClick(item.id)}
//                     className={`p-3 rounded-full transition-all duration-300 ${
//                       activeComponent === item.id
//                         ? `bg-gradient-to-r ${item.color} shadow-lg`
//                         : "bg-white/10 hover:bg-white/20"
//                     }`}
//                   >
//                     <item.icon size={20} className="text-white" />
//                   </motion.button>
//                 )
//               )}
//             </AnimatePresence>

//             {/* Divider */}
//             <div className="w-px h-8 bg-white/20" />

//             {/* Weather Effects */}
//             <div className="relative">
//               <motion.button
//                 whileHover={{ scale: 1.1, y: -5 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={() => setShowWeatherMenu(!showWeatherMenu)}
//                 className={`p-3 rounded-full transition-all duration-300 ${
//                   weatherEffect !== "none"
//                     ? "bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg"
//                     : "bg-white/10 hover:bg-white/20"
//                 }`}
//               >
//                 <Cloud size={20} className="text-white" />
//               </motion.button>

//               <AnimatePresence>
//                 {showWeatherMenu && (
//                   <motion.div
//                     initial={{ opacity: 0, y: 10, scale: 0.9 }}
//                     animate={{ opacity: 1, y: 0, scale: 1 }}
//                     exit={{ opacity: 0, y: 10, scale: 0.9 }}
//                     className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2"
//                   >
//                     <GlassPanel className="p-2">
//                       <div className="flex flex-col gap-2">
//                         {weatherOptions.map((option) => (
//                           <motion.button
//                             key={option.id}
//                             whileHover={{ scale: 1.05 }}
//                             whileTap={{ scale: 0.95 }}
//                             onClick={() =>
//                               handleWeatherChange(option.id as any)
//                             }
//                             className={`flex items-center gap-2 p-2 rounded-lg transition-all duration-300 ${
//                               weatherEffect === option.id
//                                 ? `bg-gradient-to-r ${option.color} text-white`
//                                 : "hover:bg-white/10 text-white/70"
//                             }`}
//                           >
//                             <option.icon size={16} />
//                             <span className="text-sm">{option.label}</span>
//                           </motion.button>
//                         ))}
//                       </div>
//                     </GlassPanel>
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </div>

//             {/* Focus Mode */}
//             <motion.button
//               whileHover={{ scale: 1.1, y: -5 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={() => setFocusMode(!focusMode)}
//               className={`p-3 rounded-full transition-all duration-300 ${
//                 focusMode
//                   ? "bg-gradient-to-r from-red-500 to-orange-500 shadow-lg"
//                   : "bg-white/10 hover:bg-white/20"
//               }`}
//             >
//               <Focus size={20} className="text-white" />
//             </motion.button>

//             {/* Music Indicator */}
//             <motion.button
//               whileHover={{ scale: 1.1, y: -5 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={() => setActiveComponent("music")}
//               className={`p-3 rounded-full transition-all duration-300 ${
//                 musicPlaying
//                   ? "bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg animate-pulse"
//                   : "bg-white/10 hover:bg-white/20"
//               }`}
//             >
//               {musicPlaying ? (
//                 <Volume2 size={20} className="text-white" />
//               ) : (
//                 <VolumeX size={20} className="text-white" />
//               )}
//             </motion.button>

//             {/* Theme Selector */}
//             <div className="relative">
//               <motion.button
//                 whileHover={{ scale: 1.1, y: -5 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={() => setShowThemeMenu(!showThemeMenu)}
//                 className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300"
//               >
//                 <Palette size={20} className="text-white" />
//               </motion.button>

//               <AnimatePresence>
//                 {showThemeMenu && (
//                   <motion.div
//                     initial={{ opacity: 0, y: 10, scale: 0.9 }}
//                     animate={{ opacity: 1, y: 0, scale: 1 }}
//                     exit={{ opacity: 0, y: 10, scale: 0.9 }}
//                     className="absolute bottom-full mb-2 right-0"
//                   >
//                     <GlassPanel className="p-2">
//                       <div className="flex flex-col gap-2 min-w-[120px]">
//                         {themes.map((themeOption) => (
//                           <motion.button
//                             key={themeOption.id}
//                             whileHover={{ scale: 1.05 }}
//                             whileTap={{ scale: 0.95 }}
//                             onClick={() => {
//                               setTheme(themeOption.id);
//                               setShowThemeMenu(false);
//                             }}
//                             className={`flex items-center gap-2 p-2 rounded-lg transition-all duration-300 ${
//                               theme === themeOption.id
//                                 ? `bg-gradient-to-r ${themeOption.color} text-white`
//                                 : "hover:bg-white/10 text-white/70"
//                             }`}
//                           >
//                             <div
//                               className={`w-3 h-3 rounded-full bg-gradient-to-r ${themeOption.color}`}
//                             />
//                             <span className="text-sm">{themeOption.label}</span>
//                           </motion.button>
//                         ))}
//                       </div>
//                     </GlassPanel>
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </div>

//             {/* Expand/Collapse Button */}
//             <motion.button
//               whileHover={{ scale: 1.1, y: -5 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={() => setIsExpanded(!isExpanded)}
//               className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg transition-all duration-300"
//             >
//               <motion.div
//                 animate={{ rotate: isExpanded ? 45 : 0 }}
//                 transition={{ duration: 0.2 }}
//               >
//                 <Settings size={20} className="text-white" />
//               </motion.div>
//             </motion.button>
//           </div>
//         </GlassPanel>
//       </motion.div>

//       {/* Focus Mode Overlay */}
//       <AnimatePresence>
//         {focusMode && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 pointer-events-none"
//           />
//         )}
//       </AnimatePresence>
//     </>
//   );
// }
