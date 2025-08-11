"use client";

import React, { useCallback, useMemo, useState } from "react";
import useNotes from "@/app/hooks/UseNotes";
import NoteCard from "@/app/components/NoteCard";
import NoteEditor from "@/app/components/NoteEditor";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { arrayMove, SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { motion } from "framer-motion";
import type { DragEndEvent } from "@dnd-kit/core";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faPlus } from "@fortawesome/free-solid-svg-icons";

export default function NotesPage() {
  const { notes, createNote, updateNote, deleteNote, reorderNotes } = useNotes();
  const [openId, setOpenId] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  // Filtered notes
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return notes;
    return notes.filter(
      (n) =>
        (n.title || "").toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q)
    );
  }, [notes, query]);

  const onCreate = useCallback(() => {
    const note = createNote({ content: "<p></p>" });
    setOpenId(note.id);
  }, [createNote]);

  const onOpen = (id: string) => setOpenId(id);

  const onDelete = (id: string) => {
    if (openId === id) setOpenId(null);
    deleteNote(id);
  };

  // Drag handlers
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = filtered.findIndex((n) => n.id === active.id);
    const newIndex = filtered.findIndex((n) => n.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const moved = arrayMove(filtered, oldIndex, newIndex);
    const movedIds = moved.map((n) => n.id);
    const nextOrder = [
      ...moved,
      ...notes.filter((n) => !movedIds.includes(n.id)),
    ];
    reorderNotes(nextOrder);
  };

  const activeNote = notes.find((n) => n.id === openId) ?? null;

  return (
    <div className="min-h-screen px-4 sm:px-6 py-6 bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold flowing-gradient">
          Notes
        </h1>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50">
                <FontAwesomeIcon icon={faSearch} />
              </span>
              <input
                placeholder="Search notes..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full sm:w-64 pl-9 pr-3 py-2 rounded-xl bg-white/10 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-brand-light/40 shadow-inner transition"
              />
            </div>
          </div>
          <button
            onClick={onCreate}
            className="rounded-lg px-3 py-2 bg-gradient-to-r from-brand to-accent text-black font-semibold shadow-md hover:shadow-lg transition"
          >
            New
          </button>
        </div>
      </div>

      {/* Notes grid */}
      <div className="max-w-7xl mx-auto grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={filtered.map((n) => n.id)}
            strategy={rectSortingStrategy}
          >
            {filtered.length === 0 ? (
              <div className="col-span-full py-16 md:py-32 text-center text-white/60 flex flex-col items-center justify-center">
                <div className="w-40 md:w-56 mb-6">
                  <DotLottieReact
                    src="https://lottie.host/0b238d1e-935d-45a8-af14-1899bf52f869/iSfq4aiTxy.lottie"
                    loop
                    autoplay
                  />
                </div>
                <div className="text-lg">No notes yet, create one.</div>
              </div>
            ) : (
              filtered.map((note) => (
                <div key={note.id} data-note-id={note.id}>
                  <NoteCard
                    note={note}
                    onOpen={onOpen}
                    onDelete={onDelete}
                    className="overflow-hidden break-words whitespace-normal"
                  />
                </div>
              ))
            )}
          </SortableContext>
        </DndContext>
      </div>

      {/* Editor modal */}
      {activeNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpenId(null)}
          />
          <motion.div
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            className="relative w-full max-w-3xl rounded-2xl bg-white/6 border border-white/8 shadow-2xl flex flex-col max-h-[90vh]"
          >
            {/* Title */}
            <div className="flex items-center justify-between gap-4 p-4 sm:p-6 border-b border-white/10">
              <input
                value={activeNote.title}
                onChange={(e) =>
                  updateNote(activeNote.id, { title: e.target.value })
                }
                placeholder="Title"
                className="text-lg sm:text-xl font-semibold bg-transparent border-none focus:outline-none text-white w-full break-words"
              />
              <button
                onClick={() => setOpenId(null)}
                className="px-3 py-2 rounded bg-white/10 hover:bg-white/20 transition"
              >
                Close
              </button>
            </div>

            {/* Scrollable editor area */}
            <div className="p-4 sm:p-6 overflow-y-auto">
              <NoteEditor
                content={activeNote.content}
                onChange={(html) =>
                  updateNote(activeNote.id, { content: html })
                }
              />
            </div>
          </motion.div>
        </div>
      )}

      {/* Mobile FAB */}
      <div className="sm:hidden fixed bottom-6 right-6 z-40">
        <button
          onClick={onCreate}
          className="w-14 h-14 rounded-full bg-gradient-to-br from-brand to-accent shadow-2xl flex items-center justify-center text-black text-2xl"
        >
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>
    </div>
  );
}
