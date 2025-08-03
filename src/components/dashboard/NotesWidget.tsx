"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit3, Trash2, Pin } from "lucide-react";
import GlassPanel from "@/components/ui/GlassPanel";
import type { Note } from "./types";

interface NotesWidgetProps {
  notes: Note[];
  setNotes: (notes: Note[]) => void;
}

export default function NotesWidget({ notes, setNotes }: NotesWidgetProps) {
  const [newNote, setNewNote] = useState("");
  const [editingNote, setEditingNote] = useState<string | null>(null);

  const addNote = () => {
    if (newNote.trim()) {
      const note: Note = {
        id: Date.now().toString(),
        title: newNote.slice(0, 30) + (newNote.length > 30 ? "..." : ""),
        content: newNote,
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: [],
        color: "from-purple-500 to-pink-500",
        pinned: false,
      };
      setNotes([...notes, note]);
      setNewNote("");
    }
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  const togglePin = (id: string) => {
    setNotes(
      notes.map((note) =>
        note.id === id ? { ...note, pinned: !note.pinned } : note
      )
    );
  };

  const sortedNotes = [...notes].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  return (
    <GlassPanel className="p-4 w-80 h-96 flex flex-col" glow>
      <div className="flex items-center gap-2 mb-4">
        <Edit3 size={16} className="text-yellow-400" />
        <h3 className="text-sm font-semibold text-white">Quick Notes</h3>
      </div>

      <div className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addNote()}
            placeholder="Quick note..."
            className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 backdrop-blur-sm"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={addNote}
            className="bg-gradient-to-r from-yellow-500 to-orange-500 p-2 rounded-lg text-white hover:shadow-lg transition-all duration-300"
          >
            <Plus size={16} />
          </motion.button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2">
        <AnimatePresence>
          {sortedNotes.map((note) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white/5 border border-white/10 rounded-lg p-3 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
            >
              <div className="flex items-start gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white text-sm font-medium">
                      {note.title}
                    </span>
                    {note.pinned && (
                      <Pin size={12} className="text-yellow-400" />
                    )}
                  </div>
                  <p className="text-white/70 text-xs line-clamp-2">
                    {note.content}
                  </p>
                  <div className="text-white/50 text-xs mt-1">
                    {new Date(note.updatedAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => togglePin(note.id)}
                    className="p-1 rounded hover:bg-white/10 transition-colors"
                  >
                    <Pin
                      size={12}
                      className={
                        note.pinned ? "text-yellow-400" : "text-white/50"
                      }
                    />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => deleteNote(note.id)}
                    className="p-1 rounded hover:bg-red-500/20 text-red-400 transition-colors"
                  >
                    <Trash2 size={12} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </GlassPanel>
  );
}
