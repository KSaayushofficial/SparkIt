"use client";

import { useEffect, useState, useRef, useCallback } from "react";

interface Effect {
  id: string;
  name: string;
  category: string;
  isActive: boolean;
  intensity: number;
  particles: number;
  speed: number;
  size: number;
  opacity: number;
  color: string;
  direction: string;
  physics: boolean;
  interactive: boolean;
}

export default function EffectsManager() {
  const [activeEffects, setActiveEffects] = useState<Effect[]>([]);
  const [isPlaying, setIsPlaying] = useState(true);
  const timersRef = useRef<Map<string, NodeJS.Timeout | number>>(new Map());

  const clearAllEffects = useCallback(() => {
    const container = document.getElementById("global-effects-container");
    if (container) {
      Array.from(container.children).forEach((child) => {
        const effectContainer = child as HTMLDivElement & { cleanup?: () => void };
        if (effectContainer.cleanup) {
          effectContainer.cleanup();
        }
      });
      container.innerHTML = "";
    }
    timersRef.current.forEach((timer) => {
      clearTimeout(timer);
      clearInterval(timer as NodeJS.Timeout);
    });
    timersRef.current.clear();
  }, []);

  const pauseAllEffects = useCallback(() => {
    const container = document.getElementById("global-effects-container");
    if (container) {
      container.style.display = "none";
    }
  }, []);

  const applyActiveEffects = useCallback(() => {
    const container = document.getElementById("global-effects-container");
    if (!container) return;

    clearAllEffects();

    activeEffects.forEach((effect) => {
      createGlobalEffect(container, effect);
    });
  }, [activeEffects, clearAllEffects]);

  const loadActiveEffects = useCallback(() => {
    try {
      const savedEffects = localStorage.getItem("dashboard-effects");
      const savedPlayback = localStorage.getItem("effects-playing");

      if (savedEffects) {
        const effects = JSON.parse(savedEffects);
        const active = effects.filter((effect: Effect) => effect.isActive);
        setActiveEffects(active);
      }

      if (savedPlayback !== null) {
        setIsPlaying(JSON.parse(savedPlayback));
      }
    } catch (error) {
      console.error("Error loading effects:", error);
    }
  }, []);

  useEffect(() => {
    loadActiveEffects();

    const handleEffectsChange = () => {
      loadActiveEffects();
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "dashboard-effects") {
        loadActiveEffects();
      }
    };

    const handleInitialize = () => {
      loadActiveEffects();
    };

    const handlePlaybackToggle = (e: CustomEvent) => {
      setIsPlaying(e.detail.isPlaying);
    };

    window.addEventListener("effectsChanged", handleEffectsChange);
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("initializeEffects", handleInitialize);
    window.addEventListener("effectsPlaybackToggle", handlePlaybackToggle as EventListener);

    return () => {
      window.removeEventListener("effectsChanged", handleEffectsChange);
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("initializeEffects", handleInitialize);
      window.removeEventListener("effectsPlaybackToggle", handlePlaybackToggle as EventListener);
      clearAllEffects();
    };
  }, [loadActiveEffects, clearAllEffects]);

  useEffect(() => {
    if (isPlaying) {
      applyActiveEffects();
    } else {
      pauseAllEffects();
    }
  }, [activeEffects, isPlaying, applyActiveEffects, pauseAllEffects]);

  const createGlobalEffect = (container: HTMLElement, effect: Effect) => {
    const effectContainer = document.createElement("div");
    effectContainer.className = "absolute inset-0 pointer-events-none";
    effectContainer.id = `global-effect-${effect.id}`;
    (effectContainer as HTMLDivElement & { timers?: (NodeJS.Timeout | number)[] }).timers = [];

    switch (effect.id) {
      case "rain":
      case "heavy-rain":
        createRainEffect(effectContainer, effect);
        break;
      case "snow":
      case "blizzard":
        createSnowEffect(effectContainer, effect);
        break;
      case "lightning":
      case "realistic-lightning":
        createLightningEffect(effectContainer, effect);
        break;
      case "fireflies":
        createFirefliesEffect(effectContainer, effect);
        break;
      case "butterflies":
        createButterfliesEffect(effectContainer, effect);
        break;
      case "autumn-leaves":
        createAutumnLeavesEffect(effectContainer, effect);
        break;
      case "cherry-blossoms":
        createCherryBlossomsEffect(effectContainer, effect);
        break;
      case "floating-seeds":
        createFloatingSeedsEffect(effectContainer, effect);
        break;
      case "stars":
        createStarsEffect(effectContainer, effect);
        break;
      case "shooting-stars":
        createShootingStarsEffect(effectContainer, effect);
        break;
      case "sparkles":
      case "fairy-dust":
        createSparklesEffect(effectContainer, effect);
        break;
      case "rainbow-drops":
        createRainbowDropsEffect(effectContainer, effect);
        break;
      case "wind":
        createWindEffect(effectContainer, effect);
        break;
      case "mist":
        createMistEffect(effectContainer, effect);
        break;
      case "aurora":
      case "aurora-enhanced":
        createAuroraEffect(effectContainer, effect);
        break;
      case "embers":
        createEmbersEffect(effectContainer, effect);
        break;
      case "phoenix-feathers":
        createPhoenixFeathersEffect(effectContainer, effect);
        break;
      case "bubbles":
        createBubblesEffect(effectContainer, effect);
        break;
      case "jellyfish":
        createJellyfishEffect(effectContainer, effect);
        break;
      case "crystal-shards":
        createCrystalShardsEffect(effectContainer, effect);
        break;
      case "spirit-orbs":
        createSpiritOrbsEffect(effectContainer, effect);
        break;
      case "moonbeams":
        createMoonbeamsEffect(effectContainer, effect);
        break;
      case "tornado":
        createTornadoEffect(effectContainer, effect);
        break;
      case "volcanic-ash":
        createVolcanicAshEffect(effectContainer, effect);
        break;
      case "meteor-shower":
        createMeteorShowerEffect(effectContainer, effect);
        break;
      case "sandstorm":
        createSandstormEffect(effectContainer, effect);
        break;
      case "bioluminescent-plankton":
        createBioluminescentPlanktonEffect(effectContainer, effect);
        break;
      case "forest-spirits":
        createForestSpiritsEffect(effectContainer, effect);
        break;
      case "dragon-breath":
        createDragonBreathEffect(effectContainer, effect);
        break;
      case "fog":
        createFogEffect(effectContainer, effect);
        break;
      default:
        console.warn(`Unknown effect: ${effect.id}`);
        break;
    }

    container.appendChild(effectContainer);
  };

  const createRainEffect = (container: HTMLElement, effect: Effect) => {
    const timers: (NodeJS.Timeout | number)[] = [];
    (container as HTMLDivElement & { timers?: (NodeJS.Timeout | number)[] }).timers = timers;
    const particleCount = Math.floor((effect.particles * effect.intensity) / 100);

    const createRaindrop = () => {
      const drop = document.createElement("div");
      drop.className = "absolute";
      drop.style.width = `${effect.size}px`;
      drop.style.height = `${effect.size * 10}px`;
      drop.style.left = `${Math.random() * 100}%`;
      drop.style.top = "-30px";
      drop.style.background = `linear-gradient(180deg, ${effect.color}${Math.floor(effect.opacity * 255).toString(16)}, transparent)`;
      drop.style.borderRadius = "50%";
      drop.style.boxShadow = `0 0 ${effect.size}px ${effect.color}40`;

      const windOffset = (Math.random() - 0.5) * 50;
      drop.style.setProperty("--wind-offset", `${windOffset}px`);
      drop.style.animation = `rain-fall ${3000 / effect.speed}ms linear forwards`;

      container.appendChild(drop);

      const timer = setTimeout(() => {
        if (effect.physics) {
          createRainSplash(container, drop.offsetLeft + windOffset, window.innerHeight - 20);
        }
        drop.remove();
      }, 3000 / effect.speed);
      timers.push(timer);
    };

    for (let i = 0; i < Math.min(particleCount, 100); i++) {
      const timer = setTimeout(() => createRaindrop(), Math.random() * 2000);
      timers.push(timer);
    }

    const interval = setInterval(createRaindrop, Math.max(50, 200 - effect.intensity * 2));
    timers.push(interval);

    (container as HTMLDivElement & { cleanup?: () => void }).cleanup = () => {
      timers.forEach((timer) => {
        clearTimeout(timer);
        clearInterval(timer as NodeJS.Timeout);
      });
    };
  };

  const createRainSplash = (container: HTMLElement, x: number, y: number) => {
    for (let i = 0; i < 6; i++) {
      const splash = document.createElement("div");
      splash.className = "absolute rounded-full";
      splash.style.width = "3px";
      splash.style.height = "3px";
      splash.style.left = `${x}px`;
      splash.style.top = `${y}px`;
      splash.style.background = "#4A90E2";
      splash.style.opacity = "0.7";

      const angle = (i / 6) * Math.PI * 2;
      const distance = 10 + Math.random() * 15;
      splash.style.setProperty("--splash-x", `${Math.cos(angle) * distance}px`);
      splash.style.setProperty("--splash-y", `${Math.sin(angle) * distance}px`);
      splash.style.animation = `splash-particle 400ms ease-out forwards`;

      container.appendChild(splash);
      setTimeout(() => splash.remove(), 400);
    }
  };

  const createSnowEffect = (container: HTMLElement, effect: Effect) => {
    const timers: (NodeJS.Timeout | number)[] = [];
    (container as HTMLDivElement & { timers?: (NodeJS.Timeout | number)[] }).timers = timers;
    const particleCount = Math.floor((effect.particles * effect.intensity) / 100);

    const createSnowflake = () => {
      const flake = document.createElement("div");
      const snowflakeTypes = ["❄", "❅", "❆", "✻", "✼", "❉"];
      flake.innerHTML = snowflakeTypes[Math.floor(Math.random() * snowflakeTypes.length)];
      flake.className = "absolute text-white";
      flake.style.fontSize = `${effect.size * 3}px`;
      flake.style.left = `${Math.random() * 100}%`;
      flake.style.top = "-30px";
      flake.style.opacity = effect.opacity.toString();
      flake.style.filter = `drop-shadow(0 0 ${effect.size}px rgba(255,255,255,0.8))`;

      const drift = (Math.random() - 0.5) * 150;
      const rotation = Math.random() * 720 - 360;
      flake.style.setProperty("--drift", `${drift}px`);
      flake.style.setProperty("--rotation", `${rotation}deg`);
      flake.style.animation = `snowflake-fall ${5000 / effect.speed}ms linear forwards`;

      container.appendChild(flake);
      const timer = setTimeout(() => flake.remove(), 5000 / effect.speed);
      timers.push(timer);
    };

    for (let i = 0; i < Math.min(particleCount, 80); i++) {
      const timer = setTimeout(() => createSnowflake(), Math.random() * 3000);
      timers.push(timer);
    }

    const interval = setInterval(createSnowflake, Math.max(100, 300 - effect.intensity * 2));
    timers.push(interval);

    (container as HTMLDivElement & { cleanup?: () => void }).cleanup = () => {
      timers.forEach((timer) => {
        clearTimeout(timer);
        clearInterval(timer as NodeJS.Timeout);
      });
    };
  };

  const createLightningEffect = (container: HTMLElement, effect: Effect) => {
    const timers: (NodeJS.Timeout | number)[] = [];
    (container as HTMLDivElement & { timers?: (NodeJS.Timeout | number)[] }).timers = timers;

    const createLightning = () => {
      const lightning = document.createElement("div");
      lightning.className = "absolute";
      lightning.style.width = `${effect.size}px`;
      lightning.style.height = "100vh";
      lightning.style.left = `${Math.random() * 100}%`;
      lightning.style.top = "0";
      lightning.style.background = `linear-gradient(180deg, ${effect.color} 0%, #E6E6FF 50%, transparent 100%)`;
      lightning.style.boxShadow = `0 0 30px ${effect.color}, 0 0 60px #E6E6FF, 0 0 90px #B3B3FF`;
      lightning.style.filter = "blur(1px)";
      lightning.style.zIndex = "100";

      for (let i = 0; i < 5; i++) {
        const branch = document.createElement("div");
        branch.className = "absolute";
        branch.style.width = `${effect.size / 2}px`;
        branch.style.height = `${150 + Math.random() * 300}px`;
        branch.style.left = `${(Math.random() - 0.5) * 100}px`;
        branch.style.top = `${Math.random() * 400}px`;
        branch.style.background = `linear-gradient(180deg, ${effect.color} 0%, transparent 100%)`;
        branch.style.transform = `rotate(${Math.random() * 60 - 30}deg)`;
        branch.style.transformOrigin = "top";
        branch.style.animation = "lightning-branch 400ms ease-out forwards";
        branch.style.animationDelay = `${i * 50}ms`;
        lightning.appendChild(branch);
      }

      container.appendChild(lightning);

      const flash = document.createElement("div");
      flash.className = "absolute inset-0";
      flash.style.background = `radial-gradient(circle, rgba(255,255,255,0.6) 0%, rgba(230,230,255,0.3) 50%, transparent 100%)`;
      flash.style.animation = "lightning-flash 800ms ease-out forwards";
      flash.style.zIndex = "99";
      container.appendChild(flash);

      const timer = setTimeout(() => {
        lightning.remove();
        flash.remove();
      }, 800);
      timers.push(timer);
    };

    const scheduleNextLightning = () => {
      const delay = 3000 + (Math.random() * 7000) / (effect.intensity / 20);
      const timeout = setTimeout(() => {
        createLightning();
        scheduleNextLightning();
      }, delay);
      timers.push(timeout);
    };

    scheduleNextLightning();

    (container as HTMLDivElement & { cleanup?: () => void }).cleanup = () => {
      timers.forEach((timer) => {
        clearTimeout(timer);
        clearInterval(timer as NodeJS.Timeout);
      });
    };
  };

  const createFirefliesEffect = (container: HTMLElement, effect: Effect) => {
    const timers: (NodeJS.Timeout | number)[] = [];
    (container as HTMLDivElement & { timers?: (NodeJS.Timeout | number)[] }).timers = timers;
    const particleCount = Math.floor((effect.particles * effect.intensity) / 100);

    for (let i = 0; i < Math.min(particleCount, 25); i++) {
      const firefly = document.createElement("div");
      firefly.className = "absolute rounded-full";
      firefly.style.width = `${effect.size * 3}px`;
      firefly.style.height = `${effect.size * 3}px`;
      firefly.style.left = `${Math.random() * 100}%`;
      firefly.style.top = `${Math.random() * 100}%`;
      firefly.style.background = `radial-gradient(circle, ${effect.color} 0%, transparent 70%)`;
      firefly.style.boxShadow = `0 0 ${effect.size * 6}px ${effect.color}, 0 0 ${effect.size * 12}px ${effect.color}40`;
      firefly.style.animation = `firefly-glow ${2 + Math.random() * 3}s ease-in-out infinite`;
      firefly.style.animationDelay = `${Math.random() * 2}s`;

      const moveFirefly = () => {
        const newX = Math.random() * 100;
        const newY = Math.random() * 100;
        const duration = 4 + Math.random() * 6;
        firefly.style.transition = `all ${duration}s cubic-bezier(0.4, 0, 0.2, 1)`;
        firefly.style.left = `${newX}%`;
        firefly.style.top = `${newY}%`;

        const timeout = setTimeout(moveFirefly, duration * 1000);
        timers.push(timeout);
      };

      const timer = setTimeout(moveFirefly, Math.random() * 2000);
      timers.push(timer);
      container.appendChild(firefly);
    }

    (container as HTMLDivElement & { cleanup?: () => void }).cleanup = () => {
      timers.forEach((timer) => {
        clearTimeout(timer);
        clearInterval(timer as NodeJS.Timeout);
      });
    };
  };

  const createButterfliesEffect = (container: HTMLElement, effect: Effect) => {
    const particleCount = Math.floor((effect.particles * effect.intensity) / 100);
    const butterflyEmojis = ["🦋", "🦋", "🦋"];

    for (let i = 0; i < Math.min(particleCount, 20); i++) {
      const butterfly = document.createElement("div");
      butterfly.innerHTML = butterflyEmojis[Math.floor(Math.random() * butterflyEmojis.length)];
      butterfly.className = "absolute";
      butterfly.style.fontSize = `${effect.size * 2}px`;
      butterfly.style.left = `${Math.random() * 100}%`;
      butterfly.style.top = `${Math.random() * 100}%`;
      butterfly.style.filter = `hue-rotate(${Math.random() * 360}deg) drop-shadow(0 0 4px rgba(255,105,180,0.6))`;
      butterfly.style.animation = `butterfly-dance ${6 + Math.random() * 4}s ease-in-out infinite`;
      butterfly.style.animationDelay = `${Math.random() * 3}s`;

      container.appendChild(butterfly);
    }
  };

  const createAutumnLeavesEffect = (container: HTMLElement, effect: Effect) => {
    const timers: (NodeJS.Timeout | number)[] = [];
    (container as HTMLDivElement & { timers?: (NodeJS.Timeout | number)[] }).timers = timers;
    const leafEmojis = ["🍂", "🍁", "🍃", "🌿"];

    const createLeaf = () => {
      const leaf = document.createElement("div");
      leaf.innerHTML = leafEmojis[Math.floor(Math.random() * leafEmojis.length)];
      leaf.className = "absolute";
      leaf.style.fontSize = `${effect.size * 2}px`;
      leaf.style.left = `${Math.random() * 100}%`;
      leaf.style.top = "-30px";
      leaf.style.opacity = effect.opacity.toString();
      leaf.style.filter = `hue-rotate(${Math.random() * 60 - 30}deg) drop-shadow(0 0 2px rgba(210,105,30,0.8))`;

      const duration = 6000 / effect.speed;
      const drift = (Math.random() - 0.5) * 250;
      const rotation = Math.random() * 1080 - 540;

      leaf.style.setProperty("--drift", `${drift}px`);
      leaf.style.setProperty("--rotation", `${rotation}deg`);
      leaf.style.animation = `autumn-leaf-fall ${duration}ms ease-out forwards`;

      container.appendChild(leaf);
      const timer = setTimeout(() => leaf.remove(), duration);
      timers.push(timer);
    };

    const particleCount = Math.floor((effect.particles * effect.intensity) / 100);
    for (let i = 0; i < Math.min(particleCount, 60); i++) {
      const timer = setTimeout(() => createLeaf(), Math.random() * 2000);
      timers.push(timer);
    }

    const interval = setInterval(createLeaf, Math.max(200, 600 - effect.intensity * 4));
    timers.push(interval);

    (container as HTMLDivElement & { cleanup?: () => void }).cleanup = () => {
      timers.forEach((timer) => {
        clearTimeout(timer);
        clearInterval(timer as NodeJS.Timeout);
      });
    };
  };

  const createCherryBlossomsEffect = (container: HTMLElement, effect: Effect) => {
    const timers: (NodeJS.Timeout | number)[] = [];
    (container as HTMLDivElement & { timers?: (NodeJS.Timeout | number)[] }).timers = timers;

    const createPetal = () => {
      const petal = document.createElement("div");
      petal.innerHTML = "🌸";
      petal.className = "absolute";
      petal.style.fontSize = `${effect.size * 2}px`;
      petal.style.left = `${Math.random() * 100}%`;
      petal.style.top = "-30px";
      petal.style.opacity = effect.opacity.toString();
      petal.style.filter = `hue-rotate(${Math.random() * 30 - 15}deg) drop-shadow(0 0 3px rgba(255,182,193,0.8))`;

      const duration = 7000 / effect.speed;
      const drift = (Math.random() - 0.5) * 200;
      const rotation = Math.random() * 720;

      petal.style.setProperty("--drift", `${drift}px`);
      petal.style.setProperty("--rotation", `${rotation}deg`);
      petal.style.animation = `petal-fall ${duration}ms ease-out forwards`;

      container.appendChild(petal);
      const timer = setTimeout(() => petal.remove(), duration);
      timers.push(timer);
    };

    const particleCount = Math.floor((effect.particles * effect.intensity) / 100);
    for (let i = 0; i < Math.min(particleCount, 50); i++) {
      const timer = setTimeout(() => createPetal(), Math.random() * 2000);
      timers.push(timer);
    }

    const interval = setInterval(createPetal, Math.max(300, 700 - effect.intensity * 4));
    timers.push(interval);

    (container as HTMLDivElement & { cleanup?: () => void }).cleanup = () => {
      timers.forEach((timer) => {
        clearTimeout(timer);
        clearInterval(timer as NodeJS.Timeout);
      });
    };
  };

  const createFloatingSeedsEffect = (container: HTMLElement, effect: Effect) => {
    const timers: (NodeJS.Timeout | number)[] = [];
    (container as HTMLDivElement & { timers?: (NodeJS.Timeout | number)[] }).timers = timers;

    const createSeed = () => {
      const seed = document.createElement("div");
      seed.innerHTML = "🌾";
      seed.className = "absolute";
      seed.style.fontSize = `${effect.size * 2}px`;
      seed.style.left = `${Math.random() * 100}%`;
      seed.style.bottom = "-30px";
      seed.style.opacity = effect.opacity.toString();
      seed.style.filter = "drop-shadow(0 0 2px rgba(245,245,220,0.8))";

      const duration = 8000 / effect.speed;
      const drift = (Math.random() - 0.5) * 300;
      const rotation = Math.random() * 360;

      seed.style.setProperty("--drift", `${drift}px`);
      seed.style.setProperty("--rotation", `${rotation}deg`);
      seed.style.animation = `seed-float ${duration}ms ease-out forwards`;

      container.appendChild(seed);
      const timer = setTimeout(() => seed.remove(), duration);
      timers.push(timer);
    };

    const particleCount = Math.floor((effect.particles * effect.intensity) / 100);
    for (let i = 0; i < Math.min(particleCount, 40); i++) {
      const timer = setTimeout(() => createSeed(), Math.random() * 3000);
      timers.push(timer);
    }

    const interval = setInterval(createSeed, Math.max(400, 800 - effect.intensity * 4));
    timers.push(interval);

    (container as HTMLDivElement & { cleanup?: () => void }).cleanup = () => {
      timers.forEach((timer) => {
        clearTimeout(timer);
        clearInterval(timer as NodeJS.Timeout);
      });
    };
  };

  const createStarsEffect = (container: HTMLElement, effect: Effect) => {
    const particleCount = Math.floor((effect.particles * effect.intensity) / 100);

    for (let i = 0; i < Math.min(particleCount, 100); i++) {
      const star = document.createElement("div");
      star.innerHTML = "✦";
      star.className = "absolute";
      star.style.fontSize = `${effect.size * 3}px`;
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.color = effect.color;
      star.style.opacity = effect.opacity.toString();
      star.style.filter = `drop-shadow(0 0 ${effect.size * 2}px ${effect.color})`;
      star.style.animation = `star-twinkle ${1 + Math.random() * 4}s ease-in-out infinite`;
      star.style.animationDelay = `${Math.random() * 2}s`;

      container.appendChild(star);
    }
  };

  const createShootingStarsEffect = (container: HTMLElement, effect: Effect) => {
    const timers: (NodeJS.Timeout | number)[] = [];
    (container as HTMLDivElement & { timers?: (NodeJS.Timeout | number)[] }).timers = timers;

    const createShootingStar = () => {
      const star = document.createElement("div");
      star.className = "absolute";
      star.style.width = `${effect.size}px`;
      star.style.height = `${effect.size}px`;
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 50}%`;
      star.style.background = effect.color;
      star.style.borderRadius = "50%";
      star.style.boxShadow = `0 0 ${effect.size * 4}px ${effect.color}, 0 0 ${effect.size * 8}px ${effect.color}80`;
      star.style.animation = "shooting-star 3s linear forwards";

      const trail = document.createElement("div");
      trail.className = "absolute";
      trail.style.width = "100px";
      trail.style.height = "2px";
      trail.style.right = "0";
      trail.style.top = "50%";
      trail.style.background = `linear-gradient(90deg, transparent 0%, ${effect.color} 100%)`;
      trail.style.transform = "translateY(-50%)";
      star.appendChild(trail);

      container.appendChild(star);
      const timer = setTimeout(() => star.remove(), 3000);
      timers.push(timer);
    };

    const interval = setInterval(createShootingStar, Math.max(2000, 6000 - effect.intensity * 40));
    timers.push(interval);

    (container as HTMLDivElement & { cleanup?: () => void }).cleanup = () => {
      timers.forEach((timer) => {
        clearTimeout(timer);
        clearInterval(timer as NodeJS.Timeout);
      });
    };
  };

  const createSparklesEffect = (container: HTMLElement, effect: Effect) => {
    const timers: (NodeJS.Timeout | number)[] = [];
    (container as HTMLDivElement & { timers?: (NodeJS.Timeout | number)[] }).timers = timers;

    const createSparkle = () => {
      const sparkle = document.createElement("div");
      sparkle.innerHTML = "✨";
      sparkle.className = "absolute";
      sparkle.style.fontSize = `${effect.size * 2}px`;
      sparkle.style.left = `${Math.random() * 100}%`;
      sparkle.style.top = `${Math.random() * 100}%`;
      sparkle.style.color = effect.color;
      sparkle.style.filter = `hue-rotate(${Math.random() * 360}deg) drop-shadow(0 0 4px ${effect.color})`;
      sparkle.style.animation = "sparkle-appear 3s ease-out forwards";

      container.appendChild(sparkle);
      const timer = setTimeout(() => sparkle.remove(), 3000);
      timers.push(timer);
    };

    const interval = setInterval(createSparkle, Math.max(200, 600 - effect.intensity * 8));
    timers.push(interval);

    (container as HTMLDivElement & { cleanup?: () => void }).cleanup = () => {
      timers.forEach((timer) => {
        clearTimeout(timer);
        clearInterval(timer as NodeJS.Timeout);
      });
    };
  };

  const createRainbowDropsEffect = (container: HTMLElement, effect: Effect) => {
    const timers: (NodeJS.Timeout | number)[] = [];
    (container as HTMLDivElement & { timers?: (NodeJS.Timeout | number)[] }).timers = timers;

    const createDrop = () => {
      const drop = document.createElement("div");
      drop.className = "absolute rounded-full";
      drop.style.width = `${effect.size}px`;
      drop.style.height = `${effect.size}px`;
      drop.style.left = `${Math.random() * 100}%`;
      drop.style.top = "-20px";
      drop.style.background = `hsl(${Math.random() * 360}, 70%, 60%)`;
      drop.style.boxShadow = `0 0 ${effect.size * 2}px currentColor`;
      drop.style.animation = `rainbow-drop-fall ${4000 / effect.speed}ms ease-in forwards`;

      container.appendChild(drop);
      const timer = setTimeout(() => drop.remove(), 4000 / effect.speed);
      timers.push(timer);
    };

    const particleCount = Math.floor((effect.particles * effect.intensity) / 100);
    for (let i = 0; i < Math.min(particleCount, 60); i++) {
      const timer = setTimeout(() => createDrop(), Math.random() * 2000);
      timers.push(timer);
    }

    const interval = setInterval(createDrop, Math.max(150, 450 - effect.intensity * 3));
    timers.push(interval);

    (container as HTMLDivElement & { cleanup?: () => void }).cleanup = () => {
      timers.forEach((timer) => {
        clearTimeout(timer);
        clearInterval(timer as NodeJS.Timeout);
      });
    };
  };

  const createWindEffect = (container: HTMLElement, effect: Effect) => {
    const timers: (NodeJS.Timeout | number)[] = [];
    (container as HTMLDivElement & { timers?: (NodeJS.Timeout | number)[] }).timers = timers;

    const createWindLine = () => {
      const line = document.createElement("div");
      line.className = "absolute";
      line.style.width = `${30 + Math.random() * 60}px`;
      line.style.height = "2px";
      line.style.left = "-80px";
      line.style.top = `${Math.random() * 100}%`;
      line.style.background = `linear-gradient(90deg, transparent, ${effect.color}${Math.floor(effect.opacity * 255).toString(16)}, transparent)`;
      line.style.borderRadius = "1px";
      line.style.animation = `wind-gust ${2500 / effect.speed}ms linear forwards`;

      container.appendChild(line);
      const timer = setTimeout(() => line.remove(), 2500 / effect.speed);
      timers.push(timer);
    };

    const interval = setInterval(createWindLine, Math.max(100, 200 - effect.intensity));
    timers.push(interval);

    (container as HTMLDivElement & { cleanup?: () => void }).cleanup = () => {
      timers.forEach((timer) => {
        clearTimeout(timer);
        clearInterval(timer as NodeJS.Timeout);
      });
    };
  };

  const createMistEffect = (container: HTMLElement, effect: Effect) => {
    for (let i = 0; i < 12; i++) {
      const mist = document.createElement("div");
      mist.className = "absolute";
      mist.style.width = `${effect.size * 4}px`;
      mist.style.height = `${effect.size}px`;
      mist.style.left = `${Math.random() * 100}%`;
      mist.style.bottom = "0";
      mist.style.background = `radial-gradient(ellipse, ${effect.color}${Math.floor(effect.opacity * 255).toString(16)}, transparent)`;
      mist.style.borderRadius = "50%";
      mist.style.filter = "blur(4px)";
      mist.style.animation = `mist-rise ${10000 / effect.speed}ms ease-out infinite`;
      mist.style.animationDelay = `${i * 800}ms`;

      container.appendChild(mist);
    }
  };

  const createAuroraEffect = (container: HTMLElement, effect: Effect) => {
    for (let i = 0; i < 3; i++) {
      const aurora = document.createElement("div");
      aurora.className = "absolute";
      aurora.style.width = "100%";
      aurora.style.height = "60%";
      aurora.style.top = "0";
      aurora.style.background = `linear-gradient(180deg, 
        hsla(${120 + i * 60}, 70%, 60%, 0.4) 0%, 
        hsla(${180 + i * 60}, 70%, 60%, 0.3) 50%, 
        transparent 100%)`;
      aurora.style.filter = "blur(2px)";
      aurora.style.animation = `aurora-dance ${8000 + i * 2000}ms ease-in-out infinite`;
      aurora.style.animationDelay = `${i * 1000}ms`;

      container.appendChild(aurora);
    }
  };

  const createEmbersEffect = (container: HTMLElement, effect: Effect) => {
    const timers: (NodeJS.Timeout | number)[] = [];
    (container as HTMLDivElement & { timers?: (NodeJS.Timeout | number)[] }).timers = timers;

    const createEmber = () => {
      const ember = document.createElement("div");
      ember.className = "absolute rounded-full";
      ember.style.width = `${effect.size}px`;
      ember.style.height = `${effect.size}px`;
      ember.style.left = `${Math.random() * 100}%`;
      ember.style.bottom = "0";
      ember.style.background = `radial-gradient(circle, ${effect.color} 0%, transparent 70%)`;
      ember.style.boxShadow = `0 0 ${effect.size * 3}px ${effect.color}, 0 0 ${effect.size * 6}px ${effect.color}80`;
      ember.style.animation = `ember-rise ${5000 / effect.speed}ms ease-out forwards`;

      container.appendChild(ember);
      const timer = setTimeout(() => ember.remove(), 5000 / effect.speed);
      timers.push(timer);
    };

    const particleCount = Math.floor((effect.particles * effect.intensity) / 100);
    for (let i = 0; i < Math.min(particleCount, 40); i++) {
      const timer = setTimeout(() => createEmber(), Math.random() * 2000);
      timers.push(timer);
    }

    const interval = setInterval(createEmber, Math.max(300, 700 - effect.intensity * 4));
    timers.push(interval);

    (container as HTMLDivElement & { cleanup?: () => void }).cleanup = () => {
      timers.forEach((timer) => {
        clearTimeout(timer);
        clearInterval(timer as NodeJS.Timeout);
      });
    };
  };

  const createPhoenixFeathersEffect = (container: HTMLElement, effect: Effect) => {
    const particleCount = Math.floor((effect.particles * effect.intensity) / 100);

    for (let i = 0; i < Math.min(particleCount, 15); i++) {
      const feather = document.createElement("div");
      feather.innerHTML = "🪶";
      feather.className = "absolute";
      feather.style.fontSize = `${effect.size * 2}px`;
      feather.style.left = `${Math.random() * 100}%`;
      feather.style.top = `${Math.random() * 100}%`;
      feather.style.filter = `hue-rotate(${Math.random() * 60}deg) drop-shadow(0 0 6px #FF6347)`;
      feather.style.animation = `phoenix-feather-float ${8000 + Math.random() * 4000}ms ease-in-out infinite`;

      container.appendChild(feather);
    }
  };

  const createBubblesEffect = (container: HTMLElement, effect: Effect) => {
    const timers: (NodeJS.Timeout | number)[] = [];
    (container as HTMLDivElement & { timers?: (NodeJS.Timeout | number)[] }).timers = timers;

    const createBubble = () => {
      const bubble = document.createElement("div");
      bubble.className = "absolute rounded-full";
      const size = effect.size + Math.random() * effect.size;
      bubble.style.width = `${size}px`;
      bubble.style.height = `${size}px`;
      bubble.style.left = `${Math.random() * 100}%`;
      bubble.style.bottom = "-30px";
      bubble.style.background = `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8) 0%, ${effect.color}60 100%)`;
      bubble.style.border = `1px solid ${effect.color}80`;
      bubble.style.animation = `bubble-rise ${4000 / effect.speed}ms ease-out forwards`;

      container.appendChild(bubble);
      const timer = setTimeout(() => bubble.remove(), 4000 / effect.speed);
      timers.push(timer);
    };

    const particleCount = Math.floor((effect.particles * effect.intensity) / 100);
    for (let i = 0; i < Math.min(particleCount, 60); i++) {
      const timer = setTimeout(() => createBubble(), Math.random() * 2000);
      timers.push(timer);
    }

    const interval = setInterval(createBubble, Math.max(200, 600 - effect.intensity * 4));
    timers.push(interval);

    (container as HTMLDivElement & { cleanup?: () => void }).cleanup = () => {
      timers.forEach((timer) => {
        clearTimeout(timer);
        clearInterval(timer as NodeJS.Timeout);
      });
    };
  };

  const createJellyfishEffect = (container: HTMLElement, effect: Effect) => {
    const particleCount = Math.floor((effect.particles * effect.intensity) / 100);

    for (let i = 0; i < Math.min(particleCount, 10); i++) {
      const jellyfish = document.createElement("div");
      jellyfish.innerHTML = "🎐";
      jellyfish.className = "absolute";
      jellyfish.style.fontSize = `${effect.size * 2}px`;
      jellyfish.style.left = `${Math.random() * 100}%`;
      jellyfish.style.top = `${Math.random() * 100}%`;
      jellyfish.style.filter = `hue-rotate(${Math.random() * 360}deg) drop-shadow(0 0 8px ${effect.color})`;
      jellyfish.style.animation = `jellyfish-float ${12000 + Math.random() * 8000}ms ease-in-out infinite`;

      container.appendChild(jellyfish);
    }
  };

  const createCrystalShardsEffect = (container: HTMLElement, effect: Effect) => {
    const particleCount = Math.floor((effect.particles * effect.intensity) / 100);

    for (let i = 0; i < Math.min(particleCount, 30); i++) {
      const shard = document.createElement("div");
      shard.innerHTML = "💎";
      shard.className = "absolute";
      shard.style.fontSize = `${effect.size * 2}px`;
      shard.style.left = `${Math.random() * 100}%`;
      shard.style.top = `${Math.random() * 100}%`;
      shard.style.filter = `hue-rotate(${Math.random() * 360}deg) drop-shadow(0 0 6px ${effect.color})`;
      shard.style.animation = `crystal-shard-float ${6000 + Math.random() * 4000}ms ease-in-out infinite`;

      container.appendChild(shard);
    }
  };

  const createSpiritOrbsEffect = (container: HTMLElement, effect: Effect) => {
    const particleCount = Math.floor((effect.particles * effect.intensity) / 100);

    for (let i = 0; i < Math.min(particleCount, 20); i++) {
      const orb = document.createElement("div");
      orb.className = "absolute rounded-full";
      orb.style.width = `${effect.size * 2}px`;
      orb.style.height = `${effect.size * 2}px`;
      orb.style.left = `${Math.random() * 100}%`;
      orb.style.top = `${Math.random() * 100}%`;
      orb.style.background = `radial-gradient(circle, ${effect.color} 0%, transparent 70%)`;
      orb.style.boxShadow = `0 0 ${effect.size * 4}px ${effect.color}`;
      orb.style.animation = `spirit-orb-pulse ${3000 + Math.random() * 2000}ms ease-in-out infinite`;

      container.appendChild(orb);
    }
  };

  const createMoonbeamsEffect = (container: HTMLElement, effect: Effect) => {
    for (let i = 0; i < 6; i++) {
      const beam = document.createElement("div");
      beam.className = "absolute";
      beam.style.width = "8px";
      beam.style.height = "100%";
      beam.style.left = `${15 + i * 15}%`;
      beam.style.top = "0";
      beam.style.background = `linear-gradient(180deg, ${effect.color}${Math.floor(effect.opacity * 255).toString(16)} 0%, transparent 100%)`;
      beam.style.filter = "blur(2px)";
      beam.style.animation = `moonbeam-filter ${8000 + i * 1000}ms ease-in-out infinite`;
      beam.style.animationDelay = `${i * 500}ms`;

      container.appendChild(beam);
    }
  };

  const createTornadoEffect = (container: HTMLElement, effect: Effect) => {
    const timers: (NodeJS.Timeout | number)[] = [];
    (container as HTMLDivElement & { timers?: (NodeJS.Timeout | number)[] }).timers = timers;

    const createDebris = () => {
      const debris = document.createElement("div");
      debris.innerHTML = ["🍃", "🌾", "💨"][Math.floor(Math.random() * 3)];
      debris.className = "absolute";
      debris.style.fontSize = `${effect.size * 2}px`;
      debris.style.left = "50%";
      debris.style.bottom = "0";
      debris.style.animation = `tornado-spiral ${3000 / effect.speed}ms ease-out forwards`;

      const radius = Math.random() * 200 + 50;
      const angle = Math.random() * 360;
      debris.style.setProperty("--radius", `${radius}px`);
      debris.style.setProperty("--angle", `${angle}deg`);

      container.appendChild(debris);
      const timer = setTimeout(() => debris.remove(), 3000 / effect.speed);
      timers.push(timer);
    };

    const particleCount = Math.floor((effect.particles * effect.intensity) / 100);
    for (let i = 0; i < Math.min(particleCount, 80); i++) {
      const timer = setTimeout(() => createDebris(), Math.random() * 1000);
      timers.push(timer);
    }

    const interval = setInterval(createDebris, Math.max(100, 300 - effect.intensity * 2));
    timers.push(interval);

    (container as HTMLDivElement & { cleanup?: () => void }).cleanup = () => {
      timers.forEach((timer) => {
        clearTimeout(timer);
        clearInterval(timer as NodeJS.Timeout);
      });
    };
  };

  const createVolcanicAshEffect = (container: HTMLElement, effect: Effect) => {
    const timers: (NodeJS.Timeout | number)[] = [];
    (container as HTMLDivElement & { timers?: (NodeJS.Timeout | number)[] }).timers = timers;
    const particleCount = Math.floor((effect.particles * effect.intensity) / 100);

    const createAshParticle = () => {
      const ash = document.createElement("div");
      ash.className = "absolute";
      const size = effect.size + Math.random() * effect.size;
      ash.style.width = `${size}px`;
      ash.style.height = `${size}px`;
      ash.style.left = `${Math.random() * 100}%`;
      ash.style.top = "-30px";
      ash.style.background = `radial-gradient(circle, ${effect.color} 0%, #A9A9A9 50%, transparent 100%)`;
      ash.style.borderRadius = "50%";
      ash.style.opacity = (effect.opacity * (0.6 + Math.random() * 0.4)).toString();
      ash.style.filter = "blur(1px)";

      const windDrift = (Math.random() - 0.5) * 200;
      const fallSpeed = 3000 + Math.random() * 2000;
      ash.style.setProperty("--wind-drift", `${windDrift}px`);
      ash.style.animation = `volcanic-ash-fall ${fallSpeed}ms linear forwards`;

      container.appendChild(ash);
      const timer = setTimeout(() => ash.remove(), fallSpeed);
      timers.push(timer);
    };

    for (let i = 0; i < Math.min(particleCount, 120); i++) {
      const timer = setTimeout(() => createAshParticle(), Math.random() * 3000);
      timers.push(timer);
    }

    const interval = setInterval(createAshParticle, Math.max(80, 200 - effect.intensity));
    timers.push(interval);

    (container as HTMLDivElement & { cleanup?: () => void }).cleanup = () => {
      timers.forEach((timer) => {
        clearTimeout(timer);
        clearInterval(timer as NodeJS.Timeout);
      });
    };
  };

  const createMeteorShowerEffect = (container: HTMLElement, effect: Effect) => {
    const timers: (NodeJS.Timeout | number)[] = [];
    (container as HTMLDivElement & { timers?: (NodeJS.Timeout | number)[] }).timers = timers;

    const createMeteor = () => {
      const meteor = document.createElement("div");
      meteor.className = "absolute";
      const size = effect.size + Math.random() * effect.size;
      meteor.style.width = `${size}px`;
      meteor.style.height = `${size}px`;
      meteor.style.left = `${Math.random() * 100}%`;
      meteor.style.top = `${Math.random() * 30}%`;
      meteor.style.background = `radial-gradient(circle, ${effect.color} 0%, #FF8C00 50%, transparent 100%)`;
      meteor.style.borderRadius = "50%";
      meteor.style.boxShadow = `0 0 ${size * 2}px ${effect.color}, 0 0 ${size * 4}px #FF8C00, 0 0 ${size * 6}px #FF4500`;

      const trail = document.createElement("div");
      trail.className = "absolute";
      trail.style.width = `${size * 20}px`;
      trail.style.height = `${size / 2}px`;
      trail.style.right = "0";
      trail.style.top = "50%";
      trail.style.transform = "translateY(-50%)";
      trail.style.background = `linear-gradient(90deg, transparent 0%, ${effect.color}80 30%, ${effect.color} 100%)`;
      trail.style.borderRadius = "50%";
      trail.style.filter = "blur(1px)";
      meteor.appendChild(trail);

      meteor.style.animation = "meteor-streak 4s linear forwards";
      container.appendChild(meteor);
      const timer = setTimeout(() => meteor.remove(), 4000);
      timers.push(timer);
    };

    const interval = setInterval(createMeteor, Math.max(1000, 3000 - effect.intensity * 20));
    timers.push(interval);

    (container as HTMLDivElement & { cleanup?: () => void }).cleanup = () => {
      timers.forEach((timer) => {
        clearTimeout(timer);
        clearInterval(timer as NodeJS.Timeout);
      });
    };
  };

  const createSandstormEffect = (container: HTMLElement, effect: Effect) => {
    const timers: (NodeJS.Timeout | number)[] = [];
    (container as HTMLDivElement & { timers?: (NodeJS.Timeout | number)[] }).timers = timers;
    const particleCount = Math.floor((effect.particles * effect.intensity) / 100);

    const createSandParticle = () => {
      const sand = document.createElement("div");
      sand.className = "absolute";
      const size = effect.size + Math.random() * effect.size;
      sand.style.width = `${size}px`;
      sand.style.height = `${size}px`;
      sand.style.left = "100%";
      sand.style.top = `${Math.random() * 100}%`;
      sand.style.background = `radial-gradient(circle, ${effect.color} 0%, #F4A460 50%, transparent 100%)`;
      sand.style.borderRadius = "50%";
      sand.style.opacity = (effect.opacity * (0.5 + Math.random() * 0.5)).toString();
      sand.style.filter = "blur(0.5px)";

      const speed = effect.speed + Math.random() * effect.speed;
      sand.style.animation = `sandstorm-particle ${3000 / speed}ms linear forwards`;

      container.appendChild(sand);
      const timer = setTimeout(() => sand.remove(), 3000 / speed);
      timers.push(timer);
    };

    for (let i = 0; i < Math.min(particleCount, 150); i++) {
      const timer = setTimeout(() => createSandParticle(), Math.random() * 2000);
      timers.push(timer);
    }

    const interval = setInterval(createSandParticle, Math.max(50, 150 - effect.intensity));
    timers.push(interval);

    (container as HTMLDivElement & { cleanup?: () => void }).cleanup = () => {
      timers.forEach((timer) => {
        clearTimeout(timer);
        clearInterval(timer as NodeJS.Timeout);
      });
    };
  };

  const createBioluminescentPlanktonEffect = (container: HTMLElement, effect: Effect) => {
    const particleCount = Math.floor((effect.particles * effect.intensity) / 100);

    for (let i = 0; i < Math.min(particleCount, 100); i++) {
      const plankton = document.createElement("div");
      plankton.className = "absolute rounded-full";
      plankton.style.width = `${effect.size}px`;
      plankton.style.height = `${effect.size}px`;
      plankton.style.left = `${Math.random() * 100}%`;
      plankton.style.top = `${Math.random() * 100}%`;
      plankton.style.background = `radial-gradient(circle, ${effect.color} 0%, transparent 70%)`;
      plankton.style.boxShadow = `0 0 ${effect.size * 4}px ${effect.color}`;
      plankton.style.animation = `bioluminescent-pulse ${2 + Math.random() * 3}s ease-in-out infinite`;
      plankton.style.animationDelay = `${Math.random() * 2}s`;

      container.appendChild(plankton);
    }
  };

  const createForestSpiritsEffect = (container: HTMLElement, effect: Effect) => {
    const particleCount = Math.floor((effect.particles * effect.intensity) / 100);

    for (let i = 0; i < Math.min(particleCount, 15); i++) {
      const spirit = document.createElement("div");
      spirit.innerHTML = "✨";
      spirit.className = "absolute";
      spirit.style.fontSize = `${effect.size * 2}px`;
      spirit.style.left = `${Math.random() * 100}%`;
      spirit.style.top = `${Math.random() * 100}%`;
      spirit.style.color = effect.color;
      spirit.style.filter = `drop-shadow(0 0 ${effect.size}px ${effect.color})`;
      spirit.style.animation = `forest-spirit-dance ${8 + Math.random() * 4}s ease-in-out infinite`;
      spirit.style.animationDelay = `${Math.random() * 3}s`;

      container.appendChild(spirit);
    }
  };

  const createDragonBreathEffect = (container: HTMLElement, effect: Effect) => {
    const timers: (NodeJS.Timeout | number)[] = [];
    (container as HTMLDivElement & { timers?: (NodeJS.Timeout | number)[] }).timers = timers;

    const createBreathParticle = () => {
      const particle = document.createElement("div");
      particle.className = "absolute";
      const size = effect.size + Math.random() * effect.size;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = "10%";
      particle.style.top = "50%";
      particle.style.background = `radial-gradient(circle, ${effect.color} 0%, #FF8C00 30%, transparent 70%)`;
      particle.style.borderRadius = "50%";
      particle.style.opacity = effect.opacity.toString();
      particle.style.filter = "blur(1px)";

      const angle = (Math.random() - 0.5) * 60;
      const distance = 200 + Math.random() * 300;
      const duration = 2000 + Math.random() * 1000;

      particle.style.setProperty("--angle", `${angle}deg`);
      particle.style.setProperty("--distance", `${distance}px`);
      particle.style.animation = `dragon-breath-particle ${duration}ms ease-out forwards`;

      container.appendChild(particle);
      const timer = setTimeout(() => particle.remove(), duration);
      timers.push(timer);
    };

    const particleCount = Math.floor((effect.particles * effect.intensity) / 100);
    for (let i = 0; i < Math.min(particleCount, 80); i++) {
      const timer = setTimeout(() => createBreathParticle(), Math.random() * 1000);
      timers.push(timer);
    }

    const interval = setInterval(createBreathParticle, Math.max(50, 150 - effect.intensity));
    timers.push(interval);

    (container as HTMLDivElement & { cleanup?: () => void }).cleanup = () => {
      timers.forEach((timer) => {
        clearTimeout(timer);
        clearInterval(timer as NodeJS.Timeout);
      });
    };
  };

  const createFogEffect = (container: HTMLElement, effect: Effect) => {
    for (let i = 0; i < 8; i++) {
      const fog = document.createElement("div");
      fog.className = "absolute";
      fog.style.width = `${effect.size * 3}px`;
      fog.style.height = `${effect.size}px`;
      fog.style.left = "-300px";
      fog.style.top = `${Math.random() * 100}%`;
      fog.style.background = `radial-gradient(ellipse, ${effect.color}${Math.floor(effect.opacity * 255).toString(16)}, transparent)`;
      fog.style.borderRadius = "50%";
      fog.style.filter = "blur(3px)";
      fog.style.animation = `fog-drift ${12000 / effect.speed}ms linear infinite`;
      fog.style.animationDelay = `${i * 1500}ms`;

      container.appendChild(fog);
    }
  };


  return (
    <>
      <style>{`
        @keyframes rain-fall {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0.8;
          }
          100% {
            transform: translateY(100vh) translateX(var(--wind-offset));
            opacity: 0.9;
          }
        }

        @keyframes splash-particle {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 0.8;
          }
          100% {
            transform: translate(var(--splash-x), var(--splash-y)) scale(0.2);
            opacity: 0;
          }
        }

        @keyframes snowflake-fall {
          0% {
            transform: translateY(0) translateX(0) rotate(0deg);
            opacity: 0.9;
          }
          100% {
            transform: translateY(100vh) translateX(var(--drift))
              rotate(var(--rotation));
            opacity: 1;
          }
        }

        @keyframes lightning-branch {
          0% {
            opacity: 0;
            transform: scaleY(0);
          }
          20% {
            opacity: 1;
            transform: scaleY(1);
          }
          40% {
            opacity: 0.8;
            transform: scaleY(1);
          }
          60% {
            opacity: 1;
            transform: scaleY(1);
          }
          80% {
            opacity: 0.6;
            transform: scaleY(1);
          }
          100% {
            opacity: 0;
            transform: scaleY(1);
          }
        }

        @keyframes lightning-flash {
          0% {
            opacity: 0;
          }
          15% {
            opacity: 0.9;
          }
          30% {
            opacity: 0.4;
          }
          45% {
            opacity: 0.8;
          }
          60% {
            opacity: 0.3;
          }
          75% {
            opacity: 0.7;
          }
          100% {
            opacity: 0;
          }
        }

        @keyframes firefly-glow {
          0%,
          100% {
            opacity: 0.4;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1.3);
          }
        }

        @keyframes butterfly-dance {
          0%,
          100% {
            transform: translate(0, 0) rotate(0deg);
          }
          25% {
            transform: translate(30px, -15px) rotate(8deg);
          }
          50% {
            transform: translate(-20px, -30px) rotate(-5deg);
          }
          75% {
            transform: translate(15px, -8px) rotate(3deg);
          }
        }

        @keyframes autumn-leaf-fall {
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

        @keyframes seed-float {
          0% {
            transform: translateY(0) translateX(0) rotate(0deg);
            opacity: 0.7;
          }
          25% {
            transform: translateY(-25vh) translateX(calc(var(--drift) * 0.3))
              rotate(90deg);
            opacity: 0.8;
          }
          50% {
            transform: translateY(-50vh) translateX(calc(var(--drift) * 0.7))
              rotate(180deg);
            opacity: 0.9;
          }
          75% {
            transform: translateY(-75vh) translateX(var(--drift)) rotate(270deg);
            opacity: 0.6;
          }
          100% {
            transform: translateY(-100vh) translateX(var(--drift))
              rotate(var(--rotation));
            opacity: 0;
          }
        }

        @keyframes star-twinkle {
          0%,
          100% {
            opacity: 0.4;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1.4);
          }
        }

        @keyframes shooting-star {
          0% {
            transform: translate(0, 0) rotate(45deg);
            opacity: 1;
          }
          100% {
            transform: translate(-300px, 300px) rotate(45deg);
            opacity: 0;
          }
        }

        @keyframes sparkle-appear {
          0% {
            opacity: 0;
            transform: scale(0) rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: scale(1.5) rotate(180deg);
          }
          100% {
            opacity: 0;
            transform: scale(0) rotate(360deg);
          }
        }

        @keyframes rainbow-drop-fall {
          0% {
            transform: translateY(0) scale(1);
            opacity: 1;
            filter: hue-rotate(0deg);
          }
          50% {
            transform: translateY(50vh) scale(1.2);
            opacity: 0.8;
            filter: hue-rotate(180deg);
          }
          100% {
            transform: translateY(100vh) scale(0.8);
            opacity: 0;
            filter: hue-rotate(360deg);
          }
        }

        @keyframes wind-gust {
          0% {
            transform: translateX(-80px);
            opacity: 0;
          }
          50% {
            opacity: 0.9;
          }
          100% {
            transform: translateX(calc(100vw + 80px));
            opacity: 0;
          }
        }

        @keyframes mist-rise {
          0% {
            transform: translateY(0) scale(0.8);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-40vh) scale(1.4);
            opacity: 0.6;
          }
          100% {
            transform: translateY(-80vh) scale(2);
            opacity: 0;
          }
        }

        @keyframes aurora-dance {
          0%,
          100% {
            transform: skewX(0deg) translateX(0) scaleY(1);
            opacity: 0.4;
          }
          25% {
            transform: skewX(8deg) translateX(30px) scaleY(1.2);
            opacity: 0.7;
          }
          50% {
            transform: skewX(-5deg) translateX(-20px) scaleY(0.8);
            opacity: 0.9;
          }
          75% {
            transform: skewX(3deg) translateX(15px) scaleY(1.1);
            opacity: 0.6;
          }
        }

        @keyframes ember-rise {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0.9;
          }
          50% {
            transform: translateY(-60vh) scale(1.3);
            opacity: 1;
          }
          100% {
            transform: translateY(-120vh) scale(0.4);
            opacity: 0;
          }
        }

        @keyframes phoenix-feather-float {
          0%,
          100% {
            transform: translate(0, 0) rotate(0deg);
          }
          25% {
            transform: translate(40px, -20px) rotate(10deg);
          }
          50% {
            transform: translate(-30px, -40px) rotate(-8deg);
          }
          75% {
            transform: translate(20px, -15px) rotate(5deg);
          }
        }

        @keyframes bubble-rise {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0.8;
          }
          50% {
            transform: translateY(-50vh) scale(1.2);
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) scale(1.5);
            opacity: 0;
          }
        }

        @keyframes jellyfish-float {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(50px, -30px) scale(1.1);
          }
          50% {
            transform: translate(-40px, -60px) scale(0.9);
          }
          75% {
            transform: translate(30px, -20px) scale(1.05);
          }
        }

        @keyframes crystal-shard-float {
          0%,
          100% {
            transform: translate(0, 0) rotate(0deg);
            opacity: 0.8;
          }
          25% {
            transform: translate(25px, -15px) rotate(90deg);
            opacity: 1;
          }
          50% {
            transform: translate(-20px, -30px) rotate(180deg);
            opacity: 0.9;
          }
          75% {
            transform: translate(15px, -10px) rotate(270deg);
            opacity: 0.95;
          }
        }

        @keyframes spirit-orb-pulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.6;
          }
          50% {
            transform: scale(1.3);
            opacity: 1;
          }
        }

        @keyframes moonbeam-filter {
          0%,
          100% {
            opacity: 0.3;
            transform: scaleY(1);
          }
          50% {
            opacity: 0.7;
            transform: scaleY(1.2);
          }
        }

        @keyframes tornado-spiral {
          0% {
            transform: translate(-50%, 0) rotate(0deg) translateX(var(--radius))
              rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -100vh) rotate(720deg)
              translateX(calc(var(--radius) * 0.3)) rotate(-720deg);
            opacity: 0;
          }
        }

        @keyframes volcanic-ash-fall {
          0% {
            transform: translateY(0) translateX(0) rotate(0deg);
            opacity: 0.8;
          }
          25% {
            transform: translateY(25vh)
              translateX(calc(var(--wind-drift) * 0.3)) rotate(90deg);
            opacity: 0.9;
          }
          50% {
            transform: translateY(50vh)
              translateX(calc(var(--wind-drift) * 0.7)) rotate(180deg);
            opacity: 0.8;
          }
          75% {
            transform: translateY(75vh) translateX(var(--wind-drift))
              rotate(270deg);
            opacity: 0.7;
          }
          100% {
            transform: translateY(100vh) translateX(var(--wind-drift))
              rotate(360deg);
            opacity: 0;
          }
        }

        @keyframes meteor-streak {
          0% {
            transform: translate(0, 0) rotate(45deg);
            opacity: 1;
            filter: brightness(2) blur(0px);
          }
          20% {
            opacity: 1;
            filter: brightness(1.8) blur(0.5px);
          }
          80% {
            opacity: 0.8;
            filter: brightness(1.2) blur(1px);
          }
          100% {
            transform: translate(-400px, 400px) rotate(45deg);
            opacity: 0;
            filter: brightness(0.5) blur(2px);
          }
        }

        @keyframes sandstorm-particle {
          0% {
            transform: translateX(0) translateY(0) rotate(0deg);
            opacity: 0.8;
            filter: blur(0.5px);
          }
          25% {
            transform: translateX(-25vw) translateY(-20px) rotate(90deg);
            opacity: 0.9;
            filter: blur(1px);
          }
          50% {
            transform: translateX(-50vw) translateY(10px) rotate(180deg);
            opacity: 0.8;
            filter: blur(1.5px);
          }
          75% {
            transform: translateX(-75vw) translateY(-10px) rotate(270deg);
            opacity: 0.7;
            filter: blur(2px);
          }
          100% {
            transform: translateX(-100vw) translateY(0) rotate(360deg);
            opacity: 0;
            filter: blur(2.5px);
          }
        }

        @keyframes bioluminescent-pulse {
          0%,
          100% {
            opacity: 0.4;
            transform: scale(0.8);
            filter: brightness(1) blur(0px);
          }
          25% {
            opacity: 0.8;
            transform: scale(1.2);
            filter: brightness(1.5) blur(1px);
          }
          50% {
            opacity: 1;
            transform: scale(1.5);
            filter: brightness(2) blur(2px);
          }
          75% {
            opacity: 0.9;
            transform: scale(1.3);
            filter: brightness(1.8) blur(1.5px);
          }
        }

        @keyframes forest-spirit-dance {
          0%,
          100% {
            transform: translate(0, 0) rotate(0deg) scale(1);
            opacity: 0.7;
          }
          25% {
            transform: translate(50px, -30px) rotate(90deg) scale(1.2);
            opacity: 1;
          }
          50% {
            transform: translate(-40px, -60px) rotate(180deg) scale(0.9);
            opacity: 0.8;
          }
          75% {
            transform: translate(30px, -20px) rotate(270deg) scale(1.1);
            opacity: 0.9;
          }
        }

        @keyframes dragon-breath-particle {
          0% {
            transform: translate(0, 0) rotate(0deg) scale(1);
            opacity: 1;
            filter: brightness(2) blur(0px);
          }
          25% {
            transform: translate(
                calc(cos(var(--angle)) * var(--distance) * 0.3),
                calc(sin(var(--angle)) * var(--distance) * 0.3)
              )
              rotate(90deg) scale(1.3);
            opacity: 0.9;
            filter: brightness(1.8) blur(1px);
          }
          50% {
            transform: translate(
                calc(cos(var(--angle)) * var(--distance) * 0.7),
                calc(sin(var(--angle)) * var(--distance) * 0.7)
              )
              rotate(180deg) scale(1.1);
            opacity: 0.7;
            filter: brightness(1.5) blur(2px);
          }
          75% {
            transform: translate(
                calc(cos(var(--angle)) * var(--distance) * 0.9),
                calc(sin(var(--angle)) * var(--distance) * 0.9)
              )
              rotate(270deg) scale(0.8);
            opacity: 0.4;
            filter: brightness(1.2) blur(3px);
          }
          100% {
            transform: translate(
                calc(cos(var(--angle)) * var(--distance)),
                calc(sin(var(--angle)) * var(--distance))
              )
              rotate(360deg) scale(0.3);
            opacity: 0;
            filter: brightness(0.8) blur(4px);
          }
        }

        @keyframes fog-drift {
          0% {
            transform: translateX(-300px);
            opacity: 0.3;
          }
          50% {
            opacity: 0.7;
          }
          100% {
            transform: translateX(calc(100vw + 300px));
            opacity: 0.3;
          }
        }
      `}</style>
    </>
  );
}
