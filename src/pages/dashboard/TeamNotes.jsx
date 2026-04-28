import React, { useState, useEffect } from 'react';
import { 
    Card, 
    Input, 
    Button, 
    Modal, 
    message, 
    Tooltip, 
    Empty, 
    Tag, 
    Dropdown, 
    Menu,
    Popconfirm,
    Spin
} from 'antd';
import { 
    MdPushPin, 
    MdOutlinePushPin, 
    MdDelete, 
    MdEdit, 
    MdMoreVert, 
    MdAdd, 
    MdSearch, 
    MdPalette,
    MdLabel
} from 'react-icons/md';
import axios from 'axios';
import { BASE_URL } from '../../config/URL';
import { useAuth } from '../../context/authContext';

const { TextArea } = Input;

const NOTE_COLORS = [
    { name: 'Default', value: '#ffffff' },
    { name: 'Ocean', value: '#e0f2fe' },
    { name: 'Emerald', value: '#dcfce7' },
    { name: 'Amber', value: '#fef3c7' },
    { name: 'Rose', value: '#ffe4e6' },
    { name: 'Violet', value: '#f3e8ff' },
];

const TeamNotes = ({ teamId }) => {
    const { user, token } = useAuth();
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [editingNote, setEditingNote] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        color: '#ffffff',
        isPinned: false,
        tags: []
    });

    useEffect(() => {
        if (teamId) {
            fetchNotes();
        }
    }, [teamId]);

    const fetchNotes = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${BASE_URL}/api/team-notes/get/${teamId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setNotes(res.data.data);
            }
        } catch (error) {
            console.error("Fetch notes error:", error);
            message.error("Failed to load team notes");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (note = null) => {
        if (note) {
            setEditingNote(note);
            setFormData({
                title: note.title,
                content: note.content,
                color: note.color,
                isPinned: note.isPinned,
                tags: note.tags
            });
        } else {
            setEditingNote(null);
            setFormData({
                title: '',
                content: '',
                color: '#ffffff',
                isPinned: false,
                tags: []
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async () => {
        if (!formData.content.trim()) {
            return message.warning("Please enter note content");
        }

        try {
            if (editingNote) {
                await axios.put(`${BASE_URL}/api/team-notes/update/${editingNote._id}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                message.success("Note updated");
            } else {
                await axios.post(`${BASE_URL}/api/team-notes/create`, {
                    ...formData,
                    teamId,
                    userId: user?._id
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                message.success("Note created");
            }
            setIsModalOpen(false);
            fetchNotes();
        } catch (error) {
            console.error("Submit note error:", error);
            message.error("Failed to save note");
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${BASE_URL}/api/team-notes/delete/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            message.success("Note deleted");
            fetchNotes();
        } catch (error) {
            message.error("Failed to delete note");
        }
    };

    const togglePin = async (id) => {
        try {
            await axios.patch(`${BASE_URL}/api/team-notes/pin/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchNotes();
        } catch (error) {
            message.error("Failed to pin/unpin note");
        }
    };

    const filteredNotes = notes.filter(note => 
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        note.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const NoteCard = ({ note }) => {
        const menuItems = [
            {
                key: 'edit',
                label: 'Edit',
                icon: <MdEdit />,
                onClick: () => handleOpenModal(note)
            },
            {
                key: 'delete',
                label: (
                    <Popconfirm
                        title="Delete this note?"
                        onConfirm={(e) => {
                            e.stopPropagation();
                            handleDelete(note._id);
                        }}
                        onCancel={(e) => e.stopPropagation()}
                        okText="Yes"
                        cancelText="No"
                    >
                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                            Delete
                        </div>
                    </Popconfirm>
                ),
                danger: true,
                icon: <MdDelete />
            }
        ];

        return (
            <Card
                className="group transition-all hover:shadow-md border-gray-200 relative"
                style={{ backgroundColor: note.color }}
                styles={{ body: { padding: '16px' } }}
            >
                <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-gray-800 text-sm truncate mr-6">
                        {note.title}
                    </h4>
                    <div className="absolute top-3 right-3 flex items-center gap-1">
                        <button 
                            onClick={() => togglePin(note._id)}
                            className={`transition-colors ${note.isPinned ? 'text-[#0F792C]' : 'text-gray-300 hover:text-gray-500'}`}
                        >
                            {note.isPinned ? <MdPushPin size={18} /> : <MdOutlinePushPin size={18} />}
                        </button>
                        <Dropdown 
                            menu={{ items: menuItems }}
                            trigger={['click']}
                        >
                            <button className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                <MdMoreVert size={20} />
                            </button>
                        </Dropdown>
                    </div>
                </div>
                
                <p className="text-gray-600 text-xs whitespace-pre-wrap line-clamp-4 mb-4 min-h-[40px]">
                    {note.content}
                </p>

                <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-900/5">
                    <div className="flex items-center gap-3">
                        <Tooltip title={`Created by ${note.userId?.name || 'Unknown'}`}>
                            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-500 uppercase border border-white shadow-sm">
                                {(note.userId?.name || '?')[0]}
                            </div>
                        </Tooltip>
                        <span className="text-[10px] text-gray-400 font-medium tracking-tight">
                            {new Date(note.createdAt).toLocaleDateString(undefined, { 
                                month: 'short', 
                                day: 'numeric', 
                                year: 'numeric' 
                            })}
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                        {note.tags?.slice(0, 2).map((tag, i) => (
                            <Tag key={i} className="text-[9px] px-1 py-0 border-none bg-gray-900/5 text-gray-500 m-0 leading-tight">
                                #{tag}
                            </Tag>
                        ))}
                    </div>
                </div>
            </Card>
        );
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-50 rounded-lg text-[#0F792C]">
                        <MdPushPin size={24} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-800">Team Notes</h2>
                        <p className="text-xs text-gray-500">Collaborative workspace for your team</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Input
                        placeholder="Search notes..."
                        prefix={<MdSearch className="text-gray-400" />}
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="rounded-lg w-full sm:w-48"
                    />
                    <Button
                        type="primary"
                        icon={<MdAdd />}
                        onClick={() => handleOpenModal()}
                        className="bg-[#0F792C] hover:bg-[#0a5a20] border-none rounded-lg flex items-center"
                    >
                        New Note
                    </Button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <Spin size="large" />
                </div>
            ) : filteredNotes.length === 0 ? (
                <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center">
                    <Empty 
                        image={Empty.PRESENTED_IMAGE_SIMPLE} 
                        description={
                            <div className="space-y-2">
                                <p className="text-gray-500 font-medium">No notes found</p>
                                <Button type="link" onClick={() => handleOpenModal()} className="text-[#0F792C]">
                                    Create your first team note
                                </Button>
                            </div>
                        }
                    />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {/* Pinned Notes First */}
                    {filteredNotes.filter(n => n.isPinned).map(note => (
                        <NoteCard key={note._id} note={note} />
                    ))}
                    {/* Regular Notes */}
                    {filteredNotes.filter(n => !n.isPinned).map(note => (
                        <NoteCard key={note._id} note={note} />
                    ))}
                </div>
            )}

            <Modal
                title={editingNote ? "Edit Note" : "Create New Note"}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={handleSubmit}
                okText={editingNote ? "Update" : "Create"}
                okButtonProps={{ className: 'bg-[#0F792C]' }}
                width={500}
                styles={{ body: { paddingTop: '20px' } }}
            >
                <div className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Title</label>
                        <Input
                            placeholder="Note title..."
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            className="rounded-lg"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Content</label>
                        <TextArea
                            rows={6}
                            placeholder="Write your note here..."
                            value={formData.content}
                            onChange={e => setFormData({ ...formData, content: e.target.value })}
                            className="rounded-lg"
                        />
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Color</label>
                            <div className="flex items-center gap-2">
                                {NOTE_COLORS.map(color => (
                                    <Tooltip key={color.value} title={color.name}>
                                        <button
                                            onClick={() => setFormData({ ...formData, color: color.value })}
                                            className={`w-6 h-6 rounded-full border-2 transition-all ${
                                                formData.color === color.value ? 'border-[#0F792C] scale-110 shadow-sm' : 'border-gray-100 hover:border-gray-300'
                                            }`}
                                            style={{ backgroundColor: color.value }}
                                        />
                                    </Tooltip>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center gap-2 mt-4">
                            <Button
                                type={formData.isPinned ? "primary" : "default"}
                                icon={formData.isPinned ? <MdPushPin /> : <MdOutlinePushPin />}
                                onClick={() => setFormData({ ...formData, isPinned: !formData.isPinned })}
                                className={formData.isPinned ? 'bg-[#0F792C] border-none' : ''}
                            >
                                {formData.isPinned ? 'Pinned' : 'Pin'}
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tags (comma separated)</label>
                        <Input
                            placeholder="important, meeting, ideas..."
                            prefix={<MdLabel className="text-gray-400" />}
                            value={formData.tags.join(', ')}
                            onChange={e => setFormData({ ...formData, tags: e.target.value.split(',').map(t => t.trim()).filter(t => t) })}
                            className="rounded-lg"
                        />
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default TeamNotes;
