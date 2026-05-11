import React, { useState, useEffect } from 'react';
import { Modal, Select, Button, message, Spin, Space, Tag } from 'antd';
import { MdGroupAdd, MdCheckCircle, MdArrowForward } from 'react-icons/md';
import axios from 'axios';
import { BASE_URL } from '../../config/URL';

const { Option } = Select;

const ExportToTeamModal = ({ 
    visible, 
    onCancel, 
    leads, 
    userId, 
    token,
    onSuccess 
}) => {
    const [teams, setTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [loadingTeams, setLoadingTeams] = useState(false);
    const [exporting, setExporting] = useState(false);

    // Fetch all teams for current user (Owned + Member)
    const fetchTeams = React.useCallback(async () => {
        if (!userId || !token) return;
        
        setLoadingTeams(true);
        try {
            // Fetch teams where user is owner
            const ownerRes = await axios.get(`${BASE_URL}/api/team/get/owner/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            // Fetch teams where user is a member
            const memberRes = await axios.get(`${BASE_URL}/api/team/get/member/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Filter out teams where user is both owner and member (if any) to avoid duplicates
            const memberOnlyTeams = memberRes.data.filter(
                team => team.owner?._id !== userId && team.owner !== userId
            );

            // Combine both lists
            const allTeams = [...ownerRes.data, ...memberOnlyTeams];
            setTeams(allTeams);
            
            if (allTeams.length > 0 && !selectedTeam) {
                setSelectedTeam(allTeams[0]._id);
            }
        } catch (error) {
            console.error('Error fetching teams:', error);
            message.error('Failed to fetch teams');
        } finally {
            setLoadingTeams(false);
        }
    }, [userId, token, selectedTeam]);

    useEffect(() => {
        if (visible) {
            fetchTeams();
        }
    }, [visible, fetchTeams]);

    const handleExport = async () => {
        if (!selectedTeam) {
            message.warning('Please select a team');
            return;
        }

        if (!leads || leads.length === 0) {
            message.warning('No leads to export');
            return;
        }

        setExporting(true);
        try {
            // Extract lead IDs. Depending on the source, they might be _id or leadId
            const leadIds = leads.map(l => l.leadId || l._id).filter(Boolean);

            const res = await axios.post(`${BASE_URL}/api/team-data/bulk-assign`, {
                teamId: selectedTeam,
                userId: userId,
                leadIds: leadIds
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                message.success(res.data.message);
                if (onSuccess) onSuccess();
                onCancel();
            }
        } catch (error) {
            console.error('Export to team error:', error);
            message.error(error.response?.data?.error || 'Failed to export leads to team');
        } finally {
            setExporting(false);
        }
    };

    return (
        <Modal
            title={
                <div className="flex items-center gap-3 pb-2 border-b border-gray-100">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                        <MdGroupAdd size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 tracking-tight">Export to Team</h2>
                        <p className="text-xs text-gray-500 font-normal mt-0.5">Share leads with your collaboration groups</p>
                    </div>
                </div>
            }
            open={visible}
            onCancel={onCancel}
            footer={null}
            width={500}
            centered
            className="premium-modal"
        >
            <div className="py-6 space-y-6">
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-center gap-4">
                    <div className="bg-white p-2 rounded-lg shadow-sm">
                        <MdCheckCircle className="text-blue-500 text-xl" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-blue-900">{leads?.length || 0} Leads Selected</p>
                        <p className="text-xs text-blue-600">Ready to be assigned to a team</p>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Select Target Team
                    </label>
                    {loadingTeams ? (
                        <div className="h-12 flex items-center justify-center bg-gray-50 rounded-xl border border-gray-200">
                            <Spin size="small" />
                        </div>
                    ) : (
                        <Select
                            placeholder="Choose a team"
                            className="w-full h-12 custom-select-premium"
                            value={selectedTeam}
                            onChange={(val) => setSelectedTeam(val)}
                            notFoundContent={
                                <div className="p-4 text-center">
                                    <p className="text-gray-500 text-sm">No teams found</p>
                                    <Button 
                                        type="link" 
                                        onClick={() => window.location.href = '/dashboard/collaboration'}
                                        className="text-primary p-0 h-auto"
                                    >
                                        Create your first team
                                    </Button>
                                </div>
                            }
                        >
                            {teams.map(team => {
                                const isOwner = team.owner?._id === userId || team.owner === userId;
                                return (
                                    <Option key={team._id} value={team._id}>
                                        <div className="flex items-center justify-between">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-gray-900">{team.name}</span>
                                                <span className="text-[10px] text-gray-500">
                                                    {isOwner ? 'Your Team' : `Owner: ${team.owner?.name || 'Shared'}`}
                                                </span>
                                            </div>
                                            <div className="flex gap-2">
                                                <Tag color={isOwner ? "blue" : "purple"} className="text-[10px] border-none rounded-full px-2 m-0">
                                                    {isOwner ? 'Owner' : 'Member'}
                                                </Tag>
                                                <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                                                    {team.members?.length || 0} members
                                                </span>
                                            </div>
                                        </div>
                                    </Option>
                                );
                            })}
                        </Select>
                    )}
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                    <Button
                        onClick={onCancel}
                        className="h-11 px-6 rounded-xl font-bold border-gray-200"
                        disabled={exporting}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="primary"
                        icon={<MdArrowForward />}
                        onClick={handleExport}
                        loading={exporting}
                        disabled={!selectedTeam || teams.length === 0}
                        className="h-11 px-8 rounded-xl font-black bg-primary border-none shadow-lg shadow-primary/20 flex flex-row-reverse items-center gap-2"
                    >
                        Confirm Export
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default ExportToTeamModal;
