import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../config/URL';
import { useAuth } from '../../context/authContext';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { FaPlus, FaEdit, FaTrash, FaUsers, FaUserPlus, FaArrowRight, FaSignOutAlt } from 'react-icons/fa';
import { message, Modal, Spin } from 'antd';
import Loader from '../../components/common/Loader';

const TeamPage = () => {
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const [teams, setTeams] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentTeam, setCurrentTeam] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        members: []
    });
    const [submitting, setSubmitting] = useState(false);
    const [memberTeams, setMemberTeams] = useState([]); // Teams where user is a member

    // Fetch all teams for current user (as owner)
    const fetchTeams = async () => {
        try {
            setLoading(true);
            // Fetch teams owned by user
            const ownerRes = await axios.get(`${BASE_URL}/api/team/get/owner/${user._id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTeams(ownerRes.data);
            
            // Fetch teams where user is a member
            const memberRes = await axios.get(`${BASE_URL}/api/team/get/member/${user._id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Filter out teams that user owns (to avoid duplicates)
            const memberOnlyTeams = memberRes.data.filter(
                team => team.owner?._id !== user._id
            );
            setMemberTeams(memberOnlyTeams);
        } catch (error) {
            console.error('Error fetching teams:', error);
            message.error('Failed to fetch teams');
        } finally {
            setLoading(false);
        }
    };

    // Fetch all users for selection
    const fetchUsers = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/auth/users`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { limit: 1000 }
            });
            // Filter out current user from selection
            const filteredUsers = res.data.users.filter(u => u._id !== user._id);
            setUsers(filteredUsers);
        } catch (error) {
            console.error('Error fetching users:', error);
            message.error('Failed to fetch users');
        }
    };

    useEffect(() => {
        if (user && token) {
            fetchTeams();
            fetchUsers();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, token]);

    // Transform users for react-select
    const userOptions = users.map(u => ({
        value: u._id,
        label: `${u.name} (${u.email})`
    }));

    const handleOpenModal = (team = null) => {
        if (team) {
            setIsEditMode(true);
            setCurrentTeam(team);
            setFormData({
                name: team.name,
                members: team.members?.map(m => m._id) || []
            });
        } else {
            setIsEditMode(false);
            setCurrentTeam(null);
            setFormData({ name: '', members: [] });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentTeam(null);
        setFormData({ name: '', members: [] });
        setIsEditMode(false);
    };

    const handleSubmit = async () => {
        if (!formData.name.trim()) {
            message.error('Team name is required');
            return;
        }

        setSubmitting(true);
        try {
            if (isEditMode) {
                await axios.put(
                    `${BASE_URL}/api/team/update/${currentTeam._id}`,
                    { ...formData, owner: user._id },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                message.success('Team updated successfully');
            } else {
                await axios.post(
                    `${BASE_URL}/api/team/create`,
                    { ...formData, owner: user._id },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                message.success('Team created successfully');
            }
            handleCloseModal();
            fetchTeams();
        } catch (error) {
            console.error('Error saving team:', error);
            message.error(error.response?.data?.message || 'Failed to save team');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (teamId) => {
        Modal.confirm({
            title: 'Delete Team',
            content: 'Are you sure you want to delete this team? This action cannot be undone.',
            okText: 'Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: async () => {
                try {
                    await axios.delete(`${BASE_URL}/api/team/delete/${teamId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    message.success('Team deleted successfully');
                    fetchTeams();
                } catch (error) {
                    console.error('Error deleting team:', error);
                    message.error('Failed to delete team');
                }
            }
        });
    };

    const handleMembersChange = (selectedOptions) => {
        setFormData({
            ...formData,
            members: selectedOptions ? selectedOptions.map(opt => opt.value) : []
        });
    };

    // Handle leaving a team (for members only)
    const handleLeaveTeam = async (team) => {
        Modal.confirm({
            title: 'Leave Team',
            content: `Are you sure you want to leave "${team.name}"? You will no longer have access to this team's data.`,
            okText: 'Leave',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: async () => {
                try {
                    // Remove current user from members array
                    const updatedMembers = team.members
                        .filter(m => m._id !== user._id)
                        .map(m => m._id);
                    
                    await axios.put(
                        `${BASE_URL}/api/team/update/${team._id}`,
                        { members: updatedMembers },
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    message.success('You have left the team');
                    fetchTeams();
                } catch (error) {
                    console.error('Error leaving team:', error);
                    message.error('Failed to leave team');
                }
            }
        });
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                            <FaUsers className="text-primary" />
                            Team Management
                        </h1>
                        <p className="text-gray-600 mt-1">Create and manage your teams</p>
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                        <FaPlus />
                        Create Team
                    </button>
                </div>

                {/* My Teams Section (Owner) */}
                <div className="mb-10">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full"></span>
                        My Teams
                    </h2>
                    {teams.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                            <FaUsers className="mx-auto text-6xl text-gray-300 mb-4" />
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Teams Yet</h3>
                            <p className="text-gray-500 mb-6">Create your first team to start collaborating with others</p>
                            <button
                                onClick={() => handleOpenModal()}
                                className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-all duration-300"
                            >
                                <FaPlus />
                                Create Your First Team
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {teams.map((team) => (
                                <div
                                    key={team._id}
                                    className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100"
                                >
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="text-xl font-bold text-gray-900">{team.name}</h3>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleOpenModal(team)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Edit Team"
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(team._id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete Team"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                                <FaUserPlus />
                                                <span>{team.members?.length || 0} Members</span>
                                            </div>
                                        </div>

                                        {/* Members List */}
                                        <div className="space-y-2">
                                            <p className="text-sm font-medium text-gray-700">Team Members:</p>
                                            {team.members?.length > 0 ? (
                                                <div className="flex flex-wrap gap-2">
                                                    {team.members.slice(0, 5).map((member) => (
                                                        <span
                                                            key={member._id}
                                                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary"
                                                        >
                                                            {member.name || member.email}
                                                        </span>
                                                    ))}
                                                    {team.members.length > 5 && (
                                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                                            +{team.members.length - 5} more
                                                        </span>
                                                    )}
                                                </div>
                                            ) : (
                                                <p className="text-sm text-gray-400 italic">No members added yet</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex justify-between items-center">
                                        <p className="text-xs text-gray-500">
                                            Created: {new Date(team.createdAt).toLocaleDateString()}
                                        </p>
                                        <button
                                            onClick={() => navigate(`/dashboard/team/${team._id}`)}
                                            className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 font-medium transition-colors"
                                        >
                                            View Team <FaArrowRight className="text-xs" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Teams I'm In Section (Member) */}
                {memberTeams.length > 0 && (
                    <div className="mb-10">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            Teams I'm In
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {memberTeams.map((team) => (
                                <div
                                    key={team._id}
                                    className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-blue-100"
                                >
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="text-xl font-bold text-gray-900">{team.name}</h3>
                                            <div className="flex items-center gap-2">
                                                <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                                                    Member
                                                </span>
                                                <button
                                                    onClick={() => handleLeaveTeam(team)}
                                                    className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                                                    title="Leave Team"
                                                >
                                                    <FaSignOutAlt />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                                <FaUserPlus />
                                                <span>{team.members?.length || 0} Members</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <FaUsers />
                                                <span>Owner: {team.owner?.name || team.owner?.email || 'Unknown'}</span>
                                            </div>
                                        </div>

                                        {/* Members List */}
                                        <div className="space-y-2">
                                            <p className="text-sm font-medium text-gray-700">Team Members:</p>
                                            {team.members?.length > 0 ? (
                                                <div className="flex flex-wrap gap-2">
                                                    {team.members.slice(0, 5).map((member) => (
                                                        <span
                                                            key={member._id}
                                                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                                                member._id === user._id 
                                                                    ? 'bg-blue-100 text-blue-700' 
                                                                    : 'bg-primary/10 text-primary'
                                                            }`}
                                                        >
                                                            {member.name || member.email}
                                                            {member._id === user._id && ' (You)'}
                                                        </span>
                                                    ))}
                                                    {team.members.length > 5 && (
                                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                                            +{team.members.length - 5} more
                                                        </span>
                                                    )}
                                                </div>
                                            ) : (
                                                <p className="text-sm text-gray-400 italic">No members added yet</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="bg-blue-50 px-6 py-3 border-t border-blue-100 flex justify-between items-center">
                                        <p className="text-xs text-gray-500">
                                            Created: {new Date(team.createdAt).toLocaleDateString()}
                                        </p>
                                        <button
                                            onClick={() => navigate(`/dashboard/team/${team._id}`)}
                                            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                                        >
                                            View Team <FaArrowRight className="text-xs" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Create/Edit Modal */}
                <Modal
                    title={
                        <div className="flex items-center gap-2 text-lg font-semibold">
                            {isEditMode ? <FaEdit className="text-blue-600" /> : <FaPlus className="text-green-600" />}
                            {isEditMode ? 'Edit Team' : 'Create New Team'}
                        </div>
                    }
                    open={isModalOpen}
                    onCancel={handleCloseModal}
                    footer={null}
                    width={600}
                    centered
                >
                    <div className="py-4 space-y-6">
                        {/* Team Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Team Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Enter team name"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                            />
                        </div>

                        {/* Members Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Invite Members
                            </label>
                            <Select
                                isMulti
                                options={userOptions}
                                value={userOptions.filter(opt => formData.members.includes(opt.value))}
                                onChange={handleMembersChange}
                                placeholder="Select users to invite..."
                                className="react-select-container"
                                classNamePrefix="react-select"
                                noOptionsMessage={() => "No users found"}
                                styles={{
                                    control: (base, state) => ({
                                        ...base,
                                        borderColor: state.isFocused ? '#0F792C' : '#d1d5db',
                                        boxShadow: state.isFocused ? '0 0 0 2px rgba(15, 121, 44, 0.2)' : 'none',
                                        '&:hover': {
                                            borderColor: '#0F792C'
                                        },
                                        padding: '4px'
                                    }),
                                    multiValue: (base) => ({
                                        ...base,
                                        backgroundColor: 'rgba(15, 121, 44, 0.1)',
                                        borderRadius: '6px'
                                    }),
                                    multiValueLabel: (base) => ({
                                        ...base,
                                        color: '#0F792C',
                                        fontWeight: '500'
                                    }),
                                    multiValueRemove: (base) => ({
                                        ...base,
                                        color: '#0F792C',
                                        '&:hover': {
                                            backgroundColor: '#0F792C',
                                            color: 'white'
                                        }
                                    }),
                                    option: (base, state) => ({
                                        ...base,
                                        backgroundColor: state.isSelected 
                                            ? '#0F792C' 
                                            : state.isFocused 
                                                ? 'rgba(15, 121, 44, 0.1)' 
                                                : 'white',
                                        color: state.isSelected ? 'white' : '#374151',
                                        '&:active': {
                                            backgroundColor: '#0F792C'
                                        }
                                    })
                                }}
                            />
                            <p className="text-xs text-gray-500 mt-2">
                                You can select multiple users to add to your team
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-3 pt-4 border-t">
                            <button
                                onClick={handleCloseModal}
                                className="px-6 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                                disabled={submitting}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={submitting}
                                className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium flex items-center gap-2 disabled:opacity-50"
                            >
                                {submitting ? (
                                    <>
                                        <Spin size="small" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        {isEditMode ? <FaEdit /> : <FaPlus />}
                                        {isEditMode ? 'Update Team' : 'Create Team'}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </Modal>
            </div>
        </div>
    );
};

export default TeamPage;
