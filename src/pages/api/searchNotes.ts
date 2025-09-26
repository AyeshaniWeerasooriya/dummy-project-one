/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { marked } from "marked";
import { getAuth } from "firebase-admin/auth";
import { initializeApp, getApps, cert } from "firebase-admin/app";

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
  if (req.method !== "GET") {
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

    const { q } = req.query;

    const dir = path.join(process.cwd(), "markdown-files", uid);
    const metaPath = path.join(dir, "notes.json");

    if (!fs.existsSync(metaPath)) {
      return res.status(200).json({ success: true, notes: [] });
    }

    const raw = fs.readFileSync(metaPath, "utf-8");
    const notes = JSON.parse(raw);

    let results = notes;
    if (q) {
      const query = String(q).toLowerCase();
      results = notes.filter((note: any) =>
        note.title.toLowerCase().includes(query)
      );
    }

    results = results.map((note: any) => ({
      ...note,
      title: marked.parse(note.title),
    }));

    return res.status(200).json({ success: true, notes: results });
  } catch (err: any) {
    console.error("Error searching notes:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
