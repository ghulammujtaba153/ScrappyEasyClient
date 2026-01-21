import React, { useEffect, useState } from "react";
import { Button, Empty, Popconfirm, message as antMessage, Tooltip } from "antd";
import { MdEdit, MdDelete, MdAdd, MdPushPin, MdOutlinePushPin } from "react-icons/md";
import NotesEditor from "./NotesEditor";
import NoteContent from "./NoteContent";
import { BASE_URL } from "../../config/URL";
import axios from "axios";

const Notes = ({ operationId }) => {
  const [notesList, setNotesList] = useState([]);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState(""); // Title state
  const [color, setColor] = useState("#ffffff"); // Color state
  const [editId, setEditId] = useState(null);
  const [showEditor, setShowEditor] = useState(false);

  const fetchNotes = React.useCallback(async () => {
    if (!operationId) return;
    try {
      const res = await axios.get(`${BASE_URL}/api/notes/${operationId}`);
      setNotesList(res.data);
    } catch (error) {
      console.log("Error fetching notes", error);
    }
  }, [operationId]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const openAddPopup = () => {
    setContent("");
    setTitle("");
    setColor("#ffffff");
    setEditId(null);
    setShowEditor(true);
  };

  const openEditPopup = (note) => {
    setContent(note.content);
    setTitle(note.title || "");
    setColor(note.color || "#ffffff");
    setEditId(note._id);
    setShowEditor(true);
  };

  const closePopup = () => {
    setContent("");
    setTitle("");
    setColor("#ffffff");
    setEditId(null);
    setShowEditor(false);
  };

  const saveNote = async () => {
    // Allow empty content if title is present, or vice versa? 
    // Usually content is required, but let's fit the "Post-it" vibe.
    if (!content.trim() && !title.trim()) {
      antMessage.warning("Note content or title must be provided");
      return;
    }

    try {
      const payload = {
        dataId: operationId,
        content,
        title,
        color
      };

      if (editId) {
        await axios.put(`${BASE_URL}/api/notes/${editId}`, payload);
        antMessage.success("Note updated successfully");
      } else {
        await axios.post(`${BASE_URL}/api/notes/create`, payload);
        antMessage.success("Note created successfully");
      }

      fetchNotes();
      closePopup();
    } catch (error) {
      console.log("Error saving note:", error);
      antMessage.error("Failed to save note");
    }
  };

  const deleteNote = async (noteId) => {
    try {
      await axios.delete(`${BASE_URL}/api/notes/${noteId}`);
      antMessage.success("Note deleted successfully");
      fetchNotes();
    } catch (error) {
      console.log("Error deleting note:", error);
      antMessage.error("Failed to delete note");
    }
  };

  const togglePin = async (e, note) => {
    e.stopPropagation(); // Prevent opening edit or other clicks
    try {
      const newPinStatus = !note.isPinned;
      // Optimistic update
      const newNotes = notesList.map(n => n._id === note._id ? { ...n, isPinned: newPinStatus } : n);
      // Sort: Pinned first, then date
      newNotes.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      setNotesList(newNotes);

      await axios.put(`${BASE_URL}/api/notes/${note._id}`, { isPinned: newPinStatus });
      fetchNotes(); // Sync strictly
    } catch (error) {
      console.log("Error toggling pin:", error);
      antMessage.error("Failed to update pin status");
      fetchNotes(); // Revert on error
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800">Notes</h3>
        <Button
          className="bg-[#0F792C] hover:bg-[#0a5a20] border-[#0F792C] text-white flex items-center gap-1 shadow-sm"
          type="primary"
          icon={<MdAdd />}
          onClick={openAddPopup}
        >
          Add Note
        </Button>
      </div>

      {showEditor && (
        <NotesEditor
          value={content}
          onChange={setContent}
          title={title}
          setTitle={setTitle}
          color={color}
          setColor={setColor}
          onSave={saveNote}
          onClose={closePopup}
          isEdit={!!editId}
        />
      )}

      {notesList.length === 0 ? (
        <Empty description="No notes yet. Create your first note!" className="py-10" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {notesList.map((note) => (
            <div
              key={note._id}
              className="relative p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow group flex flex-col min-h-[200px]"
              style={{ backgroundColor: note.color || '#ffffff' }}
            >
              {/* Pin Button */}
              <button
                onClick={(e) => togglePin(e, note)}
                className={`absolute top-3 right-3 p-1 rounded-full transition-colors ${note.isPinned ? 'text-gray-800' : 'text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100'
                  }`}
                title={note.isPinned ? "Unpin note" : "Pin note"}
              >
                {note.isPinned ? <MdPushPin className="text-xl" /> : <MdOutlinePushPin className="text-xl" />}
              </button>

              {/* Title */}
              {note.title && (
                <h4 className="font-bold text-lg text-gray-800 mb-2 pr-6 truncate">
                  {note.title}
                </h4>
              )}

              {/* Content */}
              <NoteContent
                content={note.content}
                title={note.title}
                color={note.color}
                maxHeight="150px"
              />

              {/* Footer Actions */}
              <div className="flex justify-between items-center mt-4 pt-3 border-t border-black/5 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-xs text-gray-500 font-medium">
                  {new Date(note.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
                <div className="flex gap-1">
                  <Tooltip title="Edit">
                    <button
                      onClick={() => openEditPopup(note)}
                      className="p-1.5 hover:bg-black/5 rounded-full text-gray-600 transition-colors"
                    >
                      <MdEdit />
                    </button>
                  </Tooltip>
                  <Popconfirm
                    title="Delete this note?"
                    onConfirm={() => deleteNote(note._id)}
                    okText="Yes"
                    cancelText="Cancel"
                  >
                    <button className="p-1.5 hover:bg-red-100 rounded-full text-red-500 transition-colors">
                      <MdDelete />
                    </button>
                  </Popconfirm>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notes;
