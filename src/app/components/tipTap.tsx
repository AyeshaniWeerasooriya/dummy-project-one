/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Heading1,
  Heading2,
  Italic,
  List,
  ListOrdered,
  Strikethrough,
} from "lucide-react";

const Tiptap = ({
  onChangeTitle,
  onChangeContent,
}: {
  onChangeTitle?: (content: string) => void;
  onChangeContent?: (content: string) => void;
}) => {
  const titleEditor = useEditor({
    extensions: [StarterKit],
    content: "<p></p>",
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      if (onChangeTitle) onChangeTitle(editor.getHTML());
    },
  });

  const contentEditor = useEditor({
    extensions: [StarterKit],
    content: "<p></p>",
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      if (onChangeContent) onChangeContent(editor.getHTML());
    },
  });

  if (!titleEditor || !contentEditor) return null;

  const buttonClass = (active: boolean) =>
    `flex items-center justify-center w-10 h-10 rounded-md transition-colors duration-200
     ${
       active
         ? "bg-blue-600 text-white"
         : "bg-gray-100 text-gray-600 hover:bg-gray-200"
     }`;

  const renderToolbar = (editor: any) => (
    <div className="mb-3 flex flex-wrap gap-2 justify-center">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={buttonClass(editor.isActive("bold"))}
        title="Bold"
      >
        <Bold />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={buttonClass(editor.isActive("italic"))}
        title="Italic"
      >
        <Italic />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={buttonClass(editor.isActive("strike"))}
        title="Strikethrough"
      >
        <Strikethrough />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={buttonClass(editor.isActive("heading", { level: 1 }))}
        title="Heading 1"
      >
        <Heading1 />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={buttonClass(editor.isActive("heading", { level: 2 }))}
        title="Heading 2"
      >
        <Heading2 />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={buttonClass(editor.isActive("bulletList"))}
        title="Bullet List"
      >
        <List />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={buttonClass(editor.isActive("orderedList"))}
        title="Numbered List"
      >
        <ListOrdered />
      </button>
    </div>
  );

  return (
    <div className="border border-gray-300 rounded-xl p-4 shadow-md bg-white flex flex-col gap-4">
      <div>
        <h4 className="font-semibold mb-2">Title</h4>
        {renderToolbar(titleEditor)}
        <EditorContent
          editor={titleEditor}
          required
          className="min-h-[50px] p-2 border border-gray-200 rounded-md focus-within:ring-2 focus-within:ring-blue-400 focus:outline-none prose prose-sm sm:prose md:prose-md"
        />
      </div>

      <div>
        <h4 className="font-semibold mb-2">Content</h4>
        {renderToolbar(contentEditor)}
        <EditorContent
          editor={contentEditor}
          required
          className="min-h-[250px] max-h-[400px] overflow-y-auto p-3 border border-gray-200 rounded-md focus-within:ring-2 focus-within:ring-blue-400 focus:outline-none prose prose-sm sm:prose md:prose-md"
        />
      </div>
    </div>
  );
};

export default Tiptap;
