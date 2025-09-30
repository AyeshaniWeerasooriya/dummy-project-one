/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { useEffect } from "react";
import {
  Bold,
  Heading1,
  Heading2,
  Italic,
  List,
  ListOrdered,
  Strikethrough,
  Heading3,
  UnderlineIcon,
} from "lucide-react";

const Tiptap = ({
  onChangeContent,
  reset = false,
  content = "<p></p>",
}: {
  onChangeContent?: (content: string) => void;
  reset?: boolean;
  content?: string;
}) => {
  const editorExtensions = [
    StarterKit.configure({
      heading: { levels: [1, 2, 3] },
      bulletList: { keepMarks: true, keepAttributes: false },
      orderedList: { keepMarks: true, keepAttributes: false },
      listItem: {},
    }),
    Underline,
  ];

  const contentEditor = useEditor({
    extensions: editorExtensions,
    content: content || "<p></p>",
    editorProps: {
      attributes: {
        class:
          "ProseMirror w-full min-h-[300px] max-h-[300px] text-lg leading-relaxed focus:outline-none prose prose-indigo prose-headings:font-bold prose-li:list-disc prose-ol:list-decimal sm:prose-lg max-w-none",
      },
    },
    onUpdate: ({ editor }) => {
      if (onChangeContent) onChangeContent(editor.getHTML());
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (reset && contentEditor) {
      contentEditor.commands.setContent("<p></p>");
      if (onChangeContent) onChangeContent("<p></p>");
    }
  }, [reset, contentEditor, onChangeContent]);

  useEffect(() => {
    if (contentEditor && content) {
      contentEditor.commands.setContent(content);
    }
  }, [content, contentEditor]);

  if (!contentEditor) return null;

  const buttonClass = (active: boolean) =>
    `flex items-center justify-center w-9 h-9 text-gray-600 rounded-md transition-colors duration-150
     ${
       active
         ? "bg-indigo-100 text-indigo-700 shadow-sm"
         : "hover:bg-gray-200 active:bg-gray-300"
     }`;

  const renderToolbar = (editor: any) => (
    <div className="mb-4 flex flex-wrap gap-1.5  bg-gray-50 rounded-lg border border-gray-200 shadow-inner  justify-center ">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={buttonClass(editor.isActive("bold"))}
        title="Bold"
      >
        <Bold size={20} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={buttonClass(editor.isActive("italic"))}
        title="Italic"
      >
        <Italic size={20} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={buttonClass(editor.isActive("underline"))}
        title="Underline"
      >
        <UnderlineIcon size={20} /> {/* or any icon for underline */}
      </button>

      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={buttonClass(editor.isActive("strike"))}
        title="Strikethrough"
      >
        <Strikethrough size={20} />
      </button>

      <div className="w-px bg-gray-200 mx-1 rounded-full"></div>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={buttonClass(editor.isActive("heading", { level: 1 }))}
        title="Heading 1"
      >
        <Heading1 size={20} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={buttonClass(editor.isActive("heading", { level: 2 }))}
        title="Heading 2"
      >
        <Heading2 size={20} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={buttonClass(editor.isActive("heading", { level: 3 }))}
        title="Heading 3"
      >
        <Heading3 size={20} />
      </button>
      <div className="w-px bg-gray-200 mx-1 rounded-full"></div>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={buttonClass(editor.isActive("bulletList"))}
        title="Bullet List"
      >
        <List size={20} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={buttonClass(editor.isActive("orderedList"))}
        title="Numbered List"
      >
        <ListOrdered size={20} />
      </button>
      <div className="w-px bg-gray-200 mx-1 rounded-full"></div>
    </div>
  );

  return (
    <div className="rounded-xl border border-gray-200 bg-white flex flex-col h-full">
      {renderToolbar(contentEditor)}
      <div
        className="flex-1 min-h-[400px] max-h-[400px] overflow-y-auto px-4 py-3 rounded-lg"
        onClick={() => contentEditor?.chain().focus().run()}
      >
        <EditorContent editor={contentEditor} required />
      </div>
    </div>
  );
};

export default Tiptap;
