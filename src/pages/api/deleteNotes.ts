/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { getAuth } from "firebase-admin/auth";
import { initializeApp, cert, getApps } from "firebase-admin/app";

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE") {
    console.log(req);
    return res
      .status(405)
      .json({ success: false, error: "Method not allowed" });
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    const idToken = authHeader.split("Bearer ")[1];
    const decoded = await getAuth().verifyIdToken(idToken);
    const uid = decoded.uid;

    const { noteId } = req.body;
    console.log(noteId, "================NoteId");
    if (!noteId) {
      return res.status(400).json({ success: false, error: "Missing noteId" });
    }

    const dir = path.join(process.cwd(), "markdown-files", uid);
    const metaPath = path.join(dir, "notes.json");

    console.log(dir, "================dir");
    console.log(metaPath, "================MetaPath");

    if (!fs.existsSync(metaPath)) {
      return res.status(404).json({ success: false, error: "No notes found" });
    }

    const notesMeta: any[] = JSON.parse(fs.readFileSync(metaPath, "utf-8"));
    const noteIndex = notesMeta.findIndex((note) => note.id === String(noteId));

    console.log(notesMeta, "================notesMeta");
    console.log(noteIndex, "================noteIndex");

    if (noteIndex === -1) {
      return res.status(404).json({ success: false, error: "Note not found" });
    }

    const filePath = path.join(dir, notesMeta[noteIndex].fileName);
    console.log(notesMeta[noteIndex].fileName, "================filePath");
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    notesMeta.splice(noteIndex, 1);
    fs.writeFileSync(metaPath, JSON.stringify(notesMeta, null, 2), "utf-8");

    return res.status(200).json({ success: true });
  } catch (err: any) {
    console.error("Error deleting note:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
