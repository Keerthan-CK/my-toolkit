"use client";

import React, { JSX, useEffect, useRef } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";

type Props = {
  content: string;
  onChange: (html: string) => void;
  autofocus?: boolean;
};

export default function NoteEditor({
  content,
  onChange,
  autofocus = true,
}: Props): JSX.Element | null {
  const lastSentHTML = useRef<string | null>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: {} }),
      Image,
      Link.configure({
        openOnClick: true,
        autolink: true,
        linkOnPaste: true,
      }),
    ],
    content,
    autofocus,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();

      // Debounce propagation
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => {
        if (lastSentHTML.current !== html) {
          onChange(html);
          lastSentHTML.current = html;
        }
      }, 500);
    },
  });

  
  useEffect(() => {
    if (!editor) return;

    const current = editor.getHTML().trim();
    if (current !== content.trim()) {
      editor.commands.setContent(content, { emitUpdate: false });
    }
  }, [content, editor]);

  // Ensure debounce cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  // Reliable autofocus
  useEffect(() => {
    if (editor && autofocus) {
      editor.commands.focus("end");
    }
  }, [editor, autofocus]);

  if (!editor) return null;

  return (
    <div className="prose prose-invert max-w-none">
      <EditorContent editor={editor} />
    </div>
  );
}
