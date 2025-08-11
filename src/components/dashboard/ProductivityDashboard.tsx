// "use client";

// import { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import { useTheme } from "next-themes";
// import TodoManager from "./TodoManager";
// import PomodoroTimer from "./PomodoroTimer";
// import HabitTracker from "./HabitTracker";
// import CalendarWidget from "./CalendarWidget";
// import GoalsWidget from "./GoalsWidget";
// import AnalyticsWidget from "./AnalyticsWidget";
// import WeatherWidget from "./WeatherWidget";
// import StressManagement from "./StressManagement";
// import ExerciseComponent from "./ExerciseComponent";
// import FloatingNavbar from "./FloatingNavbar";
// import NotificationSystem from "./NotificationSystem";
// import MusicEffects from "./MusicEffects";
// import type { Todo, Habit, Goal, Note } from "./types";

// interface ProductivityDashboardProps {
//   weatherEffect: "none" | "rain" | "snow";
//   setWeatherEffect: (effect: "none" | "rain" | "snow") => void;
// }

// export default function ProductivityDashboard({
//   weatherEffect,
//   setWeatherEffect,
// }: ProductivityDashboardProps) {
//   const [todos, setTodos] = useState<Todo[]>([]);
//   const [habits, setHabits] = useState<Habit[]>([]);
//   const [goals, setGoals] = useState<Goal[]>([]);
//   const [notes, setNotes] = useState<Note[]>([]);
//   const [notifications, setNotifications] = useState<any[]>([]);
//   const [focusMode, setFocusMode] = useState(false);
//   const [activeComponent, setActiveComponent] = useState("dashboard");
//   const [musicPlaying, setMusicPlaying] = useState(false);
//   const [currentTrack, setCurrentTrack] = useState("");
//   const { theme } = useTheme();

//   // Initialize data
//   useEffect(() => {
//     const savedTodos = localStorage.getItem("todos");
//     const savedHabits = localStorage.getItem("habits");
//     const savedGoals = localStorage.getItem("goals");
//     const savedNotes = localStorage.getItem("notes");

//     if (savedTodos) setTodos(JSON.parse(savedTodos));
//     if (savedHabits) setHabits(JSON.parse(savedHabits));
//     if (savedGoals) setGoals(JSON.parse(savedGoals));
//     if (savedNotes) setNotes(JSON.parse(savedNotes));

//     if ("Notification" in window && Notification.permission === "default") {
//       Notification.requestPermission();
//     }
//   }, []);

//   // Save to localStorage
//   useEffect(() => {
//     localStorage.setItem("todos", JSON.stringify(todos));
//   }, [todos]);

//   useEffect(() => {
//     localStorage.setItem("habits", JSON.stringify(habits));
//   }, [habits]);

//   useEffect(() => {
//     localStorage.setItem("goals", JSON.stringify(goals));
//   }, [goals]);

//   useEffect(() => {
//     localStorage.setItem("notes", JSON.stringify(notes));
//   }, [notes]);

//   const addNotification = (notification: any) => {
//     const newNotification = { ...notification, id: Date.now().toString() };
//     setNotifications((prev) => [...prev, newNotification]);

//     setTimeout(() => {
//       removeNotification(newNotification.id);
//     }, 5000);
//   };

//   const removeNotification = (id: string) => {
//     setNotifications((prev) => prev.filter((n) => n.id !== id));
//   };

//   const renderActiveComponent = () => {
//     switch (activeComponent) {
//       case "stress":
//         return <StressManagement onNotification={addNotification} />;
//       case "exercise":
//         return <ExerciseComponent onNotification={addNotification} />;
//       case "music":
//         return (
//           <MusicEffects
//             isPlaying={musicPlaying}
//             setIsPlaying={setMusicPlaying}
//             currentTrack={currentTrack}
//             setCurrentTrack={setCurrentTrack}
//             onNotification={addNotification}
//           />
//         );
//       default:
//         return (
//           <div className="grid grid-cols-12 gap-4 h-[calc(100vh-140px)]">
//             {/* Left Column */}
//             <div className="col-span-12 lg:col-span-4 space-y-4">
//               <motion.div
//                 initial={{ x: -50, opacity: 0 }}
//                 animate={{ x: 0, opacity: 1 }}
//                 transition={{ delay: 0.1 }}
//               >
//                 <TodoManager
//                   todos={todos}
//                   setTodos={setTodos}
//                   onNotification={addNotification}
//                 />
//               </motion.div>
//             </div>

//             {/* Center Column */}
//             <div className="col-span-12 lg:col-span-5 space-y-4">
//               <div className="grid grid-cols-2 gap-4 h-1/2">
//                 <motion.div
//                   initial={{ y: -50, opacity: 0 }}
//                   animate={{ y: 0, opacity: 1 }}
//                   transition={{ delay: 0.2 }}
//                 >
//                   <PomodoroTimer onNotification={addNotification} />
//                 </motion.div>
//                 <motion.div
//                   initial={{ y: -50, opacity: 0 }}
//                   animate={{ y: 0, opacity: 1 }}
//                   transition={{ delay: 0.3 }}
//                 >
//                   <HabitTracker habits={habits} setHabits={setHabits} />
//                 </motion.div>
//               </div>

//               <div className="grid grid-cols-2 gap-4 h-1/2">
//                 <motion.div
//                   initial={{ y: 50, opacity: 0 }}
//                   animate={{ y: 0, opacity: 1 }}
//                   transition={{ delay: 0.4 }}
//                 >
//                   <GoalsWidget goals={goals} setGoals={setGoals} />
//                 </motion.div>
//                 <motion.div
//                   initial={{ y: 50, opacity: 0 }}
//                   animate={{ y: 0, opacity: 1 }}
//                   transition={{ delay: 0.5 }}
//                 >
//                   <CalendarWidget />
//                 </motion.div>
//               </div>
//             </div>

//             {/* Right Column */}
//             <div className="col-span-12 lg:col-span-3 space-y-4">
//               <motion.div
//                 initial={{ x: 50, opacity: 0 }}
//                 animate={{ x: 0, opacity: 1 }}
//                 transition={{ delay: 0.6 }}
//               >
//                 <AnalyticsWidget todos={todos} habits={habits} goals={goals} />
//               </motion.div>

//               <motion.div
//                 initial={{ x: 50, opacity: 0 }}
//                 animate={{ x: 0, opacity: 1 }}
//                 transition={{ delay: 0.7 }}
//               >
//                 <WeatherWidget />
//               </motion.div>
//             </div>
//           </div>
//         );
//     }
//   };

//   return (
//     <div className="min-h-screen p-4 relative">
//       {/* Header */}
//       <motion.header
//         initial={{ y: -50, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         className="flex items-center justify-between mb-6"
//       >
//         <div>
//           <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
//             Productivity Hub
//           </h1>
//           <p className="text-white/70 mt-1">Your futuristic workspace</p>
//         </div>
//       </motion.header>

//       {/* Main Content */}
//       {renderActiveComponent()}

//       {/* Floating Navbar */}
//       <FloatingNavbar
//         activeComponent={activeComponent}
//         setActiveComponent={setActiveComponent}
//         weatherEffect={weatherEffect}
//         setWeatherEffect={setWeatherEffect}
//         focusMode={focusMode}
//         setFocusMode={setFocusMode}
//         musicPlaying={musicPlaying}
//         onNotification={addNotification}
//       />

//       {/* Notification System */}
//       <NotificationSystem
//         notifications={notifications}
//         onRemove={removeNotification}
//       />
//     </div>
//   );
// }
