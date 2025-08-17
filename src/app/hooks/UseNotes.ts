"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";


const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string | null;
}

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

 
  const fetchNotes = useCallback(async () => {
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching notes:", error);
      return;
    }
    setNotes(data || []);
    setLoading(false);
  }, []);

  
  const createNote = useCallback(
    async ({ title = "", content = "" }: { title?: string; content?: string }) => {
      const newNote: Note = {
        id: uuidv4(),
        title,
        content,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("notes")
        .insert(newNote)
        .select()
        .single();

      if (error) {
        console.error("Error creating note:", error);
        return newNote; 
      }

      setNotes((prev) => [...prev, data]);
      return data;
    },
    []
  );

  
  const updateNote = useCallback(async (id: string, fields: Partial<Note>) => {
    const { data, error } = await supabase
      .from("notes")
      .update({ ...fields, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating note:", error);
      return;
    }

    setNotes((prev) => prev.map((n) => (n.id === id ? data : n)));
  }, []);

  
  const deleteNote = useCallback(async (id: string) => {
    const { error } = await supabase.from("notes").delete().eq("id", id);
    if (error) {
      console.error("Error deleting note:", error);
      return;
    }
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }, []);


  const reorderNotes = useCallback((nextOrder: Note[]) => {
    setNotes(nextOrder);
  }, []);

  useEffect(() => {
    fetchNotes();

    const channel = supabase
      .channel("public:notes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notes" },
        (payload) => {
          console.log("Realtime change:", payload);

          if (payload.eventType === "INSERT") {
            setNotes((prev) => {
              const exists = prev.some((n) => n.id === payload.new.id);
              return exists ? prev : [...prev, payload.new as Note];
            });
          } else if (payload.eventType === "UPDATE") {
            setNotes((prev) =>
              prev.map((n) =>
                n.id === payload.new.id ? (payload.new as Note) : n
              )
            );
          } else if (payload.eventType === "DELETE") {
            setNotes((prev) => prev.filter((n) => n.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchNotes]);

  return {
    notes,
    loading,
    createNote,
    updateNote,
    deleteNote,
    reorderNotes,
  };
}
