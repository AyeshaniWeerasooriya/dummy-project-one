"use client";

import { useEffect, useState } from "react";
import { Save, X } from "lucide-react";
import { Button } from "../components/ui/button";
import Tiptap from "../components/tipTap";

interface Note {
  id?: string;
  title: string;
  content: string;
}

interface NoteEditorProps {
  existingNote?: Note | undefined;
  onSave: (note: Note) => void;
  onCancel: () => void;
}

export default function NoteEditor({
  existingNote,
  onSave,
  onCancel,
}: NoteEditorProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [resetEditors, setResetEditors] = useState(false);

  useEffect(() => {
    if (existingNote) {
      console.log(existingNote, "------------------");
      setTitle(existingNote.title);
      setContent(existingNote.content);
    } else {
      setTitle("");
      setContent("");
    }
  }, [existingNote]);

  const handleSubmit = () => {
    if (!title.trim() && !content.trim()) return;

    const note: Note = {
      title: title.trim() || "Untitled Note",
      content,
    };

    if (existingNote?.id) {
      note.id = existingNote.id;
    }

    onSave(note);

    if (!existingNote) {
    }
  };

  return (
    <div className="flex flex-col p-6 bg-white rounded-2xl shadow-lg w-full h-full">
      <input
        type="text"
        placeholder="Untitled Note..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full text-3xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-indigo-100 focus:outline-none focus:border-indigo-400 placeholder:text-gray-400"
      />

      <div className="flex-1 min-h-[300px] mb-8">
        <Tiptap
          onChangeContent={setContent}
          content={existingNote?.content}
          reset={resetEditors}
        />
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <Button
          variant="outline"
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-6 py-3 rounded-lg shadow-sm flex items-center gap-2"
          onClick={onCancel}
        >
          Discard
        </Button>

        <Button
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md flex items-center gap-2 transition-transform duration-200 hover:scale-[1.01]"
          onClick={handleSubmit}
        >
          <Save size={18} />
          {existingNote ? "Update Note" : "Save Note"}
        </Button>
      </div>
    </div>
  );
}
