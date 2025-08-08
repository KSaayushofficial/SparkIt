"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import Image from "next/image";
import MusicPlayer from "./MusicPlayer";
import { debounce } from "lodash";
import { Minimize2, X, Music } from "lucide-react";

interface Track {
  id: string;
  title: string;
  channel: string;
  thumbnail: string;
}

export default function MusicComponent() {
  const [mounted, setMounted] = useState(false);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const searchTracks = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setTracks([]);
      setShowModal(false);
      return;
    }
    try {
      const res = await fetch(
        `/api/music/search?query=${encodeURIComponent(searchTerm)}`
      );
      const data = await res.json();

      if (res.ok) {
        setTracks(data.tracks || []);
        setShowModal(true);
      } else {
        console.error("Error:", data.error || "Unknown error");
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const debouncedSearch = useMemo(
    () => debounce((term: string) => searchTracks(term), 300),
    []
  );

const handleSearchInput = useCallback(
  (term: string) => {
    if (term.trim().length >= 2 || term.trim().length === 0) {
      debouncedSearch(term);
    }
  },
  [debouncedSearch]
);

  const handleSelectTrack = useCallback((track: Track) => {
    setSelectedTrack(track);
    setShowModal(false);
  }, []);

  const logoSize = 48;

  if (!mounted) return null;

  return (
    <>
      {/* 🎵 Restore Button if Closed */}
      {closed && (
        <button
          onClick={() => setClosed(false)}
          className="fixed bottom-4 right-4 z-50 bg-pink-600 hover:bg-pink-500 text-white p-3 rounded-full shadow-lg transition"
          title="Open Music Player"
        >
          <Music size={20} />
        </button>
      )}

      {/* 🎶 Music Player UI */}
      {!closed && (
        <div
          className={`fixed bottom-4 right-4 z-50 bg-white/10 backdrop-blur-lg border border-white/30 rounded-2xl shadow-lg
            transition-all duration-300 ease-in-out overflow-hidden box-border
            flex flex-col items-center justify-center
            ${
              minimized
                ? `w-${logoSize} h-${logoSize} p-1 cursor-pointer`
                : "w-[450px] p-4 cursor-default"
            }
          `}
          onClick={() => {
            if (minimized) setMinimized(false);
          }}
        >
          {/* Top Controls */}
          {!minimized && (
            <div className="flex justify-end items-center gap-2 mb-2 select-none w-full">
              {selectedTrack && (
                <div className="flex items-center gap-2 truncate max-w-[240px] text-white font-semibold text-sm">
                  <Image
                    src={selectedTrack.thumbnail}
                    alt={selectedTrack.title}
                    width={24}
                    height={24}
                    className="w-6 h-6 rounded-lg object-cover"
                  />
                  <span className="truncate">{selectedTrack.title}</span>
                </div>
              )}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMinimized(true);
                }}
                className="text-white hover:text-pink-400 p-1 rounded"
                aria-label="Minimize music player"
                title="Minimize"
              >
                <Minimize2 size={18} />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setClosed(true);
                }}
                className="text-white hover:text-red-500 p-1 rounded"
                aria-label="Close music player"
                title="Close"
              >
                <X size={18} />
              </button>
            </div>
          )}

          {/* Main Player */}
          <div
            className={`w-full transition-all duration-300 ${
              minimized
                ? "opacity-0 pointer-events-none h-0 overflow-hidden"
                : "opacity-100 h-auto"
            }`}
          >
            <MusicPlayer
              title={selectedTrack?.title || "Search and Select a Song"}
              artist={selectedTrack?.channel || ""}
              cover={selectedTrack?.thumbnail || ""}
              previewUrl={selectedTrack?.id || ""}
              onSearch={handleSearchInput}
            />
          </div>

          {/* Minimized Preview */}
          {minimized && (
            <div className="absolute flex items-center justify-center w-[120px] h-[120px] rounded-full overflow-hidden shadow-lg cursor-pointer select-none">
              {selectedTrack ? (
                <Image
                  src={selectedTrack.thumbnail}
                  alt={selectedTrack.title}
                  width={120}
                  height={120}
                  className="w-full h-full object-cover"
                  draggable={false}
                  title={selectedTrack.title}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white bg-gray-700">
                  <Music size={24} />
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 🔍 Modal for Search Results */}
      {showModal && (
        <div className="fixed bottom-20 right-4 z-50 w-[360px] max-h-[300px] overflow-hidden rounded-2xl bg-white/10 backdrop-blur-lg border border-white/30 shadow-2xl text-white transition-all duration-300 animate-fade-in">
          <div className="p-3 border-b border-white/20 text-center relative">
            <h2 className="text-lg font-bold">Select a Song</h2>
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-3 text-xl font-bold text-white hover:text-pink-400 transition"
              aria-label="Close song selection"
            >
              ×
            </button>
          </div>

          <div className="max-h-[250px] overflow-y-auto px-3 pb-3">
            {tracks.length === 0 ? (
              <p className="text-gray-300 text-sm text-center mt-6">
                No songs found.
              </p>
            ) : (
              <ul className="space-y-2">
                {tracks.map((track) => (
                  <li
                    key={track.id}
                    onClick={() => handleSelectTrack(track)}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/20 transition cursor-pointer"
                  >
                    <Image
                      src={track.thumbnail}
                      alt={track.title}
                      width={40}
                      height={40}
                      className="w-10 h-10 object-cover rounded-lg shadow-sm"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-semibold">
                        {track.title}
                      </p>
                      <p className="truncate text-xs text-gray-300">
                        {track.channel}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </>
  );
}
