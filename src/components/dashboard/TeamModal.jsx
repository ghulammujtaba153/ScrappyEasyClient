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
                <div className="flex items-center gap-3 pb-2 border-b border-gray-100">
                    <div className={`p-2 rounded-lg flex items-center justify-center ${initialData ? 'bg-blue-50 text-blue-600' : 'bg-primary/10 text-primary'}`}>
                        {initialData ? <FaEdit size={20} /> : <FaPlus size={20} />}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">
                            {initialData ? 'Edit Team' : 'Create New Team'}
                        </h2>
                        <p className="text-sm text-gray-500 font-normal mt-0.5">Define your collaboration boundaries</p>
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
            <div className="py-4 space-y-6">
                {/* Team Name */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-semibold text-gray-700">
                            Team Name
                        </label>
                        <span className="text-xs text-red-500">* Required</span>
                    </div>
                    <div className="relative">
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Apollo Strategy Team"
                            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:border-primary outline-none transition-colors text-gray-800 text-sm"
                        />
                    </div>
                </div>

                {/* Emails Input */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-semibold text-gray-700">
                            Invite Members by Email
                        </label>
                        <span className="text-xs text-gray-500">Max {MAX_MEMBERS}</span>
                    </div>
                    <div className="relative mb-3">
                        <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="email"
                            value={currentEmail}
                            onChange={(e) => setCurrentEmail(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddEmail(e)}
                            onBlur={handleAddEmail}
                            placeholder="Press Enter to add email..."
                            disabled={emails.length >= MAX_MEMBERS}
                            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:border-primary outline-none transition-colors text-gray-800 text-sm disabled:opacity-50 disabled:bg-gray-50"
                        />
                    </div>

                    {/* Email Tags */}
                    <div className="flex flex-wrap gap-2 min-h-[32px]">
                        {emails.map((email) => (
                            <div 
                                key={email}
                                className="flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-1 rounded-md text-sm border border-gray-200"
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
                            <p className="text-gray-400 text-xs py-1">No members added yet. Type an email and press Enter.</p>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleFormSubmit}
                        disabled={loading}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {loading ? (
                            <>
                                <Spin size="small" className="text-white" />
                                Processing...
                            </>
                        ) : (
                            <>
                                {initialData ? 'Save Changes' : 'Create Team'}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default TeamModal;
