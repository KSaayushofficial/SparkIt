"use client";

import { usePathname } from "next/navigation";
import MusicComponent from "./audio/MusicComponent";

export default function PersistentAudioPlayer() {
  const pathname = usePathname();

  // Only show visual player UI on /home
  const showUI = pathname === "/home";

  return (
    <div className={showUI ? "block" : "hidden"}>
      <MusicComponent />
    </div>
  );
}
