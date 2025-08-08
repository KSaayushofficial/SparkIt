"use client";

import { usePathname } from "next/navigation";
import MusicComponent from "./audio/MusicComponent";

export default function PersistentAudioPlayer() {
  const pathname = usePathname();

  const showUI = pathname === "/home"; 

  return <MusicComponent showUI={showUI} />;
}
