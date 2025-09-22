"use client";

import Tiptap from "../components/tipTap";
import { Button } from "../components/ui/button";

export default function TextEditorPage() {
  const handleSubmit = () => {};

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-6 md:p-12 flex flex-col gap-6">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center">
          Write Your Notes
        </h2>

        <div className="border border-gray-300 rounded-lg p-4 shadow-sm bg-white">
          <Tiptap />
        </div>

        <div className="flex justify-center">
          <Button
            variant="outline"
            className="bg-blue-950 text-white text-lg font-semibold px-10 py-4 rounded-lg hover:bg-blue-800 transition-colors"
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}
