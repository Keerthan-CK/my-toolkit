"use client";

import React from "react";
import { Note } from "@/app/hooks/UseNotes";
import { motion } from "framer-motion";

type Props = {
  note: Note;
  onOpen: (id: string) => void;
  onDelete: (id: string) => void;
  onPreviewUpdate?: (id: string) => void;
  className?: string;
};

export default function NoteCard({ note, onOpen, onDelete }: Props) {
  // derive title or first line
  const title =
    note.title ||
    note.content.replace(/<[^>]+>/g, "").slice(0, 40) ||
    "Untitled";
  const preview = note.content.replace(/<[^>]+>/g, "").slice(0, 160);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl bg-white/3 border border-white/8 backdrop-blur-md p-4 shadow-lg hover:scale-[1.01] transition transform"
      onClick={() => onOpen(note.id)}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold text-white/90">{title}</h3>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(note.id);
          }}
          className="text-xs text-red-300 hover:text-red-400 p-1 rounded"
          aria-label="Delete note"
          title="Delete note"
        >
          ✕
        </button>
      </div>
      <p className="mt-3 text-xs text-white/70">{preview}</p>
      <div className="mt-3 flex items-center justify-between text-[11px] text-white/60">
        <span>{new Date(note.updated_at).toLocaleString()}</span>
      </div>
    </motion.article>
  );
}
