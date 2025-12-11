import React, { useEffect, useRef } from "react";
import { Modal, Button } from "antd";
import Quill from "quill";
import "quill/dist/quill.snow.css";

const NotesEditor = ({ value, onChange, onSave, onClose, isEdit }) => {
  const editorRef = useRef(null);
  const quillRef = useRef(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!editorRef.current || initializedRef.current) return;

    // Initialize Quill only once
    const quill = new Quill(editorRef.current, {
      theme: "snow",
      placeholder: "Write your note here...",
      modules: {
        toolbar: [
          [{ font: [] }],
          [{ size: ["small", false, "large", "huge"] }],
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ["bold", "italic", "underline", "strike", "blockquote"],
          [{ color: [] }, { background: [] }],
          [{ script: "sub" }, { script: "super" }],
          [{ align: [] }],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link", "image", "video"],
          ["code-block"],
          ["clean"],
        ],
      },
    });

    quillRef.current = quill;
    initializedRef.current = true;

    // Set initial value
    if (value) {
      quill.root.innerHTML = value;
    }

    // Listen for changes
    quill.on("text-change", () => {
      onChange(quill.root.innerHTML);
    });
  }, []);

  // Update editor content when value prop changes externally
  useEffect(() => {
    if (quillRef.current && value !== quillRef.current.root.innerHTML) {
      quillRef.current.root.innerHTML = value;
    }
  }, [value]);

  return (
    <Modal
      title={isEdit ? "Edit Note" : "Add New Note"}
      open={true}
      onCancel={onClose}
      width={900}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="save" type="primary" onClick={onSave}>
          {isEdit ? "Update Note" : "Save Note"}
        </Button>,
      ]}
    >
      <div
        ref={editorRef}
        style={{
          height: "300px",
          marginBottom: "50px",
        }}
      />
    </Modal>
  );
};

export default NotesEditor;
