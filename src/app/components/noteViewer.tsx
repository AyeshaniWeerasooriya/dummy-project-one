/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { marked } from "marked";

interface NoteViewerProps {
  markdown: string;
  createdAt?: any;
}

export default function NoteViewer({ markdown, createdAt }: NoteViewerProps) {
  const htmlContent = marked(markdown);
  const editor = useEditor({
    extensions: [StarterKit],
    content: htmlContent,
    editable: false,
    immediatelyRender: false,
  });

  if (!editor) return null;

  return (
    <div className="border border-gray-200 rounded-lg p-4 shadow-sm bg-gray-50">
      <EditorContent editor={editor} />
      <p className="text-xs text-gray-500 mt-2">
        {createdAt?.seconds
          ? new Date(createdAt.seconds * 1000).toLocaleString()
          : ""}
      </p>
    </div>
  );
}
