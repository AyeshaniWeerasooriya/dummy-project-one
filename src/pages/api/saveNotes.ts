/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from "next";
import TurndownService from "turndown";
import fs from "fs";
import path from "path";

const turndown = new TurndownService();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, error: "Method not allowed" });
  }

  try {
    const { title, html, uid } = req.body;
    if (!html || !uid) {
      return res
        .status(400)
        .json({ success: false, error: "Missing content or user ID" });
    }

    const titleMarkdown = title ? turndown.turndown(title) : "Untitled";
    const markdown = turndown.turndown(html);

    const fullContent = `# ${titleMarkdown}\n\n${markdown}`;

    const dir = path.join(process.cwd(), "markdown-files", uid);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const fileName = `${Date.now()}.md`;
    const filePath = path.join(dir, fileName);

    fs.writeFileSync(filePath, fullContent, "utf-8");

    const metaPath = path.join(dir, "notes.json");
    let notesMeta: any[] = [];

    if (fs.existsSync(metaPath)) {
      const raw = fs.readFileSync(metaPath, "utf-8");
      notesMeta = JSON.parse(raw);
    }

    const newNote = {
      id: fileName.replace(".md", ""),
      title: titleMarkdown,
      fileName,
      createdAt: new Date().toISOString(),
    };

    notesMeta.push(newNote);
    fs.writeFileSync(metaPath, JSON.stringify(notesMeta, null, 2), "utf-8");

    return res.status(200).json({ success: true, file: fileName });
  } catch (err: any) {
    console.error("Error saving note:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
