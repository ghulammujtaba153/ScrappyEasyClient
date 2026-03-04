import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../config/URL';
import { useAuth } from '../../context/authContext';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaUsers, FaUserPlus, FaArrowRight, FaSignOutAlt } from 'react-icons/fa';
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

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-12 animate-fadeIn">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                             <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-inner">
                                <FaUsers size={24} />
                             </div>
                             <h1 className="text-4xl font-black text-slate-900 tracking-tight">Team Workspace</h1>
                        </div>
                        <p className="text-slate-500 font-medium ml-1">Collaborate with your professionals in real-time</p>
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="group flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-2xl hover:bg-primary/90 transition-all duration-300 font-black shadow-xl shadow-primary/30 active:scale-95"
                    >
                        <FaPlus /> Create New Team
                    </button>
                </div>

                {/* My Teams */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                        <h2 className="text-xl font-extrabold text-slate-800 flex items-center gap-3">
                            <span className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center text-primary text-xs">01</span>
                            My Owned Teams
                        </h2>
                    </div>

                    {teams.length === 0 ? (
                        <div className="bg-white rounded-3xl shadow-xl p-20 text-center border border-slate-100">
                             <div className="w-24 h-24 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-300 mx-auto mb-6">
                                <FaUsers size={48} />
                            </div>
                            <h3 className="text-2xl font-black text-slate-800 mb-3">No active teams</h3>
                            <button onClick={() => handleOpenModal()} className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold mt-4 shadow-xl">Launch First Team</button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {teams.map((team) => (
                                <div key={team._id} className="group bg-white rounded-[2rem] shadow-xl hover:shadow-2xl transition-all border border-slate-100 flex flex-col h-full overflow-hidden">
                                    <div className="p-8 flex-grow">
                                        <div className="flex justify-between items-start mb-6">
                                            <h3 className="text-2xl font-black text-slate-900 group-hover:text-primary transition-colors">{team.name}</h3>
                                            <div className="flex gap-1">
                                                <button onClick={() => handleOpenModal(team)} className="p-2 text-slate-400 hover:text-blue-600"><FaEdit /></button>
                                                <button onClick={() => handleDelete(team._id)} className="p-2 text-slate-400 hover:text-red-500"><FaTrash /></button>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {team.members?.map(m => (
                                                <div key={m._id} className={`px-3 py-1 rounded-lg text-xs font-bold ${m.status === 'invited' ? 'bg-orange-50 text-orange-600' : 'bg-primary/10 text-primary'}`}>
                                                    {m.name || m.email?.split('@')[0]} {m.status === 'invited' && '(Invited)'}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 p-6 flex justify-between items-center border-t">
                                        <span className="text-xs font-bold text-slate-500">{team.members?.length || 0}/2 Members</span>
                                        <button onClick={() => handleViewTeam(team._id)} className="bg-white text-slate-700 px-5 py-3 rounded-2xl border font-semibold text-sm hover:border-primary">Open Workspace</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Member Teams */}
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
                                <div key={team._id} className="bg-white rounded-[2rem] shadow-xl border border-blue-50 flex flex-col h-full overflow-hidden">
                                    <div className="p-8 flex-grow">
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="text-2xl font-black text-slate-900">{team.name}</h3>
                                            <button onClick={() => handleLeaveTeam(team)} className="text-slate-300 hover:text-orange-500"><FaSignOutAlt /></button>
                                        </div>
                                        <p className="text-sm font-bold text-slate-500 mb-4">Owner: {team.owner?.name || team.owner?.email}</p>
                                    </div>
                                    <div className="bg-blue-50/30 p-6 flex justify-end">
                                        <button onClick={() => handleViewTeam(team._id)} className="bg-white text-blue-600 px-5 py-3 rounded-2xl border border-blue-100 font-semibold text-sm hover:bg-blue-600 hover:text-white transition-all">Enter Dashboard</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

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
