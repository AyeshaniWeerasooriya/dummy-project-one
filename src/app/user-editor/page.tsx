/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Tiptap from "../components/tipTap";
import { Button } from "../components/ui/button";
import { auth } from "@/lib/firebase";
import { LogOut } from "lucide-react";

export default function TextEditorPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = async (uid: string, query: string) => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/searchNotes?uid=${uid}&q=${encodeURIComponent(query)}`
      );
      const data = await res.json();

      if (data.success) setNotes(data.notes);
      else console.error("Error searching notes:", data.error);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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
        body: JSON.stringify({ title, html: content, uid: user.uid }),
      });

      const data = await res.json();
      if (data.success) {
        await fetchNotes(user.uid);
        alert("Note saved successfully");
        setTitle("");
        setContent("");
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
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 bg-white rounded-tr-3xl rounded-br-3xl shadow-xl p-8 flex flex-col gap-6 overflow-y-auto border-r border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-indigo-700 tracking-tight">
            📖 Create Study Notes
          </h2>
        </div>
        <Tiptap onChangeTitle={setTitle} onChangeContent={setContent} />
        <div className="flex justify-center mt-6">
          <Button
            variant="outline"
            className="bg-indigo-600 text-white text-lg font-semibold px-10 py-4 rounded-md shadow-md hover:bg-indigo-700 transition-all"
            onClick={handleSubmit}
          >
            Save Note
          </Button>
        </div>
      </div>
      <div className="w-[40%] bg-gradient-to-b from-indigo-50 to-white rounded-tl-3xl rounded-bl-3xl shadow-xl p-8 flex flex-col gap-6 overflow-y-auto relative">
        <div className="absolute top-6 right-6">
          <Button
            variant="outline"
            className="bg-red-500 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-red-600 transition-colors flex items-center gap-2 shadow-sm"
            onClick={handleLogout}
          >
            <LogOut size={16} />
            Logout
          </Button>
        </div>
        <h3 className="text-2xl font-semibold text-gray-900 border-b pb-2">
          📚 Your Study Notes
        </h3>
        <input
          type="text"
          placeholder="🔍 Search notes by title..."
          value={searchQuery}
          onChange={async (e) => {
            const q = e.target.value;
            setSearchQuery(q);
            const user = auth.currentUser;
            if (user) {
              await handleSearch(user.uid, q);
            }
          }}
          className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400 text-gray-700 shadow-sm"
        />
        {loading ? (
          <p className="text-gray-500 text-center mt-6">Loading notes...</p>
        ) : notes.length === 0 ? (
          <p className="text-gray-400 text-center mt-6">
            No notes yet. Start learning and take notes!
          </p>
        ) : (
          <ul className="space-y-4">
            {notes.map((note) => (
              <li
                key={note.id}
                className="cursor-pointer p-4 rounded-md border border-gray-200 bg-white hover:shadow-md hover:border-indigo-400 hover:bg-indigo-50 transition-all"
                onClick={() => router.replace("./user-notes")}
              >
                <span
                  dangerouslySetInnerHTML={{ __html: note.title }}
                  className="text-lg font-semibold text-gray-800"
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
