"use client";

import Image from "next/image";

interface Track {
  id: string;
  title: string;
  channel: string;
  thumbnail: string;
}

interface SongListModalProps {
  tracks: Track[];
  onClose: () => void;
  onSelect: (track: Track) => void;
}

export default function SongListModal({
  tracks,
  onClose,
  onSelect,
}: SongListModalProps) {
  return (
    <div
      className="fixed inset-0 bg-black/90 backdrop-blur-md flex justify-center items-center z-50 transition-opacity duration-300"
      style={{ opacity: 1 }}
    >
      <div className="bg-black/90 rounded-xl w-[90vw] max-w-md max-h-[80vh] p-4 overflow-hidden shadow-lg">
        <button
          onClick={onClose}
          className="text-white text-2xl mb-4 float-right hover:text-red-500 transition"
          aria-label="Close modal"
        >
          ✕
        </button>

        <h2 className="text-white text-2xl mb-6 font-semibold">
          Select a Song
        </h2>

        {tracks.length === 0 ? (
          <p className="text-gray-400">No songs found.</p>
        ) : (
          <ul className="space-y-4 overflow-y-auto max-h-[60vh] pr-2 scrollbar-none">
            {tracks.map((track) => (
              <li
                key={track.id}
                className="flex items-center gap-4 p-2 rounded-lg bg-white/10 hover:bg-pink-600/40 cursor-pointer transition-colors duration-300"
                onClick={() => {
                  onSelect(track);
                  onClose();
                }}
              >
                <Image
                  src={track.thumbnail}
                  alt={track.title}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-md object-cover"
                  unoptimized // Remove if you configure i.ytimg.com in next.config.js
                />
                <div className="flex-1 text-left text-white">
                  <p className="font-semibold truncate">{track.title}</p>
                  <p className="text-gray-300 text-sm truncate">
                    {track.channel}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
