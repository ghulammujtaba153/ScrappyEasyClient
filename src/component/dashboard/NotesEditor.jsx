import React, { useEffect } from "react";
import { Modal, Button } from "antd";
import { useEditor, EditorContent } from "@tiptap/react";

// TipTap Extensions
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Highlight from "@tiptap/extension-highlight";

const NotesEditor = ({ value, onChange, onSave, onClose, isEdit }) => {
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
    content: value || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
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
      title={isEdit ? "Edit Note" : "Add New Note"}
      open={true}
      onCancel={onClose}
      width={950}
      footer={[
        <Button key="cancel" onClick={onClose}>Cancel</Button>,
        <Button key="save" type="primary" onClick={onSave}>
          {isEdit ? "Update Note" : "Save Note"}
        </Button>,
      ]}
    >
      {/* Toolbar */}
      <div className="tiptap-toolbar" style={{ marginBottom: "12px", display: "flex", flexWrap: "wrap", gap: "6px" }}>

        <Button size="small" onClick={() => editor.chain().focus().undo().run()}>Undo</Button>
        <Button size="small" onClick={() => editor.chain().focus().redo().run()}>Redo</Button>

        <Button size="small" type={editor.isActive("bold") ? "primary" : "default"}
          onClick={() => editor.chain().focus().toggleBold().run()} >Bold</Button>

        <Button size="small" type={editor.isActive("italic") ? "primary" : "default"}
          onClick={() => editor.chain().focus().toggleItalic().run()} >Italic</Button>

        <Button size="small" type={editor.isActive("underline") ? "primary" : "default"}
          onClick={() => editor.chain().focus().toggleUnderline().run()} >Underline</Button>

        <Button size="small" type={editor.isActive("strike") ? "primary" : "default"}
          onClick={() => editor.chain().focus().toggleStrike().run()} >Strike</Button>

        <Button size="small" onClick={() => editor.chain().focus().toggleHighlight().run()}
          type={editor.isActive("highlight") ? "primary" : "default"}>Highlight</Button>

        <Button size="small" onClick={() => editor.chain().focus().setParagraph().run()}>
          Paragraph
        </Button>

        {[1, 2, 3, 4].map((lvl) => (
          <Button
            size="small"
            key={lvl}
            type={editor.isActive("heading", { level: lvl }) ? "primary" : "default"}
            onClick={() => editor.chain().focus().toggleHeading({ level: lvl }).run()}
          >
            H{lvl}
          </Button>
        ))}

        <Button size="small"
          type={editor.isActive("bulletList") ? "primary" : "default"}
          onClick={() => editor.chain().focus().toggleBulletList().run()} >
          Bullet List
        </Button>

        <Button size="small"
          type={editor.isActive("orderedList") ? "primary" : "default"}
          onClick={() => editor.chain().focus().toggleOrderedList().run()} >
          Numbered List
        </Button>

        <Button size="small" onClick={() => editor.chain().focus().toggleBlockquote().run()}
          type={editor.isActive("blockquote") ? "primary" : "default"} >
          Quote
        </Button>

        <Button size="small" onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          type={editor.isActive("codeBlock") ? "primary" : "default"} >
          Code Block
        </Button>

        <Button size="small" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          ─── HR
        </Button>

        <Button size="small" onClick={() => editor.chain().focus().setTextAlign("left").run()}>Left</Button>
        <Button size="small" onClick={() => editor.chain().focus().setTextAlign("center").run()}>Center</Button>
        <Button size="small" onClick={() => editor.chain().focus().setTextAlign("right").run()}>Right</Button>
        <Button size="small" onClick={() => editor.chain().focus().setTextAlign("justify").run()}>Justify</Button>

        <Button size="small" onClick={addLink}
          type={editor.isActive("link") ? "primary" : "default"} >
          Link
        </Button>

        <Button size="small" onClick={addImage}>Image</Button>
      </div>

      {/* Editor Box */}
      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "12px",
          minHeight: "350px",
        }}
      >
        <EditorContent editor={editor} />
      </div>
    </Modal>
  );
};

export default NotesEditor;
