/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import TurndownService from "turndown";

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
    const { html, uid } = req.body;
    if (!html) {
      return res
        .status(400)
        .json({ success: false, error: "No content provided" });
    }

    const markdown = turndown.turndown(html);

    await addDoc(collection(db, "notes"), {
      uid,
      markdown,
      createdAt: serverTimestamp(),
    });

    return res.status(200).json({ success: true });
  } catch (err: any) {
    console.error("Error saving note:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
