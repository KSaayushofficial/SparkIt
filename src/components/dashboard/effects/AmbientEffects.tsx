"use client";

import { useEffect } from "react";

export default function AmbientEffects() {
  useEffect(() => {
    // Create ambient effects container
    const effectsContainer = document.createElement("div");
    effectsContainer.id = "ambient-effects-container";
    effectsContainer.className = "fixed inset-0 pointer-events-none z-20";
    document.body.appendChild(effectsContainer);

    return () => {
      // Cleanup on unmount
      const container = document.getElementById("ambient-effects-container");
      if (container) {
        container.remove();
      }
    };
  }, []);

  return null;
}
