"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface WeatherEffectsProps {
  effect: "none" | "rain" | "snow";
}

export default function WeatherEffects({ effect }: WeatherEffectsProps) {
  const [particles, setParticles] = useState<
    Array<{ id: number; x: number; y: number; delay: number }>
  >([]);

  useEffect(() => {
    if (effect === "none") {
      setParticles([]);
      return;
    }

    const particleCount = effect === "rain" ? 100 : 80;
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2,
    }));

    setParticles(newParticles);
  }, [effect]);

  if (effect === "none") return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className={`absolute ${
            effect === "rain"
              ? "w-0.5 h-8 bg-gradient-to-b from-blue-400 to-transparent"
              : "w-2 h-2 bg-white rounded-full opacity-80"
          }`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: effect === "rain" ? ["0vh", "100vh"] : ["0vh", "100vh"],
            x: effect === "rain" ? [0, -20] : [0, Math.random() * 20 - 10],
            rotate: effect === "snow" ? [0, 360] : 0,
          }}
          transition={{
            duration:
              effect === "rain" ? 1 + Math.random() : 3 + Math.random() * 2,
            repeat: Number.POSITIVE_INFINITY,
            delay: particle.delay,
            ease: "linear",
          }}
        />
      ))}

      {/* Weather overlay effects */}
      {effect === "rain" && (
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 via-transparent to-blue-900/20" />
      )}
      {effect === "snow" && (
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/10 via-transparent to-cyan-900/20" />
      )}
    </div>
  );
}
