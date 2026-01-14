import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined, PhoneOutlined, ClockCircleOutlined, CheckCircleOutlined, CloseCircleOutlined, InfoCircleOutlined, UserOutlined } from '@ant-design/icons';
import { Table, Button, Space, Tag, Progress, Card, Statistic, message, Empty, Modal, Radio, Alert, Badge, Select, Spin } from 'antd';
import axios from 'axios';
import { useAuth } from '../../context/authContext';
import { BASE_URL } from '../../config/URL';
import Dialer from '../../components/Dialer';
import Loader from '../../components/common/Loader';
import { checkAccessStatus } from '../../api/subscriptionApi';
import SubscriptionRestrictedModal from '../../components/SubscriptionRestrictedModal';
import { MdLock } from 'react-icons/md';

const ColdCallerDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [campaign, setCampaign] = useState(null);

  // Dialer & Status States
  const [showDialer, setShowDialer] = useState(false);
  const [dialerNumber, setDialerNumber] = useState("");
  const [callingLeadId, setCallingLeadId] = useState(null);
  const [callingEntryId, setCallingEntryId] = useState(null);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("successful");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Subscription/Trial State
  const [isAuthorized, setIsAuthorized] = useState(true);
  const [accessType, setAccessType] = useState('trial');
  const [trialInfo, setTrialInfo] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isLockedModalOpen, setIsLockedModalOpen] = useState(false);
  const [lockedFeature, setLockedFeature] = useState('');

  // Pagination state for row numbering
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  // Check if campaign uses qualified leads
  const isQualifiedLeadsCampaign = useMemo(() => {
    return campaign?.qualifiedLeadsId && campaign.qualifiedLeadsId.entries?.length > 0;
  }, [campaign]);

  // Get unified leads list from either qualified leads or legacy numbers
  const leads = useMemo(() => {
    if (!campaign) return [];

    if (isQualifiedLeadsCampaign) {
      return campaign.qualifiedLeadsId.entries
        .filter(entry => entry.leadId?.phone)
        .map(entry => ({
          _id: entry._id,
          entryId: entry._id,
          leadId: entry.leadId._id,
          number: entry.leadId.phone,
          businessName: entry.leadId.title || 'Unknown',
          city: entry.leadId.city || '',
          address: entry.leadId.address || '',
          status: entry.callStatus || 'not-called',
          leadStatus: entry.leadId.status || 'not-reached',
          lastCalled: entry.lastCalledAt,
          recordingUrl: entry.recordingUrl,
          attempts: entry.callAttempts || 0,
          notes: entry.callNotes,
          isQualifiedLead: true
        }));
    }

    // Legacy numbers array
    return (campaign.numbers || []).map(n => ({
      ...n,
      businessName: null,
      leadStatus: 'not-reached',
      isQualifiedLead: false
    }));
  }, [campaign, isQualifiedLeadsCampaign]);

  const fetchCampaignData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/coldcall/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setCampaign(res.data.data);
      }
    } catch (error) {
      console.error('Fetch detail error:', error);
      message.error('Failed to load campaign details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user || !token || !id) return;

    const init = async () => {
      setCheckingAuth(true);
      const status = await checkAccessStatus(user?._id || user?.id, token);
      setIsAuthorized(status.isAuthorized);
      setAccessType(status.type);
      setTrialInfo(status.trial);
      setCheckingAuth(false);

      fetchCampaignData();
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user, token]);

  const handleCall = (record) => {
    if (!isAuthorized) {
      setLockedFeature('Cold Calling');
      setIsLockedModalOpen(true);
      return;
    }
    setDialerNumber(record.number);
    setCallingLeadId(record._id);
    setCallingEntryId(record.entryId || null);
    setShowDialer(true);
  };

  const onCallEnd = () => {
    // When call ends, show the status selection modal
    if (callingLeadId || callingEntryId) {
      setStatusModalVisible(true);
    }
  };

  const handleUpdateStatus = async () => {
    if (!callingLeadId && !callingEntryId) return;
    setUpdatingStatus(true);
    try {
      let res;

      if (isQualifiedLeadsCampaign && callingEntryId) {
        // Update status via qualified leads entry
        res = await axios.put(`${BASE_URL}/api/coldcall/update-call-status/${id}`, {
          entryId: callingEntryId,
          status: selectedStatus
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        // Legacy: update via numbers array
        res = await axios.put(`${BASE_URL}/api/coldcall/update/${id}`, {
          leadId: callingLeadId,
          status: selectedStatus
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      if (res.data.success) {
        message.success('Lead status updated');
        fetchCampaignData();
        setStatusModalVisible(false);
        setCallingLeadId(null);
        setCallingEntryId(null);
      }
    } catch (error) {
      console.error('Update status error:', error);
      message.error('Failed to update lead status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Handle inline status change from dropdown
  const handleInlineStatusChange = async (record, newStatus) => {
    try {
      let res;

      if (isQualifiedLeadsCampaign && record.entryId) {
        res = await axios.put(`${BASE_URL}/api/coldcall/update-call-status/${id}`, {
          entryId: record.entryId,
          status: newStatus
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        res = await axios.put(`${BASE_URL}/api/coldcall/update/${id}`, {
          leadId: record._id,
          status: newStatus
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      if (res.data.success) {
        message.success('Status updated');
        fetchCampaignData();
      }
    } catch (error) {
      console.error('Inline status update error:', error);
      message.error('Failed to update status');
    }
  };

  // Status options for dropdown (Call Status)
  const statusOptions = [
    { value: 'not-called', label: '⏳ Not Called', color: 'default' },
    { value: 'interested', label: '✅ Interested', color: 'success' },
    { value: 'callback', label: '📞 Callback', color: 'processing' },
    { value: 'not-interested', label: '❌ Not Interested', color: 'warning' },
    { value: 'no-answer', label: '📵 No Answer', color: 'orange' },
    { value: 'wrong-number', label: '🚫 Wrong Number', color: 'error' },
    { value: 'ignore', label: '🔇 Ignore', color: 'default' },
  ];

  // Lead Status options (overall lead status from LeadData)
  const leadStatusOptions = [
    { value: 'not-reached', label: '⏳ Not Reached', color: 'default' },
    { value: 'interested', label: '✅ Interested', color: 'success' },
    { value: 'not-interested', label: '❌ Not Interested', color: 'error' },
    { value: 'no-response', label: '📵 No Response', color: 'warning' },
  ];

  // Handle lead status update (overall status in LeadData)
  const handleLeadStatusChange = async (leadId, newStatus) => {
    try {
      const res = await axios.post(`${BASE_URL}/api/data/update-lead-status`, {
        leadId,
        status: newStatus
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        message.success('Lead status updated');
        fetchCampaignData();
      }
    } catch (error) {
      console.error('Lead status update error:', error);
      message.error('Failed to update lead status');
    }
  };

  if (loading) {
    return (
      <Loader />
    );
  }

  if (!campaign) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-gray-50 min-h-screen">
        <Empty description="Campaign not found" />
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/dashboard/cold-caller')}
          className="mt-4"
        >
          Back to Dashboard
        </Button>
      </div>
    );
  }

  // Stats calculation
  const total = leads.length;
  const interested = leads.filter(n => n.status === 'successful' || n.status === 'interested').length;
  const callback = leads.filter(n => n.status === 'callback').length;
  const pending = leads.filter(n => n.status === 'pending' || n.status === 'not-called').length;
  const notInterested = leads.filter(n => n.status === 'not-interested' || n.status === 'no-answer' || n.status === 'wrong-number').length;
  const successRate = total > 0 ? Math.round((interested / total) * 100) : 0;

  // Get current lead being called for modal display
  const currentCallingLead = leads.find(n =>
    (callingEntryId && n.entryId === callingEntryId) ||
    (callingLeadId && n._id === callingLeadId)
  );

  const columns = [
    {
      title: '#',
      width: 50,
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
    },
    ...(isQualifiedLeadsCampaign ? [{
      title: 'Business',
      key: 'business',
      width: 200,
      render: (_, record) => (
        <div>
          <div className="font-medium text-gray-800">{record.businessName}</div>
          {record.city && <div className="text-xs text-gray-500">{record.city}</div>}
        </div>
      ),
    }] : []),
    {
      title: 'Phone Number',
      dataIndex: 'number',
      key: 'number',
      render: (text) => <span className="font-mono font-medium">{text}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 160,
      render: (status, record) => (
        <Select
          value={status || 'not-called'}
          onChange={(value) => handleInlineStatusChange(record, value)}
          style={{ width: 150 }}
          size="small"
          options={statusOptions}
          optionRender={(option) => (
            <span>{option.data.label}</span>
          )}
        />
      )
    },
    ...(isQualifiedLeadsCampaign ? [{
      title: 'Lead Status',
      dataIndex: 'leadStatus',
      key: 'leadStatus',
      width: 160,
      render: (leadStatus, record) => (
        <Select
          value={leadStatus || 'not-reached'}
          onChange={(value) => handleLeadStatusChange(record.leadId, value)}
          style={{ width: 150 }}
          size="small"
          options={leadStatusOptions}
          optionRender={(option) => (
            <span>{option.data.label}</span>
          )}
        />
      )
    }] : []),
    ...(isQualifiedLeadsCampaign ? [{
      title: 'Attempts',
      dataIndex: 'attempts',
      key: 'attempts',
      width: 80,
      render: (attempts) => attempts || 0,
    }] : []),
    {
      title: 'Last Contact',
      dataIndex: 'lastCalled',
      key: 'lastCalled',
      render: (date) => date ? new Date(date).toLocaleString() : <span className="text-gray-400">Not called yet</span>,
    },
    {
      title: 'Recording',
      dataIndex: 'recordingUrl',
      key: 'recording',
      render: (url) => url ? (
        <audio
          controls
          src={`${BASE_URL}/api/call/recording-stream?recordingUrl=${encodeURIComponent(url)}`}
          className="h-8 w-60"
        />
      ) : <span className="text-gray-400 text-xs">No Rec</span>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button
          type="primary"
          icon={<PhoneOutlined />}
          size="small"
          onClick={() => handleCall(record)}
          style={{ backgroundColor: '#0F792C', borderColor: '#0F792C' }}
        >
          Call
        </Button>
      )
    }
  ];

  return (
    <div className="p-6 pb-20 space-y-6 bg-gray-50 min-h-screen">
      {/* Dialer Overlay */}
      {showDialer && (
        <Dialer
          phoneNumber={dialerNumber}
          onClose={() => setShowDialer(false)}
          onCallEnd={onCallEnd}
        />
      )}

      {/* Status Update Modal */}
      <Modal
        title="Update Call Status"
        open={statusModalVisible}
        onOk={handleUpdateStatus}
        confirmLoading={updatingStatus}
        onCancel={() => setStatusModalVisible(false)}
      >
        <p className="mb-4 text-gray-600">
          How did the call with{' '}
          <span className="font-bold text-gray-800">
            {currentCallingLead?.businessName || currentCallingLead?.number}
          </span>{' '}
          go?
        </p>
        <Radio.Group onChange={(e) => setSelectedStatus(e.target.value)} value={selectedStatus}>
          <Space direction="vertical">
            <Radio value="successful" className="text-green-600 font-medium">
              <CheckCircleOutlined /> Successful (Lead Interested)
            </Radio>
            <Radio value="callback" className="text-blue-500 font-medium">
              <ClockCircleOutlined /> Callback (Schedule Follow-up)
            </Radio>
            <Radio value="no-answer" className="text-orange-500 font-medium">
              <CloseCircleOutlined /> No Answer
            </Radio>
            <Radio value="not-interested" className="text-gray-500 font-medium">
              <CloseCircleOutlined /> Not Interested
            </Radio>
            <Radio value="failed" className="text-red-500 font-medium">
              <CloseCircleOutlined /> Failed (Wrong Number / Other)
            </Radio>
          </Space>
        </Radio.Group>
      </Modal>

      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/dashboard/cold-caller')}
          shape="circle"
        />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {campaign.name}
            {isQualifiedLeadsCampaign && (
              <Badge
                count={<UserOutlined className="text-green-600" />}
                style={{ marginLeft: 8 }}
                title="Linked to Qualified Leads"
              />
            )}
          </h1>
          <p className="text-gray-500 text-sm">Campaign ID: {campaign._id}</p>
        </div>
      </div>

      {/* Qualified Leads Info */}
      {isQualifiedLeadsCampaign && (
        <Alert
          type="info"
          showIcon
          message={`Linked to: ${campaign.qualifiedLeadsId.name}`}
          description="This campaign is linked to a qualified leads list. Call status is tracked per lead with business details."
        />
      )}

      {/* Call Script */}
      {campaign.callScript && (
        <Card className="bg-yellow-50 border-yellow-200">
          <h4 className="font-semibold text-yellow-800 mb-2">📝 Call Script</h4>
          <p className="text-yellow-700 whitespace-pre-wrap">{campaign.callScript}</p>
        </Card>
      )}

      <div className="flex justify-end gap-2 mb-8">
        {!isQualifiedLeadsCampaign && (
          <Button
            icon={<PhoneOutlined />}
            onClick={() => {
              Modal.confirm({
                title: 'Add New Lead',
                content: (
                  <div className="mt-4">
                    <p className="mb-2 text-gray-500">Enter phone number to add to this campaign:</p>
                    <input
                      id="new-lead-number"
                      className="w-full p-2 border rounded-md font-mono"
                      placeholder="+923001234567"
                    />
                  </div>
                ),
                onOk: async () => {
                  const number = document.getElementById('new-lead-number')?.value;
                  if (!number) {
                    message.error('Number is required');
                    return;
                  }
                  try {
                    const res = await axios.put(`${BASE_URL}/api/coldcall/update/${id}`, {
                      newNumber: number
                    }, {
                      headers: { Authorization: `Bearer ${token}` }
                    });
                    if (res.data.success) {
                      message.success('Lead added successfully');
                      setCampaign(res.data.data);
                    }
                  } catch {
                    message.error('Failed to add lead');
                  }
                }
              });
            }}
            style={{ backgroundColor: '#0F792C', borderColor: '#0F792C', color: 'white' }}
          >
            Add Lead
          </Button>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
        <Card bordered={false} className="shadow-sm">
          <Statistic title="Total Leads" value={total} prefix={<PhoneOutlined />} />
        </Card>
        <Card bordered={false} className="shadow-sm">
          <Statistic
            title="Interest Rate"
            value={successRate}
            suffix="%"
            valueStyle={{ color: '#0F792C' }}
          />
          <Progress percent={successRate} size="small" strokeColor="#0F792C" showInfo={false} />
        </Card>
        <Card bordered={false} className="shadow-sm">
          <Statistic title="Interested" value={interested} valueStyle={{ color: '#0F792C' }} />
        </Card>
        <Card bordered={false} className="shadow-sm">
          <Statistic title="Callback" value={callback} valueStyle={{ color: '#1890ff' }} />
        </Card>
        <Card bordered={false} className="shadow-sm">
          <Statistic title="Pending" value={pending} valueStyle={{ color: '#faad14' }} />
        </Card>
        <Card bordered={false} className="shadow-sm">
          <Statistic title="Not Interested" value={notInterested} valueStyle={{ color: '#ff4d4f' }} />
        </Card>
      </div>

      {/* Numbers Table */}
      <Card title="Lead Details" className="shadow-sm rounded-xl mb-10">
        <Table
          columns={columns}
          dataSource={leads}
          rowKey={(record) => record._id || record.entryId}
          scroll={{ x: 'max-content' }}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            },
            showSizeChanger: true,
            pageSizeOptions: ['10', '15', '25', '50']
          }}
        />
      </Card>

      {/* Campaign Info */}
      <Card className="bg-blue-50 border-blue-100">
        <div className="flex gap-3">
          <InfoCircleOutlined className="text-blue-500 text-xl mt-1" />
          <div>
            <h4 className="font-semibold text-blue-900">Campaign Insights</h4>
            <p className="text-blue-700 text-sm">
              This campaign was created on {new Date(campaign.createdAt).toLocaleDateString()}.
              Currently, {pending} leads are waiting to be called.
              Interest rate is {successRate}% based on {interested} interested leads out of {total - pending} contacted.
            </p>
          </div>
        </div>
      </Card>

      <SubscriptionRestrictedModal
        open={isLockedModalOpen}
        onClose={() => setIsLockedModalOpen(false)}
        featureName={lockedFeature}
        accessType={accessType}
        trialInfo={trialInfo}
        trialDays={1}
      />

      {/* Auth Checking Overlay */}
      {checkingAuth && (
        <div className="fixed inset-0 z-[100] bg-white/60 backdrop-blur-sm flex items-center justify-center">
          <div className="text-center">
            <Spin size="large" />
            <p className="mt-4 font-medium text-gray-600">Verifying access...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColdCallerDetailPage;
