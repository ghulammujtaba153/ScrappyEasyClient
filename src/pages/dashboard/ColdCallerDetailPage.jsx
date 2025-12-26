import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined, PhoneOutlined, ClockCircleOutlined, CheckCircleOutlined, CloseCircleOutlined, InfoCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import { Table, Button, Space, Tag, Progress, Card, Statistic, message, Tooltip, Empty, Modal, Radio } from 'antd';
import axios from 'axios';
import { useAuth } from '../../context/authContext';
import { BASE_URL } from '../../config/URL';
import Dialer from '../../components/Dialer';

const ColdCallerDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [campaign, setCampaign] = useState(null);

  // Dialer & Status States
  const [showDialer, setShowDialer] = useState(false);
  const [dialerNumber, setDialerNumber] = useState("");
  const [callingLeadId, setCallingLeadId] = useState(null);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("successful");
  const [updatingStatus, setUpdatingStatus] = useState(false);

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
    if (id) fetchCampaignData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleCall = (record) => {
    setDialerNumber(record.number);
    setCallingLeadId(record._id);
    setShowDialer(true);
  };

  const onCallEnd = () => {
    // When call ends, show the status selection modal
    if (callingLeadId) {
      setStatusModalVisible(true);
    }
  };

  const handleUpdateStatus = async () => {
    if (!callingLeadId) return;
    setUpdatingStatus(true);
    try {
      const res = await axios.put(`${BASE_URL}/api/coldcall/update/${id}`, {
        leadId: callingLeadId,
        status: selectedStatus
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        message.success('Lead status updated');
        // Refresh full data to get any new recordings that might have been saved by webhook
        fetchCampaignData();
        setStatusModalVisible(false);
        setCallingLeadId(null);
      }
    } catch (error) {
      console.error('Update status error:', error);
      message.error('Failed to update lead status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-gray-50 min-h-screen">
        <LoadingOutlined style={{ fontSize: 40, color: '#0F792C' }} spin />
        <p className="mt-4 text-gray-500">Loading campaign details...</p>
      </div>
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

  const numbers = campaign.numbers || [];
  const total = numbers.length;
  const success = numbers.filter(n => n.status === 'successful').length;
  const pending = numbers.filter(n => n.status === 'pending').length;
  const successRate = total > 0 ? Math.round((success / total) * 100) : 0;

  const columns = [
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
      render: (status) => {
        let color = 'blue';
        let icon = <ClockCircleOutlined />;
        if (status === 'successful') { color = 'success'; icon = <CheckCircleOutlined />; }
        if (status === 'failed') { color = 'error'; icon = <CloseCircleOutlined />; }
        return (
          <Tag icon={icon} color={color}>
            {status.toUpperCase()}
          </Tag>
        );
      }
    },
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
        <p className="mb-4 text-gray-600">How did the call with <span className="font-bold text-gray-800">{campaign.numbers.find(n => n._id === callingLeadId)?.number}</span> go?</p>
        <Radio.Group onChange={(e) => setSelectedStatus(e.target.value)} value={selectedStatus}>
          <Space direction="vertical">
            <Radio value="successful" className="text-green-600 font-medium">
              <CheckCircleOutlined /> Successful (Lead Interested)
            </Radio>
            <Radio value="failed" className="text-red-500 font-medium">
              <CloseCircleOutlined /> Failed (No Answer / Not Interested)
            </Radio>
            <Radio value="pending" className="text-blue-500 font-medium">
              <ClockCircleOutlined /> Still Pending (Try Again Later)
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
          <h1 className="text-2xl font-bold text-gray-900">{campaign.name}</h1>
          <p className="text-gray-500 text-sm">Campaign ID: {campaign._id}</p>
        </div>
      </div>

      <div className="flex justify-end gap-2 mb-8">
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
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card bordered={false} className="shadow-sm">
          <Statistic title="Total Leads" value={total} prefix={<PhoneOutlined />} />
        </Card>
        <Card bordered={false} className="shadow-sm">
          <Statistic
            title="Success Rate"
            value={successRate}
            suffix="%"
            valueStyle={{ color: '#0F792C' }}
          />
          <Progress percent={successRate} size="small" strokeColor="#0F792C" showInfo={false} />
        </Card>
        <Card bordered={false} className="shadow-sm">
          <Statistic title="Successful" value={success} valueStyle={{ color: '#0F792C' }} />
        </Card>
        <Card bordered={false} className="shadow-sm">
          <Statistic title="Pending" value={pending} valueStyle={{ color: '#1890ff' }} />
        </Card>
      </div>

      {/* Numbers Table */}
      <Card title="Lead Details" className="shadow-sm rounded-xl mb-10">
        <Table
          columns={columns}
          dataSource={numbers}
          rowKey={(record, idx) => record._id || idx}
          pagination={{ pageSize: 15 }}
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
              The success rate is {successRate}% based on {success} completions.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ColdCallerDetailPage;
