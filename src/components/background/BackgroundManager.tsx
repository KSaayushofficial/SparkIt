"use client";

import { useEffect, useState } from "react";

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

  useEffect(() => {
    loadActiveBackground();

    const handleBackgroundChange = () => loadActiveBackground();
    const handleInitialize = () => loadActiveBackground();

    const handleStorageChange = (e: StorageEvent) => {
      if (
        e.key === "dashboard-backgrounds" ||
        e.key === "dashboard-custom-backgrounds"
      ) {
        loadActiveBackground();
      }
    };

    window.addEventListener("backgroundChanged", handleBackgroundChange);
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("initializeBackground", handleInitialize);

    return () => {
      window.removeEventListener("backgroundChanged", handleBackgroundChange);
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("initializeBackground", handleInitialize);
    };
  }, []);

  const loadActiveBackground = async () => {
    setIsLoading(true);

    try {
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

      const activeBackground = allBackgrounds.find((bg) => bg.isActive);

      if (activeBackground && activeBackground.id !== currentBackground?.id) {
        setCurrentBackground(activeBackground);
        await applyBackground(activeBackground);
      } else if (!activeBackground && currentBackground) {
        setCurrentBackground(null);
        clearBackground();
      }
    } catch (error) {
      console.error("Error loading background:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyBackground = async (background: Background) => {
    const container = document.getElementById("global-background-container");
    if (!container) return;

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

    Array.from(container.children).forEach((child) => {
      if ((child as HTMLElement).dataset.backgroundElement) {
        child.remove();
      }
    });
  };

  const applyVideoBackground = async (
    container: HTMLElement,
    background: Background
  ) => {
    return new Promise<void>((resolve, reject) => {
      const video = document.createElement("video");
      video.dataset.backgroundElement = "true";
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

      video.onerror = () => reject(new Error("Failed to load video"));
      video.src = background.url || "/placeholder.svg?height=1080&width=1920";
    });
  };

  const applyImageBackground = async (
    container: HTMLElement,
    background: Background
  ) => {
    return new Promise<void>((resolve, reject) => {
      const img = document.createElement("div");
      img.dataset.backgroundElement = "true";
      img.className =
        "absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000";
      img.style.opacity = (background.opacity / 100).toString();
      img.style.filter = `blur(${background.blur}px)`;
      img.style.backgroundImage = `url(${
        background.url || "/placeholder.svg?height=1080&width=1920"
      })`;

      const preloadImg = new Image();
      preloadImg.onload = () => {
        container.appendChild(img);
        resolve();
      };
      preloadImg.onerror = () => reject(new Error("Failed to load image"));
      preloadImg.src =
        background.url || "/placeholder.svg?height=1080&width=1920";
    });
  };

  const applyInteractiveBackground = async (
    container: HTMLElement,
    background: Background
  ) => {
    const scene = document.createElement("div");
    scene.dataset.backgroundElement = "true";
    scene.className = "absolute inset-0 transition-opacity duration-1000";
    scene.style.opacity = (background.opacity / 100).toString();
    scene.style.filter = `blur(${background.blur}px)`;

    // Simplified interactive background creation
    createDefaultInteractiveBackground(scene, background);
    container.appendChild(scene);
  };

  const applyGeneratedBackground = async (
    container: HTMLElement,
    background: Background
  ) => {
    const gradient = document.createElement("div");
    gradient.dataset.backgroundElement = "true";
    gradient.className = "absolute inset-0 transition-opacity duration-1000";
    gradient.style.background =
      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
    gradient.style.opacity = (background.opacity / 100).toString();
    gradient.style.filter = `blur(${background.blur}px)`;
    container.appendChild(gradient);
  };

  const createDefaultInteractiveBackground = (
    container: HTMLElement,
    background: Background
  ) => {
    container.style.background =
      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";

    for (let i = 0; i < 20; i++) {
      const particle = document.createElement("div");
      particle.dataset.backgroundElement = "true";
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

      <div id="global-background-container" className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-black" />
      </div>

      <style jsx global>{`
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
