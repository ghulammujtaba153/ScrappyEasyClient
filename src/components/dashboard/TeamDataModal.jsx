import React, { useState } from 'react';
import { Modal, Input, Select, Button } from 'antd';
import { FaPlus, FaEdit, FaEye, FaPhone, FaLink, FaTrash } from 'react-icons/fa';

const { TextArea } = Input;

const TeamDataModal = ({ 
    isOpen, 
    onClose, 
    onSubmit, 
    formData, 
    setFormData, 
    isEditMode, 
    isViewMode,
    submitting 
}) => {
    const [newPhoneTitle, setNewPhoneTitle] = useState('');
    const [newPhoneNumber, setNewPhoneNumber] = useState('');
    const getModalTitle = () => {
        if (isViewMode) {
            return (
                <div className="flex items-center gap-2 text-lg font-semibold">
                    <FaEye className="text-purple-600" />
                    View Data
                </div>
            );
        }
        if (isEditMode) {
            return (
                <div className="flex items-center gap-2 text-lg font-semibold">
                    <FaEdit className="text-blue-600" />
                    Edit Data
                </div>
            );
        }
        return (
            <div className="flex items-center gap-2 text-lg font-semibold">
                <FaPlus className="text-green-600" />
                Add New Data
            </div>
        );
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'new': return 'bg-blue-100 text-blue-700';
            case 'contacted': return 'bg-orange-100 text-orange-700';
            case 'qualified': return 'bg-green-100 text-green-700';
            case 'unqualified': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const handleAddPhone = () => {
        if (newPhoneTitle.trim() && newPhoneNumber.trim()) {
            const phones = Array.isArray(formData.phone) ? formData.phone : [];
            setFormData({
                ...formData,
                phone: [...phones, { title: newPhoneTitle, number: newPhoneNumber }]
            });
            setNewPhoneTitle('');
            setNewPhoneNumber('');
        }
    };

    const handleRemovePhone = (index) => {
        const phones = Array.isArray(formData.phone) ? formData.phone : [];
        setFormData({
            ...formData,
            phone: phones.filter((_, i) => i !== index)
        });
    };

    return (
        <Modal
            title={getModalTitle()}
            open={isOpen}
            onCancel={onClose}
            footer={null}
            width={600}
            centered
        >
            <div className="py-4 space-y-4">
                {isViewMode ? (
                    // View Mode - Read Only Display
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Title</label>
                                <p className="text-gray-900 font-medium">{formData.title || '-'}</p>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(formData.status)}`}>
                                    {formData.status?.charAt(0).toUpperCase() + formData.status?.slice(1)}
                                </span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Phone</label>
                            <div className="space-y-2">
                                {Array.isArray(formData.phone) && formData.phone.length > 0 ? (
                                    <>
                                        {formData.phone.map((phone, index) => (
                                            <div key={index} className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                                                <div className="flex-1">
                                                    <p className="text-xs font-medium text-gray-500">{phone.title || 'Untitled'}</p>
                                                    <p className="text-gray-900 flex items-center gap-2">
                                                        <FaPhone className="text-gray-400 text-xs" />
                                                        {phone.number}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </>
                                ) : (
                                    <p className="text-gray-500">-</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                            <p className="text-gray-900 whitespace-pre-wrap">{formData.description || '-'}</p>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Link</label>
                            {formData.link ? (
                                <a 
                                    href={formData.link} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
                                >
                                    <FaLink /> {formData.link}
                                </a>
                            ) : (
                                <p className="text-gray-500">-</p>
                            )}
                        </div>

                        <div className="flex justify-end pt-4 border-t">
                            <button
                                onClick={onClose}
                                className="px-6 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                ) : (
                    // Edit/Create Mode - Form
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Title
                            </label>
                            <Input
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="Enter title"
                                size="large"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Phone</label>
                            <div className="space-y-2">
                                {Array.isArray(formData.phone) && formData.phone.length > 0 ? (
                                    <div className="space-y-2 mb-3">
                                        {formData.phone.map((phone, index) => (
                                            <div key={index} className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                                                <div className="flex-1">
                                                    <p className="text-xs font-medium text-gray-500">{phone.title || 'Untitled'}</p>
                                                    <p className="text-gray-900 flex items-center gap-2">
                                                        <FaPhone className="text-gray-400 text-xs" />
                                                        {phone.number}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => handleRemovePhone(index)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                                                    title="Remove"
                                                >
                                                    <FaTrash size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : null}
                                
                                <div className="space-y-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                    <Input
                                        value={newPhoneTitle}
                                        onChange={(e) => setNewPhoneTitle(e.target.value)}
                                        placeholder="Phone title (e.g., Main, Mobile, Office)"
                                        size="small"
                                    />
                                    <Input
                                        value={newPhoneNumber}
                                        onChange={(e) => setNewPhoneNumber(e.target.value)}
                                        placeholder="Phone number"
                                        size="small"
                                        prefix={<FaPhone className="text-gray-400" />}
                                    />
                                    <Button
                                        onClick={handleAddPhone}
                                        type="primary"
                                        size="small"
                                        block
                                        icon={<FaPlus />}
                                    >
                                        Add Phone
                                    </Button>
                                </div>
                                {(!Array.isArray(formData.phone) || formData.phone.length === 0) && (
                                    <p className="text-xs text-red-600">At least one phone number is required</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <TextArea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Enter description"
                                rows={3}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Link
                            </label>
                            <Input
                                value={formData.link}
                                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                placeholder="Enter link URL"
                                size="large"
                                prefix={<FaLink className="text-gray-400" />}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Status
                            </label>
                            <Select
                                value={formData.status}
                                onChange={(value) => setFormData({ ...formData, status: value })}
                                className="w-full"
                                size="large"
                                options={[
                                    { value: 'new', label: 'New' },
                                    { value: 'contacted', label: 'Contacted' },
                                    { value: 'qualified', label: 'Qualified' },
                                    { value: 'unqualified', label: 'Unqualified' }
                                ]}
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t">
                            <button
                                onClick={onClose}
                                className="px-6 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                                disabled={submitting}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onSubmit}
                                disabled={submitting}
                                className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium flex items-center gap-2 disabled:opacity-50"
                            >
                                {submitting ? 'Saving...' : (isEditMode ? 'Update' : 'Add Data')}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </Modal>
    );
};

export default TeamDataModal;
