import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../config/URL';
import { useAuth } from '../../context/authContext';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { FaPlus, FaEdit, FaTrash, FaUsers, FaUserPlus, FaArrowRight, FaSignOutAlt } from 'react-icons/fa';
import { message, Modal, Spin } from 'antd';
import Loader from '../../components/common/Loader';
import SubscriptionRestrictedModal from '../../components/SubscriptionRestrictedModal';

const TeamPage = () => {
    const { user, token, accessStatus } = useAuth();
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

    // Subscription State - driven by shared authContext accessStatus
    const isAuthorized = accessStatus.isAuthorized;
    const [isLockedModalOpen, setIsLockedModalOpen] = useState(false);
    const [lockedFeature, setLockedFeature] = useState('');

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
        if (!user || !token) return;
        fetchTeams();
        fetchUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, token]);

    // Transform users for react-select
    const userOptions = users.map(u => ({
        value: u._id,
        label: `${u.name} (${u.email})`
    }));

    const handleOpenModal = (team = null) => {
        if (!isAuthorized) {
            setLockedFeature('Team Management');
            setIsLockedModalOpen(true);
            return;
        }

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
        if (!isAuthorized) {
            setLockedFeature('Team Management');
            setIsLockedModalOpen(true);
            return;
        }

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
        if (selectedOptions && selectedOptions.length > 2) {
            message.warning('Maximum of 2 sub-accounts allowed per team.');
            return;
        }
        setFormData({
            ...formData,
            members: selectedOptions ? selectedOptions.map(opt => opt.value) : []
        });
    };

    // Handle navigating to team detail
    const handleViewTeam = (teamId) => {
        if (!isAuthorized) {
            setLockedFeature('Team Details');
            setIsLockedModalOpen(true);
            return;
        }
        navigate(`/dashboard/team/${teamId}`);
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
        <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-12 animate-fadeIn">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                             <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-inner">
                                <FaUsers size={24} />
                             </div>
                             <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                                Team Workspace
                             </h1>
                        </div>
                        <p className="text-slate-500 font-medium ml-1">Orchestrate your collaborative efforts and manage permissions</p>
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="group flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-2xl hover:bg-primary/90 transition-all duration-300 font-black shadow-xl shadow-primary/30 active:scale-95"
                    >
                        <FaPlus className="group-hover:rotate-90 transition-transform duration-300" />
                        Create New Team
                    </button>
                </div>

                {/* My Teams Section (Owner) */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                        <h2 className="text-xl font-extrabold text-slate-800 flex items-center gap-3">
                            <span className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center text-primary text-xs">01</span>
                            My Owned Teams
                        </h2>
                        <span className="text-slate-500 text-xs font-medium bg-slate-100 px-3 py-1 rounded-full">
                            {teams.length} Workspace{teams.length !== 1 && 's'}
                        </span>
                    </div>

                    {teams.length === 0 ? (
                        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-20 text-center border border-slate-100 relative overflow-hidden group">
                           <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full -mr-32 -mt-32 opacity-50 group-hover:scale-110 transition-transform duration-700"></div>
                            <div className="relative z-10 max-w-sm mx-auto">
                                <div className="w-24 h-24 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-300 mx-auto mb-6 group-hover:text-primary transition-colors duration-500">
                                    <FaUsers size={48} />
                                </div>
                                <h3 className="text-2xl font-black text-slate-800 mb-3">No active teams</h3>
                                <p className="text-slate-400 font-medium mb-8">Ready to start collaborating? Create your first team and invite your partners to the workspace.</p>
                                <button
                                    onClick={() => handleOpenModal()}
                                    className="inline-flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl hover:bg-slate-800 transition-all duration-300 font-bold shadow-xl shadow-slate-200 active:scale-95"
                                >
                                    <FaPlus />
                                    Launch First Team
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {teams.map((team) => (
                                <div
                                    key={team._id}
                                    className="group bg-white rounded-[2rem] shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 overflow-hidden border border-slate-100 flex flex-col h-full active:scale-[0.99]"
                                >
                                    <div className="p-8 flex-grow">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="space-y-1">
                                                <h3 className="text-2xl font-black text-slate-900 leading-tight group-hover:text-primary transition-colors duration-300">{team.name}</h3>
                                                <div className="flex items-center gap-2 text-primary font-medium text-xs">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                                                    Active
                                                </div>
                                            </div>
                                            <div className="flex gap-1">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleOpenModal(team); }}
                                                    className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                                    title="Edit Team"
                                                >
                                                    <FaEdit size={16} />
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleDelete(team._id); }}
                                                    className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                    title="Delete Team"
                                                >
                                                    <FaTrash size={14} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-4 mb-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-500">
                                                    <FaUserPlus size={12} />
                                                </div>
                                                <span className="text-sm font-bold text-slate-600">{team.members?.length || 0} Professional{team.members?.length !== 1 && 's'}</span>
                                            </div>
                                            
                                            <div className="flex flex-wrap gap-2 pt-2">
                                                {team.members?.length > 0 ? (
                                                    <>
                                                        {team.members.slice(0, 4).map((member) => (
                                                            <div
                                                                key={member._id}
                                                                className="w-9 h-9 border-2 border-white rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shadow-sm hover:z-10 transition-transform hover:scale-110"
                                                                title={member.name || member.email}
                                                            >
                                                                {(member.name || member.email)?.[0]?.toUpperCase()}
                                                            </div>
                                                        ))}
                                                        {team.members.length > 4 && (
                                                            <div className="w-9 h-9 border-2 border-white rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs">
                                                                +{team.members.length - 4}
                                                            </div>
                                                        )}
                                                    </>
                                                ) : (
                                                    <p className="text-xs text-slate-400 font-medium italic opacity-70">No collaborators added</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-slate-50/50 p-6 flex justify-between items-center group-hover:bg-primary/[0.02] transition-colors border-t border-slate-50">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-slate-400 font-medium">Created</span>
                                            <span className="text-xs font-bold text-slate-700">{new Date(team.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</span>
                                        </div>
                                        <button
                                            onClick={() => handleViewTeam(team._id)}
                                            className="group/btn flex items-center gap-2 bg-white text-slate-700 px-5 py-3 rounded-2xl border border-slate-200 hover:border-primary hover:text-primary font-semibold text-sm transition-all duration-300 shadow-sm"
                                        >
                                            Open Workspace
                                            <FaArrowRight className="group-hover/btn:translate-x-1 transition-transform" size={10} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Teams I'm In Section (Member) */}
                {memberTeams.length > 0 && (
                    <div className="space-y-6 pt-6">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                            <h2 className="text-xl font-extrabold text-slate-800 flex items-center gap-3">
                                <span className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-600 text-xs">02</span>
                                Shared Workspaces
                            </h2>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {memberTeams.map((team) => (
                                <div
                                    key={team._id}
                                    className="group bg-white rounded-[2rem] shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 overflow-hidden border border-blue-50 flex flex-col h-full active:scale-[0.99]"
                                >
                                    <div className="p-8 flex-grow">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="space-y-1">
                                                <h3 className="text-2xl font-black text-slate-900 leading-tight group-hover:text-blue-600 transition-colors duration-300">{team.name}</h3>
                                                <div className="flex items-center gap-2 text-blue-500 font-medium text-xs">
                                                    Guest Contributor
                                                </div>
                                            </div>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleLeaveTeam(team); }}
                                                className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-orange-500 hover:bg-orange-50 rounded-xl transition-all"
                                                title="Leave Team"
                                            >
                                                <FaSignOutAlt size={16} />
                                            </button>
                                        </div>

                                        <div className="space-y-3 mb-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-blue-50/50 flex items-center justify-center text-blue-400">
                                                    <FaUsers size={12} />
                                                </div>
                                                <span className="text-sm font-bold text-slate-600">Managed by {team.owner?.name || team.owner?.email?.split('@')[0]}</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            {team.members?.slice(0, 3).map((member) => (
                                                <div
                                                    key={member._id}
                                                    className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${member._id === user._id
                                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                                                        : 'bg-slate-50 text-slate-500'
                                                        }`}
                                                >
                                                    {member.name || member.email?.split('@')[0]}
                                                    {member._id === user._id && ' (You)'}
                                                </div>
                                            ))}
                                            {team.members?.length > 3 && (
                                                <span className="px-3 py-1.5 text-[10px] font-black text-slate-400">+{team.members.length - 3}</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="bg-blue-50/30 p-6 flex justify-between items-center group-hover:bg-blue-500/[0.01] transition-colors border-t border-blue-50">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-white rounded-lg shadow-sm flex items-center justify-center text-blue-500 font-semibold text-xs">
                                                {team.members?.length || 0}
                                            </div>
                                            <span className="text-xs font-medium text-slate-500">Members</span>
                                        </div>
                                        <button
                                            onClick={() => handleViewTeam(team._id)}
                                            className="group/btn flex items-center gap-2 bg-white text-blue-600 px-5 py-3 rounded-2xl border border-blue-100 hover:bg-blue-600 hover:text-white font-semibold text-sm transition-all duration-300 shadow-sm"
                                        >
                                            Enter Dashboard
                                            <FaArrowRight className="group-hover/btn:translate-x-1 transition-transform" size={10} />
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
                        <div className="flex items-center gap-4 py-2">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${isEditMode ? 'bg-blue-50 text-blue-600 shadow-blue-100' : 'bg-green-50 text-green-600 shadow-green-100'}`}>
                                {isEditMode ? <FaEdit size={24} /> : <FaPlus size={24} />}
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                                    {isEditMode ? 'Refine Team' : 'New Workspace'}
                                </h2>
                                <p className="text-slate-400 text-xs font-medium italic mt-0.5">Define your collaboration boundaries</p>
                            </div>
                        </div>
                    }
                    open={isModalOpen}
                    onCancel={handleCloseModal}
                    footer={null}
                    width={600}
                    centered
                    className="premium-modal"
                    transitionName="ant-zoom"
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
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g. Apollo Strategy Team"
                                    className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:bg-white focus:border-primary/50 outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300 shadow-inner group-hover:bg-slate-100/50"
                                />
                            </div>
                        </div>

                        {/* Members Selection */}
                        <div>
                             <div className="flex items-center justify-between mb-2 px-1">
                                <label className="text-sm font-semibold text-slate-600">
                                    Add Members
                                </label>
                            </div>
                            <Select
                                isMulti
                                options={userOptions}
                                value={userOptions.filter(opt => formData.members.includes(opt.value))}
                                onChange={handleMembersChange}
                                placeholder="Search by name or email..."
                                className="react-select-container"
                                classNamePrefix="react-select"
                                styles={{
                                    control: (base, state) => ({
                                        ...base,
                                        borderRadius: '1rem',
                                        borderWidth: '2px',
                                        backgroundColor: '#f8fafc',
                                        borderColor: state.isFocused ? 'rgba(15, 121, 44, 0.4)' : '#f8fafc',
                                        padding: '0.6rem',
                                        boxShadow: 'none',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            borderColor: 'rgba(15, 121, 44, 0.2)'
                                        }
                                    }),
                                    multiValue: (base) => ({
                                        ...base,
                                        backgroundColor: '#E7F2EA',
                                        borderRadius: '0.75rem',
                                        padding: '2px 8px'
                                    }),
                                    multiValueLabel: (base) => ({
                                        ...base,
                                        color: '#0F792C',
                                        fontWeight: '800',
                                        fontSize: '11px',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.025em'
                                    }),
                                    multiValueRemove: (base) => ({
                                        ...base,
                                        color: '#0F792C',
                                        '&:hover': {
                                            backgroundColor: '#0F792C',
                                            color: 'white',
                                            borderRadius: '6px'
                                        }
                                    }),
                                    option: (base, state) => ({
                                        ...base,
                                        fontSize: '13px',
                                        fontWeight: '600',
                                        padding: '12px 16px',
                                        backgroundColor: state.isSelected
                                            ? '#0F792C'
                                            : state.isFocused
                                                ? 'rgba(15, 121, 44, 0.05)'
                                                : 'white',
                                        color: state.isSelected ? 'white' : '#1e293b',
                                        '&:active': {
                                            backgroundColor: '#0F792C'
                                        }
                                    }),
                                    menu: (base) => ({
                                        ...base,
                                        borderRadius: '1.25rem',
                                        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
                                        border: '1px solid #f1f5f9',
                                        marginTop: '8px',
                                        overflow: 'hidden'
                                    })
                                }}
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4 pt-6 border-t border-slate-50">
                            <button
                                onClick={handleCloseModal}
                                className="flex-1 px-6 py-4 text-slate-500 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all font-semibold text-sm active:scale-95"
                                disabled={submitting}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={submitting}
                                className="flex-[1.5] px-6 py-4 bg-primary text-white rounded-2xl hover:bg-primary/90 transition-all font-semibold text-sm flex items-center justify-center gap-3 shadow-xl shadow-primary/20 active:scale-95 disabled:opacity-50"
                            >
                                {submitting ? (
                                    <>
                                        <Spin size="small" className="text-white" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        {isEditMode ? <><FaEdit size={16} /> Update Team</> : <><FaPlus size={16} /> Create Team</>}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </Modal>
            </div>

            <SubscriptionRestrictedModal
                open={isLockedModalOpen}
                onClose={() => setIsLockedModalOpen(false)}
                featureName={lockedFeature}

            />


        </div>
    );
};

export default TeamPage;
