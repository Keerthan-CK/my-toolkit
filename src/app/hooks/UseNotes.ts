import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { v4 as uuidv4 } from "uuid";


export type Note = {
  id: string;
  title?: string;
  content: string; 
  created_at: string; 
  updated_at: string; 
  order?: number;
};

type NoteRow = {
  id: string;
  title?: string | null;
  content?: string | null;
  created_at: string;
  updated_at: string;
  order?: number | null;
};

const LS_KEY = "notes.hybrid.v1";


export default function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const pushQueueRef = useRef<Record<string, Note>>({});
  const debouncedTimer = useRef<number | null>(null);

  
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const parsed: Note[] = JSON.parse(raw);
        setNotes(parsed.sort((a,b) => (a.order ?? 0) - (b.order ?? 0)));
      }
    } catch (e) {
      console.error("Failed to parse local notes", e);
    }


    (async () => {
      try {
        const { data, error } = await supabase.from("notes").select("*");
        if (error) throw error;
        if (data && data.length) {
          
          const cloudNotes = data.map((r: NoteRow) => ({
            id: r.id,
            title: r.title ?? "",
            content: r.content ?? "",
            created_at: r.created_at,
            updated_at: r.updated_at,
            order: r.order ?? 0,
          })) as Note[];


          
          setNotes(prev => {
            const map = new Map(prev.map(n => [n.id, n]));
            for (const c of cloudNotes) {
              const local = map.get(c.id);
              if (!local) map.set(c.id, c);
              else if (new Date(c.updated_at) > new Date(local.updated_at)) map.set(c.id, c);
            }
            const merged = Array.from(map.values()).sort((a,b)=> (a.order ?? 0) - (b.order ?? 0));
            localStorage.setItem(LS_KEY, JSON.stringify(merged));
            return merged;
          });
        }
      } catch (err) {
        console.warn("Supabase fetch failed (ok offline)", err);
      }
    })();
  }, []);


  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(notes));
    } catch (e) {
      console.error("Failed to save notes locally", e);
    }
  }, [notes]);

  
  function schedulePush() {
    if (debouncedTimer.current) window.clearTimeout(debouncedTimer.current);
    debouncedTimer.current = window.setTimeout(async () => {
      const queue = { ...pushQueueRef.current };
      pushQueueRef.current = {};
      const entries = Object.values(queue);
     
      try {
        await supabase.from("notes").upsert(entries);
      } catch (e) {
        console.warn("Failed push notes", e);
        
        for (const n of entries) pushQueueRef.current[n.id] = n;
      }
    }, 800);
  }

  function createNote(opts?: Partial<Note>) {
    const now = new Date().toISOString();
    const id = uuidv4();
    const note: Note = {
      id,
      title: opts?.title ?? "",
      content: opts?.content ?? "<p></p>",
      created_at: now,
      updated_at: now,
      order: notes.length > 0 ? Math.max(...notes.map(n => n.order ?? 0)) + 1 : 0,
    };
    const next = [note, ...notes];
    setNotes(next);
    pushQueueRef.current[note.id] = note;
    schedulePush();
    return note;
  }

  function updateNote(id: string, patch: Partial<Note>) {
    setNotes(prev => {
      const next = prev.map(n => (n.id === id ? { ...n, ...patch, updated_at: new Date().toISOString() } : n));
      
      const updated = next.find(n => n.id === id);
      if (updated) pushQueueRef.current[id] = updated;
      schedulePush();
      return next;
    });
  }

  function deleteNote(id: string) {
    setNotes(prev => prev.filter(n => n.id !== id));
    
    (async () => {
      try {
        await supabase.from("notes").delete().eq("id", id);
      } catch (e) {
        console.warn("Failed to delete note from cloud", e);
      }
    })();
  }

  function reorderNotes(nextOrder: Note[]) {
   
    const reord = nextOrder.map((n, idx) => ({ ...n, order: idx }));
    setNotes(reord);
    for (const n of reord) pushQueueRef.current[n.id] = n;
    schedulePush();
  }

  return {
    notes,
    createNote,
    updateNote,
    deleteNote,
    reorderNotes,
  };
}
