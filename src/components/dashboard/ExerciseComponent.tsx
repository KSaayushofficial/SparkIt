// "use client"

// import { useState, useEffect } from "react"
// import { motion } from "framer-motion"
// import { Play, Pause, RotateCcw, Timer, Zap, Target, Award } from "lucide-react"
// import GlassPanel from "@/components/ui/GlassPanel"

// interface ExerciseComponentProps {
//   onNotification: (notification: any) => void
// }

// const workoutCategories = [
//   {
//     id: "cardio",
//     name: "Cardio Boost",
//     description: "Get your heart pumping",
//     color: "from-red-500 to-orange-500",
//     exercises: [
//       {
//         id: "jumping-jacks",
//         name: "Jumping Jacks",
//         duration: 30,
//         rest: 10,
//         image: "/placeholder.svg?height=200&width=300&text=Jumping+Jacks",
//         instructions: [
//           "Stand with feet together",
//           "Jump while spreading legs",
//           "Raise arms overhead",
//           "Return to start",
//         ],
//       },
//       {
//         id: "high-knees",
//         name: "High Knees",
//         duration: 30,
//         rest: 10,
//         image: "/placeholder.svg?height=200&width=300&text=High+Knees",
//         instructions: ["Stand tall", "Lift knees to waist level", "Pump arms naturally", "Keep core engaged"],
//       },
//       {
//         id: "burpees",
//         name: "Burpees",
//         duration: 30,
//         rest: 15,
//         image: "/placeholder.svg?height=200&width=300&text=Burpees",
//         instructions: ["Start standing", "Drop to squat", "Jump back to plank", "Jump forward and up"],
//       },
//     ],
//   },
//   {
//     id: "strength",
//     name: "Strength Training",
//     description: "Build muscle and endurance",
//     color: "from-blue-500 to-purple-500",
//     exercises: [
//       {
//         id: "push-ups",
//         name: "Push-ups",
//         duration: 30,
//         rest: 15,
//         image: "/placeholder.svg?height=200&width=300&text=Push-ups",
//         instructions: ["Start in plank position", "Lower chest to ground", "Push back up", "Keep body straight"],
//       },
//       {
//         id: "squats",
//         name: "Squats",
//         duration: 30,
//         rest: 10,
//         image: "/placeholder.svg?height=200&width=300&text=Squats",
//         instructions: [
//           "Stand with feet hip-width",
//           "Lower as if sitting",
//           "Keep knees behind toes",
//           "Return to standing",
//         ],
//       },
//       {
//         id: "plank",
//         name: "Plank Hold",
//         duration: 30,
//         rest: 15,
//         image: "/placeholder.svg?height=200&width=300&text=Plank",
//         instructions: ["Start in push-up position", "Hold body straight", "Engage core muscles", "Breathe steadily"],
//       },
//     ],
//   },
//   {
//     id: "flexibility",
//     name: "Flexibility & Stretch",
//     description: "Improve mobility and reduce tension",
//     color: "from-green-500 to-teal-500",
//     exercises: [
//       {
//         id: "neck-rolls",
//         name: "Neck Rolls",
//         duration: 20,
//         rest: 5,
//         image: "/placeholder.svg?height=200&width=300&text=Neck+Rolls",
//         instructions: [
//           "Sit or stand tall",
//           "Slowly roll head in circles",
//           "Change direction halfway",
//           "Keep movements gentle",
//         ],
//       },
//       {
//         id: "shoulder-shrugs",
//         name: "Shoulder Shrugs",
//         duration: 20,
//         rest: 5,
//         image: "/placeholder.svg?height=200&width=300&text=Shoulder+Shrugs",
//         instructions: ["Lift shoulders to ears", "Hold for 2 seconds", "Release slowly", "Repeat rhythmically"],
//       },
//       {
//         id: "spinal-twist",
//         name: "Spinal Twist",
//         duration: 30,
//         rest: 10,
//         image: "/placeholder.svg?height=200&width=300&text=Spinal+Twist",
//         instructions: ["Sit with legs extended", "Twist torso to right", "Hold and breathe", "Repeat on left side"],
//       },
//     ],
//   },
//   {
//     id: "mental",
//     name: "Mental Wellness",
//     description: "Exercises for mental clarity",
//     color: "from-purple-500 to-pink-500",
//     exercises: [
//       {
//         id: "eye-exercises",
//         name: "Eye Exercises",
//         duration: 20,
//         rest: 5,
//         image: "/placeholder.svg?height=200&width=300&text=Eye+Exercises",
//         instructions: ["Look up and down", "Look left and right", "Roll eyes in circles", "Focus near then far"],
//       },
//       {
//         id: "desk-stretches",
//         name: "Desk Stretches",
//         duration: 30,
//         rest: 10,
//         image: "/placeholder.svg?height=200&width=300&text=Desk+Stretches",
//         instructions: ["Stretch arms overhead", "Twist side to side", "Roll shoulders back", "Stretch neck gently"],
//       },
//     ],
//   },
// ]

// export default function ExerciseComponent({ onNotification }: ExerciseComponentProps) {
//   const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
//   const [activeWorkout, setActiveWorkout] = useState<any>(null)
//   const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
//   const [isActive, setIsActive] = useState(false)
//   const [timeLeft, setTimeLeft] = useState(0)
//   const [isResting, setIsResting] = useState(false)
//   const [completedExercises, setCompletedExercises] = useState(0)
//   const [totalCalories, setTotalCalories] = useState(0)

//   const currentCategory = workoutCategories.find((cat) => cat.id === selectedCategory)
//   const currentExercise = activeWorkout?.exercises[currentExerciseIndex]

//   useEffect(() => {
//     let interval: NodeJS.Timeout
//     if (isActive && timeLeft > 0) {
//       interval = setInterval(() => {
//         setTimeLeft((prev) => prev - 1)
//       }, 1000)
//     } else if (isActive && timeLeft === 0) {
//       handleExerciseComplete()
//     }

//     return () => clearInterval(interval)
//   }, [isActive, timeLeft])

//   const startWorkout = (category: any) => {
//     setActiveWorkout(category)
//     setCurrentExerciseIndex(0)
//     setTimeLeft(category.exercises[0].duration)
//     setIsResting(false)
//     setCompletedExercises(0)
//     setTotalCalories(0)
//     onNotification({
//       title: "Workout Started",
//       message: `Starting ${category.name} workout`,
//       type: "info",
//     })
//   }

//   const handleExerciseComplete = () => {
//     if (!activeWorkout) return

//     if (isResting) {
//       // Rest period complete, move to next exercise or finish
//       if (currentExerciseIndex < activeWorkout.exercises.length - 1) {
//         setCurrentExerciseIndex((prev) => prev + 1)
//         setTimeLeft(activeWorkout.exercises[currentExerciseIndex + 1].duration)
//         setIsResting(false)
//       } else {
//         // Workout complete
//         completeWorkout()
//       }
//     } else {
//       // Exercise complete, start rest period
//       setCompletedExercises((prev) => prev + 1)
//       setTotalCalories((prev) => prev + Math.floor(Math.random() * 10) + 5) // Simulate calories
//       setTimeLeft(currentExercise.rest)
//       setIsResting(true)

//       onNotification({
//         title: "Exercise Complete!",
//         message: `Great job on ${currentExercise.name}!`,
//         type: "success",
//       })
//     }
//   }

//   const completeWorkout = () => {
//     setIsActive(false)
//     setActiveWorkout(null)
//     setCurrentExerciseIndex(0)
//     setTimeLeft(0)
//     setIsResting(false)

//     onNotification({
//       title: "🎉 Workout Complete!",
//       message: `You completed ${completedExercises} exercises and burned ~${totalCalories} calories!`,
//       type: "success",
//     })
//   }

//   const toggleWorkout = () => {
//     setIsActive(!isActive)
//   }

//   const resetWorkout = () => {
//     setIsActive(false)
//     setCurrentExerciseIndex(0)
//     setTimeLeft(activeWorkout?.exercises[0].duration || 0)
//     setIsResting(false)
//     setCompletedExercises(0)
//     setTotalCalories(0)
//   }

//   const skipExercise = () => {
//     if (currentExerciseIndex < activeWorkout.exercises.length - 1) {
//       setCurrentExerciseIndex((prev) => prev + 1)
//       setTimeLeft(activeWorkout.exercises[currentExerciseIndex + 1].duration)
//       setIsResting(false)
//     } else {
//       completeWorkout()
//     }
//   }

//   return (
//     <div className="grid grid-cols-12 gap-6 h-[calc(100vh-140px)]">
//       {/* Main Workout Area */}
//       <div className="col-span-12 lg:col-span-8">
//         <GlassPanel className="p-6 h-full" glow>
//           {!activeWorkout ? (
//             /* Category Selection */
//             <div>
//               <h2 className="text-2xl font-bold text-white mb-6">Choose Your Workout</h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {workoutCategories.map((category, index) => (
//                   <motion.div
//                     key={category.id}
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: index * 0.1 }}
//                     whileHover={{ scale: 1.02, y: -5 }}
//                     whileTap={{ scale: 0.98 }}
//                     onClick={() => startWorkout(category)}
//                     className={`p-6 rounded-xl cursor-pointer transition-all duration-300 bg-gradient-to-br ${category.color} hover:shadow-lg backdrop-blur-sm border border-white/10`}
//                   >
//                     <div className="text-center">
//                       <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center">
//                         <Zap size={32} className="text-white" />
//                       </div>
//                       <h3 className="text-xl font-bold text-white mb-2">{category.name}</h3>
//                       <p className="text-white/80 mb-4">{category.description}</p>
//                       <div className="flex items-center justify-center gap-2">
//                         <Play size={16} className="text-white" />
//                         <span className="text-white text-sm">{category.exercises.length} exercises</span>
//                       </div>
//                     </div>
//                   </motion.div>
//                 ))}
//               </div>
//             </div>
//           ) : (
//             /* Active Workout */
//             <div className="h-full flex flex-col">
//               <div className="flex items-center justify-between mb-6">
//                 <h2 className="text-2xl font-bold text-white">{activeWorkout.name}</h2>
//                 <motion.button
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   onClick={() => setActiveWorkout(null)}
//                   className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
//                 >
//                   Back to Categories
//                 </motion.button>
//               </div>

//               <div className="flex-1 flex flex-col items-center justify-center">
//                 {/* Exercise Image */}
//                 <motion.div
//                   key={currentExerciseIndex}
//                   initial={{ opacity: 0, scale: 0.8 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   className="mb-6"
//                 >
//                   <img
//                     src={currentExercise?.image || "/placeholder.svg"}
//                     alt={currentExercise?.name}
//                     className="w-80 h-60 object-cover rounded-xl shadow-lg"
//                   />
//                 </motion.div>

//                 {/* Exercise Info */}
//                 <div className="text-center mb-6">
//                   <h3 className="text-2xl font-bold text-white mb-2">
//                     {isResting ? "Rest Time" : currentExercise?.name}
//                   </h3>
//                   <p className="text-white/70">
//                     Exercise {currentExerciseIndex + 1} of {activeWorkout.exercises.length}
//                   </p>
//                 </div>

//                 {/* Timer */}
//                 <div className="relative mb-8">
//                   <motion.div
//                     animate={{ scale: timeLeft <= 5 && isActive ? [1, 1.1, 1] : 1 }}
//                     transition={{ duration: 0.5, repeat: timeLeft <= 5 && isActive ? Number.POSITIVE_INFINITY : 0 }}
//                     className={`w-32 h-32 rounded-full flex items-center justify-center text-4xl font-bold text-white ${
//                       isResting
//                         ? "bg-gradient-to-br from-blue-500 to-cyan-500"
//                         : "bg-gradient-to-br from-orange-500 to-red-500"
//                     } shadow-lg`}
//                   >
//                     {timeLeft}
//                   </motion.div>
//                   {timeLeft <= 5 && isActive && (
//                     <motion.div
//                       animate={{ scale: [1, 1.2, 1] }}
//                       transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY }}
//                       className="absolute inset-0 rounded-full border-4 border-white/50"
//                     />
//                   )}
//                 </div>

//                 {/* Instructions */}
//                 {!isResting && (
//                   <div className="bg-white/5 rounded-xl p-4 mb-6 max-w-md backdrop-blur-sm">
//                     <h4 className="text-white font-semibold mb-2">Instructions:</h4>
//                     <ul className="text-white/80 text-sm space-y-1">
//                       {currentExercise?.instructions.map((instruction: string, index: number) => (
//                         <li key={index}>• {instruction}</li>
//                       ))}
//                     </ul>
//                   </div>
//                 )}

//                 {/* Controls */}
//                 <div className="flex items-center gap-4">
//                   <motion.button
//                     whileHover={{ scale: 1.1 }}
//                     whileTap={{ scale: 0.9 }}
//                     onClick={toggleWorkout}
//                     className="p-4 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
//                   >
//                     {isActive ? <Pause size={24} /> : <Play size={24} />}
//                   </motion.button>
//                   <motion.button
//                     whileHover={{ scale: 1.1 }}
//                     whileTap={{ scale: 0.9 }}
//                     onClick={resetWorkout}
//                     className="p-4 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
//                   >
//                     <RotateCcw size={24} />
//                   </motion.button>
//                   <motion.button
//                     whileHover={{ scale: 1.1 }}
//                     whileTap={{ scale: 0.9 }}
//                     onClick={skipExercise}
//                     className="px-4 py-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
//                   >
//                     Skip
//                   </motion.button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </GlassPanel>
//       </div>

//       {/* Workout Stats */}
//       <div className="col-span-12 lg:col-span-4">
//         <GlassPanel className="p-6 h-full flex flex-col" glow>
//           <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
//             <Target className="text-green-400" size={20} />
//             Workout Stats
//           </h3>

//           <div className="flex-1 space-y-6">
//             {/* Progress Ring */}
//             <div className="text-center">
//               <div className="relative w-32 h-32 mx-auto mb-4">
//                 <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
//                   <circle cx="50" cy="50" r="45" stroke="rgba(255,255,255,0.1)" strokeWidth="6" fill="none" />
//                   <motion.circle
//                     cx="50"
//                     cy="50"
//                     r="45"
//                     stroke="url(#workoutGradient)"
//                     strokeWidth="6"
//                     fill="none"
//                     strokeLinecap="round"
//                     strokeDasharray={`${2 * Math.PI * 45}`}
//                     strokeDashoffset={`${
//                       2 *
//                       Math.PI *
//                       45 *
//                       (1 - (activeWorkout ? currentExerciseIndex / activeWorkout.exercises.length : 0))
//                     }`}
//                     animate={{
//                       strokeDashoffset:
//                         2 *
//                         Math.PI *
//                         45 *
//                         (1 - (activeWorkout ? currentExerciseIndex / activeWorkout.exercises.length : 0)),
//                     }}
//                     transition={{ duration: 0.5 }}
//                   />
//                   <defs>
//                     <linearGradient id="workoutGradient" x1="0%" y1="0%" x2="100%" y2="100%">
//                       <stop offset="0%" stopColor="#10B981" />
//                       <stop offset="100%" stopColor="#06B6D4" />
//                     </linearGradient>
//                   </defs>
//                 </svg>
//                 <div className="absolute inset-0 flex items-center justify-center">
//                   <div className="text-center">
//                     <div className="text-2xl font-bold text-white">
//                       {activeWorkout ? Math.round((currentExerciseIndex / activeWorkout.exercises.length) * 100) : 0}%
//                     </div>
//                     <div className="text-xs text-white/70">Complete</div>
//                   </div>
//                 </div>
//               </div>
//               <div className="text-white/70 text-sm">Workout Progress</div>
//             </div>

//             {/* Stats Grid */}
//             <div className="grid grid-cols-2 gap-4">
//               <div className="bg-white/5 rounded-lg p-3 text-center backdrop-blur-sm">
//                 <div className="text-lg font-bold text-orange-400">{completedExercises}</div>
//                 <div className="text-xs text-white/70">Exercises Done</div>
//               </div>
//               <div className="bg-white/5 rounded-lg p-3 text-center backdrop-blur-sm">
//                 <div className="text-lg font-bold text-red-400">{totalCalories}</div>
//                 <div className="text-xs text-white/70">Calories Burned</div>
//               </div>
//             </div>

//             {/* Current Exercise Info */}
//             {activeWorkout && (
//               <div className="bg-white/5 rounded-lg p-4 backdrop-blur-sm">
//                 <h4 className="text-white font-medium mb-2 flex items-center gap-2">
//                   <Timer size={16} />
//                   Current Exercise
//                 </h4>
//                 <div className="text-white/80 text-sm">
//                   <div className="mb-1">{isResting ? "Rest Period" : currentExercise?.name}</div>
//                   <div className="text-white/60">
//                     {isResting ? `${timeLeft}s rest remaining` : `${timeLeft}s remaining`}
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Achievements */}
//             <div className="bg-white/5 rounded-lg p-4 backdrop-blur-sm">
//               <h4 className="text-white font-medium mb-2 flex items-center gap-2">
//                 <Award size={16} />
//                 Today's Goals
//               </h4>
//               <div className="space-y-2">
//                 <div className="flex items-center justify-between text-sm">
//                   <span className="text-white/70">Workouts</span>
//                   <span className="text-green-400">{activeWorkout ? "1/1" : "0/1"}</span>
//                 </div>
//                 <div className="flex items-center justify-between text-sm">
//                   <span className="text-white/70">Calories</span>
//                   <span className="text-blue-400">{totalCalories}/100</span>
//                 </div>
//                 <div className="flex items-center justify-between text-sm">
//                   <span className="text-white/70">Active Minutes</span>
//                   <span className="text-purple-400">
//                     {activeWorkout ? Math.floor((completedExercises * 30) / 60) : 0}/30
//                   </span>
//                 </div>
//               </div>
//             </div>

//             {/* Motivation */}
//             <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-4 backdrop-blur-sm border border-purple-500/30">
//               <h4 className="text-white font-medium mb-2">💪 Motivation</h4>
//               <p className="text-white/80 text-sm">
//                 {activeWorkout
//                   ? "You're doing great! Keep pushing yourself!"
//                   : "Ready to get moving? Choose a workout to start!"}
//               </p>
//             </div>
//           </div>
//         </GlassPanel>
//       </div>
//     </div>
//   )
// }
