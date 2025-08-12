"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image"; // Import the Next.js Image component
import {
  Play,
  Pause,
  RotateCcw,
  Heart,
  Brain,
  Leaf,
  Sun,
  Timer,
  Volume2,
  SkipForward,
} from "lucide-react";
import GlassPanel from "@/components/ui/GlassPanel";



// Update the props interface to use the new Notification type
interface StressSectionProps {
  onNotification: (notification: any) => void;
}

interface WellnessActivity {
  id: string;
  name: string;
  category: "breathing" | "meditation" | "relaxation" | "mindfulness";
  duration: number;
  steps: string[];
  benefits: string[];
  videoUrl: string;
  imageUrl: string;
  audioUrl?: string;
}

const activities: WellnessActivity[] = [
  {
    id: "box-breathing",
    name: "Box Breathing Technique",
    category: "breathing",
    duration: 300, // 5 minutes
    steps: [
      "Sit comfortably with your back straight and feet flat on the floor",
      "Exhale completely through your mouth",
      "Inhale through your nose for 4 counts",
      "Hold your breath for 4 counts",
      "Exhale through your mouth for 4 counts",
      "Hold empty for 4 counts",
      "Repeat this cycle focusing only on your breath",
      "If your mind wanders, gently return to counting",
      "Continue until the timer completes",
      "End with three natural breaths",
    ],
    benefits: [
      "Reduces anxiety",
      "Lowers heart rate",
      "Improves focus",
      "Calms nervous system",
    ],
    videoUrl: "/placeholder.svg?height=300&width=400&text=Box+Breathing",
    imageUrl: "/placeholder.svg?height=200&width=300&text=Breathing+Exercise",
    audioUrl: "/placeholder.svg?height=100&width=100&text=Audio+Guide",
  },
  {
    id: "body-scan",
    name: "Progressive Body Scan",
    category: "meditation",
    duration: 600, // 10 minutes
    steps: [
      "Lie down comfortably or sit in a supportive chair",
      "Close your eyes and take three deep breaths",
      "Start by focusing on your toes - notice any sensations",
      "Slowly move your attention up to your feet and ankles",
      "Continue scanning up through your calves and knees",
      "Move through your thighs and hips",
      "Scan your abdomen and lower back",
      "Notice your chest, shoulders, and upper back",
      "Move through your arms, hands, and fingers",
      "Finally, scan your neck, face, and top of your head",
      "Take a moment to feel your whole body",
      "Slowly wiggle your fingers and toes before opening your eyes",
    ],
    benefits: [
      "Releases physical tension",
      "Increases body awareness",
      "Promotes deep relaxation",
    ],
    videoUrl: "/placeholder.svg?height=300&width=400&text=Body+Scan",
    imageUrl: "/placeholder.svg?height=200&width=300&text=Meditation",
  },
  {
    id: "muscle-relaxation",
    name: "Progressive Muscle Relaxation",
    category: "relaxation",
    duration: 480, // 8 minutes
    steps: [
      "Find a comfortable position lying down or sitting",
      "Take several deep breaths to center yourself",
      "Tense your feet and toes for 5 seconds, then release",
      "Tense your calf muscles for 5 seconds, then release",
      "Tense your thigh muscles for 5 seconds, then release",
      "Tense your glutes and abdomen for 5 seconds, then release",
      "Make fists and tense your arms for 5 seconds, then release",
      "Tense your shoulders up to your ears for 5 seconds, then release",
      "Scrunch your face muscles for 5 seconds, then release",
      "Tense your entire body for 5 seconds, then completely relax",
      "Lie still and enjoy the feeling of complete relaxation",
      "Slowly return to normal awareness",
    ],
    benefits: [
      "Reduces muscle tension",
      "Improves sleep quality",
      "Decreases stress hormones",
    ],
    videoUrl: "/placeholder.svg?height=300&width=400&text=Muscle+Relaxation",
    imageUrl: "/placeholder.svg?height=200&width=300&text=Relaxation",
  },
  {
    id: "mindful-observation",
    name: "Mindful Observation",
    category: "mindfulness",
    duration: 420, // 7 minutes
    steps: [
      "Choose an object in your environment to focus on",
      "Sit comfortably and hold the object in your hands",
      "Examine it as if you've never seen it before",
      "Notice its color, texture, weight, and temperature",
      "Observe any patterns, marks, or unique features",
      "If it has a scent, notice that too",
      "When your mind wanders, gently return to the object",
      "Continue exploring with curiosity and openness",
      "Notice how this focused attention affects your mind",
      "Slowly expand your awareness to your surroundings",
      "Take a moment to appreciate this mindful experience",
      "Gently set the object down and return to normal awareness",
    ],
    benefits: [
      "Improves concentration",
      "Reduces mental chatter",
      "Enhances present-moment awareness",
    ],
    videoUrl: "/placeholder.svg?height=300&width=400&text=Mindful+Observation",
    imageUrl: "/placeholder.svg?height=200&width=300&text=Mindfulness",
  },
  {
    id: "loving-kindness",
    name: "Loving-Kindness Meditation",
    category: "meditation",
    duration: 540, // 9 minutes
    steps: [
      "Sit comfortably with your eyes closed",
      "Take a few deep breaths to settle in",
      "Bring yourself to mind and silently say: 'May I be happy'",
      "Continue: 'May I be healthy, may I be at peace'",
      "Repeat these phrases, feeling the intention behind them",
      "Now bring a loved one to mind",
      "Offer them the same phrases: 'May you be happy, healthy, at peace'",
      "Next, think of a neutral person - someone you neither like nor dislike",
      "Offer them the same loving wishes",
      "Finally, think of someone you have difficulty with",
      "Try to offer them the same phrases with genuine intention",
      "End by extending these wishes to all beings everywhere",
    ],
    benefits: [
      "Increases compassion",
      "Reduces negative emotions",
      "Improves relationships",
    ],
    videoUrl: "/placeholder.svg?height=300&width=400&text=Loving+Kindness",
    imageUrl: "/placeholder.svg?height=200&width=300&text=Compassion",
  },
  {
    id: "stress-release",
    name: "Quick Stress Release",
    category: "breathing",
    duration: 180, // 3 minutes
    steps: [
      "Stand or sit with your spine straight",
      "Take a deep breath in through your nose",
      "Hold for 3 seconds while tensing your whole body",
      "Exhale forcefully through your mouth with a 'ahh' sound",
      "Let your whole body go limp and relaxed",
      "Repeat this tension-release cycle 5 times",
      "Now breathe normally and notice the difference",
      "Shake out your hands and arms gently",
      "Roll your shoulders backward and forward",
      "Take three more deep, cleansing breaths",
      "Notice how much more relaxed you feel",
      "Carry this feeling with you as you continue your day",
    ],
    benefits: [
      "Rapid stress relief",
      "Releases physical tension",
      "Boosts energy",
    ],
    videoUrl: "/placeholder.svg?height=300&width=400&text=Stress+Release",
    imageUrl: "/placeholder.svg?height=200&width=300&text=Quick+Relief",
  },
];

const categoryIcons = {
  breathing: Heart,
  meditation: Brain,
  relaxation: Leaf,
  mindfulness: Sun,
};

const categoryColors = {
  breathing: "from-blue-500 to-cyan-500",
  meditation: "from-purple-500 to-pink-500",
  relaxation: "from-green-500 to-emerald-500",
  mindfulness: "from-yellow-500 to-orange-500",
};

export default function StressSection({ onNotification }: StressSectionProps) {
  const [selectedActivity, setSelectedActivity] =
    useState<WellnessActivity | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [stepTimer, setStepTimer] = useState(30);
  const [customDuration, setCustomDuration] = useState(30);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const stepTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (stepTimerRef.current) clearInterval(stepTimerRef.current);
    };
  }, []);

  const startActivity = (activity: WellnessActivity) => {
    setSelectedActivity(activity);
    setCurrentStep(0);
    setTimeRemaining(activity.duration);
    setStepTimer(customDuration);
    setIsActive(true);

    // Start main timer
    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          completeActivity();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Start step timer with auto-progression
    startStepTimer();

    onNotification({
      type: "success",
      title: "Wellness Session Started",
      message: `Starting ${activity.name}`,
    });
  };

  const startStepTimer = () => {
    if (stepTimerRef.current) clearInterval(stepTimerRef.current);

    stepTimerRef.current = setInterval(() => {
      setStepTimer((prev) => {
        if (prev <= 1) {
          nextStep();
          return customDuration;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const nextStep = () => {
    if (!selectedActivity) return;

    setCurrentStep((prev) => {
      const nextStepIndex = prev + 1;
      if (nextStepIndex >= selectedActivity.steps.length) {
        // Loop back to beginning for continuous practice
        return 0;
      }
      return nextStepIndex;
    });
  };

  const completeActivity = () => {
    setIsActive(false);
    if (timerRef.current) clearInterval(timerRef.current);
    if (stepTimerRef.current) clearInterval(stepTimerRef.current);

    onNotification({
      type: "success",
      title: "Wellness Session Complete!",
      message: `Great job completing ${selectedActivity?.name}!`,
    });
  };

  const pauseActivity = () => {
    setIsActive(false);
    if (timerRef.current) clearInterval(timerRef.current);
    if (stepTimerRef.current) clearInterval(stepTimerRef.current);
  };

  const resumeActivity = () => {
    setIsActive(true);

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          completeActivity();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    startStepTimer();
  };

  const resetActivity = () => {
    setIsActive(false);
    setCurrentStep(0);
    setTimeRemaining(selectedActivity?.duration || 0);
    setStepTimer(customDuration);
    if (timerRef.current) clearInterval(timerRef.current);
    if (stepTimerRef.current) clearInterval(stepTimerRef.current);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
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

  if (selectedActivity) {
    return (
      <div className="h-full flex gap-6 overflow-hidden">
        {/* Video/Visual Side */}
        <div className="flex-1 min-w-0">
          <GlassPanel className="h-full p-6" glow>
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between mb-4 flex-shrink-0">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">
                    {selectedActivity.name}
                  </h2>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full bg-gradient-to-r ${
                        categoryColors[selectedActivity.category]
                      }`}
                    />
                    <span className="text-white/70 capitalize">
                      {selectedActivity.category} Practice
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedActivity(null)}
                  className="text-white/70 hover:text-white transition-colors"
                >
                  ← Back
                </button>
              </div>

              {/* Visual Guide - Now using Next.js Image component */}
              <div className="flex-1 bg-black/20 rounded-lg overflow-hidden mb-4 flex items-center justify-center min-h-0">
                <Image
                  src={selectedActivity.videoUrl || "/placeholder.svg"}
                  alt={selectedActivity.name}
                  className="w-full h-full object-cover rounded-lg"
                  width={400} // Specify width
                  height={300} // Specify height
                />
              </div>

              {/* Timer Controls */}
              <div className="flex items-center justify-center gap-6 mb-4 flex-shrink-0">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-1">
                    {formatTime(timeRemaining)}
                  </div>
                  <div className="text-white/70 text-sm">Total Time</div>
                </div>

                <div className="flex gap-3">
                  {!isActive ? (
                    <button
                      onClick={resumeActivity}
                      className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full transition-colors shadow-lg"
                    >
                      <Play size={24} />
                    </button>
                  ) : (
                    <button
                      onClick={pauseActivity}
                      className="bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-full transition-colors shadow-lg"
                    >
                      <Pause size={24} />
                    </button>
                  )}

                  <button
                    onClick={resetActivity}
                    className="bg-gray-500 hover:bg-gray-600 text-white p-4 rounded-full transition-colors shadow-lg"
                  >
                    <RotateCcw size={24} />
                  </button>

                  <button
                    onClick={nextStep}
                    className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full transition-colors shadow-lg"
                  >
                    <SkipForward size={24} />
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

        {/* Instructions Side */}
        <div className="flex-1 min-w-0">
          <GlassPanel className="h-full p-6" glow>
            <div className="h-full flex flex-col overflow-hidden">
              {/* Current Step */}
              <div className="mb-6 flex-shrink-0">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    Step {currentStep + 1} of {selectedActivity.steps.length}
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

                <div className="bg-black/20 rounded-lg p-6 mb-4">
                  {/* Image tag replaced with Next.js Image component */}
                  <Image
                    src={selectedActivity.imageUrl || "/placeholder.svg"}
                    alt={`Step ${currentStep + 1}`}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                    width={300} // Specify width
                    height={200} // Specify height
                  />
                  <p className="text-white text-lg leading-relaxed">
                    {selectedActivity.steps[currentStep]}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={nextStep}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2 font-medium"
                  >
                    <Timer size={16} />
                    Next Step
                  </button>

                  {selectedActivity.audioUrl && (
                    <button className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2 font-medium">
                      <Volume2 size={16} />
                      Audio Guide
                    </button>
                  )}
                </div>
              </div>

              {/* Progress Indicator */}
              <div className="mb-6 flex-shrink-0">
                <div className="flex justify-between text-sm text-white/70 mb-2">
                  <span>Session Progress</span>
                  <span>
                    {Math.round(
                      ((selectedActivity.duration - timeRemaining) /
                        selectedActivity.duration) *
                        100
                    )}
                    %
                  </span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-3">
                  <motion.div
                    className="bg-gradient-to-r from-green-400 to-blue-400 h-3 rounded-full"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${
                        ((selectedActivity.duration - timeRemaining) /
                          selectedActivity.duration) *
                        100
                      }%`,
                    }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              {/* Benefits */}
              <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Benefits of This Practice
                </h3>
                <div className="space-y-3">
                  {selectedActivity.benefits.map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-3 h-3 bg-green-400 rounded-full flex-shrink-0" />
                      <span className="text-white/90">{benefit}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </GlassPanel>
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
          <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent mb-2">
            Wellness & Stress Management Center
          </h1>
          <p className="text-white/70">
            Guided practices for mental wellness, stress relief, and mindfulness
          </p>
        </motion.div>

        {/* Category Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {Object.entries(categoryColors).map(([category, color]) => {
            const Icon = categoryIcons[category as keyof typeof categoryIcons];
            const activityCount = activities.filter(
              (activity) => activity.category === category
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
                    <Icon className="text-white" size={24} />
                  </div>
                  <h3 className="text-white font-semibold capitalize mb-1">
                    {category}
                  </h3>
                  <p className="text-white/70 text-sm">
                    {activityCount} practices
                  </p>
                </GlassPanel>
              </motion.div>
            );
          })}
        </div>

        {/* Activities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((activity, index) => {
            const Icon = categoryIcons[activity.category];

            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassPanel className="p-6 h-full" glow>
                  <div className="flex flex-col h-full">
                    {/* Activity Image - Now using Next.js Image component */}
                    <div className="bg-black/20 rounded-lg overflow-hidden mb-4">
                      <Image
                        src={activity.imageUrl || "/placeholder.svg"}
                        alt={activity.name}
                        className="w-full h-32 object-cover"
                        width={300} // Specify width
                        height={128} // Specify height
                      />
                    </div>

                    {/* Activity Info */}
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className={`w-10 h-10 bg-gradient-to-r ${
                          categoryColors[activity.category]
                        } rounded-full flex items-center justify-center`}
                      >
                        <Icon className="text-white" size={18} />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">
                          {activity.name}
                        </h3>
                        <p className="text-white/70 text-sm capitalize">
                          {activity.category} •{" "}
                          {Math.floor(activity.duration / 60)} min
                        </p>
                      </div>
                    </div>

                    {/* Benefits Preview */}
                    <div className="flex-1 mb-4">
                      <div className="space-y-2">
                        {activity.benefits.slice(0, 2).map((benefit, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0" />
                            <span className="text-white/80 text-sm">
                              {benefit}
                            </span>
                          </div>
                        ))}
                        {activity.benefits.length > 2 && (
                          <div className="text-white/60 text-xs">
                            +{activity.benefits.length - 2} more benefits
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Start Button */}
                    <button
                      onClick={() => startActivity(activity)}
                      className={`w-full bg-gradient-to-r ${
                        categoryColors[activity.category]
                      } hover:opacity-90 text-white py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 font-semibold shadow-lg`}
                    >
                      <Play size={16} />
                      Start Practice
                    </button>
                  </div>
                </GlassPanel>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
