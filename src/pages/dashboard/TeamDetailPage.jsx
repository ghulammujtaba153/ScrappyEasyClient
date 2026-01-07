import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../config/URL';
import { useAuth } from '../../context/authContext';
import { Table, Select, message, Popconfirm } from 'antd';
import { FaPlus, FaEdit, FaTrash, FaArrowLeft, FaUsers, FaPhone, FaLink, FaEye } from 'react-icons/fa';
import Loader from '../../components/common/Loader';
import TeamDataModal from '../../components/dashboard/TeamDataModal';

const TeamDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, token } = useAuth();
    
    const [team, setTeam] = useState(null);
    const [teamData, setTeamData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isViewMode, setIsViewMode] = useState(false);
    const [currentData, setCurrentData] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        phone: '',
        link: '',
        status: 'new'
    });

    // Check if user has access to this team
    const hasAccess = () => {
        if (!team || !user) return false;
        const isOwner = team.owner?._id === user._id;
        const isMember = team.members?.some(m => m._id === user._id);
        return isOwner || isMember;
    };

    // Fetch team details
    const fetchTeam = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/team/get/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTeam(res.data);
        } catch (error) {
            console.error('Error fetching team:', error);
            message.error('Failed to fetch team details');
        }
    };

    // Fetch team data
    const fetchTeamData = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/team-data/get/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTeamData(res.data);
        } catch (error) {
            console.error('Error fetching team data:', error);
            message.error('Failed to fetch team data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id && token) {
            fetchTeam();
            fetchTeamData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, token]);

    const handleOpenModal = (data = null, viewOnly = false) => {
        if (data) {
            setIsEditMode(!viewOnly);
            setIsViewMode(viewOnly);
            setCurrentData(data);
            setFormData({
                title: data.title || '',
                description: data.description || '',
                phone: data.phone || '',
                link: data.link || '',
                status: data.status || 'new'
            });
        } else {
            setIsEditMode(false);
            setIsViewMode(false);
            setCurrentData(null);
            setFormData({
                title: '',
                description: '',
                phone: '',
                link: '',
                status: 'new'
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentData(null);
        setFormData({
            title: '',
            description: '',
            phone: '',
            link: '',
            status: 'new'
        });
        setIsEditMode(false);
        setIsViewMode(false);
    };

    const handleSubmit = async () => {
        if (!formData.phone.trim()) {
            message.error('Phone number is required');
            return;
        }

        setSubmitting(true);
        try {
            if (isEditMode) {
                await axios.put(
                    `${BASE_URL}/api/team-data/update/${currentData._id}`,
                    { ...formData, team: id, user: user._id },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                message.success('Data updated successfully');
            } else {
                await axios.post(
                    `${BASE_URL}/api/team-data/create`,
                    { ...formData, team: id, user: user._id },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                message.success('Data created successfully');
            }
            handleCloseModal();
            fetchTeamData();
        } catch (error) {
            console.error('Error saving data:', error);
            message.error(error.response?.data?.error || 'Failed to save data');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (dataId) => {
        try {
            await axios.delete(`${BASE_URL}/api/team-data/delete/${dataId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            message.success('Data deleted successfully');
            fetchTeamData();
        } catch (error) {
            console.error('Error deleting data:', error);
            message.error('Failed to delete data');
        }
    };

    // Handle inline status update
    const handleStatusChange = async (dataId, newStatus) => {
        try {
            await axios.put(
                `${BASE_URL}/api/team-data/update/${dataId}`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            message.success('Status updated successfully');
            fetchTeamData();
        } catch (error) {
            console.error('Error updating status:', error);
            message.error('Failed to update status');
        }
    };

    const columns = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            render: (text) => text || '-'
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            key: 'phone',
            render: (phone) => (
                <span className="flex items-center gap-2">
                    <FaPhone className="text-gray-400" />
                    {phone}
                </span>
            )
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
            render: (text) => text || '-'
        },
        {
            title: 'Link',
            dataIndex: 'link',
            key: 'link',
            render: (link) => link ? (
                <a 
                    href={link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                    <FaLink /> View
                </a>
            ) : '-'
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status, record) => (
                <Select
                    value={status}
                    onChange={(value) => handleStatusChange(record._id, value)}
                    size="small"
                    style={{ width: 120 }}
                    options={[
                        { value: 'new', label: <span className="text-blue-600">New</span> },
                        { value: 'contacted', label: <span className="text-orange-600">Contacted</span> },
                        { value: 'qualified', label: <span className="text-green-600">Qualified</span> },
                        { value: 'unqualified', label: <span className="text-red-600">Unqualified</span> }
                    ]}
                />
            )
        },
        {
            title: 'Added By',
            dataIndex: 'user',
            key: 'user',
            render: (userData) => (
                <span className="text-gray-600">
                    {userData?.name || userData?.email || 'Unknown'}
                </span>
            )
        },
        {
            title: 'Created',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => new Date(date).toLocaleDateString()
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <div className="flex gap-1">
                    <button
                        onClick={() => handleOpenModal(record, true)}
                        className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        title="View"
                    >
                        <FaEye />
                    </button>
                    <button
                        onClick={() => handleOpenModal(record, false)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                    >
                        <FaEdit />
                    </button>
                    <Popconfirm
                        title="Delete this data?"
                        description="This action cannot be undone."
                        onConfirm={() => handleDelete(record._id)}
                        okText="Delete"
                        cancelText="Cancel"
                        okButtonProps={{ danger: true }}
                    >
                        <button
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                        >
                            <FaTrash />
                        </button>
                    </Popconfirm>
                </div>
            )
        }
    ];

    if (loading) {
        return <Loader />;
    }

    if (!hasAccess()) {
        return (
            <div className="min-h-screen bg-gray-50 py-8 px-4 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
                    <p className="text-gray-600 mb-4">You don't have access to this team.</p>
                    <button
                        onClick={() => navigate('/dashboard/team')}
                        className="text-primary hover:text-primary/80"
                    >
                        Back to Teams
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/dashboard/team')}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
                    >
                        <FaArrowLeft /> Back to Teams
                    </button>
                    
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                                <FaUsers className="text-primary" />
                                {team?.name}
                            </h1>
                            <p className="text-gray-600 mt-1">
                                {team?.members?.length || 0} members • Owner: {team?.owner?.name || team?.owner?.email}
                            </p>
                        </div>
                        <button
                            onClick={() => handleOpenModal()}
                            className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-all duration-300 shadow-md hover:shadow-lg"
                        >
                            <FaPlus />
                            Add Data
                        </button>
                    </div>
                </div>

                {/* Team Members */}
                <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Team Members</h3>
                    <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                            {team?.owner?.name || team?.owner?.email} (Owner)
                        </span>
                        {team?.members?.map((member) => (
                            <span
                                key={member._id}
                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                    member._id === user._id 
                                        ? 'bg-blue-100 text-blue-700' 
                                        : 'bg-gray-100 text-gray-700'
                                }`}
                            >
                                {member.name || member.email}
                                {member._id === user._id && ' (You)'}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Data Table */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <Table
                        columns={columns}
                        dataSource={teamData}
                        rowKey="_id"
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
                        }}
                        locale={{
                            emptyText: (
                                <div className="py-8 text-center">
                                    <FaUsers className="mx-auto text-4xl text-gray-300 mb-3" />
                                    <p className="text-gray-500">No data yet. Click "Add Data" to get started.</p>
                                </div>
                            )
                        }}
                    />
                </div>

                {/* Add/Edit/View Modal */}
                <TeamDataModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSubmit={handleSubmit}
                    formData={formData}
                    setFormData={setFormData}
                    isEditMode={isEditMode}
                    isViewMode={isViewMode}
                    submitting={submitting}
                />
            </div>
        </div>
    );
};

export default TeamDetailPage;
