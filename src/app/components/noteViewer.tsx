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
  const contentWithoutTitle = markdown.split("\n").slice(1).join("\n").trim();
  const htmlContent = marked(contentWithoutTitle);
  const editor = useEditor({
    extensions: [StarterKit],
    content: htmlContent,
    editable: false,
    immediatelyRender: false,
  });

  if (!editor) return null;

  return (
    <div className="">
      <EditorContent editor={editor} />
      <p className="text-xs text-blue-500 mt-3">
        {createdAt
          ? new Date(
              typeof createdAt === "string"
                ? createdAt
                : createdAt.seconds * 1000
            ).toLocaleString()
          : ""}
      </p>
    </div>
  );
}
