import React, { useState, useEffect } from 'react';
import { Modal, Select, Button, message, Spin, Radio } from 'antd';
import { MdInput, MdOutlineCategory, MdVerified, MdArrowForward } from 'react-icons/md';
import axios from 'axios';
import { BASE_URL } from '../../config/URL';

const { Option } = Select;

const ImportLeadsToTeamModal = ({ 
    visible, 
    onCancel, 
    teamId, 
    userId, 
    token,
    onSuccess 
}) => {
    const [sourceType, setSourceType] = useState('operation'); // 'operation' or 'qualified'
    const [sources, setSources] = useState([]);
    const [selectedSource, setSelectedSource] = useState(null);
    const [loadingSources, setLoadingSources] = useState(false);
    const [importing, setImporting] = useState(false);

    const fetchSources = React.useCallback(async () => {
        if (!userId || !token) return;
        
        setLoadingSources(true);
        setSelectedSource(null);
        try {
            if (sourceType === 'operation') {
                const res = await axios.get(`${BASE_URL}/api/data/unique/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSources(res.data.data || []);
            } else {
                const res = await axios.get(`${BASE_URL}/api/qualified-leads/get/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSources(res.data || []);
            }
        } catch (error) {
            console.error('Error fetching sources:', error);
            message.error('Failed to fetch import sources');
        } finally {
            setLoadingSources(false);
        }
    }, [userId, token, sourceType]);

    useEffect(() => {
        if (visible) {
            fetchSources();
        }
    }, [visible, fetchSources]);

    const handleImport = async () => {
        if (!selectedSource) {
            message.warning('Please select a source to import from');
            return;
        }

        setImporting(true);
        try {
            let leadIds = [];
            
            if (sourceType === 'operation') {
                const res = await axios.get(`${BASE_URL}/api/data/record/${selectedSource}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                leadIds = (res.data.data.leads || []).map(l => l._id || l).filter(Boolean);
            } else {
                const res = await axios.get(`${BASE_URL}/api/qualified-leads/get-by-id/${selectedSource}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const entries = res.data.entries || [];
                // leadId can be a populated object { _id, title, ... } or a raw ObjectId string
                leadIds = entries.map(e => {
                    const lid = e.leadId;
                    if (!lid) return null;
                    // Populated document → use ._id; raw ObjectId string/object → use directly
                    return (typeof lid === 'object' && lid._id) ? lid._id : lid;
                }).filter(Boolean);

                if (leadIds.length === 0 && entries.length > 0) {
                    message.warning(`Found ${entries.length} entries but none had valid lead references. The list may not be linked to lead data.`);
                    setImporting(false);
                    return;
                }
            }

            if (leadIds.length === 0) {
                message.warning('The selected source has no leads to import');
                setImporting(false);
                return;
            }

            const importRes = await axios.post(`${BASE_URL}/api/team-data/bulk-assign`, {
                teamId: teamId,
                userId: userId,
                leadIds: leadIds
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (importRes.data.success) {
                message.success(`Successfully imported ${importRes.data.count} leads`);
                if (onSuccess) onSuccess();
                onCancel();
            }
        } catch (error) {
            console.error('Import error:', error);
            message.error(error.response?.data?.error || 'Failed to import leads');
        } finally {
            setImporting(false);
        }
    };

    return (
        <Modal
            title={
                <div className="flex items-center gap-3 pb-2 border-b border-gray-100">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                        <MdInput size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 tracking-tight">Import Leads</h2>
                        <p className="text-xs text-gray-500 font-normal mt-0.5">Bring existing leads into this team</p>
                    </div>
                </div>
            }
            open={visible}
            onCancel={onCancel}
            footer={null}
            width={550}
            centered
            className="premium-modal"
        >
            <div className="py-6 space-y-8">
                <div className="space-y-3">
                    <label className="block text-sm font-bold text-gray-700">
                        1. Choose Source Type
                    </label>
                    <Radio.Group 
                        value={sourceType} 
                        onChange={(e) => setSourceType(e.target.value)}
                        className="w-full flex"
                    >
                        <Radio.Button value="operation" className="flex-1 h-16 flex items-center justify-center gap-2 rounded-l-2xl">
                            <MdOutlineCategory className="text-xl" />
                            <div className="text-left">
                                <div className="text-sm font-bold leading-none">Operations</div>
                                <div className="text-[10px] text-gray-500 font-normal mt-1">Raw scraped data</div>
                            </div>
                        </Radio.Button>
                        <Radio.Button value="qualified" className="flex-1 h-16 flex items-center justify-center gap-2 rounded-r-2xl">
                            <MdVerified className="text-xl" />
                            <div className="text-left">
                                <div className="text-sm font-bold leading-none">Qualified Lists</div>
                                <div className="text-[10px] text-gray-500 font-normal mt-1">Filtered & verified lists</div>
                            </div>
                        </Radio.Button>
                    </Radio.Group>
                </div>

                <div className="space-y-3">
                    <label className="block text-sm font-bold text-gray-700">
                        2. Select {sourceType === 'operation' ? 'Operation' : 'Qualified List'}
                    </label>
                    {loadingSources ? (
                        <div className="h-14 flex items-center justify-center bg-gray-50 rounded-2xl border border-gray-200">
                            <Spin size="small" />
                        </div>
                    ) : (
                        <Select
                            placeholder={`Select ${sourceType === 'operation' ? 'an operation' : 'a list'}`}
                            className="w-full h-14 custom-select-premium"
                            value={selectedSource}
                            onChange={(val) => setSelectedSource(val)}
                            showSearch
                            optionFilterProp="children"
                        >
                            {sources.map(source => (
                                <Option key={source.id || source._id} value={source.id || source._id}>
                                    <div className="flex items-center justify-between py-1">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-gray-900">{source.searchString || source.name}</span>
                                            <span className="text-[10px] text-gray-500">
                                                Created: {new Date(source.updatedAt || source.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-bold">
                                            {source.count || source.totalRecords || source.leads?.length || 0} leads
                                        </span>
                                    </div>
                                </Option>
                            ))}
                        </Select>
                    )}
                </div>

                {selectedSource && (
                    <div className="bg-green-50 p-5 rounded-[1.5rem] border border-green-100 flex items-center gap-4">
                        <div className="bg-white p-3 rounded-xl shadow-sm text-primary">
                            <MdVerified size={20} />
                        </div>
                        <div>
                            <p className="text-sm font-black text-green-900">Source Selected</p>
                            <p className="text-xs text-green-700">Ready to import leads into this team database.</p>
                        </div>
                    </div>
                )}

                <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                    <Button
                        onClick={onCancel}
                        className="h-12 px-8 rounded-2xl font-bold border-gray-200 hover:bg-gray-50"
                        disabled={importing}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="primary"
                        icon={<MdArrowForward />}
                        onClick={handleImport}
                        loading={importing}
                        disabled={!selectedSource}
                        className="h-12 px-10 rounded-2xl font-black bg-primary border-none shadow-lg shadow-primary/25 flex flex-row-reverse items-center gap-2 hover:translate-x-1 transition-transform"
                    >
                        Start Import
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default ImportLeadsToTeamModal;
