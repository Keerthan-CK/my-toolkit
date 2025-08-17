"use client";

import { useState, useCallback } from "react";
import { useNotes } from "@/app/hooks/UseNotes";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";

export default function NukeNotes() {
  const { notes, deleteNote } = useNotes();
  const [confirming, setConfirming] = useState(false);

  const handleDeleteAll = useCallback(async () => {
    if (notes.length === 0) return;

    if (!confirming) {
      setConfirming(true);
      
      setTimeout(() => setConfirming(false), 3000);
      return;
    }

    
    await Promise.all(notes.map((n) => deleteNote(n.id)));
    setConfirming(false);
  }, [notes, deleteNote, confirming]);

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleDeleteAll}
      className={`flex items-center gap-2 rounded-lg px-3 py-2 font-semibold shadow-md transition
        ${confirming
          ? "bg-red-700 text-white hover:bg-red-800"
          : "bg-red-600/80 text-white hover:bg-red-700"}
      `}
    >
      <Trash2 className="w-4 h-4" />
      {confirming ? "Click again to confirm" : `Nuke All (${notes.length})`}
    </motion.button>
  );
}
