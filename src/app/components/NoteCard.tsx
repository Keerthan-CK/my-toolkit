"use client";

import React from "react";
import { Note } from "@/app/hooks/UseNotes";
import { motion } from "framer-motion";
import clsx from "clsx";

type Props = {
  note: Note;
  onOpen: (id: string) => void;
  onDelete: (id: string) => void;
  onPreviewUpdate?: (id: string) => void;
  className?: string;
};

export default function NoteCard({
  note,
  onOpen,
  onDelete,
  onPreviewUpdate,
  className,
}: Props) {
  const title =
    note.title ||
    note.content.replace(/<[^>]+>/g, "").slice(0, 40) ||
    "Untitled";

  const preview = note.content.replace(/<[^>]+>/g, "").slice(0, 160);

  const formattedDate = note.updated_at
    ? new Date(note.updated_at).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "No date";

  const handleOpen = () => {
    onOpen(note.id);
    if (onPreviewUpdate) onPreviewUpdate(note.id);
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className={clsx(
        "rounded-xl bg-white/5 border border-white/10 backdrop-blur-md p-4 shadow-lg hover:scale-[1.01] transition-transform cursor-pointer",
        className
      )}
      onClick={handleOpen}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold text-white/90 line-clamp-1">
          {title}
        </h3>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(note.id);
          }}
          className="text-xs text-red-300 hover:text-red-400 p-1 rounded focus:outline-none focus:ring-2 focus:ring-red-400/50 transition"
          aria-label="Delete note"
          title="Delete note"
        >
          ✕
        </button>
      </div>

      <p className="mt-3 text-xs text-white/70 line-clamp-4">{preview}</p>

      <div className="mt-3 flex items-center justify-between text-[11px] text-white/60">
        <span>{formattedDate}</span>
      </div>
    </motion.article>
  );
}
