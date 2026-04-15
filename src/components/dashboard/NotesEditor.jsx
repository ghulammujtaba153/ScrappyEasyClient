import React, { useEffect } from "react";
import { Modal, Button } from "antd";
import { useEditor, EditorContent } from "@tiptap/react";
import {
  MdUndo,
  MdRedo,
  MdFormatBold,
  MdFormatItalic,
  MdFormatUnderlined,
  MdFormatStrikethrough,
  MdHighlight,
  MdFormatListBulleted,
  MdFormatListNumbered,
  MdFormatQuote,
  MdCode,
  MdHorizontalRule,
  MdFormatAlignLeft,
  MdFormatAlignCenter,
  MdFormatAlignRight,
  MdFormatAlignJustify,
  MdLink,
  MdImage,
  MdTitle,
  MdCheck
} from "react-icons/md";

// TipTap Extensions
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Highlight from "@tiptap/extension-highlight";

// Toolbar Button Component
const ToolbarButton = ({ icon: Icon, onClick, isActive, label, title }) => (
  <button
    onClick={onClick}
    title={title || label}
    className={`p-2 rounded-lg transition-all hover:bg-gray-100 ${isActive ? 'bg-[#0F792C] text-white hover:bg-[#0a5a20]' : 'text-gray-700'
      }`}
  >
    {Icon ? <Icon className="w-4 h-4" /> : <span className="text-xs font-semibold">{label}</span>}
  </button>
);

const COLORS = [
  "#ffffff", // White
  "#FCD34D", // Yellow (Darker)
  "#7DD3FC", // Blue (Darker)
  "#F9A8D4", // Pink (Darker)
  "#86EFAC", // Green (Darker)
  "#D8B4FE", // Purple (Darker)
  "#FDBA74", // Orange (Darker)
];

const NotesEditor = ({ value, onChange, onSave, onClose, isEdit, title, setTitle, color, setColor }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: true,
        blockquote: true,
      }),
      Underline,
      Highlight,
      Image,
      Link.configure({
        openOnClick: true,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: value || "", // Ensure content is initialized
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    onCreate: ({ editor }) => {
      // Ensure content is set when editor is created (fixes empty editor on reopen)
      if (value && editor.getHTML() !== value) {
        editor.commands.setContent(value);
      }
    }
  });

  // Update external value
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  if (!editor) return null;

  // Insert image via URL
  const addImage = () => {
    const url = prompt("Enter Image URL");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  // Add or edit hyperlink
  const addLink = () => {
    const prev = editor.getAttributes("link").href;
    const url = prompt("Enter URL", prev);
    if (url === null) return;

    if (url === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }

    editor.chain().focus().setLink({ href: url }).run();
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <MdTitle className="text-[#0F792C] text-xl" />
          <span>{isEdit ? "Edit Note" : "Add New Note"}</span>
        </div>
      }
      open={true}
      onCancel={onClose}
      width={950}
      footer={[
        <div key="colors" className="flex-1 flex gap-2 items-center">
          <span className="text-sm text-gray-500 mr-2">Color:</span>
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={`w-8 h-8 rounded-full border-2 transition-transform flex items-center justify-center ${color === c ? 'border-[#0F792C] scale-110' : 'border-gray-300 hover:scale-105'}`}
              style={{ backgroundColor: c }}
              title={c}
            >
              {color === c && <MdCheck className={`text-lg ${c === '#ffffff' || c === '#FCD34D' || c === '#7DD3FC' || c === '#F9A8D4' || c === '#86EFAC' || c === '#D8B4FE' || c === '#FDBA74' ? 'text-gray-800' : 'text-white'}`} />}
            </button>
          ))}
        </div>,
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button
          key="save"
          type="primary"
          onClick={onSave}
          className="bg-[#0F792C] hover:bg-[#0a5a20] border-[#0F792C]"
        >
          {isEdit ? "Update Note" : "Save Note"}
        </Button>,
      ]}
    >
      <div className="mb-4">
        <input
          type="text"
          placeholder="Note Title (Optional)"
          className="w-full text-xl font-semibold border-b border-gray-300 pb-2 focus:outline-none focus:border-[#0F792C] bg-transparent"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* Toolbar */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4">
        {/* Row 1: History & Text Formatting */}
        <div className="flex flex-wrap gap-1 mb-2 pb-2 border-b border-gray-200">
          <ToolbarButton
            icon={MdUndo}
            onClick={() => editor.chain().focus().undo().run()}
            title="Undo"
          />
          <ToolbarButton
            icon={MdRedo}
            onClick={() => editor.chain().focus().redo().run()}
            title="Redo"
          />

          <div className="w-px h-6 bg-gray-300 mx-1" />

          <ToolbarButton
            icon={MdFormatBold}
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive("bold")}
            title="Bold"
          />
          <ToolbarButton
            icon={MdFormatItalic}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive("italic")}
            title="Italic"
          />
          <ToolbarButton
            icon={MdFormatUnderlined}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive("underline")}
            title="Underline"
          />
          <ToolbarButton
            icon={MdFormatStrikethrough}
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive("strike")}
            title="Strikethrough"
          />
          <ToolbarButton
            icon={MdHighlight}
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            isActive={editor.isActive("highlight")}
            title="Highlight"
          />
        </div>

        {/* Row 2: Headings & Paragraph */}
        <div className="flex flex-wrap gap-1 mb-2 pb-2 border-b border-gray-200">
          <ToolbarButton
            label="P"
            onClick={() => editor.chain().focus().setParagraph().run()}
            isActive={editor.isActive("paragraph")}
            title="Paragraph"
          />
          {[1, 2, 3, 4].map((lvl) => (
            <ToolbarButton
              key={lvl}
              label={`H${lvl}`}
              onClick={() => editor.chain().focus().toggleHeading({ level: lvl }).run()}
              isActive={editor.isActive("heading", { level: lvl })}
              title={`Heading ${lvl}`}
            />
          ))}
        </div>

        {/* Row 3: Lists & Blocks */}
        <div className="flex flex-wrap gap-1 mb-2 pb-2 border-b border-gray-200">
          <ToolbarButton
            icon={MdFormatListBulleted}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive("bulletList")}
            title="Bullet List"
          />
          <ToolbarButton
            icon={MdFormatListNumbered}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive("orderedList")}
            title="Numbered List"
          />
          <ToolbarButton
            icon={MdFormatQuote}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive("blockquote")}
            title="Quote"
          />
          <ToolbarButton
            icon={MdHorizontalRule}
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            title="Horizontal Rule"
          />
        </div>

        {/* Row 4: Alignment, Link & Image */}
        <div className="flex flex-wrap gap-1">
          <ToolbarButton
            icon={MdFormatAlignLeft}
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            isActive={editor.isActive({ textAlign: "left" })}
            title="Align Left"
          />
          <ToolbarButton
            icon={MdFormatAlignCenter}
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            isActive={editor.isActive({ textAlign: "center" })}
            title="Align Center"
          />
          <ToolbarButton
            icon={MdFormatAlignRight}
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            isActive={editor.isActive({ textAlign: "right" })}
            title="Align Right"
          />
          <ToolbarButton
            icon={MdFormatAlignJustify}
            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
            isActive={editor.isActive({ textAlign: "justify" })}
            title="Justify"
          />

          <div className="w-px h-6 bg-gray-300 mx-1" />

          <ToolbarButton
            icon={MdLink}
            onClick={addLink}
            isActive={editor.isActive("link")}
            title="Insert Link"
          />
          <ToolbarButton
            icon={MdImage}
            onClick={addImage}
            title="Insert Image"
          />
        </div>
      </div>

      {/* Editor Box */}
      <div className="border border-gray-300 rounded-lg p-4 min-h-[350px] bg-white focus-within:border-[#0F792C] focus-within:ring-2 focus-within:ring-[#0F792C]/20 transition-all">
        <style>{`
          .ProseMirror {
            outline: none;
            min-height: 320px;
          }
          .ProseMirror p {
            margin: 0.5em 0;
          }
          .ProseMirror h1 {
            font-size: 2em;
            font-weight: bold;
            margin: 0.67em 0;
          }
          .ProseMirror h2 {
            font-size: 1.5em;
            font-weight: bold;
            margin: 0.75em 0;
          }
          .ProseMirror h3 {
            font-size: 1.17em;
            font-weight: bold;
            margin: 0.83em 0;
          }
          .ProseMirror h4 {
            font-size: 1em;
            font-weight: bold;
            margin: 1em 0;
          }
          .ProseMirror ul {
            list-style-type: disc !important;
            padding-left: 1.5em !important;
            margin: 0.5em 0;
          }
          .ProseMirror ol {
            list-style-type: decimal !important;
            padding-left: 1.5em !important;
            margin: 0.5em 0;
          }
          .ProseMirror blockquote {
            border-left: 3px solid #0F792C;
            padding-left: 1em;
            margin: 1em 0;
            color: #666;
          }
          .ProseMirror code {
            background: #f4f4f4;
            padding: 0.2em 0.4em;
            border-radius: 3px;
            font-family: monospace;
          }
          .ProseMirror pre {
            background: #2d2d2d;
            color: #f8f8f2;
            padding: 1em;
            border-radius: 5px;
            overflow-x: auto;
          }
          .ProseMirror pre code {
            background: none;
            padding: 0;
            color: inherit;
          }
          .ProseMirror mark {
            background-color: #fef08a;
            padding: 0.1em 0.2em;
            border-radius: 2px;
          }
          .ProseMirror img {
            max-width: 100%;
            height: auto;
            border-radius: 4px;
          }
          .ProseMirror a {
            color: #0F792C;
            text-decoration: underline;
          }
          .ProseMirror hr {
            border: none;
            border-top: 2px solid #ddd;
            margin: 1.5em 0;
          }
        `}</style>
        <EditorContent editor={editor} />
      </div>
    </Modal>
  );
};

export default NotesEditor;
