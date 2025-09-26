/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { marked } from "marked";
import admin from "@/lib/firebaseAdmin";

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
    const { noteid } = req.query;

    if (!noteid || Array.isArray(noteid)) {
      return res.status(400).json({ success: false, error: "Invalid note ID" });
    }

    const idToken = req.headers.authorization?.split("Bearer ")[1];

    if (!idToken) {
      return res
        .status(401)
        .json({ success: false, error: "Missing auth token" });
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    const filePath = path.join(
      process.cwd(),
      "markdown-files",
      uid,
      `${noteid}.md`
    );

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, error: "Note not found" });
    }

    const markdown = fs.readFileSync(filePath, "utf-8");

    const lines = markdown.split("\n");
    const firstLine = lines[0].replace(/^#\s*/, "").trim() || "Untitled";

    const contentWithoutTitle = lines.slice(1).join("\n").trim();

    const titleHtml = marked.parse(firstLine);
    const contentHtml = marked.parse(contentWithoutTitle);

    const createdAt = new Date(Number(noteid)).toISOString();

    return res.status(200).json({
      success: true,
      note: {
        id: Number(noteid),
        title: titleHtml,
        html: contentHtml,
        createdAt,
      },
    });
  } catch (err: any) {
    console.error("Error fetching note:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
