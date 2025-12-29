import React, { useState } from 'react';
import { Input, Button, message } from 'antd';
import { createSupportRequest } from '../../api/supportApi';

const { TextArea } = Input;

const SupportPage = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        subject: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.firstName || !formData.lastName || !formData.subject || !formData.message) {
            message.error('Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            const response = await createSupportRequest(formData);

            if (response.success) {
                message.success(response.message || 'Support request submitted successfully!');

                // Reset form
                setFormData({
                    firstName: '',
                    lastName: '',
                    subject: '',
                    message: ''
                });
            }
        } catch (error) {
            console.error('Support request error:', error);
            message.error(error.message || 'Failed to submit support request. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <style>
                {`
                    .ant-input:focus,
                    .ant-input-focused,
                    .ant-input:hover {
                        border-color: #0F792C !important;
                        box-shadow: 0 0 0 2px rgba(15, 121, 44, 0.1) !important;
                    }
                    
                    .ant-input-affix-wrapper:focus,
                    .ant-input-affix-wrapper-focused,
                    .ant-input-affix-wrapper:hover {
                        border-color: #0F792C !important;
                        box-shadow: 0 0 0 2px rgba(15, 121, 44, 0.1) !important;
                    }
                `}
            </style>
            <div className="p-6 max-w-3xl mx-auto">
                <div className="bg-white rounded-lg shadow-md p-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Support</h1>
                    <p className="text-gray-600 mb-6">Need help? Send us a message and we'll get back to you soon.</p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Name Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    First Name <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    placeholder="Enter your first name"
                                    size="large"
                                    className="rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Last Name <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    placeholder="Enter your last name"
                                    size="large"
                                    className="rounded-lg"
                                />
                            </div>
                        </div>

                        {/* Subject */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Subject <span className="text-red-500">*</span>
                            </label>
                            <Input
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                placeholder="What is this regarding?"
                                size="large"
                                className="rounded-lg"
                            />
                        </div>

                        {/* Message */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Message <span className="text-red-500">*</span>
                            </label>
                            <TextArea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                placeholder="Describe your issue or question in detail..."
                                rows={6}
                                className="rounded-lg"
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end">
                            <Button
                                type="primary"
                                htmlType="submit"
                                size="large"
                                loading={loading}
                                className="bg-primary hover:bg-primary/90 px-8"
                            >
                                Submit Request
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default SupportPage;