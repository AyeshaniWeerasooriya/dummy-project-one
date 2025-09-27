/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Tiptap from "../components/tipTap";
import { Button } from "../components/ui/button";
import { auth } from "@/lib/firebase";
import { LogOut, Menu, Search, X } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "../components/ui/drawer";
import { DialogTitle } from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export default function TextEditorPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [resetEditors, setResetEditors] = useState(false);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) return;

      const idToken = await user.getIdToken();
      const res = await fetch("/api/getNotes", {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      const data = await res.json();
      if (data.success) setNotes(data.notes);
      else console.error("Error fetching notes:", data.error);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    try {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) return;

      const idToken = await user.getIdToken();
      const res = await fetch(
        `/api/searchNotes?q=${encodeURIComponent(query)}`,
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
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

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push("/");
      } else {
        fetchNotes();
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleSubmit = async () => {
    if (!content.trim()) return alert("Please write something first!");
    const user = auth.currentUser;
    if (!user) return alert("User not logged in");

    try {
      const idToken = await user.getIdToken();
      const res = await fetch("/api/saveNotes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ title, html: content }),
      });

      const data = await res.json();
      if (data.success) {
        await fetchNotes();
        alert("Note saved successfully");

        setTitle("");
        setContent("");
        setResetEditors(true);
        setTimeout(() => setResetEditors(false), 100);
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
    router.push("/");
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 relative z-10 mt-5">
        <Drawer direction="left">
          <DrawerTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-2 font-bold bg-indigo-100 text-indigo-700 hover:bg-indigo-200 shadow-sm"
            >
              <Menu size={18} />
              Notes
            </Button>
          </DrawerTrigger>

          <DrawerContent
            dir="left"
            className="bg-gradient-to-b from-indigo-50 to-white p-6 h-screen w-80 shadow-2xl flex flex-col pt-10"
          >
            <DialogTitle>
              <span className="sr-only">Notes Drawer</span>
            </DialogTitle>

            <div className="absolute top-4 right-6 z-20">
              <DrawerClose asChild>
                <Button
                  variant="outline"
                  className="bg-gray-200 text-gray-400 hover:bg-indigo-300 hover:text-white p-2 rounded-full"
                >
                  <X size={16} />
                </Button>
              </DrawerClose>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-gray-900 border-b pb-2 ">
                📚 Your Study Notes
              </h3>
              <div className="relative w-full mt-3">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Search className="text-gray-400" size={20} />
                </div>
                <input
                  type="text"
                  placeholder="Search notes by title..."
                  value={searchQuery}
                  onChange={async (e) => {
                    const q = e.target.value;
                    setSearchQuery(q);
                    await handleSearch(q);
                  }}
                  className="w-full pl-10 pr-3 p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400 text-gray-700 shadow-sm"
                />
              </div>
            </div>

            <div className="mt-4 flex-1 overflow-y-auto">
              {loading ? (
                <p className="text-gray-500 text-center mt-6">
                  Loading notes...
                </p>
              ) : notes.length === 0 ? (
                <p className="text-gray-400 text-center mt-6">
                  No notes yet. Start learning and take notes!
                </p>
              ) : (
                <ul className="space-y-3">
                  {notes.map((note) => (
                    <li
                      key={note.id}
                      className="cursor-pointer p-3 rounded-md border border-gray-200 bg-white hover:shadow-md hover:border-indigo-400 hover:bg-indigo-50 transition-all"
                      onClick={() => router.push("/user-notes/" + note.id)}
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
          </DrawerContent>
        </Drawer>

        <h2 className="text-3xl font-bold text-indigo-700 tracking-tight absolute left-1/2 transform -translate-x-1/2">
          📖 Create Your Study Notes
        </h2>

        <div className="absolute right-6">
          <Button
            variant="outline"
            className="bg-gray-300 text-black font-bold px-4 py-2 rounded-md hover:bg-white hover:text-indigo-600 hover:border-indigo-600 flex items-center gap-2 shadow-sm"
            onClick={handleLogout}
          >
            <LogOut size={16} />
            Logout
          </Button>
        </div>
      </div>

      <div
        className="flex-1 p-6"
        style={{ marginLeft: "120px", marginRight: "140px" }}
      >
        <div className="bg-white rounded-3xl shadow-xl flex flex-col flex-1 p-8 h-full">
          <div className="overflow-y-auto flex-1">
            <input
              type="text"
              placeholder="Type your title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mb-5 p-3 border border-indigo-500 rounded-md "
            />
            <Tiptap onChangeContent={setContent} reset={resetEditors} />
          </div>

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
      </div>
    </div>
  );
}
