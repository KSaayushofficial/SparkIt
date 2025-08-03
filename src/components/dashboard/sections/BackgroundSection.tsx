"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Upload,
  Play,
  Volume2,
  VolumeX,
  Trash2,
  Eye,
  CloudRain,
  Sun,
  Mountain,
  Waves,
  TreePine,
  Building,
  Plane,
  Train,
  Coffee,
  Snowflake,
  Flame,
  Zap,
  Star,
  Fish,
  Leaf,
  Moon,
  Sunrise,
  Sunset,
  Wind,
  Cloud,
  Rainbow,
  Compass,
  Camera,
  Globe,
  MapPin,
  Home,
  Trees,
  Flower,
  Bird,
} from "lucide-react";
import GlassPanel from "@/components/ui/GlassPanel";

interface BackgroundSectionProps {
  onNotification: (notification: any) => void;
}

// Icon mapping for safe serialization
const iconMap = {
  Upload,
  Play,
  Eye,
  CloudRain,
  Sun,
  Mountain,
  Waves,
  TreePine,
  Building,
  Plane,
  Train,
  Coffee,
  Snowflake,
  Flame,
  Zap,
  Star,
  Fish,
  Leaf,
  Moon,
  Sunrise,
  Sunset,
  Wind,
  Cloud,
  Rainbow,
  Compass,
  Camera,
  Globe,
  MapPin,
  Home,
  Trees,
  Flower,
  Bird,
} as const;

interface Background {
  id: string;
  name: string;
  type: "video" | "image" | "interactive" | "generated";
  category:
    | "nature"
    | "urban"
    | "abstract"
    | "seasonal"
    | "travel"
    | "cozy"
    | "space"
    | "underwater"
    | "forest"
    | "desert"
    | "arctic";
  url?: string;
  thumbnail?: string;
  description: string;
  isActive: boolean;
  hasAudio: boolean;
  volume: number;
  speed: number;
  opacity: number;
  blur: number;
  interactive: boolean;
  effects: string[];
  iconName: keyof typeof iconMap;
}

const defaultBackgrounds: Background[] = [
  // Nature Backgrounds
  {
    id: "ocean-waves",
    name: "Ocean Waves",
    type: "interactive",
    category: "nature",
    description: "Calming ocean waves with gentle sounds and seagull calls",
    isActive: false,
    hasAudio: true,
    volume: 50,
    speed: 1,
    opacity: 100,
    blur: 0,
    interactive: true,
    effects: ["waves", "seagulls", "sea-breeze"],
    iconName: "Waves",
  },
  {
    id: "forest-rain",
    name: "Forest Rain",
    type: "interactive",
    category: "nature",
    description: "Peaceful forest with gentle rainfall and bird songs",
    isActive: false,
    hasAudio: true,
    volume: 60,
    speed: 1,
    opacity: 100,
    blur: 0,
    interactive: true,
    effects: ["rain", "wind", "birds"],
    iconName: "TreePine",
  },
  {
    id: "mountain-sunrise",
    name: "Mountain Sunrise",
    type: "interactive",
    category: "nature",
    description:
      "Majestic mountain sunrise with changing colors and morning mist",
    isActive: false,
    hasAudio: false,
    volume: 0,
    speed: 0.5,
    opacity: 100,
    blur: 0,
    interactive: false,
    effects: ["light-rays", "mist"],
    iconName: "Mountain",
  },
  {
    id: "tropical-beach",
    name: "Tropical Beach Paradise",
    type: "interactive",
    category: "nature",
    description: "Crystal clear waters, palm trees swaying, and tropical birds",
    isActive: false,
    hasAudio: true,
    volume: 45,
    speed: 1,
    opacity: 100,
    blur: 0,
    interactive: true,
    effects: ["palm-sway", "crystal-water", "tropical-birds"],
    iconName: "Sun",
  },
  {
    id: "cherry-blossom",
    name: "Cherry Blossom Garden",
    type: "interactive",
    category: "seasonal",
    description:
      "Beautiful cherry blossoms with falling petals in spring breeze",
    isActive: false,
    hasAudio: false,
    volume: 0,
    speed: 1,
    opacity: 100,
    blur: 0,
    interactive: true,
    effects: ["falling-petals", "gentle-breeze", "butterflies"],
    iconName: "Flower",
  },
  {
    id: "northern-lights",
    name: "Northern Lights",
    type: "interactive",
    category: "space",
    description: "Mesmerizing aurora borealis dancing across the night sky",
    isActive: false,
    hasAudio: true,
    volume: 30,
    speed: 1,
    opacity: 100,
    blur: 0,
    interactive: true,
    effects: ["aurora", "stars", "arctic-wind"],
    iconName: "Star",
  },
  {
    id: "underwater-coral",
    name: "Coral Reef Underwater",
    type: "interactive",
    category: "underwater",
    description: "Vibrant coral reef with tropical fish and gentle currents",
    isActive: false,
    hasAudio: true,
    volume: 40,
    speed: 1,
    opacity: 100,
    blur: 0,
    interactive: true,
    effects: ["fish-swimming", "water-bubbles", "coral-sway"],
    iconName: "Fish",
  },
  {
    id: "desert-sunset",
    name: "Desert Sunset",
    type: "interactive",
    category: "desert",
    description: "Vast desert landscape with stunning sunset and sand dunes",
    isActive: false,
    hasAudio: false,
    volume: 0,
    speed: 1,
    opacity: 100,
    blur: 0,
    interactive: true,
    effects: ["sand-drift", "heat-shimmer", "desert-wind"],
    iconName: "Sunset",
  },
  {
    id: "bamboo-forest",
    name: "Bamboo Forest",
    type: "interactive",
    category: "forest",
    description:
      "Serene bamboo forest with filtered sunlight and gentle rustling",
    isActive: false,
    hasAudio: true,
    volume: 35,
    speed: 1,
    opacity: 100,
    blur: 0,
    interactive: true,
    effects: ["bamboo-sway", "filtered-light", "zen-atmosphere"],
    iconName: "Trees",
  },
  {
    id: "alpine-lake",
    name: "Alpine Lake",
    type: "interactive",
    category: "nature",
    description: "Crystal clear alpine lake surrounded by snow-capped peaks",
    isActive: false,
    hasAudio: true,
    volume: 40,
    speed: 1,
    opacity: 100,
    blur: 0,
    interactive: true,
    effects: ["water-ripples", "mountain-echo", "fresh-air"],
    iconName: "Mountain",
  },
];

const categoryColors = {
  nature: "from-green-500 to-emerald-500",
  urban: "from-blue-500 to-cyan-500",
  abstract: "from-purple-500 to-pink-500",
  seasonal: "from-orange-500 to-red-500",
  travel: "from-indigo-500 to-purple-500",
  cozy: "from-amber-500 to-orange-500",
  space: "from-violet-500 to-purple-500",
  underwater: "from-cyan-500 to-blue-500",
  forest: "from-green-600 to-teal-500",
  desert: "from-yellow-500 to-orange-600",
  arctic: "from-blue-300 to-cyan-300",
};

export default function BackgroundSection({
  onNotification,
}: BackgroundSectionProps) {
  const [backgrounds, setBackgrounds] =
    useState<Background[]>(defaultBackgrounds);
  const [customBackgrounds, setCustomBackgrounds] = useState<Background[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedBackground, setSelectedBackground] =
    useState<Background | null>(null);
  const [globalVolume, setGlobalVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    // Load saved backgrounds and settings
    try {
      const savedBackgrounds = localStorage.getItem("dashboard-backgrounds");
      const savedCustom = localStorage.getItem("dashboard-custom-backgrounds");
      const savedVolume = localStorage.getItem("background-volume");
      const savedMuted = localStorage.getItem("background-muted");

      if (savedBackgrounds) {
        const parsed = JSON.parse(savedBackgrounds);
        // Merge with defaults to ensure all properties exist
        const mergedBackgrounds = defaultBackgrounds.map((defaultBg) => {
          const savedBg = parsed.find(
            (bg: Background) => bg.id === defaultBg.id
          );
          return savedBg ? { ...defaultBg, ...savedBg } : defaultBg;
        });
        setBackgrounds(mergedBackgrounds);
      }

      if (savedCustom) {
        setCustomBackgrounds(JSON.parse(savedCustom));
      }

      if (savedVolume) {
        setGlobalVolume(Number.parseInt(savedVolume));
      }

      if (savedMuted) {
        setIsMuted(JSON.parse(savedMuted));
      }
    } catch (error) {
      console.error("Error loading background settings:", error);
    }

    // Apply active background
    applyActiveBackground();
  }, []);

  useEffect(() => {
    // Save backgrounds state
    localStorage.setItem("dashboard-backgrounds", JSON.stringify(backgrounds));
    localStorage.setItem(
      "dashboard-custom-backgrounds",
      JSON.stringify(customBackgrounds)
    );

    // Notify background manager of changes
    window.dispatchEvent(new CustomEvent("backgroundChanged"));
  }, [backgrounds, customBackgrounds]);

  useEffect(() => {
    localStorage.setItem("background-volume", globalVolume.toString());
    localStorage.setItem("background-muted", JSON.stringify(isMuted));

    // Notify background manager of volume changes
    window.dispatchEvent(new CustomEvent("backgroundChanged"));
  }, [globalVolume, isMuted]);

  const applyActiveBackground = () => {
    const activeBackground = [...backgrounds, ...customBackgrounds].find(
      (bg) => bg.isActive
    );
    if (!activeBackground) return;

    const backgroundContainer = document.getElementById("main-background");
    if (!backgroundContainer) return;

    // Clear existing background and cleanup
    if ((backgroundContainer as any).cleanup) {
      (backgroundContainer as any).cleanup();
    }
    backgroundContainer.innerHTML = "";

    if (activeBackground.type === "video" && activeBackground.url) {
      applyVideoBackground(backgroundContainer, activeBackground);
    } else if (activeBackground.type === "image" && activeBackground.url) {
      applyImageBackground(backgroundContainer, activeBackground);
    } else if (activeBackground.type === "interactive") {
      applyInteractiveBackground(backgroundContainer, activeBackground);
    }
  };

  const applyVideoBackground = (
    container: HTMLElement,
    background: Background
  ) => {
    const video = document.createElement("video");
    video.src = background.url!;
    video.autoplay = true;
    video.muted = isMuted || !background.hasAudio;
    video.loop = true;
    video.className = "absolute inset-0 w-full h-full object-cover";
    video.style.opacity = (background.opacity / 100).toString();
    video.style.filter = `blur(${background.blur}px)`;
    video.playbackRate = background.speed;

    if (background.hasAudio && !isMuted) {
      video.volume = (background.volume * globalVolume) / 10000;
    }

    container.appendChild(video);
  };

  const applyImageBackground = (
    container: HTMLElement,
    background: Background
  ) => {
    const img = document.createElement("div");
    img.className = "absolute inset-0 w-full h-full bg-cover bg-center";
    img.style.backgroundImage = `url(${background.url})`;
    img.style.opacity = (background.opacity / 100).toString();
    img.style.filter = `blur(${background.blur}px)`;

    container.appendChild(img);
  };

  const applyInteractiveBackground = (
    container: HTMLElement,
    background: Background
  ) => {
    const createSunriseBeach = (
      container: HTMLElement,
      background: Background
    ) => {
      const scene = document.createElement("div");
      scene.className = "absolute inset-0";
      scene.style.background =
        "linear-gradient(180deg, #FFB6C1 0%, #FFC0CB 30%, #F0E68C 70%, #98FB98 100%)";
      scene.style.opacity = (background.opacity / 100).toString();

      // Sunrise
      const sunrise = document.createElement("div");
      sunrise.className = "absolute rounded-full";
      sunrise.style.width = "120px";
      sunrise.style.height = "120px";
      sunrise.style.right = "15%";
      sunrise.style.top = "20%";
      sunrise.style.background =
        "radial-gradient(circle, #FFD700 0%, #FF8C00 100%)";
      sunrise.style.boxShadow = "0 0 60px #FFD700, 0 0 120px #FF8C00";
      sunrise.style.animation = "sun-glow 4s ease-in-out infinite";
      scene.appendChild(sunrise);

      // Beach
      const beach = document.createElement("div");
      beach.className = "absolute";
      beach.style.width = "100%";
      beach.style.height = "30%";
      beach.style.bottom = "0";
      beach.style.background =
        "linear-gradient(180deg, #F0E68C 0%, #DEB887 100%)";
      scene.appendChild(beach);

      // Waves
      const createWave = () => {
        const wave = document.createElement("div");
        wave.className = "absolute";
        wave.style.width = "100%";
        wave.style.height = "30px";
        wave.style.bottom = `${Math.random() * 80}px`;
        wave.style.background =
          "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)";
        wave.style.borderRadius = "50%";
        wave.style.animation = `wave-motion ${
          3000 + Math.random() * 2000
        }ms ease-in-out infinite`;
        scene.appendChild(wave);
      };

      for (let i = 0; i < 5; i++) {
        setTimeout(() => createWave(), i * 1000);
      }

      container.appendChild(scene);
    };

    const createNightCity = (
      container: HTMLElement,
      background: Background
    ) => {
      const scene = document.createElement("div");
      scene.className = "absolute inset-0";
      scene.style.background =
        "linear-gradient(180deg, #2C3E50 0%, #34495E 50%, #2C3E50 100%)";
      scene.style.opacity = (background.opacity / 100).toString();

      // Neon signs
      const neonColors = [
        "#FF1493",
        "#00FFFF",
        "#FF4500",
        "#ADFF2F",
        "#FF69B4",
      ];
      for (let i = 0; i < 12; i++) {
        const neon = document.createElement("div");
        neon.className = "absolute";
        neon.style.width = `${40 + Math.random() * 80}px`;
        neon.style.height = `${20 + Math.random() * 40}px`;
        neon.style.left = `${Math.random() * 100}%`;
        neon.style.top = `${Math.random() * 80}%`;
        neon.style.background =
          neonColors[Math.floor(Math.random() * neonColors.length)];
        neon.style.boxShadow = `0 0 20px ${
          neonColors[Math.floor(Math.random() * neonColors.length)]
        }`;
        neon.style.animation = `neon-flicker ${
          2 + Math.random() * 3
        }s ease-in-out infinite`;
        scene.appendChild(neon);
      }

      // Rain with neon reflections
      const createRainDrop = () => {
        const drop = document.createElement("div");
        drop.className = "absolute";
        drop.style.width = "2px";
        drop.style.height = `${20 + Math.random() * 15}px`;
        drop.style.left = `${Math.random() * 100}%`;
        drop.style.top = "-30px";
        drop.style.background =
          "linear-gradient(180deg, rgba(173,216,230,0.9) 0%, rgba(173,216,230,0.5) 100%)";
        drop.style.animation = `rain-fall ${
          800 + Math.random() * 400
        }ms linear forwards`;
        scene.appendChild(drop);
        setTimeout(() => drop.remove(), 1200);
      };

      setInterval(createRainDrop, 50);
      container.appendChild(scene);
    };
    switch (background.id) {
      case "thunderstorm":
        createThunderstorm(container, background);
        break;
      case "autumn-park":
        createAutumnPark(container, background);
        break;
      case "snowy-cabin":
        createSnowyCabin(container, background);
        break;
      case "sunrise-beach":
        createSunriseBeach(container, background);
        break;
      case "night-city-view":
        createNightCity(container, background);
        break;
      case "airplane-view":
        createAirplaneView(container, background);
        break;
      case "train-journey":
        createTrainJourney(container, background);
        break;
      case "coffee-shop":
        createCoffeeShop(container, background);
        break;
    }
  };

  const createThunderstorm = (
    container: HTMLElement,
    background: Background
  ) => {
    // Create storm clouds with multiple layers
    const scene = document.createElement("div");
    scene.className = "absolute inset-0";
    scene.style.background =
      "linear-gradient(180deg, #1a1a2e 0%, #16213e 30%, #0f3460 70%, #1a1a2e 100%)";
    scene.style.opacity = (background.opacity / 100).toString();

    // Add multiple cloud layers for depth
    for (let i = 0; i < 5; i++) {
      const cloudLayer = document.createElement("div");
      cloudLayer.className = "absolute inset-0";
      cloudLayer.style.background = `radial-gradient(ellipse ${
        800 + i * 200
      }px ${200 + i * 50}px at ${30 + i * 15}% ${
        20 + i * 10
      }%, rgba(52, 73, 94, ${0.8 - i * 0.1}) 0%, transparent 70%)`;
      cloudLayer.style.animation = `cloud-drift-${i} ${
        15 + i * 3
      }s linear infinite`;
      cloudLayer.style.animationDelay = `${i * 2}s`;
      scene.appendChild(cloudLayer);
    }

    // Enhanced lightning with branching
    const createLightning = () => {
      const lightning = document.createElement("div");
      lightning.className = "absolute";
      lightning.style.width = "6px";
      lightning.style.height = "100vh";
      lightning.style.left = `${Math.random() * 100}%`;
      lightning.style.top = "0";
      lightning.style.background =
        "linear-gradient(180deg, #ffffff 0%, #e6e6ff 30%, #b3b3ff 70%, transparent 100%)";
      lightning.style.boxShadow =
        "0 0 30px #ffffff, 0 0 60px #e6e6ff, 0 0 90px #b3b3ff";
      lightning.style.animation = "lightning-flash 400ms ease-out forwards";
      lightning.style.filter = "blur(1px)";

      // Add branching lightning
      for (let i = 0; i < 3; i++) {
        const branch = document.createElement("div");
        branch.className = "absolute";
        branch.style.width = "3px";
        branch.style.height = `${100 + Math.random() * 300}px`;
        branch.style.left = `${(Math.random() - 0.5) * 100}px`;
        branch.style.top = `${Math.random() * 400}px`;
        branch.style.background =
          "linear-gradient(180deg, #ffffff 0%, #e6e6ff 50%, transparent 100%)";
        branch.style.transform = `rotate(${Math.random() * 60 - 30}deg)`;
        branch.style.transformOrigin = "top";
        branch.style.animation = "lightning-flash 350ms ease-out forwards";
        branch.style.animationDelay = "50ms";
        lightning.appendChild(branch);
      }

      container.appendChild(lightning);

      // Enhanced screen flash with color variation
      const flash = document.createElement("div");
      flash.className = "absolute inset-0";
      flash.style.background =
        "radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(230,230,255,0.2) 50%, transparent 100%)";
      flash.style.animation = "screen-flash 600ms ease-out forwards";
      container.appendChild(flash);

      // Add thunder sound effect simulation
      setTimeout(() => {
        const thunderFlash = document.createElement("div");
        thunderFlash.className = "absolute inset-0";
        thunderFlash.style.background = "rgba(100,100,150,0.1)";
        thunderFlash.style.animation = "thunder-rumble 2s ease-out forwards";
        container.appendChild(thunderFlash);
        setTimeout(() => thunderFlash.remove(), 2000);
      }, 200);

      setTimeout(() => {
        lightning.remove();
        flash.remove();
      }, 600);
    };

    // Rain effect
    const createRain = () => {
      for (let i = 0; i < 150; i++) {
        const drop = document.createElement("div");
        drop.className = "absolute";
        drop.style.width = "2px";
        drop.style.height = `${15 + Math.random() * 10}px`;
        drop.style.left = `${Math.random() * 100}%`;
        drop.style.top = "-30px";
        drop.style.background =
          "linear-gradient(180deg, rgba(173,216,230,0.8) 0%, rgba(173,216,230,0.4) 100%)";
        drop.style.animation = `rain-fall ${
          1000 + Math.random() * 500
        }ms linear forwards`;
        drop.style.animationDelay = `${Math.random() * 2000}ms`;
        scene.appendChild(drop);

        setTimeout(() => drop.remove(), 3000);
      }
    };

    // Schedule lightning and rain
    const scheduleNextLightning = () => {
      const delay = 2000 + Math.random() * 6000;
      setTimeout(() => {
        createLightning();
        scheduleNextLightning();
      }, delay);
    };

    container.appendChild(scene);
    createRain();
    setInterval(createRain, 3000);
    scheduleNextLightning();

    // Store cleanup function
    (container as any).cleanup = () => {
      // Cleanup handled by timeouts and intervals
    };
  };

  const createTropicalBeach = (
    container: HTMLElement,
    background: Background
  ) => {
    const scene = document.createElement("div");
    scene.className = "absolute inset-0";
    scene.style.background =
      "linear-gradient(180deg, #87CEEB 0%, #98D8E8 30%, #F0E68C 70%, #DEB887 100%)";
    scene.style.opacity = (background.opacity / 100).toString();

    // Palm trees
    for (let i = 0; i < 4; i++) {
      const palm = document.createElement("div");
      palm.className = "absolute";
      palm.style.width = "80px";
      palm.style.height = "300px";
      palm.style.left = `${10 + i * 25}%`;
      palm.style.bottom = "0";
      palm.style.background =
        "linear-gradient(180deg, #228B22 0%, #8B4513 80%)";
      palm.style.borderRadius = "40px 40px 0 0";
      palm.style.animation = `palm-sway ${
        3 + Math.random() * 2
      }s ease-in-out infinite`;
      palm.style.transformOrigin = "bottom center";

      // Palm fronds
      for (let j = 0; j < 6; j++) {
        const frond = document.createElement("div");
        frond.className = "absolute";
        frond.style.width = "60px";
        frond.style.height = "40px";
        frond.style.top = "0";
        frond.style.left = "10px";
        frond.style.background = "#228B22";
        frond.style.borderRadius = "50%";
        frond.style.transform = `rotate(${j * 60}deg)`;
        frond.style.transformOrigin = "center bottom";
        frond.style.animation = `frond-sway ${
          2 + Math.random()
        }s ease-in-out infinite`;
        palm.appendChild(frond);
      }

      scene.appendChild(palm);
    }

    // Waves
    const createWave = () => {
      const wave = document.createElement("div");
      wave.className = "absolute";
      wave.style.width = "100%";
      wave.style.height = "30px";
      wave.style.bottom = `${Math.random() * 80}px`;
      wave.style.background =
        "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)";
      wave.style.borderRadius = "50%";
      wave.style.animation = `wave-motion ${
        3000 + Math.random() * 2000
      }ms ease-in-out infinite`;
      scene.appendChild(wave);
    };

    // Tropical birds
    const createBird = () => {
      const bird = document.createElement("div");
      bird.innerHTML = "🐦";
      bird.className = "absolute";
      bird.style.fontSize = "20px";
      bird.style.left = "-50px";
      bird.style.top = `${Math.random() * 30}%`;
      bird.style.animation = `bird-fly ${
        8000 + Math.random() * 4000
      }ms linear forwards`;
      scene.appendChild(bird);
      setTimeout(() => bird.remove(), 12000);
    };

    for (let i = 0; i < 5; i++) {
      setTimeout(() => createWave(), i * 1000);
    }

    setInterval(createBird, 5000);
    container.appendChild(scene);
  };

  const createCherryBlossom = (
    container: HTMLElement,
    background: Background
  ) => {
    const scene = document.createElement("div");
    scene.className = "absolute inset-0";
    scene.style.background =
      "linear-gradient(180deg, #FFB6C1 0%, #FFC0CB 30%, #F0E68C 70%, #98FB98 100%)";
    scene.style.opacity = (background.opacity / 100).toString();

    // Cherry trees
    for (let i = 0; i < 6; i++) {
      const tree = document.createElement("div");
      tree.className = "absolute";
      tree.style.width = `${60 + Math.random() * 40}px`;
      tree.style.height = `${200 + Math.random() * 100}px`;
      tree.style.left = `${Math.random() * 100}%`;
      tree.style.bottom = "0";
      tree.style.background =
        "linear-gradient(180deg, #FFB6C1 0%, #8B4513 70%)";
      tree.style.borderRadius = "50% 50% 0 0";
      tree.style.animation = `tree-sway ${
        4 + Math.random() * 2
      }s ease-in-out infinite`;
      scene.appendChild(tree);
    }

    // Falling petals with realistic physics
    const createPetal = () => {
      const petal = document.createElement("div");
      petal.innerHTML = "🌸";
      petal.className = "absolute";
      petal.style.fontSize = `${12 + Math.random() * 8}px`;
      petal.style.left = `${Math.random() * 100}%`;
      petal.style.top = "-30px";
      petal.style.animation = `petal-fall ${
        4000 + Math.random() * 3000
      }ms ease-out forwards`;

      const drift = (Math.random() - 0.5) * 200;
      const rotation = Math.random() * 720;
      petal.style.setProperty("--drift", `${drift}px`);
      petal.style.setProperty("--rotation", `${rotation}deg`);

      scene.appendChild(petal);
      setTimeout(() => petal.remove(), 7000);
    };

    // Butterflies
    const createButterfly = () => {
      const butterfly = document.createElement("div");
      butterfly.innerHTML = "🦋";
      butterfly.className = "absolute";
      butterfly.style.fontSize = "16px";
      butterfly.style.left = `${Math.random() * 100}%`;
      butterfly.style.top = `${Math.random() * 70}%`;
      butterfly.style.animation = `butterfly-dance ${
        6000 + Math.random() * 4000
      }ms ease-in-out infinite`;
      scene.appendChild(butterfly);
    };

    const petalInterval = setInterval(createPetal, 300);
    for (let i = 0; i < 3; i++) {
      setTimeout(() => createButterfly(), i * 2000);
    }

    container.appendChild(scene);
    (container as any).cleanup = () => clearInterval(petalInterval);
  };

  const createNorthernLights = (
    container: HTMLElement,
    background: Background
  ) => {
    const scene = document.createElement("div");
    scene.className = "absolute inset-0";
    scene.style.background =
      "linear-gradient(180deg, #000428 0%, #004e92 100%)";
    scene.style.opacity = (background.opacity / 100).toString();

    // Stars
    for (let i = 0; i < 200; i++) {
      const star = document.createElement("div");
      star.className = "absolute rounded-full";
      star.style.width = `${1 + Math.random() * 3}px`;
      star.style.height = star.style.width;
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 60}%`;
      star.style.background = "#FFFFFF";
      star.style.animation = `star-twinkle ${
        2 + Math.random() * 4
      }s ease-in-out infinite`;
      star.style.animationDelay = `${Math.random() * 2}s`;
      scene.appendChild(star);
    }

    // Aurora layers
    const createAurora = () => {
      const aurora = document.createElement("div");
      aurora.className = "absolute";
      aurora.style.width = "100%";
      aurora.style.height = "60%";
      aurora.style.top = "0";
      aurora.style.background = `linear-gradient(180deg, 
        rgba(0,255,127,0.3) 0%, 
        rgba(0,191,255,0.4) 30%, 
        rgba(138,43,226,0.3) 60%, 
        transparent 100%)`;
      aurora.style.animation = `aurora-dance ${
        8000 + Math.random() * 4000
      }ms ease-in-out infinite`;
      aurora.style.filter = "blur(2px)";
      scene.appendChild(aurora);

      setTimeout(() => aurora.remove(), 12000);
    };

    // Create multiple aurora layers
    setInterval(createAurora, 3000);
    createAurora();

    container.appendChild(scene);
  };

  const createUnderwaterCoral = (
    container: HTMLElement,
    background: Background
  ) => {
    const scene = document.createElement("div");
    scene.className = "absolute inset-0";
    scene.style.background =
      "linear-gradient(180deg, #006994 0%, #0077be 50%, #004d7a 100%)";
    scene.style.opacity = (background.opacity / 100).toString();

    // Coral formations
    for (let i = 0; i < 8; i++) {
      const coral = document.createElement("div");
      coral.className = "absolute";
      coral.style.width = `${40 + Math.random() * 60}px`;
      coral.style.height = `${80 + Math.random() * 120}px`;
      coral.style.left = `${Math.random() * 100}%`;
      coral.style.bottom = "0";
      coral.style.background = `linear-gradient(180deg, 
        ${
          ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7"][
            Math.floor(Math.random() * 5)
          ]
        } 0%, 
        ${
          ["#DDA0DD", "#20B2AA", "#87CEEB"][Math.floor(Math.random() * 3)]
        } 100%)`;
      coral.style.borderRadius = "50% 50% 0 0";
      coral.style.animation = `coral-sway ${
        3 + Math.random() * 2
      }s ease-in-out infinite`;
      scene.appendChild(coral);
    }

    // Swimming fish
    const createFish = () => {
      const fishTypes = ["🐠", "🐟", "🦈", "🐡"];
      const fish = document.createElement("div");
      fish.innerHTML = fishTypes[Math.floor(Math.random() * fishTypes.length)];
      fish.className = "absolute";
      fish.style.fontSize = `${16 + Math.random() * 12}px`;
      fish.style.left = "-50px";
      fish.style.top = `${Math.random() * 80}%`;
      fish.style.animation = `fish-swim ${
        6000 + Math.random() * 4000
      }ms linear forwards`;
      scene.appendChild(fish);
      setTimeout(() => fish.remove(), 10000);
    };

    // Bubbles
    const createBubble = () => {
      const bubble = document.createElement("div");
      bubble.className = "absolute rounded-full";
      bubble.style.width = `${4 + Math.random() * 8}px`;
      bubble.style.height = bubble.style.width;
      bubble.style.left = `${Math.random() * 100}%`;
      bubble.style.bottom = "0";
      bubble.style.background =
        "radial-gradient(circle, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.2) 100%)";
      bubble.style.animation = `bubble-rise ${
        3000 + Math.random() * 2000
      }ms ease-out forwards`;
      scene.appendChild(bubble);
      setTimeout(() => bubble.remove(), 5000);
    };

    setInterval(createFish, 2000);
    setInterval(createBubble, 500);
    container.appendChild(scene);
  };

  // Continue with other background creation functions...
  const createDesertSunset = (
    container: HTMLElement,
    background: Background
  ) => {
    const scene = document.createElement("div");
    scene.className = "absolute inset-0";
    scene.style.background =
      "linear-gradient(180deg, #FF6B35 0%, #F7931E 30%, #FFD23F 60%, #C4A484 100%)";
    scene.style.opacity = (background.opacity / 100).toString();

    // Sand dunes
    for (let i = 0; i < 5; i++) {
      const dune = document.createElement("div");
      dune.className = "absolute";
      dune.style.width = `${200 + Math.random() * 300}px`;
      dune.style.height = `${100 + Math.random() * 150}px`;
      dune.style.left = `${Math.random() * 100}%`;
      dune.style.bottom = "0";
      dune.style.background = `linear-gradient(135deg, #DEB887 0%, #D2B48C 100%)`;
      dune.style.borderRadius = "50% 50% 0 0";
      dune.style.transform = `skew(${Math.random() * 20 - 10}deg)`;
      scene.appendChild(dune);
    }

    // Sun
    const sun = document.createElement("div");
    sun.className = "absolute rounded-full";
    sun.style.width = "120px";
    sun.style.height = "120px";
    sun.style.right = "15%";
    sun.style.top = "20%";
    sun.style.background = "radial-gradient(circle, #FFD700 0%, #FF8C00 100%)";
    sun.style.boxShadow = "0 0 60px #FFD700, 0 0 120px #FF8C00";
    sun.style.animation = "sun-glow 4s ease-in-out infinite";
    scene.appendChild(sun);

    // Heat shimmer effect
    const createShimmer = () => {
      const shimmer = document.createElement("div");
      shimmer.className = "absolute";
      shimmer.style.width = "100%";
      shimmer.style.height = "30px";
      shimmer.style.bottom = `${Math.random() * 200}px`;
      shimmer.style.background =
        "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)";
      shimmer.style.animation = `heat-shimmer ${
        2000 + Math.random() * 1000
      }ms ease-in-out forwards`;
      scene.appendChild(shimmer);
      setTimeout(() => shimmer.remove(), 3000);
    };

    setInterval(createShimmer, 1000);
    container.appendChild(scene);
  };

  const createBambooForest = (
    container: HTMLElement,
    background: Background
  ) => {
    const scene = document.createElement("div");
    scene.className = "absolute inset-0";
    scene.style.background =
      "linear-gradient(180deg, #90EE90 0%, #228B22 50%, #006400 100%)";
    scene.style.opacity = (background.opacity / 100).toString();

    // Bamboo stalks
    for (let i = 0; i < 15; i++) {
      const bamboo = document.createElement("div");
      bamboo.className = "absolute";
      bamboo.style.width = `${20 + Math.random() * 15}px`;
      bamboo.style.height = "100%";
      bamboo.style.left = `${Math.random() * 100}%`;
      bamboo.style.background =
        "linear-gradient(90deg, #228B22 0%, #32CD32 50%, #228B22 100%)";
      bamboo.style.borderRadius = "10px";
      bamboo.style.animation = `bamboo-sway ${
        4 + Math.random() * 2
      }s ease-in-out infinite`;

      // Bamboo segments
      for (let j = 0; j < 8; j++) {
        const segment = document.createElement("div");
        segment.className = "absolute";
        segment.style.width = "100%";
        segment.style.height = "2px";
        segment.style.top = `${j * 12.5}%`;
        segment.style.background = "#006400";
        bamboo.appendChild(segment);
      }

      scene.appendChild(bamboo);
    }

    // Filtered sunlight
    const createSunbeam = () => {
      const beam = document.createElement("div");
      beam.className = "absolute";
      beam.style.width = "4px";
      beam.style.height = "100%";
      beam.style.left = `${Math.random() * 100}%`;
      beam.style.background =
        "linear-gradient(180deg, rgba(255,255,0,0.3) 0%, transparent 100%)";
      beam.style.animation = `sunbeam-filter ${
        6000 + Math.random() * 4000
      }ms ease-in-out infinite`;
      scene.appendChild(beam);
    };

    for (let i = 0; i < 8; i++) {
      setTimeout(() => createSunbeam(), i * 1000);
    }

    container.appendChild(scene);
  };

  const createAlpineLake = (container: HTMLElement, background: Background) => {
    const scene = document.createElement("div");
    scene.className = "absolute inset-0";
    scene.style.background =
      "linear-gradient(180deg, #87CEEB 0%, #4682B4 30%, #1E90FF 70%, #0000CD 100%)";
    scene.style.opacity = (background.opacity / 100).toString();

    // Mountains
    for (let i = 0; i < 6; i++) {
      const mountain = document.createElement("div");
      mountain.className = "absolute";
      mountain.style.width = `${150 + Math.random() * 200}px`;
      mountain.style.height = `${200 + Math.random() * 150}px`;
      mountain.style.left = `${Math.random() * 100}%`;
      mountain.style.bottom = "30%";
      mountain.style.background =
        "linear-gradient(135deg, #696969 0%, #2F4F4F 100%)";
      mountain.style.clipPath = "polygon(50% 0%, 0% 100%, 100% 100%)";
      scene.appendChild(mountain);

      // Snow caps
      const snowCap = document.createElement("div");
      snowCap.className = "absolute";
      snowCap.style.width = "60%";
      snowCap.style.height = "40%";
      snowCap.style.top = "0";
      snowCap.style.left = "20%";
      snowCap.style.background = "#FFFFFF";
      snowCap.style.clipPath = "polygon(50% 0%, 20% 60%, 80% 60%)";
      mountain.appendChild(snowCap);
    }

    // Lake surface with ripples
    const createRipple = () => {
      const ripple = document.createElement("div");
      ripple.className = "absolute rounded-full";
      ripple.style.width = "20px";
      ripple.style.height = "20px";
      ripple.style.left = `${Math.random() * 100}%`;
      ripple.style.bottom = `${20 + Math.random() * 30}%`;
      ripple.style.border = "2px solid rgba(255,255,255,0.5)";
      ripple.style.animation = "ripple-expand 3s ease-out forwards";
      scene.appendChild(ripple);
      setTimeout(() => ripple.remove(), 3000);
    };

    setInterval(createRipple, 2000);
    container.appendChild(scene);
  };

  // Additional interactive backgrounds...
  const createTokyoRain = (container: HTMLElement, background: Background) => {
    const scene = document.createElement("div");
    scene.className = "absolute inset-0";
    scene.style.background =
      "linear-gradient(180deg, #2C3E50 0%, #34495E 50%, #2C3E50 100%)";
    scene.style.opacity = (background.opacity / 100).toString();

    // Neon signs
    const neonColors = ["#FF1493", "#00FFFF", "#FF4500", "#ADFF2F", "#FF69B4"];
    for (let i = 0; i < 12; i++) {
      const neon = document.createElement("div");
      neon.className = "absolute";
      neon.style.width = `${40 + Math.random() * 80}px`;
      neon.style.height = `${20 + Math.random() * 40}px`;
      neon.style.left = `${Math.random() * 100}%`;
      neon.style.top = `${Math.random() * 80}%`;
      neon.style.background =
        neonColors[Math.floor(Math.random() * neonColors.length)];
      neon.style.boxShadow = `0 0 20px ${
        neonColors[Math.floor(Math.random() * neonColors.length)]
      }`;
      neon.style.animation = `neon-flicker ${
        2 + Math.random() * 3
      }s ease-in-out infinite`;
      scene.appendChild(neon);
    }

    // Rain with neon reflections
    const createRainDrop = () => {
      const drop = document.createElement("div");
      drop.className = "absolute";
      drop.style.width = "2px";
      drop.style.height = `${20 + Math.random() * 15}px`;
      drop.style.left = `${Math.random() * 100}%`;
      drop.style.top = "-30px";
      drop.style.background =
        "linear-gradient(180deg, rgba(173,216,230,0.9) 0%, rgba(173,216,230,0.5) 100%)";
      drop.style.animation = `rain-fall ${
        800 + Math.random() * 400
      }ms linear forwards`;
      scene.appendChild(drop);
      setTimeout(() => drop.remove(), 1200);
    };

    setInterval(createRainDrop, 50);
    container.appendChild(scene);
  };

  const createRooftopGarden = (
    container: HTMLElement,
    background: Background
  ) => {
    const scene = document.createElement("div");
    scene.className = "absolute inset-0";
    scene.style.background =
      "linear-gradient(180deg, #87CEEB 0%, #98FB98 30%, #90EE90 70%, #228B22 100%)";
    scene.style.opacity = (background.opacity / 100).toString();

    // City skyline in background
    for (let i = 0; i < 8; i++) {
      const building = document.createElement("div");
      building.className = "absolute";
      building.style.width = `${30 + Math.random() * 50}px`;
      building.style.height = `${80 + Math.random() * 120}px`;
      building.style.left = `${i * 12}%`;
      building.style.bottom = "40%";
      building.style.background = "#696969";
      building.style.opacity = "0.6";
      scene.appendChild(building);
    }

    // Garden plants
    const plantEmojis = ["🌱", "🌿", "🌺", "🌻", "🌷", "🌹"];
    for (let i = 0; i < 20; i++) {
      const plant = document.createElement("div");
      plant.innerHTML =
        plantEmojis[Math.floor(Math.random() * plantEmojis.length)];
      plant.className = "absolute";
      plant.style.fontSize = `${16 + Math.random() * 12}px`;
      plant.style.left = `${Math.random() * 100}%`;
      plant.style.bottom = `${Math.random() * 40}%`;
      plant.style.animation = `plant-sway ${
        3 + Math.random() * 2
      }s ease-in-out infinite`;
      scene.appendChild(plant);
    }

    container.appendChild(scene);
  };

  const createSafariSunset = (
    container: HTMLElement,
    background: Background
  ) => {
    const scene = document.createElement("div");
    scene.className = "absolute inset-0";
    scene.style.background =
      "linear-gradient(180deg, #FF6B35 0%, #F7931E 30%, #FFD23F 60%, #8B4513 100%)";
    scene.style.opacity = (background.opacity / 100).toString();

    // Acacia trees
    for (let i = 0; i < 4; i++) {
      const tree = document.createElement("div");
      tree.className = "absolute";
      tree.style.width = "100px";
      tree.style.height = "150px";
      tree.style.left = `${20 + i * 20}%`;
      tree.style.bottom = "20%";
      tree.style.background =
        "linear-gradient(180deg, #228B22 0%, #8B4513 80%)";
      tree.style.borderRadius = "50% 50% 0 0";
      tree.style.clipPath = "ellipse(80% 60% at 50% 40%)";
      scene.appendChild(tree);
    }

    // Animal silhouettes
    const animals = ["🦁", "🐘", "🦒", "🦓", "🦏"];
    for (let i = 0; i < 3; i++) {
      const animal = document.createElement("div");
      animal.innerHTML = animals[Math.floor(Math.random() * animals.length)];
      animal.className = "absolute";
      animal.style.fontSize = "24px";
      animal.style.left = `${Math.random() * 80}%`;
      animal.style.bottom = "15%";
      animal.style.filter = "brightness(0)";
      animal.style.animation = `animal-move ${
        8000 + Math.random() * 4000
      }ms ease-in-out infinite`;
      scene.appendChild(animal);
    }

    // Grass swaying
    for (let i = 0; i < 50; i++) {
      const grass = document.createElement("div");
      grass.className = "absolute";
      grass.style.width = "2px";
      grass.style.height = `${10 + Math.random() * 20}px`;
      grass.style.left = `${Math.random() * 100}%`;
      grass.style.bottom = "0";
      grass.style.background = "#228B22";
      grass.style.animation = `grass-sway ${
        2 + Math.random() * 2
      }s ease-in-out infinite`;
      scene.appendChild(grass);
    }

    container.appendChild(scene);
  };

  const createMediterraneanCoast = (
    container: HTMLElement,
    background: Background
  ) => {
    const scene = document.createElement("div");
    scene.className = "absolute inset-0";
    scene.style.background =
      "linear-gradient(180deg, #87CEEB 0%, #4682B4 30%, #1E90FF 70%, #0066CC 100%)";
    scene.style.opacity = (background.opacity / 100).toString();

    // Coastal cliffs
    for (let i = 0; i < 3; i++) {
      const cliff = document.createElement("div");
      cliff.className = "absolute";
      cliff.style.width = `${120 + Math.random() * 80}px`;
      cliff.style.height = `${150 + Math.random() * 100}px`;
      cliff.style.left = `${i * 30}%`;
      cliff.style.bottom = "30%";
      cliff.style.background =
        "linear-gradient(135deg, #D2B48C 0%, #A0522D 100%)";
      cliff.style.clipPath = "polygon(0% 100%, 20% 0%, 80% 10%, 100% 100%)";
      scene.appendChild(cliff);
    }

    // Mediterranean vegetation
    const vegetation = ["🌿", "🫒", "🌾"];
    for (let i = 0; i < 15; i++) {
      const plant = document.createElement("div");
      plant.innerHTML =
        vegetation[Math.floor(Math.random() * vegetation.length)];
      plant.className = "absolute";
      plant.style.fontSize = `${12 + Math.random() * 8}px`;
      plant.style.left = `${Math.random() * 100}%`;
      plant.style.bottom = `${30 + Math.random() * 40}%`;
      plant.style.animation = `mediterranean-breeze ${
        3 + Math.random() * 2
      }s ease-in-out infinite`;
      scene.appendChild(plant);
    }

    // Gentle waves
    const createWave = () => {
      const wave = document.createElement("div");
      wave.className = "absolute";
      wave.style.width = "100%";
      wave.style.height = "25px";
      wave.style.bottom = `${Math.random() * 60}px`;
      wave.style.background =
        "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)";
      wave.style.borderRadius = "50%";
      wave.style.animation = `gentle-wave ${
        4000 + Math.random() * 2000
      }ms ease-in-out infinite`;
      scene.appendChild(wave);
    };

    for (let i = 0; i < 4; i++) {
      setTimeout(() => createWave(), i * 1500);
    }

    container.appendChild(scene);
  };

  const createLibraryStudy = (
    container: HTMLElement,
    background: Background
  ) => {
    const scene = document.createElement("div");
    scene.className = "absolute inset-0";
    scene.style.background =
      "linear-gradient(180deg, #8B4513 0%, #A0522D 30%, #D2B48C 70%, #F5DEB3 100%)";
    scene.style.opacity = (background.opacity / 100).toString();

    // Bookshelves
    for (let i = 0; i < 6; i++) {
      const shelf = document.createElement("div");
      shelf.className = "absolute";
      shelf.style.width = `${80 + Math.random() * 40}px`;
      shelf.style.height = "200px";
      shelf.style.left = `${i * 15}%`;
      shelf.style.bottom = "20%";
      shelf.style.background = "#8B4513";
      shelf.style.borderRadius = "4px";

      // Books
      for (let j = 0; j < 8; j++) {
        const book = document.createElement("div");
        book.className = "absolute";
        book.style.width = `${8 + Math.random() * 6}px`;
        book.style.height = `${20 + Math.random() * 15}px`;
        book.style.left = `${j * 10}px`;
        book.style.bottom = `${Math.floor(j / 4) * 40 + 20}px`;
        book.style.background = [
          "#FF6B6B",
          "#4ECDC4",
          "#45B7D1",
          "#96CEB4",
          "#FFEAA7",
        ][Math.floor(Math.random() * 5)];
        book.style.borderRadius = "2px";
        shelf.appendChild(book);
      }

      scene.appendChild(shelf);
    }

    // Floating dust particles
    const createDustParticle = () => {
      const dust = document.createElement("div");
      dust.className = "absolute rounded-full";
      dust.style.width = "2px";
      dust.style.height = "2px";
      dust.style.left = `${Math.random() * 100}%`;
      dust.style.top = `${Math.random() * 100}%`;
      dust.style.background = "rgba(255,255,255,0.6)";
      dust.style.animation = `dust-float ${
        8000 + Math.random() * 4000
      }ms ease-in-out infinite`;
      scene.appendChild(dust);
    };

    for (let i = 0; i < 20; i++) {
      setTimeout(() => createDustParticle(), i * 500);
    }

    container.appendChild(scene);
  };

  const createSpringMeadow = (
    container: HTMLElement,
    background: Background
  ) => {
    const scene = document.createElement("div");
    scene.className = "absolute inset-0";
    scene.style.background =
      "linear-gradient(180deg, #87CEEB 0%, #98FB98 30%, #90EE90 70%, #228B22 100%)";
    scene.style.opacity = (background.opacity / 100).toString();

    // Wildflowers
    const flowers = ["🌼", "🌻", "🌺", "🌷", "🌹", "💐"];
    for (let i = 0; i < 30; i++) {
      const flower = document.createElement("div");
      flower.innerHTML = flowers[Math.floor(Math.random() * flowers.length)];
      flower.className = "absolute";
      flower.style.fontSize = `${14 + Math.random() * 10}px`;
      flower.style.left = `${Math.random() * 100}%`;
      flower.style.bottom = `${Math.random() * 60}%`;
      flower.style.animation = `flower-sway ${
        3 + Math.random() * 2
      }s ease-in-out infinite`;
      scene.appendChild(flower);
    }

    // Butterflies
    const createButterfly = () => {
      const butterfly = document.createElement("div");
      butterfly.innerHTML = "🦋";
      butterfly.className = "absolute";
      butterfly.style.fontSize = "18px";
      butterfly.style.left = `${Math.random() * 100}%`;
      butterfly.style.top = `${Math.random() * 70}%`;
      butterfly.style.animation = `butterfly-flight ${
        6000 + Math.random() * 4000
      }ms ease-in-out infinite`;
      scene.appendChild(butterfly);
    };

    // Bees
    const createBee = () => {
      const bee = document.createElement("div");
      bee.innerHTML = "🐝";
      bee.className = "absolute";
      bee.style.fontSize = "14px";
      bee.style.left = `${Math.random() * 100}%`;
      bee.style.top = `${Math.random() * 80}%`;
      bee.style.animation = `bee-buzz ${
        4000 + Math.random() * 3000
      }ms linear infinite`;
      scene.appendChild(bee);
    };

    for (let i = 0; i < 4; i++) {
      setTimeout(() => createButterfly(), i * 2000);
      setTimeout(() => createBee(), i * 3000);
    }

    container.appendChild(scene);
  };

  const createStarryNight = (
    container: HTMLElement,
    background: Background
  ) => {
    const scene = document.createElement("div");
    scene.className = "absolute inset-0";
    scene.style.background =
      "linear-gradient(180deg, #000428 0%, #004e92 100%)";
    scene.style.opacity = (background.opacity / 100).toString();

    // Stars with different sizes and brightness
    for (let i = 0; i < 300; i++) {
      const star = document.createElement("div");
      star.className = "absolute";
      const size = Math.random() * 4 + 1;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.background = "#FFFFFF";
      star.style.borderRadius = "50%";
      star.style.animation = `star-twinkle ${
        2 + Math.random() * 4
      }s ease-in-out infinite`;
      star.style.animationDelay = `${Math.random() * 2}s`;
      star.style.boxShadow = `0 0 ${size * 2}px rgba(255,255,255,0.8)`;
      scene.appendChild(star);
    }

    // Milky Way
    const milkyWay = document.createElement("div");
    milkyWay.className = "absolute";
    milkyWay.style.width = "100%";
    milkyWay.style.height = "40%";
    milkyWay.style.top = "30%";
    milkyWay.style.background =
      "linear-gradient(45deg, transparent 0%, rgba(255,255,255,0.1) 30%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 70%, transparent 100%)";
    milkyWay.style.transform = "rotate(-15deg)";
    scene.appendChild(milkyWay);

    // Shooting stars
    const createShootingStar = () => {
      const star = document.createElement("div");
      star.className = "absolute";
      star.style.width = "2px";
      star.style.height = "2px";
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 50}%`;
      star.style.background = "#FFFFFF";
      star.style.boxShadow = "0 0 6px #FFFFFF";
      star.style.animation = "shooting-star 2s linear forwards";
      scene.appendChild(star);
      setTimeout(() => star.remove(), 2000);
    };

    setInterval(createShootingStar, 8000);
    container.appendChild(scene);
  };

  const createSpaceStation = (
    container: HTMLElement,
    background: Background
  ) => {
    const scene = document.createElement("div");
    scene.className = "absolute inset-0";
    scene.style.background =
      "radial-gradient(circle, #000428 0%, #004e92 100%)";
    scene.style.opacity = (background.opacity / 100).toString();

    // Earth
    const earth = document.createElement("div");
    earth.className = "absolute rounded-full";
    earth.style.width = "300px";
    earth.style.height = "300px";
    earth.style.right = "-100px";
    earth.style.bottom = "-100px";
    earth.style.background =
      "radial-gradient(circle at 30% 30%, #4A90E2 0%, #2E5BBA 50%, #1E3A8A 100%)";
    earth.style.boxShadow = "inset -20px -20px 50px rgba(0,0,0,0.5)";
    earth.style.animation = "earth-rotation 60s linear infinite";

    // Continents
    const continent1 = document.createElement("div");
    continent1.className = "absolute";
    continent1.style.width = "80px";
    continent1.style.height = "60px";
    continent1.style.top = "40%";
    continent1.style.left = "30%";
    continent1.style.background = "#228B22";
    continent1.style.borderRadius = "50%";
    continent1.style.opacity = "0.8";
    earth.appendChild(continent1);

    const continent2 = document.createElement("div");
    continent2.className = "absolute";
    continent2.style.width = "60px";
    continent2.style.height = "40px";
    continent2.style.top = "60%";
    continent2.style.left = "50%";
    continent2.style.background = "#8B4513";
    continent2.style.borderRadius = "40%";
    continent2.style.opacity = "0.7";
    earth.appendChild(continent2);

    scene.appendChild(earth);

    // Satellites
    const createSatellite = () => {
      const satellite = document.createElement("div");
      satellite.className = "absolute";
      satellite.style.width = "4px";
      satellite.style.height = "4px";
      satellite.style.left = `${Math.random() * 100}%`;
      satellite.style.top = `${Math.random() * 100}%`;
      satellite.style.background = "#FFFFFF";
      satellite.style.boxShadow = "0 0 4px #FFFFFF";
      satellite.style.animation = `satellite-orbit ${
        20000 + Math.random() * 10000
      }ms linear infinite`;
      scene.appendChild(satellite);
    };

    for (let i = 0; i < 5; i++) {
      setTimeout(() => createSatellite(), i * 2000);
    }

    // Aurora from space
    const aurora = document.createElement("div");
    aurora.className = "absolute";
    aurora.style.width = "200px";
    aurora.style.height = "100px";
    aurora.style.right = "0";
    aurora.style.bottom = "20%";
    aurora.style.background =
      "linear-gradient(90deg, transparent 0%, rgba(0,255,127,0.6) 50%, transparent 100%)";
    aurora.style.borderRadius = "50%";
    aurora.style.animation = "space-aurora 8s ease-in-out infinite";
    scene.appendChild(aurora);

    container.appendChild(scene);
  };

  // Continue with the rest of the background functions...
  const createAutumnPark = (container: HTMLElement, background: Background) => {
    // Create autumn scene
    const scene = document.createElement("div");
    scene.className = "absolute inset-0";
    scene.style.background =
      "linear-gradient(180deg, #f4a460 0%, #daa520 30%, #8b4513 100%)";
    scene.style.opacity = (background.opacity / 100).toString();

    // Add trees
    for (let i = 0; i < 8; i++) {
      const tree = document.createElement("div");
      tree.className = "absolute";
      tree.style.width = `${60 + Math.random() * 40}px`;
      tree.style.height = `${200 + Math.random() * 100}px`;
      tree.style.left = `${Math.random() * 100}%`;
      tree.style.bottom = "0";
      tree.style.background = `linear-gradient(180deg, 
        ${
          ["#ff6b35", "#f7931e", "#ffb347", "#daa520"][
            Math.floor(Math.random() * 4)
          ]
        } 0%, 
        #8b4513 80%)`;
      tree.style.borderRadius = "50% 50% 0 0";
      tree.style.animation = `tree-sway ${
        3 + Math.random() * 2
      }s ease-in-out infinite`;
      scene.appendChild(tree);
    }

    // Falling leaves
    const createLeaf = () => {
      const leaf = document.createElement("div");
      leaf.innerHTML = ["🍂", "🍁", "🍃"][Math.floor(Math.random() * 3)];
      leaf.className = "absolute";
      leaf.style.fontSize = `${12 + Math.random() * 8}px`;
      leaf.style.left = `${Math.random() * 100}%`;
      leaf.style.top = "-30px";
      leaf.style.animation = `leaf-fall ${
        4000 + Math.random() * 3000
      }ms linear forwards`;

      container.appendChild(leaf);
      setTimeout(() => leaf.remove(), 7000);
    };

    // Create leaves periodically
    const leafInterval = setInterval(createLeaf, 500);

    container.appendChild(scene);

    // Store cleanup function
    (container as any).cleanup = () => clearInterval(leafInterval);
  };

  const createSnowyCabin = (container: HTMLElement, background: Background) => {
    // Create snowy landscape
    const scene = document.createElement("div");
    scene.className = "absolute inset-0";
    scene.style.background = "linear-gradient(180deg, #87ceeb 0%, #ffffff 70%)";
    scene.style.opacity = (background.opacity / 100).toString();

    // Add cabin
    const cabin = document.createElement("div");
    cabin.className = "absolute";
    cabin.style.width = "200px";
    cabin.style.height = "120px";
    cabin.style.left = "50%";
    cabin.style.bottom = "30%";
    cabin.style.transform = "translateX(-50%)";
    cabin.style.background = "#8b4513";
    cabin.style.borderRadius = "8px";

    // Cabin roof
    const roof = document.createElement("div");
    roof.className = "absolute";
    roof.style.width = "220px";
    roof.style.height = "60px";
    roof.style.left = "-10px";
    roof.style.top = "-40px";
    roof.style.background = "#654321";
    roof.style.clipPath = "polygon(0% 100%, 50% 0%, 100% 100%)";
    cabin.appendChild(roof);

    // Window with warm glow
    const window = document.createElement("div");
    window.className = "absolute";
    window.style.width = "40px";
    window.style.height = "40px";
    window.style.left = "30px";
    window.style.top = "30px";
    window.style.background = "#ffeb3b";
    window.style.borderRadius = "4px";
    window.style.boxShadow = "0 0 20px #ffeb3b";
    window.style.animation = "warm-glow 3s ease-in-out infinite";
    cabin.appendChild(window);

    // Chimney smoke
    const chimney = document.createElement("div");
    chimney.className = "absolute";
    chimney.style.width = "20px";
    chimney.style.height = "40px";
    chimney.style.right = "40px";
    chimney.style.top = "-60px";
    chimney.style.background = "#654321";
    cabin.appendChild(chimney);

    // Smoke particles
    const createSmoke = () => {
      const smoke = document.createElement("div");
      smoke.className = "absolute rounded-full";
      smoke.style.width = `${4 + Math.random() * 6}px`;
      smoke.style.height = smoke.style.width;
      smoke.style.right = "45px";
      smoke.style.top = "-70px";
      smoke.style.background = "rgba(200, 200, 200, 0.6)";
      smoke.style.animation = `smoke-rise ${
        2000 + Math.random() * 1000
      }ms ease-out forwards`;

      container.appendChild(smoke);
      setTimeout(() => smoke.remove(), 3000);
    };

    // Snow falling
    const createSnowflake = () => {
      const flake = document.createElement("div");
      flake.innerHTML = "❄";
      flake.className = "absolute text-white";
      flake.style.fontSize = `${8 + Math.random() * 8}px`;
      flake.style.left = `${Math.random() * 100}%`;
      flake.style.top = "-30px";
      flake.style.animation = `snowfall ${
        3000 + Math.random() * 2000
      }ms linear forwards`;

      container.appendChild(flake);
      setTimeout(() => flake.remove(), 5000);
    };

    const smokeInterval = setInterval(createSmoke, 800);
    const snowInterval = setInterval(createSnowflake, 200);

    scene.appendChild(cabin);
    container.appendChild(scene);

    // Store cleanup function
    (container as any).cleanup = () => {
      clearInterval(smokeInterval);
      clearInterval(snowInterval);
    };
  };

  const createAirplaneView = (
    container: HTMLElement,
    background: Background
  ) => {
    // Create sky scene
    const scene = document.createElement("div");
    scene.className = "absolute inset-0";
    scene.style.background =
      "linear-gradient(180deg, #87ceeb 0%, #b0e0e6 100%)";
    scene.style.opacity = (background.opacity / 100).toString();

    // Add airplane window frame
    const windowFrame = document.createElement("div");
    windowFrame.className = "absolute";
    windowFrame.style.width = "300px";
    windowFrame.style.height = "200px";
    windowFrame.style.right = "50px";
    windowFrame.style.top = "50%";
    windowFrame.style.transform = "translateY(-50%)";
    windowFrame.style.border = "20px solid #2c3e50";
    windowFrame.style.borderRadius = "20px";
    windowFrame.style.overflow = "hidden";

    // Moving clouds
    const createCloud = () => {
      const cloud = document.createElement("div");
      cloud.className = "absolute";
      cloud.style.width = `${60 + Math.random() * 80}px`;
      cloud.style.height = `${30 + Math.random() * 40}px`;
      cloud.style.left = "100%";
      cloud.style.top = `${Math.random() * 80}%`;
      cloud.style.background = "rgba(255, 255, 255, 0.8)";
      cloud.style.borderRadius = "50px";
      cloud.style.animation = `cloud-pass ${
        3000 + Math.random() * 2000
      }ms linear forwards`;

      windowFrame.appendChild(cloud);
      setTimeout(() => cloud.remove(), 5000);
    };

    const cloudInterval = setInterval(createCloud, 1000);

    scene.appendChild(windowFrame);
    container.appendChild(scene);

    // Store cleanup function
    (container as any).cleanup = () => clearInterval(cloudInterval);
  };

  const createTrainJourney = (
    container: HTMLElement,
    background: Background
  ) => {
    // Create countryside scene
    const scene = document.createElement("div");
    scene.className = "absolute inset-0";
    scene.style.background =
      "linear-gradient(180deg, #87ceeb 0%, #90ee90 50%, #228b22 100%)";
    scene.style.opacity = (background.opacity / 100).toString();

    // Add train window frame
    const windowFrame = document.createElement("div");
    windowFrame.className = "absolute";
    windowFrame.style.width = "400px";
    windowFrame.style.height = "250px";
    windowFrame.style.left = "50%";
    windowFrame.style.top = "50%";
    windowFrame.style.transform = "translate(-50%, -50%)";
    windowFrame.style.border = "15px solid #8b4513";
    windowFrame.style.borderRadius = "10px";
    windowFrame.style.overflow = "hidden";

    // Moving landscape elements
    const createLandscapeElement = () => {
      const elements = ["🌳", "🏠", "🐄", "🌾"];
      const element = document.createElement("div");
      element.innerHTML = elements[Math.floor(Math.random() * elements.length)];
      element.className = "absolute";
      element.style.fontSize = `${20 + Math.random() * 20}px`;
      element.style.left = "100%";
      element.style.bottom = `${Math.random() * 50}px`;
      element.style.animation = `landscape-pass ${
        2000 + Math.random() * 1000
      }ms linear forwards`;

      windowFrame.appendChild(element);
      setTimeout(() => element.remove(), 3000);
    };

    // Telegraph poles
    const createTelegraphPole = () => {
      const pole = document.createElement("div");
      pole.className = "absolute";
      pole.style.width = "4px";
      pole.style.height = "60px";
      pole.style.left = "100%";
      pole.style.bottom = "20px";
      pole.style.background = "#8b4513";
      pole.style.animation = "landscape-pass 1500ms linear forwards";

      windowFrame.appendChild(pole);
      setTimeout(() => pole.remove(), 1500);
    };

    const landscapeInterval = setInterval(createLandscapeElement, 800);
    const poleInterval = setInterval(createTelegraphPole, 400);

    scene.appendChild(windowFrame);
    container.appendChild(scene);

    // Store cleanup function
    (container as any).cleanup = () => {
      clearInterval(landscapeInterval);
      clearInterval(poleInterval);
    };
  };

  const createCoffeeShop = (container: HTMLElement, background: Background) => {
    // Create coffee shop interior
    const scene = document.createElement("div");
    scene.className = "absolute inset-0";
    scene.style.background =
      "linear-gradient(180deg, #d2b48c 0%, #deb887 50%, #cd853f 100%)";
    scene.style.opacity = (background.opacity / 100).toString();

    // Add coffee machine
    const coffeeMachine = document.createElement("div");
    coffeeMachine.className = "absolute";
    coffeeMachine.style.width = "80px";
    coffeeMachine.style.height = "100px";
    coffeeMachine.style.left = "20%";
    coffeeMachine.style.bottom = "30%";
    coffeeMachine.style.background = "#2c3e50";
    coffeeMachine.style.borderRadius = "8px";

    // Steam from coffee machine
    const createSteam = () => {
      const steam = document.createElement("div");
      steam.className = "absolute rounded-full";
      steam.style.width = `${3 + Math.random() * 4}px`;
      steam.style.height = steam.style.width;
      steam.style.left = `${25 + Math.random() * 30}%`;
      steam.style.bottom = "40%";
      steam.style.background = "rgba(255, 255, 255, 0.6)";
      steam.style.animation = `steam-rise ${
        1500 + Math.random() * 500
      }ms ease-out forwards`;

      scene.appendChild(steam);
      setTimeout(() => steam.remove(), 2000);
    };

    // Moving people silhouettes
    const createPerson = () => {
      const person = document.createElement("div");
      person.innerHTML = "🚶";
      person.className = "absolute";
      person.style.fontSize = "30px";
      person.style.left = "-50px";
      person.style.bottom = "20%";
      person.style.animation = `person-walk ${
        4000 + Math.random() * 2000
      }ms linear forwards`;

      scene.appendChild(person);
      setTimeout(() => person.remove(), 6000);
    };

    const steamInterval = setInterval(createSteam, 600);
    const personInterval = setInterval(createPerson, 3000);

    scene.appendChild(coffeeMachine);
    container.appendChild(scene);

    // Store cleanup function
    (container as any).cleanup = () => {
      clearInterval(steamInterval);
      clearInterval(personInterval);
    };
  };

  const setActiveBackground = (backgroundId: string) => {
    const allBackgrounds = [...backgrounds, ...customBackgrounds];

    setBackgrounds((prev) =>
      prev.map((bg) => ({
        ...bg,
        isActive: bg.id === backgroundId,
      }))
    );

    setCustomBackgrounds((prev) =>
      prev.map((bg) => ({
        ...bg,
        isActive: bg.id === backgroundId,
      }))
    );

    const selectedBg = allBackgrounds.find((bg) => bg.id === backgroundId);
    if (selectedBg) {
      onNotification({
        type: "success",
        title: "Background Changed",
        message: `${selectedBg.name} is now active`,
      });
    }
  };

  const updateBackgroundProperty = (
    backgroundId: string,
    property: keyof Background,
    value: any
  ) => {
    setBackgrounds((prev) =>
      prev.map((bg) =>
        bg.id === backgroundId ? { ...bg, [property]: value } : bg
      )
    );

    setCustomBackgrounds((prev) =>
      prev.map((bg) =>
        bg.id === backgroundId ? { ...bg, [property]: value } : bg
      )
    );
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      // Create object URL for preview
      const url = URL.createObjectURL(file);
      const isVideo = file.type.startsWith("video/");

      const newBackground: Background = {
        id: `custom-${Date.now()}`,
        name: file.name.split(".")[0],
        type: isVideo ? "video" : "image",
        category: "abstract",
        url,
        description: `Custom ${isVideo ? "video" : "image"} background`,
        isActive: false,
        hasAudio: isVideo,
        volume: 50,
        speed: 1,
        opacity: 100,
        blur: 0,
        interactive: false,
        effects: [],
        iconName: isVideo ? "Play" : "Eye",
      };

      setCustomBackgrounds((prev) => [...prev, newBackground]);

      onNotification({
        type: "success",
        title: "Background Uploaded",
        message: `${newBackground.name} has been added to your collection`,
      });
    } catch (error) {
      onNotification({
        type: "error",
        title: "Upload Failed",
        message: "Failed to upload background. Please try again.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const deleteCustomBackground = (backgroundId: string) => {
    const background = customBackgrounds.find((bg) => bg.id === backgroundId);
    if (background?.url) {
      URL.revokeObjectURL(background.url);
    }

    setCustomBackgrounds((prev) => prev.filter((bg) => bg.id !== backgroundId));

    onNotification({
      type: "info",
      title: "Background Deleted",
      message: "Custom background has been removed",
    });
  };

  const allBackgrounds = [...backgrounds, ...customBackgrounds];
  const activeBackground = allBackgrounds.find((bg) => bg.isActive);

  return (
    <div className="h-full overflow-y-auto custom-scrollbar">
      <div className="max-w-7xl mx-auto space-y-6 p-4">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            Immersive Backgrounds
          </h1>
          <p className="text-white/70">
            Transform your workspace with stunning, interactive backgrounds from
            around the world
          </p>
        </motion.div>

        {/* Upload Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <GlassPanel className="p-6" glow>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-white font-semibold text-lg">
                  Custom Backgrounds
                </h3>
                <p className="text-white/70">
                  Upload your own videos or images
                </p>
              </div>

              <label className="relative">
                <input
                  type="file"
                  accept="video/*,image/*"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={isUploading}
                />
                <div
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    isUploading
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600 cursor-pointer"
                  } text-white`}
                >
                  <Upload size={20} />
                  {isUploading ? "Uploading..." : "Upload Background"}
                </div>
              </label>
            </div>

            {customBackgrounds.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {customBackgrounds.map((background) => {
                  const Icon = iconMap[background.iconName] || Star;
                  return (
                    <div key={background.id} className="relative group">
                      <div
                        className={`aspect-video rounded-lg border-2 transition-all cursor-pointer ${
                          background.isActive
                            ? "border-green-500 bg-green-500/20"
                            : "border-white/20 bg-white/5 hover:bg-white/10"
                        }`}
                        onClick={() => setActiveBackground(background.id)}
                      >
                        <div className="flex items-center justify-center h-full">
                          <Icon className="text-white" size={24} />
                        </div>
                      </div>
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteCustomBackground(background.id);
                          }}
                          className="p-1 bg-red-500 hover:bg-red-600 rounded text-white"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <p className="text-white/80 text-sm mt-2 truncate">
                        {background.name}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </GlassPanel>
        </motion.div>

        {/* Global Controls */}
        {activeBackground && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <GlassPanel className="p-6" glow>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-white font-semibold text-lg">
                    Active Background Controls
                  </h3>
                  <p className="text-white/70">{activeBackground.name}</p>
                </div>

                <div className="flex items-center gap-2">
                  {activeBackground.hasAudio && (
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className={`p-2 rounded-lg transition-colors ${
                        isMuted
                          ? "bg-gray-500 hover:bg-gray-600"
                          : "bg-blue-500 hover:bg-blue-600"
                      } text-white`}
                    >
                      {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-white/70 text-sm">Opacity</label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={activeBackground.opacity}
                    onChange={(e) =>
                      updateBackgroundProperty(
                        activeBackground.id,
                        "opacity",
                        Number(e.target.value)
                      )
                    }
                    className="w-full accent-purple-500"
                  />
                  <span className="text-white/70 text-xs">
                    {activeBackground.opacity}%
                  </span>
                </div>

                <div>
                  <label className="text-white/70 text-sm">Blur</label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={activeBackground.blur}
                    onChange={(e) =>
                      updateBackgroundProperty(
                        activeBackground.id,
                        "blur",
                        Number(e.target.value)
                      )
                    }
                    className="w-full accent-purple-500"
                  />
                  <span className="text-white/70 text-xs">
                    {activeBackground.blur}px
                  </span>
                </div>

                {activeBackground.type === "video" && (
                  <div>
                    <label className="text-white/70 text-sm">Speed</label>
                    <input
                      type="range"
                      min="0.25"
                      max="2"
                      step="0.25"
                      value={activeBackground.speed}
                      onChange={(e) =>
                        updateBackgroundProperty(
                          activeBackground.id,
                          "speed",
                          Number(e.target.value)
                        )
                      }
                      className="w-full accent-purple-500"
                    />
                    <span className="text-white/70 text-xs">
                      {activeBackground.speed}x
                    </span>
                  </div>
                )}

                {activeBackground.hasAudio && (
                  <div>
                    <label className="text-white/70 text-sm">Volume</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={activeBackground.volume}
                      onChange={(e) =>
                        updateBackgroundProperty(
                          activeBackground.id,
                          "volume",
                          Number(e.target.value)
                        )
                      }
                      className="w-full accent-purple-500"
                    />
                    <span className="text-white/70 text-xs">
                      {activeBackground.volume}%
                    </span>
                  </div>
                )}
              </div>
            </GlassPanel>
          </motion.div>
        )}

        {/* Background Categories */}
        {Object.entries(
          backgrounds.reduce((acc, bg) => {
            if (!acc[bg.category]) acc[bg.category] = [];
            acc[bg.category].push(bg);
            return acc;
          }, {} as Record<string, Background[]>)
        ).map(([category, categoryBackgrounds]) => (
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
                {category} Backgrounds
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {categoryBackgrounds.map((background) => {
                  const Icon = iconMap[background.iconName] || Star;
                  const isActive = background.isActive;

                  return (
                    <motion.div
                      key={background.id}
                      whileHover={{ scale: 1.02 }}
                      className={`relative group cursor-pointer`}
                      onClick={() => setActiveBackground(background.id)}
                    >
                      <div
                        className={`aspect-video rounded-lg border-2 transition-all ${
                          isActive
                            ? "border-green-500 bg-green-500/20"
                            : "border-white/20 bg-white/5 hover:bg-white/10"
                        }`}
                      >
                        {background.thumbnail ? (
                          <img
                            src={background.thumbnail || "/placeholder.svg"}
                            alt={background.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <Icon className="text-white" size={32} />
                          </div>
                        )}

                        {isActive && (
                          <div className="absolute inset-0 flex items-center justify-center bg-green-500/20 rounded-lg">
                            <div className="bg-green-500 text-white px-2 py-1 rounded text-sm font-semibold">
                              Active
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="mt-2">
                        <h4 className="text-white font-medium">
                          {background.name}
                        </h4>
                        <p className="text-white/70 text-sm">
                          {background.description}
                        </p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          {background.hasAudio && (
                            <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs">
                              Audio
                            </span>
                          )}
                          {background.interactive && (
                            <span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded text-xs">
                              Interactive
                            </span>
                          )}
                          <span className="bg-gray-500/20 text-gray-300 px-2 py-1 rounded text-xs capitalize">
                            {background.type}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </GlassPanel>
          </motion.div>
        ))}
      </div>

      {/* Enhanced CSS Animations */}
      <style jsx>{`
        @keyframes cloud-drift-0 {
          0% {
            transform: translateX(-100px);
          }
          100% {
            transform: translateX(100vw);
          }
        }

        @keyframes cloud-drift-1 {
          0% {
            transform: translateX(-150px);
          }
          100% {
            transform: translateX(calc(100vw + 50px));
          }
        }

        @keyframes cloud-drift-2 {
          0% {
            transform: translateX(-200px);
          }
          100% {
            transform: translateX(calc(100vw + 100px));
          }
        }

        @keyframes cloud-drift-3 {
          0% {
            transform: translateX(-250px);
          }
          100% {
            transform: translateX(calc(100vw + 150px));
          }
        }

        @keyframes cloud-drift-4 {
          0% {
            transform: translateX(-300px);
          }
          100% {
            transform: translateX(calc(100vw + 200px));
          }
        }

        @keyframes lightning-flash {
          0% {
            opacity: 0;
            transform: scaleY(0);
          }
          25% {
            opacity: 1;
            transform: scaleY(1);
          }
          50% {
            opacity: 0.7;
            transform: scaleY(1);
          }
          75% {
            opacity: 1;
            transform: scaleY(1);
          }
          100% {
            opacity: 0;
            transform: scaleY(1);
          }
        }

        @keyframes screen-flash {
          0% {
            opacity: 0;
          }
          25% {
            opacity: 0.8;
          }
          50% {
            opacity: 0.3;
          }
          75% {
            opacity: 0.6;
          }
          100% {
            opacity: 0;
          }
        }

        @keyframes thunder-rumble {
          0% {
            opacity: 0;
          }
          20% {
            opacity: 0.3;
          }
          40% {
            opacity: 0.1;
          }
          60% {
            opacity: 0.4;
          }
          80% {
            opacity: 0.2;
          }
          100% {
            opacity: 0;
          }
        }

        @keyframes rain-fall {
          0% {
            transform: translateY(0);
            opacity: 0.8;
          }
          100% {
            transform: translateY(100vh);
            opacity: 0.9;
          }
        }

        @keyframes palm-sway {
          0%,
          100% {
            transform: rotate(0deg);
          }
          50% {
            transform: rotate(3deg);
          }
        }

        @keyframes frond-sway {
          0%,
          100% {
            transform: rotate(0deg);
          }
          50% {
            transform: rotate(5deg);
          }
        }

        @keyframes bird-fly {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(100vw + 50px));
          }
        }

        @keyframes petal-fall {
          0% {
            transform: translateY(0) translateX(0) rotate(0deg);
            opacity: 1;
          }
          25% {
            transform: translateY(25vh) translateX(calc(var(--drift) * 0.3))
              rotate(90deg);
            opacity: 0.9;
          }
          50% {
            transform: translateY(50vh) translateX(calc(var(--drift) * 0.7))
              rotate(180deg);
            opacity: 0.8;
          }
          75% {
            transform: translateY(75vh) translateX(var(--drift)) rotate(270deg);
            opacity: 0.7;
          }
          100% {
            transform: translateY(100vh) translateX(var(--drift))
              rotate(var(--rotation));
            opacity: 0;
          }
        }

        @keyframes butterfly-dance {
          0%,
          100% {
            transform: translate(0, 0) rotate(0deg);
          }
          25% {
            transform: translate(20px, -10px) rotate(5deg);
          }
          50% {
            transform: translate(-15px, -20px) rotate(-3deg);
          }
          75% {
            transform: translate(10px, -5px) rotate(2deg);
          }
        }

        @keyframes butterfly-flight {
          0% {
            transform: translate(0, 0);
          }
          25% {
            transform: translate(50px, -20px);
          }
          50% {
            transform: translate(-30px, -40px);
          }
          75% {
            transform: translate(40px, -10px);
          }
          100% {
            transform: translate(0, 0);
          }
        }

        @keyframes aurora-dance {
          0%,
          100% {
            transform: skewX(0deg) translateX(0);
            opacity: 0.3;
          }
          25% {
            transform: skewX(5deg) translateX(20px);
            opacity: 0.6;
          }
          50% {
            transform: skewX(-3deg) translateX(-15px);
            opacity: 0.8;
          }
          75% {
            transform: skewX(2deg) translateX(10px);
            opacity: 0.5;
          }
        }

        @keyframes coral-sway {
          0%,
          100% {
            transform: rotate(0deg);
          }
          50% {
            transform: rotate(2deg);
          }
        }

        @keyframes fish-swim {
          0% {
            transform: translateX(0) scaleX(1);
          }
          50% {
            transform: translateX(50vw) scaleX(1);
          }
          51% {
            transform: translateX(50vw) scaleX(-1);
          }
          100% {
            transform: translateX(calc(100vw + 50px)) scaleX(-1);
          }
        }

        @keyframes bubble-rise {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0.8;
          }
          100% {
            transform: translateY(-100vh) scale(1.5);
            opacity: 0;
          }
        }

        @keyframes sun-glow {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }

        @keyframes heat-shimmer {
          0% {
            transform: translateX(-100px) scaleY(1);
            opacity: 0;
          }
          50% {
            opacity: 0.6;
            transform: scaleY(1.2);
          }
          100% {
            transform: translateX(100px) scaleY(1);
            opacity: 0;
          }
        }

        @keyframes bamboo-sway {
          0%,
          100% {
            transform: rotate(0deg);
          }
          50% {
            transform: rotate(1deg);
          }
        }

        @keyframes sunbeam-filter {
          0%,
          100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.6;
          }
        }

        @keyframes ripple-expand {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }
          100% {
            transform: scale(4);
            opacity: 0;
          }
        }

        @keyframes neon-flicker {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
          75% {
            opacity: 0.9;
          }
        }

        @keyframes plant-sway {
          0%,
          100% {
            transform: rotate(0deg);
          }
          50% {
            transform: rotate(2deg);
          }
        }

        @keyframes animal-move {
          0%,
          100% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(20px);
          }
        }

        @keyframes grass-sway {
          0%,
          100% {
            transform: rotate(0deg);
          }
          50% {
            transform: rotate(3deg);
          }
        }

        @keyframes gentle-wave {
          0%,
          100% {
            transform: scaleX(1);
            opacity: 0.4;
          }
          50% {
            transform: scaleX(1.2);
            opacity: 0.7;
          }
        }

        @keyframes mediterranean-breeze {
          0%,
          100% {
            transform: rotate(0deg);
          }
          50% {
            transform: rotate(2deg);
          }
        }

        @keyframes dust-float {
          0% {
            transform: translate(0, 0);
            opacity: 0.3;
          }
          25% {
            transform: translate(10px, -20px);
            opacity: 0.6;
          }
          50% {
            transform: translate(-5px, -40px);
            opacity: 0.8;
          }
          75% {
            transform: translate(15px, -60px);
            opacity: 0.4;
          }
          100% {
            transform: translate(0, -80px);
            opacity: 0;
          }
        }

        @keyframes flower-sway {
          0%,
          100% {
            transform: rotate(0deg);
          }
          50% {
            transform: rotate(3deg);
          }
        }

        @keyframes bee-buzz {
          0% {
            transform: translate(0, 0);
          }
          25% {
            transform: translate(20px, -10px);
          }
          50% {
            transform: translate(-15px, 5px);
          }
          75% {
            transform: translate(10px, -15px);
          }
          100% {
            transform: translate(0, 0);
          }
        }

        @keyframes star-twinkle {
          0%,
          100% {
            opacity: 0.3;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }

        @keyframes shooting-star {
          0% {
            transform: translate(0, 0) rotate(45deg);
            opacity: 1;
          }
          100% {
            transform: translate(-200px, 200px) rotate(45deg);
            opacity: 0;
          }
        }

        @keyframes earth-rotation {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes satellite-orbit {
          0% {
            transform: rotate(0deg) translateX(100px) rotate(0deg);
          }
          100% {
            transform: rotate(360deg) translateX(100px) rotate(-360deg);
          }
        }

        @keyframes space-aurora {
          0%,
          100% {
            opacity: 0.3;
            transform: scaleY(1);
          }
          50% {
            opacity: 0.8;
            transform: scaleY(1.5);
          }
        }

        @keyframes tree-sway {
          0%,
          100% {
            transform: rotate(0deg);
          }
          50% {
            transform: rotate(2deg);
          }
        }

        @keyframes leaf-fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }

        @keyframes warm-glow {
          0%,
          100% {
            opacity: 0.8;
          }
          50% {
            opacity: 1;
          }
        }

        @keyframes smoke-rise {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0.6;
          }
          100% {
            transform: translateY(-100px) scale(2);
            opacity: 0;
          }
        }

        @keyframes snowfall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }

        @keyframes wave-motion {
          0%,
          100% {
            transform: scaleX(1);
            opacity: 0.3;
          }
          50% {
            transform: scaleX(1.2);
            opacity: 0.6;
          }
        }

        @keyframes cloud-pass {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-120%);
          }
        }

        @keyframes landscape-pass {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-120%);
          }
        }

        @keyframes steam-rise {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0.6;
          }
          100% {
            transform: translateY(-80px) scale(2);
            opacity: 0;
          }
        }

        @keyframes person-walk {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(100vw + 50px));
          }
        }
      `}</style>
    </div>
  );
}
