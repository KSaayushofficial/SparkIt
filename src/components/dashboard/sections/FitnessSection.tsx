"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  Timer,
  Dumbbell,
  Zap,
  CheckCircle,
  Clock,
  Activity,
  Volume2,
} from "lucide-react";
import GlassPanel from "@/components/ui/GlassPanel";

// interface Notification {
//   type: "success" | "info" | "warning" | "error";
//   title: string;
//   message: string;
// }

interface FitnessSectionProps {
  onNotification: (notification: unknown) => void;
}

interface Exercise {
  id: string;
  name: string;
  category:
    | "strength"
    | "cardio"
    | "flexibility"
    | "balance"
    | "hiit"
    | "yoga"
    | "pilates"
    | "functional";
  duration: number;
  steps: ExerciseStep[];
  benefits: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  equipment: string[];
  calories: number;
  targetMuscles: string[];
  videoUrl: string;
  imageUrl: string;
  audioUrl?: string;
}

interface ExerciseStep {
  id: string;
  instruction: string;
  duration: number;
  restAfter?: number;
  tips: string[];
  form: string[];
  breathing: string;
  visualization: string;
}

const exercises: Exercise[] = [
  {
    id: "push-ups",
    name: "Push-ups",
    category: "strength",
    duration: 300,
    difficulty: "beginner",
    equipment: [],
    calories: 50,
    targetMuscles: ["chest", "shoulders", "triceps", "core"],
    benefits: ["Upper body strength", "Core stability", "Functional movement"],
    videoUrl: "/placeholder.svg?height=300&width=400&text=Push-ups+Demo",
    imageUrl: "/placeholder.svg?height=200&width=300&text=Push-ups",
    steps: [
      {
        id: "setup",
        instruction: "Get into plank position with hands shoulder-width apart",
        duration: 15,
        tips: ["Keep your body in a straight line", "Engage your core"],
        form: [
          "Hands directly under shoulders",
          "Straight line from head to heels",
        ],
        breathing: "Breathe normally during setup",
        visualization:
          "Imagine a straight plank of wood from your head to your heels",
      },
      {
        id: "descent",
        instruction: "Lower your body until chest nearly touches the floor",
        duration: 30,
        tips: ["Control the movement", "Keep elbows at 45-degree angle"],
        form: ["Lower chest, not just head", "Maintain straight body line"],
        breathing: "Inhale as you lower down",
        visualization: "Imagine pushing the floor away from you",
      },
      {
        id: "push",
        instruction: "Push back up to starting position",
        duration: 30,
        restAfter: 15,
        tips: ["Drive through your palms", "Maintain core tension"],
        form: ["Full extension of arms", "Keep body aligned"],
        breathing: "Exhale as you push up",
        visualization: "Feel the power coming from your chest and arms",
      },
    ],
  },
  {
    id: "squats",
    name: "Bodyweight Squats",
    category: "strength",
    duration: 240,
    difficulty: "beginner",
    equipment: [],
    calories: 40,
    targetMuscles: ["quadriceps", "glutes", "hamstrings", "calves"],
    benefits: ["Lower body strength", "Functional movement", "Core stability"],
    videoUrl: "/placeholder.svg?height=300&width=400&text=Squats+Demo",
    imageUrl: "/placeholder.svg?height=200&width=300&text=Squats",
    steps: [
      {
        id: "stance",
        instruction: "Stand with feet shoulder-width apart, toes slightly out",
        duration: 10,
        tips: ["Keep chest up", "Engage your core"],
        form: [
          "Feet parallel or slightly turned out",
          "Weight evenly distributed",
        ],
        breathing: "Take a deep breath and brace your core",
        visualization: "Imagine sitting back into an invisible chair",
      },
      {
        id: "descent",
        instruction: "Lower down by pushing hips back and bending knees",
        duration: 45,
        tips: ["Keep knees tracking over toes", "Chest stays up"],
        form: ["Hips go back first", "Knees don't cave inward"],
        breathing: "Inhale as you lower down",
        visualization: "Sit back like you're reaching for a chair behind you",
      },
      {
        id: "bottom",
        instruction: "Go down until thighs are parallel to floor",
        duration: 15,
        tips: ["Keep weight on heels", "Maintain upright torso"],
        form: ["Thighs parallel to ground", "Knees over ankles"],
        breathing: "Hold breath briefly at bottom",
        visualization: "Feel the stretch in your glutes and thighs",
      },
      {
        id: "ascent",
        instruction: "Drive through heels to return to standing",
        duration: 30,
        restAfter: 20,
        tips: ["Push the floor away", "Squeeze glutes at top"],
        form: ["Drive through heels", "Hips and knees extend together"],
        breathing: "Exhale as you stand up",
        visualization: "Imagine pushing the earth away with your feet",
      },
    ],
  },
  {
    id: "plank",
    name: "Plank Hold",
    category: "strength",
    duration: 180,
    difficulty: "beginner",
    equipment: [],
    calories: 25,
    targetMuscles: ["core", "shoulders", "back"],
    benefits: ["Core strength", "Stability", "Posture improvement"],
    videoUrl: "/placeholder.svg?height=300&width=400&text=Plank+Demo",
    imageUrl: "/placeholder.svg?height=200&width=300&text=Plank",
    steps: [
      {
        id: "setup",
        instruction: "Get into forearm plank position",
        duration: 15,
        tips: ["Elbows under shoulders", "Engage entire core"],
        form: ["Straight line from head to heels", "Neutral spine"],
        breathing: "Breathe steadily and controlled",
        visualization: "Imagine you're a rigid plank of wood",
      },
      {
        id: "hold",
        instruction: "Hold the position while breathing steadily",
        duration: 150,
        tips: ["Don't let hips sag", "Keep breathing"],
        form: ["Maintain straight line", "Engage glutes"],
        breathing: "Steady, controlled breathing throughout",
        visualization: "Feel your core muscles working like a corset",
      },
    ],
  },
  {
    id: "burpees",
    name: "Burpees",
    category: "hiit",
    duration: 300,
    difficulty: "intermediate",
    equipment: [],
    calories: 80,
    targetMuscles: ["full body"],
    benefits: [
      "Cardiovascular fitness",
      "Full body strength",
      "Explosive power",
    ],
    videoUrl: "/placeholder.svg?height=300&width=400&text=Burpees+Demo",
    imageUrl: "/placeholder.svg?height=200&width=300&text=Burpees",
    steps: [
      {
        id: "squat-down",
        instruction: "Squat down and place hands on floor",
        duration: 20,
        tips: ["Keep chest up", "Hands shoulder-width apart"],
        form: ["Squat position", "Hands flat on ground"],
        breathing: "Inhale as you squat down",
        visualization: "Prepare for explosive movement",
      },
      {
        id: "jump-back",
        instruction: "Jump feet back into plank position",
        duration: 15,
        tips: ["Land softly", "Maintain plank form"],
        form: ["Straight body line", "Core engaged"],
        breathing: "Quick exhale on jump",
        visualization: "Feel the power in your legs",
      },
      {
        id: "push-up",
        instruction: "Perform one push-up",
        duration: 25,
        tips: ["Full range of motion", "Control the movement"],
        form: ["Chest to floor", "Full extension"],
        breathing: "Inhale down, exhale up",
        visualization: "Strong, controlled movement",
      },
      {
        id: "jump-forward",
        instruction: "Jump feet back to squat position",
        duration: 15,
        tips: ["Land in squat", "Prepare for jump"],
        form: ["Feet under hips", "Ready position"],
        breathing: "Quick inhale",
        visualization: "Coil like a spring",
      },
      {
        id: "jump-up",
        instruction: "Explosive jump up with arms overhead",
        duration: 20,
        restAfter: 25,
        tips: ["Full extension", "Land softly"],
        form: ["Arms reach high", "Full body extension"],
        breathing: "Explosive exhale",
        visualization: "Reach for the sky with power",
      },
    ],
  },
  {
    id: "mountain-climbers",
    name: "Mountain Climbers",
    category: "cardio",
    duration: 180,
    difficulty: "intermediate",
    equipment: [],
    calories: 60,
    targetMuscles: ["core", "shoulders", "legs"],
    benefits: ["Cardiovascular endurance", "Core strength", "Agility"],
    videoUrl:
      "/placeholder.svg?height=300&width=400&text=Mountain+Climbers+Demo",
    imageUrl: "/placeholder.svg?height=200&width=300&text=Mountain+Climbers",
    steps: [
      {
        id: "plank-setup",
        instruction: "Start in high plank position",
        duration: 10,
        tips: ["Hands under shoulders", "Body in straight line"],
        form: ["High plank", "Core engaged"],
        breathing: "Steady breathing",
        visualization: "Strong, stable base",
      },
      {
        id: "alternating-knees",
        instruction: "Alternate bringing knees to chest rapidly",
        duration: 160,
        tips: ["Keep hips level", "Stay on balls of feet"],
        form: ["Quick knee drives", "Maintain plank"],
        breathing: "Quick, rhythmic breathing",
        visualization: "Running in place horizontally",
      },
    ],
  },
  {
    id: "lunges",
    name: "Forward Lunges",
    category: "strength",
    duration: 240,
    difficulty: "beginner",
    equipment: [],
    calories: 45,
    targetMuscles: ["quadriceps", "glutes", "hamstrings", "calves"],
    benefits: ["Unilateral strength", "Balance", "Functional movement"],
    videoUrl: "/placeholder.svg?height=300&width=400&text=Lunges+Demo",
    imageUrl: "/placeholder.svg?height=200&width=300&text=Lunges",
    steps: [
      {
        id: "starting-position",
        instruction: "Stand tall with feet hip-width apart",
        duration: 10,
        tips: ["Engage core", "Shoulders back"],
        form: ["Upright posture", "Even weight distribution"],
        breathing: "Deep breath to prepare",
        visualization: "Stand proud and strong",
      },
      {
        id: "step-forward",
        instruction: "Step forward with right leg into lunge",
        duration: 30,
        tips: ["Big step forward", "Keep torso upright"],
        form: ["Front thigh parallel", "Back knee toward ground"],
        breathing: "Inhale as you step",
        visualization: "Controlled, graceful movement",
      },
      {
        id: "lunge-hold",
        instruction: "Hold the lunge position",
        duration: 20,
        tips: ["90-degree angles", "Weight on front heel"],
        form: ["Both knees at 90 degrees", "Upright torso"],
        breathing: "Steady breathing",
        visualization: "Feel the stretch and strength",
      },
      {
        id: "return",
        instruction: "Push off front foot to return to start",
        duration: 25,
        tips: ["Drive through front heel", "Control the movement"],
        form: ["Smooth return", "Balanced landing"],
        breathing: "Exhale as you return",
        visualization: "Power from your front leg",
      },
      {
        id: "switch-legs",
        instruction: "Repeat with left leg",
        duration: 155,
        restAfter: 20,
        tips: ["Alternate legs", "Maintain form"],
        form: ["Same technique", "Both sides equal"],
        breathing: "Rhythmic breathing pattern",
        visualization: "Balanced strength development",
      },
    ],
  },
  {
    id: "yoga-flow",
    name: "Sun Salutation Flow",
    category: "yoga",
    duration: 360,
    difficulty: "beginner",
    equipment: ["yoga mat"],
    calories: 35,
    targetMuscles: ["full body", "flexibility"],
    benefits: ["Flexibility", "Mind-body connection", "Stress relief"],
    videoUrl: "/placeholder.svg?height=300&width=400&text=Yoga+Flow+Demo",
    imageUrl: "/placeholder.svg?height=200&width=300&text=Yoga+Flow",
    audioUrl: "/placeholder.svg?height=100&width=100&text=Yoga+Audio",
    steps: [
      {
        id: "mountain-pose",
        instruction: "Stand tall in Mountain Pose, hands at heart center",
        duration: 20,
        tips: ["Ground through feet", "Lengthen spine"],
        form: ["Feet hip-width apart", "Shoulders relaxed"],
        breathing: "Deep, steady breaths",
        visualization: "Feel rooted like a mountain",
      },
      {
        id: "upward-salute",
        instruction: "Inhale, sweep arms up to Upward Salute",
        duration: 15,
        tips: ["Reach through fingertips", "Slight backbend"],
        form: ["Arms overhead", "Heart open"],
        breathing: "Deep inhale",
        visualization: "Reaching toward the sun",
      },
      {
        id: "forward-fold",
        instruction: "Exhale, hinge at hips into Forward Fold",
        duration: 25,
        tips: ["Bend knees if needed", "Let arms hang"],
        form: ["Hinge from hips", "Soft knees"],
        breathing: "Long exhale",
        visualization: "Releasing tension downward",
      },
      {
        id: "half-lift",
        instruction: "Inhale, hands to shins for Half Lift",
        duration: 15,
        tips: ["Flat back", "Look forward"],
        form: ["Hands on shins", "Straight spine"],
        breathing: "Inhale to lengthen",
        visualization: "Creating space in spine",
      },
      {
        id: "low-push-up",
        instruction: "Exhale, step back to Low Push-up",
        duration: 20,
        tips: ["Elbows close to ribs", "Strong core"],
        form: ["Body in line", "Hover above ground"],
        breathing: "Controlled exhale",
        visualization: "Strong and controlled",
      },
      {
        id: "upward-dog",
        instruction: "Inhale, roll over toes to Upward Dog",
        duration: 20,
        tips: ["Open chest", "Straight arms"],
        form: ["Thighs off ground", "Heart forward"],
        breathing: "Heart-opening inhale",
        visualization: "Opening like a flower",
      },
      {
        id: "downward-dog",
        instruction: "Exhale, tuck toes, lift to Downward Dog",
        duration: 30,
        tips: ["Press hands down", "Lengthen spine"],
        form: ["Inverted V shape", "Heels reaching down"],
        breathing: "Grounding exhale",
        visualization: "Strong foundation",
      },
      {
        id: "return-flow",
        instruction: "Step forward and return to Mountain Pose",
        duration: 215,
        restAfter: 30,
        tips: ["Reverse the sequence", "Maintain breath awareness"],
        form: ["Same poses in reverse", "Smooth transitions"],
        breathing: "Coordinate with movement",
        visualization: "Completing the circle",
      },
    ],
  },
  {
    id: "hiit-tabata",
    name: "Tabata HIIT Circuit",
    category: "hiit",
    duration: 240,
    difficulty: "advanced",
    equipment: [],
    calories: 120,
    targetMuscles: ["full body"],
    benefits: ["Maximum calorie burn", "Metabolic boost", "Time efficient"],
    videoUrl: "/placeholder.svg?height=300&width=400&text=HIIT+Tabata+Demo",
    imageUrl: "/placeholder.svg?height=200&width=300&text=HIIT+Tabata",
    steps: [
      {
        id: "warm-up",
        instruction: "Light movement to warm up",
        duration: 30,
        tips: ["Gentle movements", "Prepare your body"],
        form: ["Dynamic stretches", "Joint mobility"],
        breathing: "Natural breathing",
        visualization: "Preparing for intensity",
      },
      {
        id: "work-interval-1",
        instruction: "20 seconds maximum effort - Jumping Jacks",
        duration: 20,
        tips: ["All-out effort", "Push your limits"],
        form: ["Full range of motion", "Land softly"],
        breathing: "Whatever it takes",
        visualization: "Give everything you have",
      },
      {
        id: "rest-interval-1",
        instruction: "10 seconds rest",
        duration: 10,
        tips: ["Catch your breath", "Prepare for next round"],
        form: ["Stay moving lightly", "Don't sit down"],
        breathing: "Deep recovery breaths",
        visualization: "Recharging your energy",
      },
      {
        id: "work-interval-2",
        instruction: "20 seconds maximum effort - Burpees",
        duration: 20,
        tips: ["Maintain form", "Push through fatigue"],
        form: ["Full burpee movement", "Explosive jumps"],
        breathing: "Power breathing",
        visualization: "Stronger with each rep",
      },
      {
        id: "rest-interval-2",
        instruction: "10 seconds rest",
        duration: 10,
        tips: ["Active recovery", "Stay ready"],
        form: ["Light movement", "Shake it out"],
        breathing: "Controlled breathing",
        visualization: "Almost there",
      },
      {
        id: "final-rounds",
        instruction: "Continue alternating work and rest",
        duration: 130,
        restAfter: 60,
        tips: ["Maintain intensity", "Finish strong"],
        form: ["Quality over quantity", "Safe movement"],
        breathing: "Match effort level",
        visualization: "Crossing the finish line",
      },
    ],
  },
];

const categoryColors = {
  strength: "from-red-500 to-orange-500",
  cardio: "from-blue-500 to-cyan-500",
  flexibility: "from-green-500 to-emerald-500",
  balance: "from-purple-500 to-pink-500",
  hiit: "from-yellow-500 to-red-500",
  yoga: "from-indigo-500 to-purple-500",
  pilates: "from-pink-500 to-rose-500",
  functional: "from-teal-500 to-cyan-500",
} as const;

export default function FitnessSection({
  onNotification,
}: FitnessSectionProps) {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null
  );
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [stepTimer, setStepTimer] = useState(30);
  const [customDuration, setCustomDuration] = useState(30);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [restTimeRemaining, setRestTimeRemaining] = useState(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const stepTimerRef = useRef<NodeJS.Timeout | null>(null);

  const completeExercise = useCallback(() => {
    if (!selectedExercise) return;

    setIsActive(false);
    setCompletedExercises((prev) => [...prev, selectedExercise.id]);
    setTotalTimeSpent((prev) => prev + selectedExercise.duration);
    setCurrentStreak((prev) => prev + 1);

    onNotification({
      type: "success",
      title: "Exercise Completed!",
      message: `Great job! You burned approximately ${selectedExercise.calories} calories`,
    });

    setSelectedExercise(null);
    setCurrentStepIndex(0);
    setTimeRemaining(0);
  }, [selectedExercise, onNotification]);

  const handleNextStep = useCallback(() => {
    if (!selectedExercise) return;

    const currentStep = selectedExercise.steps[currentStepIndex];

    // Check if there's rest time after this step
    if (currentStep.restAfter && currentStep.restAfter > 0) {
      setIsResting(true);
      setRestTimeRemaining(currentStep.restAfter);

      onNotification({
        type: "info",
        title: "Rest Time",
        message: `Rest for ${currentStep.restAfter} seconds`,
      });
    }

    if (currentStepIndex < selectedExercise.steps.length - 1) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);

      onNotification({
        type: "info",
        title: "Next Step",
        message: selectedExercise.steps[nextIndex].instruction,
      });
    } else {
      // Exercise completed
      completeExercise();
    }
  }, [selectedExercise, currentStepIndex, onNotification, completeExercise]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (stepTimerRef.current) clearInterval(stepTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (isActive && !isPaused && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            completeExercise();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, isPaused, timeRemaining, completeExercise]);

  useEffect(() => {
    if (isActive && !isPaused && stepTimer > 0) {
      stepTimerRef.current = setInterval(() => {
        setStepTimer((prev) => {
          if (prev <= 1) {
            handleNextStep();
            return customDuration;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (stepTimerRef.current) {
        clearInterval(stepTimerRef.current);
      }
    }

    return () => {
      if (stepTimerRef.current) {
        clearInterval(stepTimerRef.current);
      }
    };
  }, [isActive, isPaused, stepTimer, customDuration, handleNextStep]);

  useEffect(() => {
    if (isResting && restTimeRemaining > 0) {
      const restInterval = setInterval(() => {
        setRestTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsResting(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(restInterval);
    }
  }, [isResting, restTimeRemaining]);

  const startExercise = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setCurrentStepIndex(0);
    setTimeRemaining(exercise.duration);
    setStepTimer(customDuration);
    setIsActive(true);
    setIsPaused(false);
    setIsResting(false);

    onNotification({
      type: "success",
      title: "Exercise Started",
      message: `Starting ${exercise.name} - ${exercise.steps.length} steps`,
    });
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
    onNotification({
      type: "info",
      title: isPaused ? "Resumed" : "Paused",
      message: isPaused ? "Exercise resumed" : "Exercise paused",
    });
  };

  const resetExercise = () => {
    if (!selectedExercise) return;

    setCurrentStepIndex(0);
    setTimeRemaining(selectedExercise.duration);
    setStepTimer(customDuration);
    setIsActive(false);
    setIsPaused(false);
    setIsResting(false);
    setRestTimeRemaining(0);

    onNotification({
      type: "info",
      title: "Exercise Reset",
      message: "Exercise has been reset to the beginning",
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const increaseDuration = () => {
    const newDuration = Math.min(customDuration + 10, 120);
    setCustomDuration(newDuration);
    if (!isActive) {
      setStepTimer(newDuration);
    }
  };

  const decreaseDuration = () => {
    const newDuration = Math.max(customDuration - 10, 10);
    setCustomDuration(newDuration);
    if (!isActive) {
      setStepTimer(newDuration);
    }
  };

  const currentStep = selectedExercise?.steps[currentStepIndex];

  if (selectedExercise) {
    return (
      <div className="h-full flex gap-6 overflow-hidden">
        {/* Left Side - Exercise Visualization/Video */}
        <div className="flex-1 min-w-0">
          <GlassPanel className="h-full p-6" glow>
            <div className="h-full flex flex-col">
              {/* Exercise Header */}
              <div className="mb-6 flex-shrink-0">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                      {selectedExercise.name}
                    </h2>
                    <div className="flex items-center gap-4 text-white/70">
                      <span className="flex items-center gap-1">
                        <Timer size={16} />
                        {formatTime(timeRemaining)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Activity size={16} />
                        Step {currentStepIndex + 1} of{" "}
                        {selectedExercise.steps.length}
                      </span>
                      <span className="flex items-center gap-1">
                        <Zap size={16} />
                        {selectedExercise.calories} cal
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedExercise(null)}
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    ← Back
                  </button>
                </div>
              </div>

              {/* Visual Representation */}
              <div className="flex-1 bg-black/20 rounded-lg overflow-hidden mb-6 flex items-center justify-center min-h-0">
                <Image
                  src={selectedExercise.videoUrl}
                  alt={selectedExercise.name}
                  width={400}
                  height={300}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>

              {/* Rest Timer */}
              {isResting && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center mb-4 flex-shrink-0"
                >
                  <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
                    <h3 className="text-yellow-300 font-semibold mb-2">
                      Rest Time
                    </h3>
                    <div className="text-2xl font-bold text-yellow-200">
                      {formatTime(restTimeRemaining)}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Timer Controls */}
              <div className="flex items-center justify-center gap-6 mb-4 flex-shrink-0">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-1">
                    {formatTime(timeRemaining)}
                  </div>
                  <div className="text-white/70 text-sm">Total Time</div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={togglePause}
                    disabled={!isActive}
                    className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500 text-white p-3 rounded-full transition-colors"
                  >
                    {isPaused ? <Play size={20} /> : <Pause size={20} />}
                  </button>
                  <button
                    onClick={handleNextStep}
                    disabled={!isActive}
                    className="bg-green-500 hover:bg-green-600 disabled:bg-gray-500 text-white p-3 rounded-full transition-colors"
                  >
                    <SkipForward size={20} />
                  </button>
                  <button
                    onClick={resetExercise}
                    className="bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-full transition-colors"
                  >
                    <RotateCcw size={20} />
                  </button>
                </div>

                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-1">
                    {formatTime(stepTimer)}
                  </div>
                  <div className="text-white/70 text-sm">Step Timer</div>
                </div>
              </div>

              {/* Duration Controls */}
              <div className="flex items-center justify-center gap-4 flex-shrink-0">
                <span className="text-white/70">Step Duration:</span>
                <button
                  onClick={decreaseDuration}
                  disabled={isActive}
                  className="bg-white/10 hover:bg-white/20 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  -10s
                </button>
                <span className="text-white font-semibold text-lg">
                  {customDuration}s
                </span>
                <button
                  onClick={increaseDuration}
                  disabled={isActive}
                  className="bg-white/10 hover:bg-white/20 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  +10s
                </button>
              </div>
            </div>
          </GlassPanel>
        </div>

        {/* Right Side - Exercise Instructions and Stats */}
        <div className="w-96 min-w-0">
          <div className="h-full flex flex-col gap-6 overflow-hidden">
            {/* Current Step Instructions */}
            {currentStep && (
              <GlassPanel className="p-6 flex-1 min-h-0" glow>
                <div className="h-full flex flex-col overflow-hidden">
                  <h3 className="text-lg font-semibold text-white mb-4 flex-shrink-0">
                    Current Step
                  </h3>
                  <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                        Step {currentStepIndex + 1} of{" "}
                        {selectedExercise.steps.length}
                      </div>
                      {isActive && (
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                          <span className="text-green-400 text-sm font-medium">
                            Active
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="bg-black/20 rounded-lg p-4 mb-4">
                      <Image
                        src={selectedExercise.imageUrl}
                        alt={`Step ${currentStepIndex + 1}`}
                        width={300}
                        height={128}
                        className="w-full h-32 object-cover rounded-lg mb-4"
                      />
                      <p className="text-white text-base leading-relaxed">
                        {currentStep.instruction}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-white font-medium mb-2">Form Tips</h4>
                      <ul className="text-white/70 text-sm space-y-1">
                        {currentStep.form.map((tip, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-green-400 mt-1">•</span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-white font-medium mb-2">Breathing</h4>
                      <p className="text-blue-300 text-sm">
                        {currentStep.breathing}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-white font-medium mb-2">
                        Visualization
                      </h4>
                      <p className="text-purple-300 text-sm italic">
                        {currentStep.visualization}
                      </p>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={handleNextStep}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 font-medium text-sm"
                      >
                        <Timer size={14} />
                        Next Step
                      </button>

                      {selectedExercise.audioUrl && (
                        <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 font-medium text-sm">
                          <Volume2 size={14} />
                          Audio
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </GlassPanel>
            )}

            {/* Stats */}
            <GlassPanel className="p-6 flex-shrink-0" glow>
              <h3 className="text-lg font-semibold text-white mb-4">
                Your Progress
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {completedExercises.length}
                  </div>
                  <div className="text-white/70 text-sm">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">
                    {Math.floor(totalTimeSpent / 60)}m
                  </div>
                  <div className="text-white/70 text-sm">Total Time</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">
                    {currentStreak}
                  </div>
                  <div className="text-white/70 text-sm">Streak</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-400">
                    {completedExercises.reduce((total, id) => {
                      const exercise = exercises.find((e) => e.id === id);
                      return total + (exercise?.calories || 0);
                    }, 0)}
                  </div>
                  <div className="text-white/70 text-sm">Calories</div>
                </div>
              </div>
            </GlassPanel>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto custom-scrollbar">
      <div className="max-w-6xl mx-auto space-y-6 p-4">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent mb-2">
            Fitness Training Center
          </h1>
          <p className="text-white/70">
            Professional guided workouts with step-by-step instructions and
            real-time coaching
          </p>
        </motion.div>

        {/* Category Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
          {Object.entries(categoryColors).map(([category, color]) => {
            const exerciseCount = exercises.filter(
              (exercise) => exercise.category === category
            ).length;

            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <GlassPanel className="p-4 text-center" glow>
                  <div
                    className={`w-12 h-12 mx-auto mb-3 bg-gradient-to-r ${color} rounded-full flex items-center justify-center`}
                  >
                    <Dumbbell className="text-white" size={20} />
                  </div>
                  <h3 className="text-white font-semibold capitalize mb-1 text-sm">
                    {category}
                  </h3>
                  <p className="text-white/70 text-xs">
                    {exerciseCount} exercises
                  </p>
                </GlassPanel>
              </motion.div>
            );
          })}
        </div>

        {/* Exercise Categories */}
        {Object.entries(
          exercises.reduce((acc, exercise) => {
            if (!acc[exercise.category]) acc[exercise.category] = [];
            acc[exercise.category].push(exercise);
            return acc;
          }, {} as Record<string, Exercise[]>)
        ).map(([category, categoryExercises]) => (
          <motion.div
            key={category}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <GlassPanel className="p-6" glow>
              <h3 className="text-white font-semibold mb-4 capitalize flex items-center gap-2">
                <div
                  className={`w-8 h-8 bg-gradient-to-r ${
                    categoryColors[category as keyof typeof categoryColors]
                  } rounded-full`}
                />
                {category} Training
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryExercises.map((exercise) => {
                  const isCompleted = completedExercises.includes(exercise.id);

                  return (
                    <motion.div
                      key={exercise.id}
                      whileHover={{ scale: 1.02 }}
                      className={`p-4 rounded-lg border transition-all ${
                        isCompleted
                          ? "bg-green-500/10 border-green-500/30"
                          : "bg-white/5 border-white/10 hover:bg-white/10"
                      }`}
                    >
                      <div className="flex flex-col h-full">
                        {/* Exercise Image */}
                        <div className="bg-black/20 rounded-lg overflow-hidden mb-4">
                          <Image
                            src={exercise.imageUrl}
                            alt={exercise.name}
                            width={300}
                            height={128}
                            className="w-full h-32 object-cover"
                          />
                        </div>

                        {/* Exercise Info */}
                        <div className="flex items-center gap-3 mb-3">
                          <div
                            className={`w-10 h-10 bg-gradient-to-r ${
                              categoryColors[exercise.category]
                            } rounded-full flex items-center justify-center`}
                          >
                            <Dumbbell className="text-white" size={16} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-white">
                                {exercise.name}
                              </h4>
                              {isCompleted && (
                                <CheckCircle
                                  className="text-green-400"
                                  size={16}
                                />
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-white/70">
                              <span className="flex items-center gap-1">
                                <Clock size={12} />
                                {Math.floor(exercise.duration / 60)}m
                              </span>
                              <span className="flex items-center gap-1">
                                <Zap size={12} />
                                {exercise.calories} cal
                              </span>
                              <span className="capitalize">
                                {exercise.difficulty}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Benefits Preview */}
                        <div className="flex-1 mb-4">
                          <div className="space-y-2">
                            {exercise.benefits
                              .slice(0, 2)
                              .map((benefit, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center gap-2"
                                >
                                  <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0" />
                                  <span className="text-white/80 text-sm">
                                    {benefit}
                                  </span>
                                </div>
                              ))}
                            {exercise.benefits.length > 2 && (
                              <div className="text-white/60 text-xs">
                                +{exercise.benefits.length - 2} more benefits
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Target Muscles */}
                        <div className="mb-4">
                          <div className="text-xs text-white/60 mb-1">
                            Target Muscles:
                          </div>
                          <div className="text-xs text-white/80">
                            {exercise.targetMuscles.slice(0, 3).join(", ")}
                            {exercise.targetMuscles.length > 3 && "..."}
                          </div>
                        </div>

                        {/* Equipment */}
                        {exercise.equipment.length > 0 && (
                          <div className="mb-4">
                            <div className="text-xs text-white/60 mb-1">
                              Equipment:
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {exercise.equipment.map((item, idx) => (
                                <span
                                  key={idx}
                                  className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs"
                                >
                                  {item}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Start Button */}
                        <button
                          onClick={() => startExercise(exercise)}
                          className={`w-full bg-gradient-to-r ${
                            categoryColors[exercise.category]
                          } hover:opacity-90 text-white py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 font-semibold shadow-lg`}
                        >
                          <Play size={16} />
                          Start Exercise
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </GlassPanel>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
