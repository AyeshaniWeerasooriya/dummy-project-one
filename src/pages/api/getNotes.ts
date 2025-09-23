/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

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
    const { uid } = req.query;
    if (!uid) {
      return res.status(400).json({ success: false, error: "Missing user ID" });
    }

    const notesRef = collection(db, "notes");
    const q = query(notesRef, where("uid", "==", uid));

    const snapshot = await getDocs(q);
    const notes = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.status(200).json({ success: true, notes });
  } catch (err: any) {
    console.error("Error fetching notes:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
