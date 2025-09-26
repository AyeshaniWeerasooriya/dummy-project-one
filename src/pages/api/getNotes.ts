/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { marked } from "marked";
import admin from "@/lib/firebaseAdmin"; // use your initialized Firebase Admin

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
    const decoded = await admin.auth().verifyIdToken(idToken);
    const uid = decoded.uid;

    const dir = path.join(process.cwd(), "markdown-files", uid);
    let notes: any[] = [];

    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir).filter((file) => file.endsWith(".md"));

      notes = files.map((file) => {
        const markdown = fs.readFileSync(path.join(dir, file), "utf-8");

        const lines = markdown.split("\n");
        const firstLine = lines[0].replace(/^#\s*/, "");
        const titleMarkdown = firstLine.trim() || "Untitled";

        const titleHtml = marked.parse(titleMarkdown);
        const contentHtml = marked.parse(markdown);

        const timestamp = Number(path.basename(file, ".md"));
        const createdAt = !isNaN(timestamp)
          ? new Date(timestamp).toISOString()
          : null;

        return {
          id: timestamp,
          title: titleHtml,
          html: contentHtml,
          createdAt,
        };
      });
    }

    return res.status(200).json({ success: true, notes });
  } catch (err: any) {
    console.error("Error fetching notes:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
