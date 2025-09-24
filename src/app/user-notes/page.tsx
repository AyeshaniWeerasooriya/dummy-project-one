"use client";

import React from "react";
import { Calendar } from "lucide-react";

export default function NotePage() {
  const note = {
    title: "<h1>My First Note</h1>",
    content: `<p>This is the <strong>content</strong> of the note.</p>
              <p>You can add <em>styles</em> too.</p>`,
    createdAt: "2025-09-24T10:15:00Z",
  };

  return (
    <div className="flex justify-center bg-gray-100 min-h-screen py-10">
      <div className="w-full max-w-4xl bg-white rounded-md shadow-xl p-8 flex flex-col gap-6 border border-gray-200">
        <h1
          className="text-3xl md:text-4xl font-bold mb-6 text-black tracking-tight"
          dangerouslySetInnerHTML={{ __html: note.title }}
        />

        <div
          className="prose prose-lg md:prose-xl text-black mb-6 max-w-none"
          dangerouslySetInnerHTML={{ __html: note.content }}
        />

        <div className="flex items-center gap-2 text-indigo-700 text-sm border-t pt-3">
          <Calendar size={16} />
          <span>Created at: {new Date(note.createdAt).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
