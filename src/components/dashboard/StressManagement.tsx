"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Brain, Heart, Waves, Play, Pause, RotateCcw } from "lucide-react";
import GlassPanel from "@/components/ui/GlassPanel";

interface StressManagementProps {
  onNotification: (notification: any) => void;
}

const breathingExercises = [
  {
    id: "4-7-8",
    name: "4-7-8 Breathing",
    description: "Inhale for 4, hold for 7, exhale for 8",
    inhale: 4,
    hold: 7,
    exhale: 8,
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "box",
    name: "Box Breathing",
    description: "Equal counts for inhale, hold, exhale, hold",
    inhale: 4,
    hold: 4,
    exhale: 4,
    holdAfter: 4,
    color: "from-green-500 to-teal-500",
  },
  {
    id: "triangle",
    name: "Triangle Breathing",
    description: "Inhale, hold, exhale in equal counts",
    inhale: 6,
    hold: 6,
    exhale: 6,
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "coherent",
    name: "Coherent Breathing",
    description: "5 seconds in, 5 seconds out",
    inhale: 5,
    exhale: 5,
    color: "from-orange-500 to-red-500",
  },
];

const relaxationTechniques = [
  {
    id: "progressive",
    name: "Progressive Muscle Relaxation",
    description: "Tense and release muscle groups",
    duration: 15,
    steps: [
      "Start with your toes, tense for 5 seconds",
      "Release and feel the relaxation",
      "Move to your calves, repeat",
      "Continue up through your body",
      "End with your face and scalp",
    ],
  },
  {
    id: "visualization",
    name: "Guided Visualization",
    description: "Imagine a peaceful place",
    duration: 10,
    steps: [
      "Close your eyes and breathe deeply",
      "Imagine a peaceful, safe place",
      "Notice the colors, sounds, and smells",
      "Feel yourself becoming more relaxed",
      "Stay in this place as long as you need",
    ],
  },
  {
    id: "mindfulness",
    name: "5-4-3-2-1 Grounding",
    description: "Engage your senses to stay present",
    duration: 5,
    steps: [
      "Name 5 things you can see",
      "Name 4 things you can touch",
      "Name 3 things you can hear",
      "Name 2 things you can smell",
      "Name 1 thing you can taste",
    ],
  },
];

export default function StressManagement({
  onNotification,
}: StressManagementProps) {
  const [activeExercise, setActiveExercise] = useState<string | null>(null);
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<
    "inhale" | "hold" | "exhale" | "holdAfter"
  >("inhale");
  const [breathingCount, setBreathingCount] = useState(0);
  const [currentCycle, setCurrentCycle] = useState(0);
  const [activeRelaxation, setActiveRelaxation] = useState<string | null>(null);
  const [relaxationStep, setRelaxationStep] = useState(0);
  const [heartRate, setHeartRate] = useState(72);

  const currentExercise = breathingExercises.find(
    (ex) => ex.id === activeExercise
  );
  const currentRelaxationTechnique = relaxationTechniques.find(
    (tech) => tech.id === activeRelaxation
  );

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isBreathing && currentExercise) {
      interval = setInterval(() => {
        setBreathingCount((prev) => {
          const newCount = prev + 1;
          const phase = breathingPhase;

          // Determine phase durations
          let phaseDuration = 0;
          switch (phase) {
            case "inhale":
              phaseDuration = currentExercise.inhale;
              break;
            case "hold":
              phaseDuration = currentExercise.hold;
              break;
            case "exhale":
              phaseDuration = currentExercise.exhale;
              break;
            case "holdAfter":
              phaseDuration = currentExercise.holdAfter || 0;
              break;
          }

          if (newCount >= phaseDuration) {
            // Move to next phase
            let nextPhase: "inhale" | "hold" | "exhale" | "holdAfter" =
              "inhale";
            let shouldIncrementCycle = false;

            switch (phase) {
              case "inhale":
                nextPhase = currentExercise.hold > 0 ? "hold" : "exhale";
                break;
              case "hold":
                nextPhase = "exhale";
                break;
              case "exhale":
                if (
                  currentExercise.holdAfter &&
                  currentExercise.holdAfter > 0
                ) {
                  nextPhase = "holdAfter";
                } else {
                  nextPhase = "inhale";
                  shouldIncrementCycle = true;
                }
                break;
              case "holdAfter":
                nextPhase = "inhale";
                shouldIncrementCycle = true;
                break;
            }

            setBreathingPhase(nextPhase);
            if (shouldIncrementCycle) {
              setCurrentCycle((prev) => prev + 1);
            }
            return 0;
          }
          return newCount;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isBreathing, breathingPhase, currentExercise]);

  // Simulate heart rate changes during breathing
  useEffect(() => {
    if (isBreathing) {
      const baseRate = 72;
      const variation =
        breathingPhase === "inhale" ? 5 : breathingPhase === "exhale" ? -8 : 0;
      setHeartRate(baseRate + variation + Math.random() * 4 - 2);
    }
  }, [breathingPhase, isBreathing]);

  const startBreathingExercise = (exerciseId: string) => {
    setActiveExercise(exerciseId);
    setIsBreathing(true);
    setBreathingPhase("inhale");
    setBreathingCount(0);
    setCurrentCycle(0);
    onNotification({
      title: "Breathing Exercise Started",
      message: `Starting ${
        breathingExercises.find((ex) => ex.id === exerciseId)?.name
      }`,
      type: "info",
    });
  };

  const stopBreathingExercise = () => {
    setIsBreathing(false);
    setActiveExercise(null);
    setBreathingPhase("inhale");
    setBreathingCount(0);
    setCurrentCycle(0);
  };

  const startRelaxationTechnique = (techniqueId: string) => {
    setActiveRelaxation(techniqueId);
    setRelaxationStep(0);
    onNotification({
      title: "Relaxation Started",
      message: `Starting ${
        relaxationTechniques.find((tech) => tech.id === techniqueId)?.name
      }`,
      type: "info",
    });
  };

  const nextRelaxationStep = () => {
    if (
      currentRelaxationTechnique &&
      relaxationStep < currentRelaxationTechnique.steps.length - 1
    ) {
      setRelaxationStep((prev) => prev + 1);
    } else {
      setActiveRelaxation(null);
      setRelaxationStep(0);
      onNotification({
        title: "Relaxation Complete",
        message: "Great job! You've completed the relaxation technique.",
        type: "success",
      });
    }
  };

  const getPhaseInstruction = () => {
    if (!currentExercise) return "";
    switch (breathingPhase) {
      case "inhale":
        return "Breathe In";
      case "hold":
        return "Hold";
      case "exhale":
        return "Breathe Out";
      case "holdAfter":
        return "Hold";
      default:
        return "";
    }
  };

  const getPhaseColor = () => {
    switch (breathingPhase) {
      case "inhale":
        return "from-blue-500 to-cyan-500";
      case "hold":
        return "from-yellow-500 to-orange-500";
      case "exhale":
        return "from-green-500 to-teal-500";
      case "holdAfter":
        return "from-purple-500 to-pink-500";
      default:
        return "from-blue-500 to-cyan-500";
    }
  };

  return (
    <div className="grid grid-cols-12 gap-6 h-[calc(100vh-140px)]">
      {/* Breathing Exercises */}
      <div className="col-span-12 lg:col-span-8">
        <GlassPanel className="p-6 h-full" glow>
          <h2 className="text-2xl font-bold text-white mb-6">
            Stress Management & Relaxation
          </h2>

          {!activeExercise && !activeRelaxation ? (
            <div className="space-y-8">
              {/* Breathing Exercises */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Waves className="text-blue-400" size={20} />
                  Breathing Exercises
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {breathingExercises.map((exercise, index) => (
                    <motion.div
                      key={exercise.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02, y: -5 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => startBreathingExercise(exercise.id)}
                      className={`p-4 rounded-xl cursor-pointer transition-all duration-300 bg-gradient-to-br ${exercise.color} hover:shadow-lg backdrop-blur-sm border border-white/10`}
                    >
                      <h4 className="text-white font-semibold mb-2">
                        {exercise.name}
                      </h4>
                      <p className="text-white/80 text-sm mb-3">
                        {exercise.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <Play size={16} className="text-white" />
                        <span className="text-white text-sm">
                          Start Exercise
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Relaxation Techniques */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Brain className="text-purple-400" size={20} />
                  Relaxation Techniques
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {relaxationTechniques.map((technique, index) => (
                    <motion.div
                      key={technique.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 + 0.4 }}
                      whileHover={{ scale: 1.02, y: -5 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => startRelaxationTechnique(technique.id)}
                      className="p-4 rounded-xl cursor-pointer transition-all duration-300 bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10"
                    >
                      <h4 className="text-white font-semibold mb-2">
                        {technique.name}
                      </h4>
                      <p className="text-white/80 text-sm mb-3">
                        {technique.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-white/60 text-xs">
                          {technique.duration} min
                        </span>
                        <div className="flex items-center gap-2">
                          <Play size={16} className="text-white" />
                          <span className="text-white text-sm">Start</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          ) : activeExercise ? (
            /* Active Breathing Exercise */
            <div className="flex flex-col items-center justify-center h-full">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center"
              >
                <h3 className="text-2xl font-bold text-white mb-2">
                  {currentExercise?.name}
                </h3>
                <p className="text-white/70 mb-8">
                  {currentExercise?.description}
                </p>

                {/* Breathing Circle */}
                <div className="relative mb-8">
                  <motion.div
                    animate={{
                      scale:
                        breathingPhase === "inhale"
                          ? 1.5
                          : breathingPhase === "exhale"
                          ? 0.8
                          : 1.2,
                    }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                    className={`w-64 h-64 rounded-full bg-gradient-to-br ${getPhaseColor()} flex items-center justify-center shadow-2xl`}
                  >
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white mb-2">
                        {getPhaseInstruction()}
                      </div>
                      <div className="text-lg text-white/80">
                        {currentExercise && (
                          <>
                            {breathingPhase === "inhale" &&
                              currentExercise.inhale - breathingCount}
                            {breathingPhase === "hold" &&
                              currentExercise.hold - breathingCount}
                            {breathingPhase === "exhale" &&
                              currentExercise.exhale - breathingCount}
                            {breathingPhase === "holdAfter" &&
                              currentExercise.holdAfter &&
                              currentExercise.holdAfter - breathingCount}
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>

                  {/* Breathing Guide Rings */}
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                    className="absolute inset-0 rounded-full border-2 border-white/20"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: 0.5,
                    }}
                    className="absolute inset-0 rounded-full border border-white/10"
                  />
                </div>

                {/* Stats */}
                <div className="flex items-center justify-center gap-8 mb-8">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">
                      {currentCycle}
                    </div>
                    <div className="text-white/70 text-sm">Cycles</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">
                      {Math.round(heartRate)}
                    </div>
                    <div className="text-white/70 text-sm">BPM</div>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsBreathing(!isBreathing)}
                    className="p-4 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
                  >
                    {isBreathing ? <Pause size={24} /> : <Play size={24} />}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={stopBreathingExercise}
                    className="p-4 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                  >
                    <RotateCcw size={24} />
                  </motion.button>
                </div>
              </motion.div>
            </div>
          ) : (
            /* Active Relaxation Technique */
            <div className="flex flex-col items-center justify-center h-full">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center max-w-2xl"
              >
                <h3 className="text-2xl font-bold text-white mb-2">
                  {currentRelaxationTechnique?.name}
                </h3>
                <p className="text-white/70 mb-8">
                  {currentRelaxationTechnique?.description}
                </p>

                <div className="bg-white/5 rounded-xl p-8 mb-8 backdrop-blur-sm border border-white/10">
                  <div className="text-lg text-white mb-4">
                    Step {relaxationStep + 1} of{" "}
                    {currentRelaxationTechnique?.steps.length}
                  </div>
                  <div className="text-xl text-white/90 leading-relaxed">
                    {currentRelaxationTechnique?.steps[relaxationStep]}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={nextRelaxationStep}
                    className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                  >
                    {relaxationStep <
                    (currentRelaxationTechnique?.steps.length || 0) - 1
                      ? "Next Step"
                      : "Complete"}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setActiveRelaxation(null);
                      setRelaxationStep(0);
                    }}
                    className="px-6 py-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                  >
                    Stop
                  </motion.button>
                </div>
              </motion.div>
            </div>
          )}
        </GlassPanel>
      </div>

      {/* Wellness Stats */}
      <div className="col-span-12 lg:col-span-4">
        <GlassPanel className="p-6 h-full flex flex-col" glow>
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Heart className="text-red-400" size={20} />
            Wellness Monitor
          </h3>

          <div className="flex-1 space-y-6">
            {/* Heart Rate */}
            <div className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg
                  className="w-full h-full transform -rotate-90"
                  viewBox="0 0 100 100"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="6"
                    fill="none"
                  />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="url(#heartGradient)"
                    strokeWidth="6"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 45}`}
                    strokeDashoffset={`${
                      2 * Math.PI * 45 * (1 - heartRate / 120)
                    }`}
                    animate={{
                      strokeDashoffset:
                        2 * Math.PI * 45 * (1 - heartRate / 120),
                    }}
                    transition={{ duration: 0.5 }}
                  />
                  <defs>
                    <linearGradient
                      id="heartGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#EF4444" />
                      <stop offset="100%" stopColor="#F97316" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">
                      {Math.round(heartRate)}
                    </div>
                    <div className="text-xs text-white/70">BPM</div>
                  </div>
                </div>
              </div>
              <div className="text-white/70 text-sm">Heart Rate</div>
            </div>

            {/* Stress Level Indicator */}
            <div className="bg-white/5 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white text-sm">Stress Level</span>
                <span className="text-green-400 text-sm">Low</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-green-500 to-yellow-500"
                  initial={{ width: "60%" }}
                  animate={{ width: isBreathing ? "20%" : "60%" }}
                  transition={{ duration: 2 }}
                />
              </div>
            </div>

            {/* Session Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-lg p-3 text-center backdrop-blur-sm">
                <div className="text-lg font-bold text-blue-400">
                  {currentCycle}
                </div>
                <div className="text-xs text-white/70">Breathing Cycles</div>
              </div>
              <div className="bg-white/5 rounded-lg p-3 text-center backdrop-blur-sm">
                <div className="text-lg font-bold text-purple-400">
                  {activeExercise || activeRelaxation ? "Active" : "Ready"}
                </div>
                <div className="text-xs text-white/70">Session Status</div>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-white/5 rounded-lg p-4 backdrop-blur-sm">
              <h4 className="text-white font-medium mb-2">💡 Quick Tips</h4>
              <ul className="text-white/70 text-sm space-y-1">
                <li>• Practice breathing exercises daily</li>
                <li>• Find a quiet, comfortable space</li>
                <li>• Focus on your breath rhythm</li>
                <li>• Be patient with yourself</li>
              </ul>
            </div>
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}
