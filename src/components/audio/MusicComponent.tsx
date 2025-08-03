"use client";

import { useState, useCallback } from "react";
import MusicPlayer from "./MusicPlayer";
import { debounce } from "lodash";

interface Track {
  id: string;
  title: string;
  channel: string;
  thumbnail: string;
}

export default function MusicComponent() {
  const [query, setQuery] = useState("");
  const [tracks, setTracks] = useState<Track[]>([]);
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Actual API call function
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

  // Debounced version of search
  const debouncedSearch = useCallback(
    debounce((term: string) => {
      searchTracks(term);
    }, 300),
    []
  );

  // Input handler passed to MusicPlayer
  const handleSearchInput = (term: string) => {
    setQuery(term);
    debouncedSearch(term);
  };

  const handleSelectTrack = (track: Track) => {
    setSelectedTrack(track);
    setShowModal(false);
  };

  return (
    <>
      {/* Music Player */}
      <div className="flex items-end justify-center min-h-screen p-4 relative">
        <MusicPlayer
          title={selectedTrack?.title || "Search and Select a Song"}
          artist={selectedTrack?.channel || ""}
          cover={selectedTrack?.thumbnail || ""}
          previewUrl={selectedTrack?.id || ""}
          onSearch={handleSearchInput}
        />
      </div>

      {/* Track Modal */}
      {showModal && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 w-[360px] max-h-[300px] overflow-hidden rounded-2xl bg-white/10 backdrop-blur-lg border border-white/30 shadow-2xl text-white transition-all duration-300 animate-fade-in">
          <div className="p-3 border-b border-white/20 text-center relative">
            <h2 className="text-lg font-bold">Select a Song</h2>
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-3 text-xl font-bold text-white hover:text-pink-400 transition"
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
                    <img
                      src={track.thumbnail}
                      alt={track.title}
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
