"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Cloud,
  CloudRain,
  CloudSnow,
  Sun,
  Zap,
  Wind,
  Droplets,
  Flame,
  Sparkles,
  Star,
  Leaf,
  Bug,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Settings,
  Snowflake,
  Rainbow,
  Tornado,
  Waves,
  TreePine,
  Flower,
  Bird,
  Fish,
  Moon,
  Sunrise,
  Sunset,
  Eye,
  Heart,
  Feather,
  Gem,
} from "lucide-react";
import GlassPanel from "@/components/ui/GlassPanel";

// interface Notification {
//   type: "success" | "info" | "warning" | "error";
//   title: string;
//   message: string;
// }

interface EffectsSectionProps {
  onNotification: (notification: unknown) => void;
}

const iconMap = {
  CloudRain,
  CloudSnow,
  Zap,
  Cloud,
  Bug,
  Leaf,
  Star,
  Sparkles,
  Wind,
  Flame,
  Droplets,
  Sun,
  Snowflake,
  Rainbow,
  Tornado,
  Waves,
  TreePine,
  Flower,
  Bird,
  Fish,
  Moon,
  Sunrise,
  Sunset,
  Eye,
  Heart,
  Feather,
  Gem,
} as const;

interface Effect {
  id: string;
  name: string;
  category:
    | "weather"
    | "nature"
    | "atmospheric"
    | "magical"
    | "seasonal"
    | "cosmic"
    | "aquatic"
    | "mystical";
  iconName: keyof typeof iconMap;
  description: string;
  intensity: number;
  hasAudio: boolean;
  isActive: boolean;
  color: string;
  particles: number;
  speed: number;
  size: number;
  opacity: number;
  direction: "down" | "up" | "left" | "right" | "random";
  physics: boolean;
  interactive: boolean;
}

const defaultEffects: Effect[] = [
  // Weather Effects
  {
    id: "rain",
    name: "Realistic Rain",
    category: "weather",
    iconName: "CloudRain",
    description:
      "Hyper-realistic raindrops with splash effects, puddle formation, and ambient sounds",
    intensity: 50,
    hasAudio: true,
    isActive: false,
    color: "#4A90E2",
    particles: 150,
    speed: 8,
    size: 2,
    opacity: 0.8,
    direction: "down",
    physics: true,
    interactive: true,
  },
  {
    id: "heavy-rain",
    name: "Heavy Downpour",
    category: "weather",
    iconName: "CloudRain",
    description:
      "Intense rainfall with wind effects and realistic water physics",
    intensity: 80,
    hasAudio: true,
    isActive: false,
    color: "#2E5BBA",
    particles: 250,
    speed: 12,
    size: 3,
    opacity: 0.9,
    direction: "down",
    physics: true,
    interactive: true,
  },
  {
    id: "snow",
    name: "Gentle Snowfall",
    category: "weather",
    iconName: "CloudSnow",
    description:
      "Soft snowflakes with realistic physics, wind drift, and accumulation",
    intensity: 30,
    hasAudio: false,
    isActive: false,
    color: "#FFFFFF",
    particles: 100,
    speed: 3,
    size: 4,
    opacity: 0.9,
    direction: "down",
    physics: true,
    interactive: true,
  },
  {
    id: "blizzard",
    name: "Winter Blizzard",
    category: "weather",
    iconName: "Snowflake",
    description:
      "Intense snowstorm with strong winds and swirling snow patterns",
    intensity: 90,
    hasAudio: true,
    isActive: false,
    color: "#E6F3FF",
    particles: 300,
    speed: 10,
    size: 3,
    opacity: 0.8,
    direction: "random",
    physics: true,
    interactive: true,
  },
  {
    id: "lightning",
    name: "Thunder & Lightning",
    category: "weather",
    iconName: "Zap",
    description:
      "Dramatic lightning bolts with realistic branching, thunder sounds, and screen flashes",
    intensity: 20,
    hasAudio: true,
    isActive: false,
    color: "#FFFFFF",
    particles: 1,
    speed: 10,
    size: 8,
    opacity: 1,
    direction: "down",
    physics: false,
    interactive: true,
  },
  {
    id: "fog",
    name: "Mysterious Fog",
    category: "atmospheric",
    iconName: "Cloud",
    description:
      "Dense fog that drifts across the screen with realistic density variations",
    intensity: 40,
    hasAudio: false,
    isActive: false,
    color: "#E6E6FA",
    particles: 30,
    speed: 1,
    size: 120,
    opacity: 0.4,
    direction: "left",
    physics: false,
    interactive: false,
  },
  {
    id: "tornado",
    name: "Dust Devil",
    category: "weather",
    iconName: "Tornado",
    description:
      "Swirling dust devil with realistic particle physics and debris",
    intensity: 60,
    hasAudio: true,
    isActive: false,
    color: "#D2B48C",
    particles: 200,
    speed: 15,
    size: 2,
    opacity: 0.7,
    direction: "random",
    physics: true,
    interactive: true,
  },

  // Nature Effects
  {
    id: "fireflies",
    name: "Magical Fireflies",
    category: "nature",
    iconName: "Bug",
    description:
      "Enchanting fireflies that glow, dance, and respond to cursor movement",
    intensity: 25,
    hasAudio: false,
    isActive: false,
    color: "#FFFF00",
    particles: 20,
    speed: 2,
    size: 3,
    opacity: 0.8,
    direction: "random",
    physics: true,
    interactive: true,
  },
  {
    id: "butterflies",
    name: "Dancing Butterflies",
    category: "nature",
    iconName: "Bird",
    description:
      "Colorful butterflies that flutter and dance in natural patterns",
    intensity: 35,
    hasAudio: false,
    isActive: false,
    color: "#FF69B4",
    particles: 15,
    speed: 3,
    size: 8,
    opacity: 0.9,
    direction: "random",
    physics: true,
    interactive: true,
  },
  {
    id: "autumn-leaves",
    name: "Autumn Leaves",
    category: "seasonal",
    iconName: "Leaf",
    description:
      "Colorful autumn leaves falling with realistic wind physics and swirling patterns",
    intensity: 35,
    hasAudio: false,
    isActive: false,
    color: "#D2691E",
    particles: 50,
    speed: 4,
    size: 8,
    opacity: 0.9,
    direction: "down",
    physics: true,
    interactive: true,
  },
  {
    id: "cherry-blossoms",
    name: "Cherry Blossom Petals",
    category: "seasonal",
    iconName: "Flower",
    description: "Delicate cherry blossom petals dancing in the spring breeze",
    intensity: 40,
    hasAudio: false,
    isActive: false,
    color: "#FFB6C1",
    particles: 40,
    speed: 3,
    size: 6,
    opacity: 0.8,
    direction: "down",
    physics: true,
    interactive: true,
  },
  {
    id: "floating-seeds",
    name: "Dandelion Seeds",
    category: "nature",
    iconName: "Feather",
    description: "Floating dandelion seeds drifting gently on air currents",
    intensity: 25,
    hasAudio: false,
    isActive: false,
    color: "#F5F5DC",
    particles: 30,
    speed: 2,
    size: 4,
    opacity: 0.7,
    direction: "up",
    physics: true,
    interactive: true,
  },

  // Magical Effects
  {
    id: "stars",
    name: "Twinkling Stars",
    category: "cosmic",
    iconName: "Star",
    description:
      "Sparkling stars that twinkle and shimmer across the cosmic void",
    intensity: 60,
    hasAudio: false,
    isActive: false,
    color: "#FFD700",
    particles: 80,
    speed: 0.5,
    size: 2,
    opacity: 0.7,
    direction: "random",
    physics: false,
    interactive: true,
  },
  {
    id: "shooting-stars",
    name: "Shooting Stars",
    category: "cosmic",
    iconName: "Star",
    description: "Brilliant shooting stars streaking across the night sky",
    intensity: 15,
    hasAudio: false,
    isActive: false,
    color: "#FFFFFF",
    particles: 3,
    speed: 20,
    size: 4,
    opacity: 1,
    direction: "random",
    physics: false,
    interactive: true,
  },
  {
    id: "sparkles",
    name: "Magic Sparkles",
    category: "magical",
    iconName: "Sparkles",
    description:
      "Enchanting sparkles that appear and disappear with magical shimmer",
    intensity: 45,
    hasAudio: false,
    isActive: false,
    color: "#FF69B4",
    particles: 35,
    speed: 3,
    size: 4,
    opacity: 0.8,
    direction: "random",
    physics: false,
    interactive: true,
  },
  {
    id: "fairy-dust",
    name: "Fairy Dust",
    category: "magical",
    iconName: "Sparkles",
    description: "Glittering fairy dust with rainbow colors and magical trails",
    intensity: 50,
    hasAudio: false,
    isActive: false,
    color: "#DDA0DD",
    particles: 60,
    speed: 2,
    size: 2,
    opacity: 0.6,
    direction: "random",
    physics: true,
    interactive: true,
  },
  {
    id: "rainbow-drops",
    name: "Rainbow Droplets",
    category: "magical",
    iconName: "Rainbow",
    description:
      "Colorful droplets that shift through rainbow hues as they fall",
    intensity: 40,
    hasAudio: false,
    isActive: false,
    color: "#FF6B6B",
    particles: 45,
    speed: 5,
    size: 5,
    opacity: 0.8,
    direction: "down",
    physics: true,
    interactive: true,
  },

  // Atmospheric Effects
  {
    id: "wind",
    name: "Wind Gusts",
    category: "atmospheric",
    iconName: "Wind",
    description:
      "Visible wind currents that affect other particles and create atmospheric movement",
    intensity: 30,
    hasAudio: true,
    isActive: false,
    color: "#87CEEB",
    particles: 80,
    speed: 6,
    size: 1,
    opacity: 0.4,
    direction: "left",
    physics: true,
    interactive: false,
  },
  {
    id: "mist",
    name: "Morning Mist",
    category: "atmospheric",
    iconName: "Droplets",
    description:
      "Gentle morning mist that creates a dreamy, ethereal atmosphere",
    intensity: 35,
    hasAudio: false,
    isActive: false,
    color: "#F0F8FF",
    particles: 40,
    speed: 1.5,
    size: 60,
    opacity: 0.3,
    direction: "up",
    physics: false,
    interactive: false,
  },
  {
    id: "aurora",
    name: "Northern Lights",
    category: "cosmic",
    iconName: "Waves",
    description:
      "Mesmerizing aurora borealis with shifting colors and ethereal movement",
    intensity: 70,
    hasAudio: false,
    isActive: false,
    color: "#00FF7F",
    particles: 20,
    speed: 1,
    size: 200,
    opacity: 0.5,
    direction: "random",
    physics: false,
    interactive: true,
  },

  // Fire Effects
  {
    id: "embers",
    name: "Fire Embers",
    category: "nature",
    iconName: "Flame",
    description:
      "Glowing embers that rise and fade like a campfire with realistic heat distortion",
    intensity: 40,
    hasAudio: false,
    isActive: false,
    color: "#FF4500",
    particles: 30,
    speed: 2,
    size: 3,
    opacity: 0.9,
    direction: "up",
    physics: true,
    interactive: true,
  },
  {
    id: "phoenix-feathers",
    name: "Phoenix Feathers",
    category: "magical",
    iconName: "Feather",
    description:
      "Mystical phoenix feathers that glow with inner fire and float gracefully",
    intensity: 20,
    hasAudio: false,
    isActive: false,
    color: "#FF6347",
    particles: 12,
    speed: 2,
    size: 12,
    opacity: 0.8,
    direction: "random",
    physics: true,
    interactive: true,
  },

  // Aquatic Effects
  {
    id: "bubbles",
    name: "Ocean Bubbles",
    category: "aquatic",
    iconName: "Droplets",
    description:
      "Realistic underwater bubbles rising to the surface with varying sizes",
    intensity: 45,
    hasAudio: false,
    isActive: false,
    color: "#87CEEB",
    particles: 50,
    speed: 3,
    size: 6,
    opacity: 0.6,
    direction: "up",
    physics: true,
    interactive: true,
  },
  {
    id: "jellyfish",
    name: "Floating Jellyfish",
    category: "aquatic",
    iconName: "Fish",
    description:
      "Graceful jellyfish floating through the water with bioluminescent trails",
    intensity: 15,
    hasAudio: false,
    isActive: false,
    color: "#9370DB",
    particles: 8,
    speed: 1,
    size: 20,
    opacity: 0.7,
    direction: "random",
    physics: true,
    interactive: true,
  },

  // Mystical Effects
  {
    id: "crystal-shards",
    name: "Crystal Shards",
    category: "mystical",
    iconName: "Gem",
    description:
      "Floating crystal shards that catch and reflect light with prismatic effects",
    intensity: 30,
    hasAudio: false,
    isActive: false,
    color: "#E6E6FA",
    particles: 25,
    speed: 2,
    size: 8,
    opacity: 0.8,
    direction: "random",
    physics: true,
    interactive: true,
  },
  {
    id: "spirit-orbs",
    name: "Spirit Orbs",
    category: "mystical",
    iconName: "Eye",
    description: "Mysterious spirit orbs that pulse with otherworldly energy",
    intensity: 20,
    hasAudio: false,
    isActive: false,
    color: "#98FB98",
    particles: 15,
    speed: 1,
    size: 10,
    opacity: 0.6,
    direction: "random",
    physics: true,
    interactive: true,
  },
  {
    id: "moonbeams",
    name: "Moonbeams",
    category: "cosmic",
    iconName: "Moon",
    description:
      "Ethereal moonbeams filtering through clouds with silvery light",
    intensity: 25,
    hasAudio: false,
    isActive: false,
    color: "#F5F5DC",
    particles: 20,
    speed: 1,
    size: 100,
    opacity: 0.4,
    direction: "down",
    physics: false,
    interactive: false,
  },
  {
    id: "realistic-lightning",
    name: "Ultra Realistic Lightning",
    category: "weather",
    iconName: "Zap",
    description:
      "Hyper-realistic lightning with multiple branches, realistic timing, and atmospheric effects",
    intensity: 30,
    hasAudio: true,
    isActive: false,
    color: "#FFFFFF",
    particles: 1,
    speed: 15,
    size: 12,
    opacity: 1,
    direction: "down",
    physics: true,
    interactive: true,
  },
  {
    id: "volcanic-ash",
    name: "Volcanic Ash",
    category: "weather",
    iconName: "Cloud",
    description:
      "Dense volcanic ash clouds with realistic particle physics and wind effects",
    intensity: 60,
    hasAudio: true,
    isActive: false,
    color: "#696969",
    particles: 200,
    speed: 4,
    size: 3,
    opacity: 0.8,
    direction: "random",
    physics: true,
    interactive: true,
  },
  {
    id: "aurora-enhanced",
    name: "Enhanced Aurora Borealis",
    category: "cosmic",
    iconName: "Waves",
    description:
      "Spectacular aurora with realistic color shifts, magnetic field simulation, and solar wind effects",
    intensity: 75,
    hasAudio: false,
    isActive: false,
    color: "#00FF7F",
    particles: 30,
    speed: 2,
    size: 300,
    opacity: 0.6,
    direction: "random",
    physics: false,
    interactive: true,
  },
  {
    id: "meteor-shower",
    name: "Meteor Shower",
    category: "cosmic",
    iconName: "Star",
    description:
      "Realistic meteor shower with varying sizes, trails, and atmospheric burn-up effects",
    intensity: 40,
    hasAudio: false,
    isActive: false,
    color: "#FFD700",
    particles: 15,
    speed: 25,
    size: 6,
    opacity: 1,
    direction: "random",
    physics: true,
    interactive: true,
  },
  {
    id: "sandstorm",
    name: "Desert Sandstorm",
    category: "weather",
    iconName: "Wind",
    description:
      "Intense sandstorm with realistic particle density, wind patterns, and visibility reduction",
    intensity: 80,
    hasAudio: true,
    isActive: false,
    color: "#DEB887",
    particles: 300,
    speed: 12,
    size: 2,
    opacity: 0.7,
    direction: "left",
    physics: true,
    interactive: true,
  },
  {
    id: "bioluminescent-plankton",
    name: "Bioluminescent Plankton",
    category: "aquatic",
    iconName: "Sparkles",
    description:
      "Magical bioluminescent plankton that glow and pulse in response to movement",
    intensity: 50,
    hasAudio: false,
    isActive: false,
    color: "#00FFFF",
    particles: 80,
    speed: 1,
    size: 2,
    opacity: 0.9,
    direction: "random",
    physics: true,
    interactive: true,
  },
  {
    id: "forest-spirits",
    name: "Forest Spirits",
    category: "mystical",
    iconName: "Feather",
    description:
      "Ethereal forest spirits that dance between trees with mystical trails",
    intensity: 25,
    hasAudio: false,
    isActive: false,
    color: "#98FB98",
    particles: 12,
    speed: 2,
    size: 15,
    opacity: 0.7,
    direction: "random",
    physics: true,
    interactive: true,
  },
  {
    id: "dragon-breath",
    name: "Dragon&apos;s Breath",
    category: "magical",
    iconName: "Flame",
    description:
      "Mystical dragon breath with swirling fire particles and heat distortion effects",
    intensity: 70,
    hasAudio: false,
    isActive: false,
    color: "#FF4500",
    particles: 60,
    speed: 8,
    size: 8,
    opacity: 0.9,
    direction: "random",
    physics: true,
    interactive: true,
  },
];

const categoryColors = {
  weather: "from-blue-500 to-cyan-500",
  nature: "from-green-500 to-emerald-500",
  atmospheric: "from-gray-500 to-slate-500",
  magical: "from-purple-500 to-pink-500",
  seasonal: "from-orange-500 to-red-500",
  cosmic: "from-violet-500 to-purple-500",
  aquatic: "from-cyan-500 to-blue-500",
  mystical: "from-indigo-500 to-purple-500",
};

export default function EffectsSection({
  onNotification,
}: EffectsSectionProps) {
  const [effects, setEffects] = useState<Effect[]>(defaultEffects);
  const [globalVolume, setGlobalVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedEffect, setSelectedEffect] = useState<Effect | null>(null);

  useEffect(() => {
    // Load saved effects state
    const savedEffects = localStorage.getItem("dashboard-effects");
    const savedVolume = localStorage.getItem("effects-volume");
    const savedMuted = localStorage.getItem("effects-muted");
    const savedPlaying = localStorage.getItem("effects-playing");

    if (savedEffects) {
      try {
        const parsedEffects = JSON.parse(savedEffects);
        // Merge with default effects to ensure all properties exist
        const mergedEffects = defaultEffects.map((defaultEffect) => {
          const savedEffect = parsedEffects.find(
            (e: Effect) => e.id === defaultEffect.id
          );
          return savedEffect
            ? { ...defaultEffect, ...savedEffect }
            : defaultEffect;
        });
        setEffects(mergedEffects);
      } catch (error) {
        console.error("Error parsing saved effects:", error);
        setEffects(defaultEffects);
      }
    }
    if (savedVolume) {
      setGlobalVolume(Number.parseInt(savedVolume));
    }
    if (savedMuted) {
      setIsMuted(JSON.parse(savedMuted));
    }
    if (savedPlaying) {
      setIsPlaying(JSON.parse(savedPlaying));
    }
  }, []);

  useEffect(() => {
    // Save effects state
    localStorage.setItem("dashboard-effects", JSON.stringify(effects));

    // Notify effects manager of changes
    window.dispatchEvent(new CustomEvent("effectsChanged"));
  }, [effects]);

  useEffect(() => {
    localStorage.setItem("effects-volume", globalVolume.toString());
    localStorage.setItem("effects-muted", JSON.stringify(isMuted));
  }, [globalVolume, isMuted]);

  useEffect(() => {
    localStorage.setItem("effects-playing", JSON.stringify(isPlaying));

    // Notify effects manager of playback changes
    window.dispatchEvent(
      new CustomEvent("effectsPlaybackToggle", { detail: { isPlaying } })
    );
  }, [isPlaying]);

  const toggleEffect = (effectId: string) => {
    setEffects((prev) =>
      prev.map((effect) =>
        effect.id === effectId
          ? { ...effect, isActive: !effect.isActive }
          : effect
      )
    );

    const effect = effects.find((e) => e.id === effectId);
    if (effect) {
      onNotification({
        type: effect.isActive ? "info" : "success",
        title: `${effect.name} ${effect.isActive ? "Disabled" : "Enabled"}`,
        message: effect.isActive
          ? "Effect has been turned off"
          : "Effect is now active across all pages",
      });
    }
  };

  const updateEffectProperty = (
    effectId: string,
    property: keyof Omit<Effect, "iconName">,
    value: string | number | boolean
  ) => {
    setEffects((prev) =>
      prev.map((effect) =>
        effect.id === effectId ? { ...effect, [property]: value } : effect
      )
    );
  };

  const resetAllEffects = () => {
    setEffects((prev) =>
      prev.map((effect) => ({ ...effect, isActive: false }))
    );
    onNotification({
      type: "info",
      title: "All Effects Reset",
      message: "All effects have been turned off",
    });
  };

  const toggleGlobalPlayback = () => {
    setIsPlaying(!isPlaying);
    onNotification({
      type: "info",
      title: isPlaying ? "Effects Paused" : "Effects Resumed",
      message: `All effects are now ${isPlaying ? "paused" : "playing"}`,
    });
  };

  const activeEffectsCount = effects.filter((e) => e.isActive).length;

  return (
    <div className="h-full overflow-y-auto custom-scrollbar">
      <div className="max-w-7xl mx-auto space-y-6 p-4">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Hyper-Realistic Ambient Effects
          </h1>
          <p className="text-white/70">
            Immersive, physics-based effects that bring nature&apos;s beauty to
            your digital workspace
          </p>
        </motion.div>

        {/* Global Controls */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <GlassPanel className="p-6" glow>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-white font-semibold text-lg">
                  Global Controls
                </h3>
                <p className="text-white/70">
                  {activeEffectsCount} effect
                  {activeEffectsCount !== 1 ? "s" : ""} active
                </p>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={toggleGlobalPlayback}
                  className={`p-3 rounded-lg transition-colors ${
                    isPlaying
                      ? "bg-orange-500 hover:bg-orange-600"
                      : "bg-green-500 hover:bg-green-600"
                  } text-white`}
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </button>

                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`p-3 rounded-lg transition-colors ${
                    isMuted
                      ? "bg-gray-500 hover:bg-gray-600"
                      : "bg-blue-500 hover:bg-blue-600"
                  } text-white`}
                >
                  {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>

                <button
                  onClick={resetAllEffects}
                  className="p-3 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors"
                >
                  <RotateCcw size={20} />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-white/70 text-sm">Global Volume:</span>
              <input
                type="range"
                min="0"
                max="100"
                value={globalVolume}
                onChange={(e) => setGlobalVolume(Number(e.target.value))}
                className="flex-1 accent-blue-500"
              />
              <span className="text-white/70 text-sm w-12">
                {globalVolume}%
              </span>
            </div>
          </GlassPanel>
        </motion.div>

        {/* Effect Categories */}
        {Object.entries(
          effects.reduce((acc, effect) => {
            if (!acc[effect.category]) acc[effect.category] = [];
            acc[effect.category].push(effect);
            return acc;
          }, {} as Record<string, Effect[]>)
        ).map(([category, categoryEffects]) => (
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
                {category} Effects
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryEffects.map((effect) => {
                  const Icon = iconMap[effect.iconName] || Star;
                  const isActive = effect.isActive;

                  return (
                    <motion.div
                      key={effect.id}
                      whileHover={{ scale: 1.02 }}
                      className={`p-4 rounded-lg border transition-all ${
                        isActive
                          ? "bg-green-500/20 border-green-500/50"
                          : "bg-white/5 border-white/10 hover:bg-white/10"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 bg-gradient-to-r ${
                              categoryColors[effect.category]
                            } rounded-full flex items-center justify-center`}
                          >
                            <Icon className="text-white" size={16} />
                          </div>
                          <div>
                            <h4 className="font-medium text-white">
                              {effect.name}
                            </h4>
                            <div className="flex items-center gap-2 text-xs text-white/70">
                              {effect.hasAudio && (
                                <span className="bg-blue-500/20 text-blue-300 px-1 rounded">
                                  Audio
                                </span>
                              )}
                              {effect.interactive && (
                                <span className="bg-purple-500/20 text-purple-300 px-1 rounded">
                                  Interactive
                                </span>
                              )}
                              {effect.physics && (
                                <span className="bg-orange-500/20 text-orange-300 px-1 rounded">
                                  Physics
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() =>
                            setSelectedEffect(
                              selectedEffect?.id === effect.id ? null : effect
                            )
                          }
                          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                        >
                          <Settings size={14} />
                        </button>
                      </div>

                      <p className="text-white/80 text-sm mb-4">
                        {effect.description}
                      </p>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-white/70 text-sm">
                            Intensity
                          </span>
                          <span className="text-white/70 text-sm">
                            {effect.intensity}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={effect.intensity}
                          onChange={(e) =>
                            updateEffectProperty(
                              effect.id,
                              "intensity",
                              Number(e.target.value)
                            )
                          }
                          className="w-full accent-blue-500"
                        />

                        <button
                          onClick={() => toggleEffect(effect.id)}
                          className={`w-full py-2 rounded-lg transition-all font-semibold ${
                            isActive
                              ? "bg-red-500 hover:bg-red-600 text-white"
                              : "bg-green-500 hover:bg-green-600 text-white"
                          }`}
                        >
                          {isActive ? "Disable Effect" : "Enable Effect"}
                        </button>
                      </div>

                      {/* Advanced Settings */}
                      {selectedEffect?.id === effect.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 pt-4 border-t border-white/10 space-y-3"
                        >
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-white/70 text-xs">
                                Speed
                              </label>
                              <input
                                type="range"
                                min="1"
                                max="20"
                                value={effect.speed}
                                onChange={(e) =>
                                  updateEffectProperty(
                                    effect.id,
                                    "speed",
                                    Number(e.target.value)
                                  )
                                }
                                className="w-full accent-blue-500"
                              />
                            </div>
                            <div>
                              <label className="text-white/70 text-xs">
                                Size
                              </label>
                              <input
                                type="range"
                                min="1"
                                max="15"
                                value={effect.size}
                                onChange={(e) =>
                                  updateEffectProperty(
                                    effect.id,
                                    "size",
                                    Number(e.target.value)
                                  )
                                }
                                className="w-full accent-blue-500"
                              />
                            </div>
                            <div>
                              <label className="text-white/70 text-xs">
                                Particles
                              </label>
                              <input
                                type="range"
                                min="5"
                                max="500"
                                value={effect.particles}
                                onChange={(e) =>
                                  updateEffectProperty(
                                    effect.id,
                                    "particles",
                                    Number(e.target.value)
                                  )
                                }
                                className="w-full accent-blue-500"
                              />
                            </div>
                            <div>
                              <label className="text-white/70 text-xs">
                                Opacity
                              </label>
                              <input
                                type="range"
                                min="0.1"
                                max="1"
                                step="0.1"
                                value={effect.opacity}
                                onChange={(e) =>
                                  updateEffectProperty(
                                    effect.id,
                                    "opacity",
                                    Number(e.target.value)
                                  )
                                }
                                className="w-full accent-blue-500"
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}
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
