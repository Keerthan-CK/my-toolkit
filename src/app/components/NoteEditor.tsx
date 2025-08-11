// "use client";
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

export default function NoteEditor({ content, onChange, autofocus = true }: Props): JSX.Element | null {
  // keeps the exact HTML last produced by the editor instance
  const lastEditorHTML = useRef<string | null>(null);
  // keeps the last HTML we sent to parent via onChange
  const lastSentHTML = useRef<string | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: {} }),
      Image,
      Link.configure({ openOnClick: true }),
    ],
    content,
    autofocus,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      // store exactly what the editor produced
      lastEditorHTML.current = html;

      // only send upstream if different from last-sent (avoid redundant writes)
      if (lastSentHTML.current !== html) {
        onChange(html);
        lastSentHTML.current = html;
      }
    },
  });

  // sync incoming `content` -> editor, but only when it's truly different
  useEffect(() => {
    if (!editor) return;

    const editorHTML = editor.getHTML();

    // If parent gave us exactly what the editor already produced, do nothing.
    if (content === lastEditorHTML.current || content === editorHTML) {
      // keep refs in sync
      lastEditorHTML.current = editorHTML;
      lastSentHTML.current = editorHTML;
      return;
    }

    // Otherwise, update editor silently (emitUpdate: false prevents onUpdate firing)
    editor.commands.setContent(content, { emitUpdate: false });

    // reflect the new content into refs so we won't loop
    lastEditorHTML.current = content;
    lastSentHTML.current = content;
  }, [content, editor]);

  if (!editor) return null;
  return <EditorContent editor={editor} />;
}
