/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import {
  LogOut,
  Search,
  BookOpen,
  PlusCircle,
  UserCircle,
  ClipboardList,
  Pencil,
  Trash2,
  Menu,
  X,
} from "lucide-react";
import { Button } from "../components/ui/button";
import NoteEditor from "../components/userNote";

interface Note {
  id?: string;
  title: string;
  content: string;
}

export default function TextEditorPage() {
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [resetEditors, setResetEditors] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState("my-notes");
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  const handleEdit = (noteId: string | undefined) => {
    const note = notes.find((n) => n.id === noteId);
    if (!note) return;
    const lines = note.content.split("\n");
    const contentWithoutTitle = lines.slice(1).join("\n").trim();
    const formattedNote: Note = {
      id: note.id,
      title: note.title,
      content: contentWithoutTitle,
    };
    setEditingNote(formattedNote);
    setActiveNavItem("new-note");
    setSidebarOpen(false);
  };

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) return;

      const idToken = await user.getIdToken();
      const res = await fetch("/api/getNotes", {
        headers: { Authorization: `Bearer ${idToken}` },
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
          headers: { Authorization: `Bearer ${idToken}` },
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

  const handleNewNote = () => {
    setEditingNote(null);
    setResetEditors(true);
    setTimeout(() => setResetEditors(false), 100);
    setActiveNavItem("new-note");
    setSidebarOpen(false);
  };

  const handleSubmit = async (note: Note) => {
    if (!note?.content.trim()) return alert("Please write something first!");
    const user = auth.currentUser;
    if (!user) return alert("User not logged in");

    try {
      const idToken = await user.getIdToken();
      const endpoint = note.id ? "/api/updateNotes" : "/api/saveNotes";
      const method = note.id ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify(note),
      });

      const data = await res.json();
      if (data.success) {
        await fetchNotes();
        alert(
          note.id ? "Note updated successfully" : "Note saved successfully"
        );

        setEditingNote(null);
        setResetEditors(true);
        setTimeout(() => setResetEditors(false), 100);
        setActiveNavItem("my-notes");
      } else {
        alert("Error: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save note.");
    }
  };

  const handleDelete = async (noteId: string | undefined) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      const user = auth.currentUser;
      if (!user) return alert("User not logged in");

      const idToken = await user.getIdToken();

      const res = await fetch("/api/deleteNotes", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ noteId }),
      });

      const data = await res.json();
      if (data.success) {
        alert("Note deleted successfully");
        fetchNotes();
      } else {
        alert("Error: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete note");
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
    router.push("/");
  };

  return (
    <div className="flex h-screen bg-gray-50 relative">
      <button
        className="absolute top-4 left-4 z-50 md:hidden bg-white p-2 rounded-lg shadow-md hover:bg-gray-400"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? (
          <X size={24} className="text-indigo-800" />
        ) : (
          <Menu size={24} className="text-indigo-800" />
        )}
      </button>

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white p-6 flex flex-col border-r border-gray-200 shadow-sm transform transition-transform duration-300 md:relative md:translate-x-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100">
          <BookOpen size={28} className="text-indigo-600" />
          <h1 className="text-2xl font-bold text-gray-900">StudyFlow</h1>
        </div>

        <nav className="flex-1 space-y-2">
          <Button
            variant="ghost"
            className={`w-full justify-start text-lg font-medium py-3 px-4 rounded-lg transition-colors duration-200 ${
              activeNavItem === "my-notes"
                ? "bg-indigo-100 text-indigo-700 hover:bg-indigo-200 font-semibold"
                : "text-gray-700 hover:bg-gray-100 font-semibold "
            }`}
            onClick={() => {
              setActiveNavItem("my-notes");
              setSidebarOpen(false);
            }}
          >
            <ClipboardList size={20} className="mr-3" />
            My Notes
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start text-lg font-medium py-3 px-4 rounded-lg transition-colors duration-200 ${
              activeNavItem === "new-note"
                ? "bg-indigo-100 text-indigo-700 hover:bg-indigo-200 font-semibold"
                : "text-gray-700 hover:bg-gray-100 font-semibold"
            }`}
            onClick={handleNewNote}
          >
            <PlusCircle size={20} className="mr-3" />
            New Note
          </Button>
        </nav>

        <div className="mt-4 flex flex-col gap-2">
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-700 hover:bg-gray-100 py-3 px-4 rounded-lg transition-colors duration-200"
          >
            <UserCircle size={20} className="mr-3" />
            Account
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:bg-red-50 py-3 px-4 rounded-lg transition-colors duration-200"
            onClick={handleLogout}
          >
            <LogOut size={20} className="mr-3" />
            Logout
          </Button>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-indigo-900 bg-opacity-40 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="flex-1 flex flex-col overflow-auto px-8 pt-5 md:ml-0">
        <div className="flex-1 flex justify-center items-start">
          <div className="w-full max-w-4xl rounded-2xl flex flex-col p-8">
            {activeNavItem === "my-notes" && (
              <>
                <h2 className="text-4xl font-bold text-gray-800 mb-12">
                  My Notes
                </h2>

                <div className="relative w-full mb-8">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Search className="text-gray-400" size={20} />
                  </div>
                  <input
                    type="text"
                    placeholder="Search your notes..."
                    value={searchQuery}
                    onChange={async (e) => {
                      const q = e.target.value;
                      setSearchQuery(q);
                      await handleSearch(q);
                    }}
                    className="w-full pl-10 pr-3 p-3 rounded-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700 shadow-sm bg-gray-50"
                  />
                </div>

                {loading ? (
                  <p className="text-gray-500">Loading notes...</p>
                ) : notes.length === 0 ? (
                  <p className="text-gray-500">
                    No notes found. Create a new one!
                  </p>
                ) : (
                  <div className="max-h-[580px] overflow-y-auto pr-2">
                    <ul className="space-y-4">
                      {notes.map((note) => (
                        <li
                          key={note.id}
                          className="relative p-4 bg-white rounded-lg hover:bg-gray-200 transition cursor-pointer border border-gray-100 shadow-lg"
                          onClick={() => router.push(`/user-notes/${note.id}`)}
                        >
                          <h3
                            className="text-xl font-bold text-indigo-900"
                            dangerouslySetInnerHTML={{
                              __html: note.title || "Untitled",
                            }}
                          />

                          <p className="text-sm text-black truncate pt-2">
                            Click to view full note
                          </p>

                          <div className="absolute top-4 right-4 flex space-x-2">
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(note.id);
                              }}
                              className="p-1 rounded hover:bg-white bg-indigo-100 hover:cursor-pointer"
                              title="Edit"
                            >
                              <Pencil size={16} className="text-gray-600" />
                            </Button>

                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(note.id);
                              }}
                              className="p-1 rounded hover:bg-white bg-indigo-100 hover:cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 size={16} className="text-gray-600" />
                            </Button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}

            {activeNavItem === "new-note" && (
              <NoteEditor
                existingNote={editingNote as Note | undefined}
                onSave={handleSubmit}
                onCancel={() => {
                  setEditingNote(null);
                  setActiveNavItem("my-notes");
                }}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
