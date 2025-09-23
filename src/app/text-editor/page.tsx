/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Tiptap from "../components/tipTap";
import NoteViewer from "../components/noteViewer";
import { Button } from "../components/ui/button";
import { auth } from "@/lib/firebase";
import { LogOut } from "lucide-react";

export default function TextEditorPage() {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotes = async (uid: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/getNotes?uid=${uid}`);
      const data = await res.json();
      if (data.success) setNotes(data.notes);
      else console.error("Error fetching notes:", data.error);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.replace("/");
      } else {
        fetchNotes(user.uid);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleSubmit = async () => {
    if (!content.trim()) return alert("Please write something first!");
    const user = auth.currentUser;
    if (!user) return alert("User not logged in");

    try {
      const res = await fetch("/api/saveNotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html: content, uid: user.uid }),
      });

      const data = await res.json();
      if (data.success) {
        setContent("");
        await fetchNotes(user.uid);
        alert("Note saved successfully ✅");
      } else {
        alert("Error: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save note.");
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
    router.replace("/");
  };

  return (
    <div className="flex justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-6 md:p-12 flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center flex-1">
            Write Your Notes
          </h2>
          <Button
            variant="outline"
            className="bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-red-500 transition-colors ml-4"
            onClick={handleLogout}
          >
            <LogOut className="text-white" />
          </Button>
        </div>

        <Tiptap onChange={setContent} />

        <div className="flex justify-center">
          <Button
            variant="outline"
            className="bg-blue-950 text-white text-lg font-semibold px-10 py-4 rounded-lg hover:bg-blue-800 transition-colors"
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Your Saved Notes
          </h3>
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : notes.length === 0 ? (
            <p className="text-gray-500">No notes yet. Start writing!</p>
          ) : (
            <ul className="space-y-4">
              {notes.map((note) => (
                <li key={note.id}>
                  <NoteViewer
                    markdown={note.markdown}
                    createdAt={note.createdAt}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
