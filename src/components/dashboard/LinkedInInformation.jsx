import React, { useState, useEffect } from 'react';
import { Modal, Spin, Tag, Empty, Button, message, Avatar } from 'antd';
import { 
    MdClose, 
    MdPerson, 
    MdEmail, 
    MdPhone, 
    MdLocationOn, 
    MdBusinessCenter, 
    MdRefresh,
    MdPeople
} from 'react-icons/md';
import axios from 'axios';
import { BASE_URL } from '../../config/URL';

const LinkedInInformation = ({ isOpen, onClose, leadData }) => {
    const [loading, setLoading] = useState(false);
    const [people, setPeople] = useState([]);
    const [error, setError] = useState(null);

    const fetchPersonnelInfo = async () => {
        if (!leadData?.website) {
            setError("No website available for this lead to scan.");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${BASE_URL}/api/social-media/linkedin-info`, {
                leadId: leadData._id,
                website: leadData?.website,
                companyName: leadData?.title
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                setPeople(response.data.data || []);
            } else {
                setError(response.data.message || "Failed to retrieve information.");
            }
        } catch (err) {
            console.error("Personnel Discovery Error:", err);
            setError(err.response?.data?.message || "An error occurred while scanning the website.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen && leadData) {
            fetchPersonnelInfo();
        }
    }, [isOpen, leadData]);

    const copyToClipboard = (text, label) => {
        navigator.clipboard.writeText(text);
        message.success(`${label} copied to clipboard`);
    };

    return (
        <Modal
            title={
                <div className="flex items-center gap-2 py-1">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                        <MdPeople size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-gray-900 m-0">Company Team Discovery</h3>
                        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider m-0">Leadership & Management Scan</p>
                    </div>
                </div>
            }
            open={isOpen}
            onCancel={onClose}
            footer={[
                <Button key="close" onClick={onClose} className="rounded-xl px-6">
                    Close
                </Button>,
                <Button 
                    key="refresh" 
                    icon={<MdRefresh />} 
                    onClick={fetchPersonnelInfo} 
                    loading={loading}
                    className="rounded-xl bg-gray-50 border-gray-200"
                >
                    Rescan
                </Button>
            ]}
            width={700}
            centered
            className="premium-modal"
            closeIcon={<MdClose className="text-xl" />}
        >
            <div className="py-4">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-4">
                        <div className="relative">
                            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                            <MdPeople className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary animate-pulse" size={24} />
                        </div>
                        <div className="text-center">
                            <h4 className="text-gray-900 font-bold m-0">Scanning Website...</h4>
                            <p className="text-xs text-gray-400">Identifying team members & leadership</p>
                        </div>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center">
                        <div className="w-12 h-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MdClose size={24} />
                        </div>
                        <h4 className="text-red-800 font-bold mb-2">Scan Failed</h4>
                        <p className="text-red-600 text-sm mb-4">{error}</p>
                        <Button onClick={fetchPersonnelInfo} type="primary" danger className="rounded-xl">
                            Try Again
                        </Button>
                    </div>
                ) : people.length > 0 ? (
                    <div className="space-y-4">
                        {people.map((person, index) => (
                            <div 
                                key={index} 
                                className="group relative bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-xl hover:border-primary/20 transition-all duration-300"
                            >
                                <div className="flex flex-col md:flex-row gap-5">
                                    {/* Avatar & Basic Info */}
                                    <div className="flex-shrink-0 flex md:flex-col items-center gap-3">
                                        <Avatar 
                                            size={64} 
                                            icon={<MdPerson />} 
                                            src={person.avatar}
                                            className="bg-primary/10 text-primary border-2 border-white shadow-md"
                                        />
                                        <div className="flex flex-col gap-1.5">
                                            <Tag color={
                                                person.role?.toLowerCase().includes('ceo') || 
                                                person.role?.toLowerCase().includes('owner') ||
                                                person.role?.toLowerCase().includes('founder') ? 'gold' : 'blue'
                                            } className="m-0 rounded-full px-3 py-0.5 font-semibold text-[10px] uppercase tracking-wider text-center">
                                                {person.role || 'Personnel'}
                                            </Tag>
                                            <Tag color="cyan" className="m-0 rounded-full px-2 py-0.5 text-[9px] font-medium opacity-80 text-center">
                                                {person.source || 'Company Website'}
                                            </Tag>
                                        </div>
                                    </div>

                                    {/* Details */}
                                    <div className="flex-grow space-y-3">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h4 className="text-xl font-black text-gray-900">{person.name}</h4>
                                                <div className="flex items-center gap-1 text-gray-500 text-sm mt-0.5">
                                                    <MdBusinessCenter className="text-primary" />
                                                    <span>{person.title || person.role} at {leadData?.title}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                                            {/* Contact Grid */}
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl group/item">
                                                    <div className="flex items-center gap-2 overflow-hidden">
                                                        <MdEmail className="text-gray-400 shrink-0" />
                                                        <span className="text-sm text-gray-600 truncate">{person.email || 'No email found'}</span>
                                                    </div>
                                                    {person.email && (
                                                        <button 
                                                            onClick={() => copyToClipboard(person.email, 'Email')}
                                                            className="p-1 hover:bg-gray-200 rounded text-gray-400 opacity-0 group-hover/item:opacity-100 transition-opacity"
                                                        >
                                                            <MdContentCopy size={14} />
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl group/item">
                                                    <div className="flex items-center gap-2 overflow-hidden">
                                                        <MdPhone className="text-gray-400 shrink-0" />
                                                        <span className="text-sm text-gray-600 truncate">{person.phone || 'No phone found'}</span>
                                                    </div>
                                                    {person.phone && (
                                                        <button 
                                                            onClick={() => copyToClipboard(person.phone, 'Phone')}
                                                            className="p-1 hover:bg-gray-200 rounded text-gray-400 opacity-0 group-hover/item:opacity-100 transition-opacity"
                                                        >
                                                            <MdContentCopy size={14} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-xl">
                                                    <MdLocationOn className="text-gray-400 shrink-0" />
                                                    <span className="text-sm text-gray-600 truncate">{person.location || leadData?.city || 'N/A'}</span>
                                                </div>
                                                <div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-xl">
                                                    <MdBusinessCenter className="text-gray-400 shrink-0" />
                                                    <span className="text-xs text-gray-500">Source: {person.source || 'Website Scan'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <Empty 
                        image={Empty.PRESENTED_IMAGE_SIMPLE} 
                        description={
                            <div className="text-center">
                                <p className="text-gray-500">No team members found on the website.</p>
                                <Button 
                                    type="link" 
                                    onClick={fetchPersonnelInfo}
                                    className="text-primary font-bold"
                                >
                                    Rescan Website
                                </Button>
                            </div>
                        } 
                    />
                )}
            </div>
        </Modal>
    );
};

export default LinkedInInformation;