/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Calendar, Pencil, Trash2 } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { auth } from "@/lib/firebase";
import { Button } from "@/app/components/ui/button";

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export default function NotePage() {
  const params = useParams();
  const noteid = typeof params?.noteid === "string" ? params.noteid : "";
  const router = useRouter();

  const { user } = useAuth();

  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          throw new Error("User not authenticated");
        }

        const idToken = await user.getIdToken();

        const res = await fetch(`/api/note/${noteid}`, {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.error || "Failed to fetch note");
        }
        console.log(data, "===============data ");
        setNote(data.note);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [user, noteid]);

  const handleEdit = () => {
    if (!note) return;
    router.push(`/user-notes?edit=${note.id}`);
  };

  const handleDelete = async () => {
    if (!note) return;

    if (!confirm("Are you sure you want to delete this note?")) return;

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");

      const idToken = await user.getIdToken();

      const res = await fetch("/api/deleteNotes", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ noteId: note.id }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to delete note");
      }

      router.push("/user-notes");
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">Loading note...</div>
    );
  }

  if (error || !note) {
    return (
      <div className="p-10 text-center text-red-600">
        Error: {error || "Note not found"}
      </div>
    );
  }

  return (
    <div className="flex justify-center bg-gray-100 min-h-screen py-10">
      <article className="relative w-full max-w-4xl bg-white rounded-md shadow-xl p-12 flex flex-col gap-6 border border-gray-200">
        <div className="absolute top-12 right-12 flex space-x-2">
          <Button
            onClick={handleEdit}
            className="p-1 rounded hover:bg-gray-200 bg-indigo-100 hover:cursor-pointer"
            title="Edit"
          >
            <Pencil size={16} className="text-gray-600" />
          </Button>

          <Button
            onClick={handleDelete}
            className="p-1 rounded hover:bg-gray-200 bg-indigo-100 hover:cursor-pointer"
            title="Delete"
          >
            <Trash2 size={16} className="text-gray-600" />
          </Button>
        </div>

        <h1
          className="text-2xl md:text-3xl font-bold text-black tracking-tight"
          dangerouslySetInnerHTML={{ __html: note.title }}
        />
        <div className="flex items-center gap-2 text-indigo-700 text-xs border-b pb-7 border-indigo-100 italic">
          <Calendar size={16} />
          <span>Created at: {new Date(note.createdAt).toLocaleString()}</span>
        </div>
        <section
          className="prose prose-lg md:prose-xl text-black mb-6 max-w-none text-justify"
          dangerouslySetInnerHTML={{ __html: note.content }}
        />
      </article>
    </div>
  );
}
