"use client";

import { useRef, useState, useEffect } from "react";
import { PiFlowerLotusDuotone } from "react-icons/pi";

interface MusicPlayerProps {
  title: string;
  artist: string;
  cover: string;
  previewUrl: string; // YouTube video ID
  onSearch: (q: string) => void;
}

export default function MusicPlayer({
  title,
  artist,
  cover,
  previewUrl,
  onSearch,
}: MusicPlayerProps) {
  const [relaxMode, setRelaxMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [randomHeights, setRandomHeights] = useState<number[]>([]);

  useEffect(() => {
    const heights = Array.from(
      { length: 24 },
      () => 10 + Math.floor(Math.random() * 40)
    );
    setRandomHeights(heights);
  }, [previewUrl]);

  return (
    <div className="w-[420px] p-5 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl text-white relative overflow-hidden">
      {/* Top Controls: Search input + Relax Mode toggle */}
      <div className="flex items-center justify-center gap-3 mb-4">
        <input
          onChange={(e) => {
            setSearchQuery(e.target.value);
            onSearch(e.target.value);
          }}
          value={searchQuery}
          type="text"
          placeholder="Search for a song..."
          className="flex-grow min-w-0 px-4 py-2 rounded-xl bg-white/10 border border-white/20 placeholder:text-white/50 text-white focus:outline-none focus:ring-2 focus:ring-white/30 transition"
        />
        <button
          onClick={() => setRelaxMode(!relaxMode)}
          className="text-white px-4 py-1 rounded-full bg-white/10 hover:bg-white/20 transition border border-white/30 flex items-center gap-2 text-sm whitespace-nowrap"
        >
          <PiFlowerLotusDuotone className="text-xl" />
          {relaxMode ? "Relax Mode : OFF" : "Relax Mode : ON"}
        </button>
      </div>

      {/* YouTube iframe for relax mode */}
      {previewUrl && (
        <iframe
          width="100%"
          height="200"
          style={{
            display: relaxMode ? "block" : "none",
            marginTop: "12px",
            borderRadius: "20px",
          }}
          src={`https://www.youtube.com/embed/${previewUrl}?autoplay=1&controls=1&mute=0&modestbranding=1`}
          title="YouTube video player"
          frameBorder="0"
          allow="autoplay"
          allowFullScreen
        ></iframe>
      )}

      {/* Normal Mode View */}
      {!relaxMode && (
        <div className="flex flex-col items-center">
          {/* Info Row */}
          <div className="flex w-full gap-3 items-center">
            <img
              src={cover || "/default_cover.png"}
              alt="cover"
              className="w-20 h-20 rounded-xl object-cover shadow-lg"
            />
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="relative w-full h-[24px] overflow-hidden">
                <div
                  className="animated-title-container"
                  style={{
                    animationPlayState:
                      title.length > 28 ? "running" : "paused",
                    animationDuration: `${Math.min(title.length / 5, 12)}s`,
                  }}
                >
                  <span className="animated-text">{title}</span>
                </div>
              </div>
              <p className="text-sm mt-1 animated-text truncate">{artist}</p>
            </div>
          </div>

          {/* Frequency Bars */}
          {previewUrl && (
            <div className="flex justify-center items-end gap-[4px] w-full mt-6 h-12 px-2">
              {randomHeights.map((height, i) => (
                <div
                  key={i}
                  className=" rounded-sm glowing-bar"
                  style={{
                    height: `${height}px`,
                    animationDelay: `${i * 0.05}s`,
                    width: "3px",
                  }}
                ></div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Styles */}
      <style jsx>{`
        .animated-text {
          background: linear-gradient(
            -45deg,
            #ff6ec4,
            #7873f5,
            #5ee7df,
            #b490ca
          );
          background-size: 400% 400%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradientText 6s ease infinite;
          font-weight: bold;
        }

        @keyframes gradientText {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .animated-title-container {
          display: inline-block;
          white-space: nowrap;
          animation-name: scrollLeftThenReturn;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }

        @keyframes scrollLeftThenReturn {
          0%,
          10% {
            transform: translateX(0%);
          }
          45%,
          55% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0%);
          }
        }

        .glowing-bar {
          background: linear-gradient(to top, #ff80bf, #8ec5fc);
          box-shadow: 0 0 6px rgba(255, 200, 255, 0.6),
            0 0 12px rgba(100, 150, 255, 0.4);
          box-sizing: border-box;
          animation: pulseGlow 1.5s ease-in-out infinite;
        }

        @keyframes pulseGlow {
          0%,
          100% {
            transform: scaleY(1);
            opacity: 0.8;
          }
          50% {
            transform: scaleY(1.6);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
