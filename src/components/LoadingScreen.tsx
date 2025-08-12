"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0f0f] via-[#1a1a1a] to-[#0b0b0b]">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 1.2,
          ease: "easeOut",
          repeat: Infinity,
          repeatType: "reverse",
          repeatDelay: 0.5,
        }}
        className="backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl p-10 flex flex-col items-center shadow-lg shadow-purple-700/40"
      >
        <Image
          src="/bluelogo.png"
          alt="SparkIt Logo"
          width={200}
          height={200}
          className="drop-shadow-[0_0_15px_rgba(147,112,219,0.75)]"
        />
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="mt-6 text-white text-3xl font-semibold tracking-wide"
        >
          Spark It
        </motion.h2>
      </motion.div>
    </div>
  );
}
