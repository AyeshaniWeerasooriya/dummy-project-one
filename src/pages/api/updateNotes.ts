/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from "next";
import TurndownService from "turndown";
import fs from "fs";
import path from "path";
import { getAuth } from "firebase-admin/auth";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import converter from "@/types/showdown";

const turndown = new TurndownService();

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
  if (req.method !== "PUT") {
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

    const { id, title, content } = req.body;

    if (!id || !content) {
      return res
        .status(400)
        .json({ success: false, error: "Missing id or content" });
    }

    const dir = path.join(process.cwd(), "markdown-files", uid);
    const metaPath = path.join(dir, "notes.json");

    if (!fs.existsSync(metaPath)) {
      return res
        .status(404)
        .json({ success: false, error: "No notes metadata found" });
    }

    const notesMeta = JSON.parse(fs.readFileSync(metaPath, "utf-8"));

    const noteIndex = notesMeta.findIndex((n: any) => n.id === String(id));

    if (noteIndex === -1) {
      return res.status(404).json({ success: false, error: "Note not found" });
    }

    const fileName = notesMeta[noteIndex].fileName;
    const filePath = path.join(dir, fileName);

    const titleMarkdown = title;
    const markdown = turndown.turndown(content);
    const fullContent = `# ${titleMarkdown}\n\n${markdown}`;

    // const titleMarkdown = title;
    // const markdown = converter.makeMarkdown(content);
    // const fullContent = `# ${titleMarkdown}\n\n${markdown}`;

    fs.writeFileSync(filePath, fullContent, "utf-8");

    notesMeta[noteIndex].title = titleMarkdown;
    notesMeta[noteIndex].updatedAt = new Date().toISOString();

    fs.writeFileSync(metaPath, JSON.stringify(notesMeta, null, 2), "utf-8");

    return res.status(200).json({ success: true, file: fileName });
  } catch (err: any) {
    console.error("Error updating note:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
