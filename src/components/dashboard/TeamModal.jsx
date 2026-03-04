import React, { useState, useEffect } from 'react';
import { Modal, Spin, message } from 'antd';
import { FaEdit, FaPlus, FaTimes, FaEnvelope } from 'react-icons/fa';

const TeamModal = ({ 
    open, 
    onCancel, 
    onSubmit, 
    initialData = null, 
    loading = false 
}) => {
    const [name, setName] = useState('');
    const [emails, setEmails] = useState([]);
    const [currentEmail, setCurrentEmail] = useState('');
    const MAX_MEMBERS = 2;

    useEffect(() => {
        if (initialData) {
            setName(initialData.name || '');
            setEmails(initialData.members?.map(m => m.email) || []);
        } else {
            setName('');
            setEmails([]);
        }
    }, [initialData, open]);

    const handleAddEmail = (e) => {
        if (e.key === 'Enter' || e.type === 'blur') {
            const trimmed = currentEmail.trim().toLowerCase();
            if (!trimmed) return;
            
            // Basic email validation
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
                message.error('Invalid email format');
                return;
            }

            if (emails.includes(trimmed)) {
                message.warning('Email already added');
                return;
            }

            if (emails.length >= MAX_MEMBERS) {
                message.warning(`Maximum ${MAX_MEMBERS} sub-accounts allowed.`);
                return;
            }

            setEmails([...emails, trimmed]);
            setCurrentEmail('');
            if (e.preventDefault) e.preventDefault();
        }
    };

    const removeEmail = (emailToRemove) => {
        setEmails(emails.filter(e => e !== emailToRemove));
    };

    const handleFormSubmit = () => {
        if (!name.trim()) {
            message.error('Team name is required');
            return;
        }
        onSubmit({ name, memberEmails: emails });
    };

    return (
        <Modal
            title={
                <div className="flex items-center gap-4 py-2">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${initialData ? 'bg-blue-50 text-blue-600 shadow-blue-100' : 'bg-green-50 text-green-600 shadow-green-100'}`}>
                        {initialData ? <FaEdit size={24} /> : <FaPlus size={24} />}
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                            {initialData ? 'Refine Team' : 'New Workspace'}
                        </h2>
                        <p className="text-slate-400 text-xs font-medium italic mt-0.5">Define your collaboration boundaries</p>
                    </div>
                </div>
            }
            open={open}
            onCancel={onCancel}
            footer={null}
            width={600}
            centered
            className="premium-modal"
            maskClosable={false}
        >
            <div className="py-6 space-y-8">
                {/* Team Name */}
                <div>
                    <div className="flex items-center justify-between mb-2 px-1">
                        <label className="text-sm font-semibold text-slate-600">
                            Team Name
                        </label>
                        <span className="text-xs font-medium text-red-400">Required</span>
                    </div>
                    <div className="relative group">
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Apollo Strategy Team"
                            className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:bg-white focus:border-primary/50 outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300 shadow-inner group-hover:bg-slate-100/50"
                        />
                    </div>
                </div>

                {/* Emails Input */}
                <div>
                    <div className="flex items-center justify-between mb-2 px-1">
                        <label className="text-sm font-semibold text-slate-600">
                            Invite Members by Email
                        </label>
                        <span className="text-xs font-medium text-slate-400">Max {MAX_MEMBERS}</span>
                    </div>
                    <div className="relative group mb-4">
                        <FaEnvelope className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                        <input
                            type="email"
                            value={currentEmail}
                            onChange={(e) => setCurrentEmail(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddEmail(e)}
                            onBlur={handleAddEmail}
                            placeholder="Press Enter to add email..."
                            disabled={emails.length >= MAX_MEMBERS}
                            className="w-full pl-12 pr-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:bg-white focus:border-primary/50 outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300 shadow-inner group-hover:bg-slate-100/50 disabled:opacity-50"
                        />
                    </div>

                    {/* Email Tags */}
                    <div className="flex flex-wrap gap-2 min-h-[40px]">
                        {emails.map((email) => (
                            <div 
                                key={email}
                                className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-xl font-bold text-sm border border-primary/20 animate-fadeIn"
                            >
                                <span>{email}</span>
                                <button 
                                    onClick={() => removeEmail(email)}
                                    className="hover:text-red-500 transition-colors"
                                >
                                    <FaTimes size={12} />
                                </button>
                            </div>
                        ))}
                        {emails.length === 0 && (
                            <p className="text-slate-400 text-xs italic py-2">No members added yet. Type an email and press Enter.</p>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-6 border-t border-slate-50">
                    <button
                        onClick={onCancel}
                        className="flex-1 px-6 py-4 text-slate-500 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all font-semibold text-sm active:scale-95"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleFormSubmit}
                        disabled={loading}
                        className="flex-[1.5] px-6 py-4 bg-primary text-white rounded-2xl hover:bg-primary/90 transition-all font-semibold text-sm flex items-center justify-center gap-3 shadow-xl shadow-primary/20 active:scale-95 disabled:opacity-50"
                    >
                        {loading ? (
                            <>
                                <Spin size="small" className="text-white" />
                                Processing...
                            </>
                        ) : (
                            <>
                                {initialData ? <><FaEdit size={16} /> Update Team</> : <><FaPlus size={16} /> Create Team</>}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default TeamModal;
