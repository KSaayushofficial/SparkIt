"use client";

import { useEffect, useState, useCallback } from "react";

interface Background {
  id: string;
  name: string;
  type: "video" | "image" | "interactive" | "generated";
  url?: string;
  isActive: boolean;
  hasAudio: boolean;
  volume: number;
  speed: number;
  opacity: number;
  blur: number;
  effects: string[];
}

export default function BackgroundManager() {
  const [currentBackground, setCurrentBackground] = useState<Background | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  const loadActiveBackground = useCallback(async () => {
    setIsLoading(true);

    try {
      // Get saved backgrounds
      const savedBackgrounds = localStorage.getItem("dashboard-backgrounds");
      const savedCustomBackgrounds = localStorage.getItem(
        "dashboard-custom-backgrounds"
      );

      let allBackgrounds: Background[] = [];

      if (savedBackgrounds) {
        allBackgrounds = [...allBackgrounds, ...JSON.parse(savedBackgrounds)];
      }

      if (savedCustomBackgrounds) {
        allBackgrounds = [
          ...allBackgrounds,
          ...JSON.parse(savedCustomBackgrounds),
        ];
      }

      // Find active background
      const activeBackground = allBackgrounds.find((bg) => bg.isActive);

      if (activeBackground && activeBackground.id !== currentBackground?.id) {
        setCurrentBackground(activeBackground);
        await applyBackground(activeBackground);
      } else if (!activeBackground && currentBackground) {
        // Clear background if none is active
        setCurrentBackground(null);
        clearBackground();
      }
    } catch (error) {
      console.error("Error loading background:", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentBackground]);

  useEffect(() => {
    // Load initial background
    loadActiveBackground();

    // Listen for background changes
    const handleBackgroundChange = () => {
      loadActiveBackground();
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (
        e.key === "dashboard-backgrounds" ||
        e.key === "dashboard-custom-backgrounds"
      ) {
        loadActiveBackground();
      }
    };

    const handleInitialize = () => {
      loadActiveBackground();
    };

    window.addEventListener("backgroundChanged", handleBackgroundChange);
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("initializeBackground", handleInitialize);

    return () => {
      window.removeEventListener("backgroundChanged", handleBackgroundChange);
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("initializeBackground", handleInitialize);
    };
  }, [loadActiveBackground]);

  const applyBackground = async (background: Background) => {
    const container = document.getElementById("global-background-container");
    if (!container) return;

    // Clear existing background
    clearBackground();

    try {
      switch (background.type) {
        case "video":
          await applyVideoBackground(container, background);
          break;
        case "image":
          await applyImageBackground(container, background);
          break;
        case "interactive":
          await applyInteractiveBackground(container, background);
          break;
        case "generated":
          await applyGeneratedBackground(container, background);
          break;
      }
    } catch (error) {
      console.error("Error applying background:", error);
    }
  };

  const clearBackground = () => {
    const container = document.getElementById("global-background-container");
    if (!container) return;

    // Clean up existing content
    Array.from(container.children).forEach((child) => {
      if ((child as any).cleanup) {
        (child as any).cleanup();
      }
    });

    container.innerHTML = "";
  };

  const applyVideoBackground = async (
    container: HTMLElement,
    background: Background
  ) => {
    return new Promise<void>((resolve, reject) => {
      const video = document.createElement("video");
      video.className =
        "absolute inset-0 w-full h-full object-cover transition-opacity duration-1000";
      video.autoplay = true;
      video.muted = !background.hasAudio;
      video.loop = true;
      video.playsInline = true;
      video.style.opacity = (background.opacity / 100).toString();
      video.style.filter = `blur(${background.blur}px)`;
      video.playbackRate = background.speed;

      if (background.hasAudio) {
        const globalVolume = localStorage.getItem("background-volume") || "50";
        const isMuted = localStorage.getItem("background-muted") === "true";
        video.volume = isMuted
          ? 0
          : (background.volume * Number.parseInt(globalVolume)) / 10000;
      }

      video.onloadeddata = () => {
        container.appendChild(video);
        resolve();
      };

      video.onerror = () => {
        reject(new Error("Failed to load video"));
      };

      if (background.url) {
        video.src = background.url;
      } else {
        // Fallback to placeholder
        video.src = "/placeholder.svg?height=1080&width=1920";
      }
    });
  };

  const applyImageBackground = async (
    container: HTMLElement,
    background: Background
  ) => {
    return new Promise<void>((resolve, reject) => {
      const img = document.createElement("div");
      img.className =
        "absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000";
      img.style.opacity = (background.opacity / 100).toString();
      img.style.filter = `blur(${background.blur}px)`;

      if (background.url) {
        img.style.backgroundImage = `url(${background.url})`;
      } else {
        img.style.backgroundImage = `url(/placeholder.svg?height=1080&width=1920)`;
      }

      // Preload image
      const preloadImg = new Image();
      preloadImg.onload = () => {
        container.appendChild(img);
        resolve();
      };
      preloadImg.onerror = () => {
        reject(new Error("Failed to load image"));
      };
      preloadImg.src =
        background.url || "/placeholder.svg?height=1080&width=1920";
    });
  };

  const applyInteractiveBackground = async (
    container: HTMLElement,
    background: Background
  ) => {
    const scene = document.createElement("div");
    scene.className = "absolute inset-0 transition-opacity duration-1000";
    scene.style.opacity = (background.opacity / 100).toString();
    scene.style.filter = `blur(${background.blur}px)`;

    // Create interactive background based on ID
    switch (background.id) {
      case "ocean-waves":
        createOceanWavesBackground(scene, background);
        break;
      case "forest-rain":
        createForestRainBackground(scene, background);
        break;
      case "mountain-sunrise":
        createMountainSunriseBackground(scene, background);
        break;
      case "tropical-beach":
        createTropicalBeachBackground(scene, background);
        break;
      case "cherry-blossom":
        createCherryBlossomBackground(scene, background);
        break;
      case "northern-lights":
        createNorthernLightsBackground(scene, background);
        break;
      case "underwater-coral":
        createUnderwaterCoralBackground(scene, background);
        break;
      case "desert-sunset":
        createDesertSunsetBackground(scene, background);
        break;
      case "bamboo-forest":
        createBambooForestBackground(scene, background);
        break;
      case "alpine-lake":
        createAlpineLakeBackground(scene, background);
        break;
      default:
        createDefaultInteractiveBackground(scene, background);
        break;
    }

    container.appendChild(scene);
  };

  const applyGeneratedBackground = async (
    container: HTMLElement,
    background: Background
  ) => {
    // Create a gradient background as fallback
    const gradient = document.createElement("div");
    gradient.className = "absolute inset-0 transition-opacity duration-1000";
    gradient.style.background =
      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
    gradient.style.opacity = (background.opacity / 100).toString();
    gradient.style.filter = `blur(${background.blur}px)`;

    container.appendChild(gradient);
  };

  // Interactive background creation functions
  const createOceanWavesBackground = (
    container: HTMLElement,
    background: Background
  ) => {
    container.style.background =
      "linear-gradient(180deg, #87CEEB 0%, #4682B4 30%, #1E90FF 70%, #0066CC 100%)";

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
      container.appendChild(wave);
    };

    const createSeagull = () => {
      const seagull = document.createElement("div");
      seagull.innerHTML = "🕊️";
      seagull.className = "absolute";
      seagull.style.fontSize = "20px";
      seagull.style.left = "-50px";
      seagull.style.top = `${Math.random() * 30}%`;
      seagull.style.animation = `seagull-fly ${
        8000 + Math.random() * 4000
      }ms linear infinite`;
      container.appendChild(seagull);
    };

    // Create initial waves
    for (let i = 0; i < 5; i++) {
      setTimeout(() => createWave(), i * 1000);
    }

    // Create seagulls
    setInterval(createSeagull, 6000);

    // Continuous wave creation
    const waveInterval = setInterval(createWave, 2000);

    // Store cleanup function
    (container as any).cleanup = () => {
      clearInterval(waveInterval);
    };
  };

  const createForestRainBackground = (
    container: HTMLElement,
    background: Background
  ) => {
    container.style.background =
      "linear-gradient(180deg, #228B22 0%, #006400 50%, #2F4F2F 100%)";

    // Add trees
    for (let i = 0; i < 8; i++) {
      const tree = document.createElement("div");
      tree.className = "absolute";
      tree.style.width = `${60 + Math.random() * 40}px`;
      tree.style.height = `${200 + Math.random() * 100}px`;
      tree.style.left = `${Math.random() * 100}%`;
      tree.style.bottom = "0";
      tree.style.background =
        "linear-gradient(180deg, #228B22 0%, #8B4513 80%)";
      tree.style.borderRadius = "50% 50% 0 0";
      tree.style.animation = `tree-sway ${
        4 + Math.random() * 2
      }s ease-in-out infinite`;
      container.appendChild(tree);
    }

    const createRaindrop = () => {
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
      container.appendChild(drop);
      setTimeout(() => drop.remove(), 1500);
    };

    const rainInterval = setInterval(createRaindrop, 50);
    (container as any).cleanup = () => {
      clearInterval(rainInterval);
    };
  };

  const createMountainSunriseBackground = (
    container: HTMLElement,
    background: Background
  ) => {
    container.style.background =
      "linear-gradient(180deg, #FFB6C1 0%, #FFC0CB 30%, #F0E68C 70%, #98FB98 100%)";

    // Add mountains
    for (let i = 0; i < 5; i++) {
      const mountain = document.createElement("div");
      mountain.className = "absolute";
      mountain.style.width = `${150 + Math.random() * 200}px`;
      mountain.style.height = `${200 + Math.random() * 150}px`;
      mountain.style.left = `${Math.random() * 100}%`;
      mountain.style.bottom = "0";
      mountain.style.background =
        "linear-gradient(135deg, #696969 0%, #2F4F4F 100%)";
      mountain.style.clipPath = "polygon(50% 0%, 0% 100%, 100% 100%)";
      container.appendChild(mountain);
    }

    // Add sun
    const sun = document.createElement("div");
    sun.className = "absolute rounded-full";
    sun.style.width = "120px";
    sun.style.height = "120px";
    sun.style.right = "15%";
    sun.style.top = "20%";
    sun.style.background = "radial-gradient(circle, #FFD700 0%, #FF8C00 100%)";
    sun.style.boxShadow = "0 0 60px #FFD700, 0 0 120px #FF8C00";
    sun.style.animation = "sun-glow 4s ease-in-out infinite";
    container.appendChild(sun);
  };

  const createTropicalBeachBackground = (
    container: HTMLElement,
    background: Background
  ) => {
    container.style.background =
      "linear-gradient(180deg, #87CEEB 0%, #98D8E8 30%, #F0E68C 70%, #DEB887 100%)";

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

      container.appendChild(palm);
    }

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
      container.appendChild(wave);
    };

    for (let i = 0; i < 5; i++) {
      setTimeout(() => createWave(), i * 1000);
    }

    const waveInterval = setInterval(createWave, 2000);
    (container as any).cleanup = () => clearInterval(waveInterval);
  };

  const createCherryBlossomBackground = (
    container: HTMLElement,
    background: Background
  ) => {
    container.style.background =
      "linear-gradient(180deg, #FFB6C1 0%, #FFC0CB 30%, #F0E68C 70%, #98FB98 100%)";

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
      container.appendChild(tree);
    }

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

      container.appendChild(petal);
      setTimeout(() => petal.remove(), 7000);
    };

    const petalInterval = setInterval(createPetal, 300);
    (container as any).cleanup = () => clearInterval(petalInterval);
  };

  const createNorthernLightsBackground = (
    container: HTMLElement,
    background: Background
  ) => {
    container.style.background =
      "linear-gradient(180deg, #000428 0%, #004e92 100%)";

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
      container.appendChild(star);
    }

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
      container.appendChild(aurora);

      setTimeout(() => aurora.remove(), 12000);
    };

    const auroraInterval = setInterval(createAurora, 3000);
    createAurora();
    (container as any).cleanup = () => clearInterval(auroraInterval);
  };

  const createUnderwaterCoralBackground = (
    container: HTMLElement,
    background: Background
  ) => {
    container.style.background =
      "linear-gradient(180deg, #006994 0%, #0077be 50%, #004d7a 100%)";

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
      container.appendChild(coral);
    }

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
      container.appendChild(fish);
      setTimeout(() => fish.remove(), 10000);
    };

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
      container.appendChild(bubble);
      setTimeout(() => bubble.remove(), 5000);
    };

    const fishInterval = setInterval(createFish, 2000);
    const bubbleInterval = setInterval(createBubble, 500);
    (container as any).cleanup = () => {
      clearInterval(fishInterval);
      clearInterval(bubbleInterval);
    };
  };

  const createDesertSunsetBackground = (
    container: HTMLElement,
    background: Background
  ) => {
    container.style.background =
      "linear-gradient(180deg, #FF6B35 0%, #F7931E 30%, #FFD23F 60%, #C4A484 100%)";

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
      container.appendChild(dune);
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
    container.appendChild(sun);

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
      container.appendChild(shimmer);
      setTimeout(() => shimmer.remove(), 3000);
    };

    const shimmerInterval = setInterval(createShimmer, 1000);
    (container as any).cleanup = () => clearInterval(shimmerInterval);
  };

  const createBambooForestBackground = (
    container: HTMLElement,
    background: Background
  ) => {
    container.style.background =
      "linear-gradient(180deg, #90EE90 0%, #228B22 50%, #006400 100%)";

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

      container.appendChild(bamboo);
    }

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
      container.appendChild(beam);
    };

    for (let i = 0; i < 8; i++) {
      setTimeout(() => createSunbeam(), i * 1000);
    }
  };

  const createAlpineLakeBackground = (
    container: HTMLElement,
    background: Background
  ) => {
    container.style.background =
      "linear-gradient(180deg, #87CEEB 0%, #4682B4 30%, #1E90FF 70%, #0000CD 100%)";

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
      container.appendChild(mountain);

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

    const createRipple = () => {
      const ripple = document.createElement("div");
      ripple.className = "absolute rounded-full";
      ripple.style.width = "20px";
      ripple.style.height = "20px";
      ripple.style.left = `${Math.random() * 100}%`;
      ripple.style.bottom = `${20 + Math.random() * 30}%`;
      ripple.style.border = "2px solid rgba(255,255,255,0.5)";
      ripple.style.animation = "ripple-expand 3s ease-out forwards";
      container.appendChild(ripple);
      setTimeout(() => ripple.remove(), 3000);
    };

    const rippleInterval = setInterval(createRipple, 2000);
    (container as any).cleanup = () => clearInterval(rippleInterval);
  };

  const createDefaultInteractiveBackground = (
    container: HTMLElement,
    background: Background // eslint-disable-line @typescript-eslint/no-unused-vars
  ) => {
    container.style.background =
      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";

    // Add some animated particles
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement("div");
      particle.className = "absolute rounded-full";
      particle.style.width = `${4 + Math.random() * 8}px`;
      particle.style.height = particle.style.width;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.background = "rgba(255,255,255,0.3)";
      particle.style.animation = `float-particle ${
        3 + Math.random() * 4
      }s ease-in-out infinite`;
      particle.style.animationDelay = `${Math.random() * 2}s`;
      container.appendChild(particle);
    }
  };

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="text-white text-lg">Loading background...</div>
        </div>
      )}

      {/* Background container */}
      <div id="global-background-container" className="fixed inset-0 z-0">
        {/* Default gradient background as fallback */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-black" />

        {/* Dynamic background overlay */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-blob" />
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000" />
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000" />
          <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-6000" />
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-400/30 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Background CSS Animations */}
      <style jsx global>{`
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

        @keyframes seagull-fly {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(100vw + 50px));
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

        @keyframes sun-glow {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
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

        @keyframes float-particle {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
      `}</style>
    </>
  );
}
