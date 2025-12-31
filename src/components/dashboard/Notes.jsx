import React, { useEffect, useState } from "react";
import { Card, Button, Empty, Space, Popconfirm, message as antMessage, Timeline } from "antd";
import { MdEdit, MdDelete, MdAdd, MdAccessTime } from "react-icons/md";
import NotesEditor from "./NotesEditor";
import { BASE_URL } from "../../config/URL";
import axios from "axios";

const Notes = ({ operationId }) => {
  const [notesList, setNotesList] = useState([]);
  const [content, setContent] = useState("");
  const [editId, setEditId] = useState(null);
  const [showEditor, setShowEditor] = useState(false);

  const fetchNotes = async () => {
    if (!operationId) return;
    try {
      const res = await axios.get(`${BASE_URL}/api/notes/${operationId}`);
      setNotesList(res.data);
    } catch (error) {
      console.log("Error fetching notes", error);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [operationId]);

  const openAddPopup = () => {
    setContent("");
    setEditId(null);
    setShowEditor(true);
  };

  const openEditPopup = (note) => {
    setContent(note.content);
    setEditId(note._id);
    setShowEditor(true);
  };

  const closePopup = () => {
    setContent("");
    setEditId(null);
    setShowEditor(false);
  };

  const saveNote = async () => {
    if (!content.trim()) {
      antMessage.warning("Note content cannot be empty");
      return;
    }

    try {
      if (editId) {
        await axios.put(`${BASE_URL}/api/notes/${editId}`, { content });
        antMessage.success("Note updated successfully");
      } else {
        await axios.post(`${BASE_URL}/api/notes/create`, {
          dataId: operationId,
          content,
        });
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

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-700">Notes</h3>
        <Button
          className="bg-[#0F792C] hover:bg-[#0a5a20] border-[#0F792C] text-white"
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
          onSave={saveNote}
          onClose={closePopup}
          isEdit={!!editId}
        />
      )}

      {notesList.length === 0 ? (
        <Empty description="No notes yet. Create your first note!" />
      ) : (
        <Timeline
          mode="left"
          items={notesList
            .slice()
            .reverse()
            .map((note) => ({
              dot: <MdAccessTime className="text-lg text-[#0F792C]" />,
              color: 'green',
              children: (
                <Card
                  className="shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-[#0F792C]"
                  size="small"
                  title={
                    <span className="text-sm font-medium text-gray-600">
                      {new Date(note.createdAt).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  }
                  extra={
                    <Space>
                      <Button
                        type="text"
                        size="small"
                        icon={<MdEdit className="text-[#0F792C]" />}
                        onClick={() => openEditPopup(note)}
                        className="hover:bg-green-50"
                      >
                        <span className="text-[#0F792C]">Edit</span>
                      </Button>
                      <Popconfirm
                        title="Delete this note?"
                        description="This action cannot be undone."
                        onConfirm={() => deleteNote(note._id)}
                        okText="Yes"
                        cancelText="No"
                      >
                        <Button
                          type="text"
                          size="small"
                          danger
                          icon={<MdDelete />}
                          className="hover:bg-red-50"
                        >
                          Delete
                        </Button>
                      </Popconfirm>
                    </Space>
                  }
                >
                  <div
                    dangerouslySetInnerHTML={{ __html: note.content }}
                    className="prose max-w-none text-gray-700"
                  />
                  {note.updatedAt && note.updatedAt !== note.createdAt && (
                    <div className="text-xs text-gray-400 mt-2 border-t pt-2">
                      Last edited: {new Date(note.updatedAt).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  )}
                </Card>
              )
            }))}
        />
      )}
    </div>
  );
};

export default Notes;
