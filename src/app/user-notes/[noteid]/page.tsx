/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Calendar } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { auth } from "@/lib/firebase";

interface Note {
  title: string;
  html: string;
  createdAt: string;
}

export default function NotePage() {
  const params = useParams();
  const noteid = typeof params?.noteid === "string" ? params.noteid : "";
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

        setNote(data.note);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [user, noteid]);

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
      <article className="w-full max-w-4xl bg-white rounded-md shadow-xl p-8 flex flex-col gap-6 border border-gray-200">
        <h1
          className="text-xl md:text-2xl font-semibold mb-2 text-black tracking-tight  border-b-1 pb-5"
          dangerouslySetInnerHTML={{ __html: note.title }}
        />
        <section
          className="prose prose-lg md:prose-xl text-black mb-6 max-w-none"
          dangerouslySetInnerHTML={{ __html: note.html }}
        />
        <footer className="flex items-center gap-2 text-indigo-700 text-sm border-t pt-3">
          <Calendar size={16} />
          <span>Created at: {new Date(note.createdAt).toLocaleString()}</span>
        </footer>
      </article>
    </div>
  );
}
