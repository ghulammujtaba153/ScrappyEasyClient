import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../config/URL';
import { useAuth } from '../../context/authContext';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaUsers, FaUserPlus, FaArrowRight, FaSignOutAlt, FaTimes } from 'react-icons/fa';
import { message, Modal } from 'antd';
import Loader from '../../components/common/Loader';
import SubscriptionRestrictedModal from '../../components/SubscriptionRestrictedModal';
import TeamModal from '../../components/dashboard/TeamModal';

const TeamPage = () => {
    const { user, token, accessStatus } = useAuth();
    const navigate = useNavigate();
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTeam, setCurrentTeam] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [memberTeams, setMemberTeams] = useState([]); // Teams where user is a member

    // Subscription State
    const isAuthorized = accessStatus.isAuthorized;
    const [isLockedModalOpen, setIsLockedModalOpen] = useState(false);
    const [lockedFeature, setLockedFeature] = useState('');

    // Fetch all teams for current user
    const fetchTeams = React.useCallback(async () => {
        try {
            setLoading(true);
            const ownerRes = await axios.get(`${BASE_URL}/api/team/get/owner/${user._id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTeams(ownerRes.data);

            const memberRes = await axios.get(`${BASE_URL}/api/team/get/member/${user._id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
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
    }, [user, token]);

    useEffect(() => {
        if (!user || !token) return;
        fetchTeams();
    }, [user, token, fetchTeams]);

    const handleOpenModal = (team = null) => {
        if (!isAuthorized) {
            setLockedFeature('Team Management');
            setIsLockedModalOpen(true);
            return;
        }
        setCurrentTeam(team);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentTeam(null);
    };

    const handleSubmit = async (teamData) => {
        setSubmitting(true);
        try {
            if (currentTeam) {
                await axios.put(
                    `${BASE_URL}/api/team/update/${currentTeam._id}`,
                    { ...teamData, owner: user._id },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                message.success('Team updated successfully');
            } else {
                await axios.post(
                    `${BASE_URL}/api/team/create`,
                    { ...teamData, owner: user._id },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                message.success('Team created & invitations sent!');
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

    const handleViewTeam = (teamId) => {
        if (!isAuthorized) {
            setLockedFeature('Team Details');
            setIsLockedModalOpen(true);
            return;
        }
        navigate(`/dashboard/team/${teamId}`);
    };

    const handleLeaveTeam = async (team) => {
        Modal.confirm({
            title: 'Leave Team',
            content: `Are you sure you want to leave "${team.name}"? You will no longer have access to this team's data.`,
            onOk: async () => {
                try {
                    const memberEmails = team.members
                        .filter(m => m._id !== user._id)
                        .map(m => m.email);

                    await axios.put(
                        `${BASE_URL}/api/team/update/${team._id}`,
                        { memberEmails },
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    message.success('You have left the team');
                    fetchTeams();
                } catch {
                    message.error('Failed to leave team');
                }
            }
        });
    };

    const handleRemoveMember = async (team, memberToRemove) => {
        Modal.confirm({
            title: 'Remove Member',
            content: `Are you sure you want to remove ${memberToRemove.name || memberToRemove.email} from "${team.name}"?`,
            okText: 'Remove',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: async () => {
                try {
                    const memberEmails = team.members
                        .filter(m => m._id !== memberToRemove._id)
                        .map(m => m.email);

                    await axios.put(
                        `${BASE_URL}/api/team/update/${team._id}`,
                        { memberEmails },
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    message.success('Member removed successfully');
                    fetchTeams();
                } catch {
                    message.error('Failed to remove member');
                }
            }
        });
    };

    if (loading) return <Loader />;

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Team Workspace</h1>
                    <p className="text-sm text-gray-600">Collaborate with your professionals in real-time</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors font-medium"
                >
                    <FaPlus /> Create New Team
                </button>
            </div>

                {/* My Teams */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
                        <h2 className="text-lg font-bold text-gray-800">
                            My Owned Teams
                        </h2>
                    </div>

                    {teams.length === 0 ? (
                        <div className="text-center py-12">
                             <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mx-auto mb-4">
                                <FaUsers size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 mb-2">No active teams</h3>
                            <button onClick={() => handleOpenModal()} className="text-primary hover:text-primary/80 font-medium mt-2">Create your first team</button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {teams.map((team) => (
                                <div key={team._id} className="bg-white rounded-lg border border-gray-200 hover:border-primary/50 transition-colors flex flex-col h-full overflow-hidden shadow-sm hover:shadow-md">
                                    <div className="p-6 flex-grow">
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="text-lg font-bold text-gray-900">{team.name}</h3>
                                            <div className="flex gap-2">
                                                <button onClick={() => handleOpenModal(team)} className="text-gray-400 hover:text-blue-600 transition-colors"><FaEdit /></button>
                                                <button onClick={() => handleDelete(team._id)} className="text-gray-400 hover:text-red-500 transition-colors"><FaTrash /></button>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            <div className="px-2 py-1 rounded bg-emerald-50 border border-emerald-100 text-xs font-medium text-emerald-600">
                                                Owner: {user.name || user.email?.split('@')[0]} (You)
                                            </div>
                                        </div>
                                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Members</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {team.members?.map(m => (
                                                <div key={m._id} className={`px-2 py-1 flex items-center gap-1 rounded bg-gray-50 border border-gray-100 text-xs font-medium ${m.status === 'invited' ? 'text-orange-600' : 'text-gray-600'}`}>
                                                    <span>{m.name || m.email?.split('@')[0]} {m.status === 'invited' && '(Invited)'}</span>
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); handleRemoveMember(team, m); }}
                                                        className="ml-1 text-gray-400 hover:text-red-500 transition-colors focus:outline-none"
                                                        title="Remove user"
                                                    >
                                                        <FaTimes size={10} />
                                                    </button>
                                                </div>
                                            ))}
                                            <button 
                                                onClick={() => handleOpenModal(team)} 
                                                className="px-2 py-1 flex items-center justify-center rounded bg-gray-50 hover:bg-blue-50 border border-dashed border-gray-300 hover:border-blue-300 text-xs font-medium text-gray-500 hover:text-blue-600 transition-colors cursor-pointer"
                                                title="Invite member"
                                            >
                                                <FaPlus size={10} className="mr-1" /> Add
                                            </button>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-t border-gray-100">
                                        <span className="text-xs font-medium text-gray-500">{team.members?.length || 0}/2 Members</span>
                                        <button onClick={() => handleViewTeam(team._id)} className="text-primary hover:text-primary/80 font-medium text-sm transition-colors">Open Workspace</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Member Teams */}
                {memberTeams.length > 0 && (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
                            <h2 className="text-lg font-bold text-gray-800">
                                Shared Workspaces
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {memberTeams.map((team) => (
                                <div key={team._id} className="bg-white rounded-lg border border-gray-200 hover:border-blue-500/50 transition-colors flex flex-col h-full overflow-hidden shadow-sm hover:shadow-md">
                                    <div className="p-6 flex-grow">
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="text-lg font-bold text-gray-900">{team.name}</h3>
                                            <button onClick={() => handleLeaveTeam(team)} className="text-gray-400 hover:text-orange-500 transition-colors" title="Leave Team"><FaSignOutAlt /></button>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            <div className="px-2 py-1 rounded bg-blue-50 border border-blue-100 text-xs font-medium text-blue-600">
                                                Owner: {team.owner?.name || team.owner?.email?.split('@')[0]}
                                            </div>
                                        </div>
                                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Members</h4>
                                        <div className="flex flex-wrap gap-2">
                                            <div className="px-2 py-1 flex items-center gap-1 rounded bg-emerald-50 border border-emerald-100 text-xs font-medium text-emerald-600">
                                                <span>{user.name || user.email?.split('@')[0]} (You)</span>
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); handleLeaveTeam(team); }}
                                                    className="ml-1 text-emerald-400 hover:text-red-500 transition-colors focus:outline-none"
                                                    title="Leave team"
                                                >
                                                    <FaTimes size={10} />
                                                </button>
                                            </div>
                                            {team.members?.filter(m => m._id !== user._id).map(m => (
                                                <div key={m._id} className={`px-2 py-1 rounded bg-gray-50 border border-gray-100 text-xs font-medium ${m.status === 'invited' ? 'text-orange-600' : 'text-gray-600'}`}>
                                                    {m.name || m.email?.split('@')[0]} {m.status === 'invited' && '(Invited)'}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 px-6 py-4 flex justify-end border-t border-gray-100">
                                        <button onClick={() => handleViewTeam(team._id)} className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors">Enter Dashboard</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            
            <TeamModal
                open={isModalOpen}
                onCancel={handleCloseModal}
                onSubmit={handleSubmit}
                initialData={currentTeam}
                loading={submitting}
            />

            <SubscriptionRestrictedModal
                open={isLockedModalOpen}
                onClose={() => setIsLockedModalOpen(false)}
                featureName={lockedFeature}
            />
        </div>
    );
};

export default TeamPage;
