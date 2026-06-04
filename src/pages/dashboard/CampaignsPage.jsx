import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api.js';
import toast, { Toaster } from 'react-hot-toast';
import { Button, Card, Typography, Space, Tag, Statistic, Row, Col, Popconfirm, List } from 'antd';
import { MdAdd, MdPlayArrow, MdPause, MdEdit, MdDelete, MdBarChart, MdFlashOn, MdOutbox } from 'react-icons/md';

const { Title, Text } = Typography;

const STATUS = {
  draft:     { color: 'default', label: 'Draft'     },
  active:    { color: 'success', label: 'Active'    },
  paused:    { color: 'warning', label: 'Paused'    },
  completed: { color: 'purple',  label: 'Completed' },
};

export default function CampaignsPage() {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const { data } = await api.get('/cold-campaigns');
      setCampaigns(data);
    } catch { toast.error('Failed to load campaigns'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const launch = async (id) => {
    try {
      await api.post(`/cold-campaigns/${id}/launch`);
      toast.success('Campaign launched 🚀');
      setCampaigns(c => c.map(x => x._id === id ? { ...x, status: 'active' } : x));
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to launch'); }
  };

  const pause = async (id) => {
    try {
      await api.post(`/cold-campaigns/${id}/pause`);
      toast.success('Campaign paused');
      setCampaigns(c => c.map(x => x._id === id ? { ...x, status: 'paused' } : x));
    } catch { toast.error('Failed to pause'); }
  };

  const sendNow = async (id) => {
    try {
      const res = await api.post(`/cold-campaigns/${id}/send-now`);
      toast.success(res.data.message || 'Queued for immediate sending 🚀');
      setCampaigns(c => c.map(x => x._id === id ? { ...x, status: 'active' } : x));
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to send immediately'); }
  };

  const del = async (id) => {
    try {
      await api.delete(`/cold-campaigns/${id}`);
      setCampaigns(c => c.filter(x => x._id !== id));
      toast.success('Campaign deleted');
    } catch (err) { toast.error(err.response?.data?.message || 'Cannot delete active campaigns'); }
  };

  const rate = (num, den) => den ? `${Math.round((num / den) * 100)}%` : '—';

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <Toaster position="top-right" />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Title level={3} style={{ margin: 0 }}>Cold Campaigns</Title>
          <Text type="secondary">{campaigns.length} total campaigns</Text>
        </div>
        <Button 
          type="primary" 
          icon={<MdAdd />} 
          onClick={() => navigate('/dashboard/cold-mail/campaigns/new')}
          style={{ backgroundColor: '#0F792C' }}
        >
          New Campaign
        </Button>
      </div>

      <List
        loading={loading}
        locale={{
          emptyText: (
            <div style={{ padding: '64px 24px', background: '#fff', borderRadius: 16, border: '1px dashed #d9d9d9' }}>
              <MdOutbox style={{ fontSize: 56, color: '#d9d9d9', marginBottom: 16 }} />
              <Title level={4} style={{ margin: '0 0 8px' }}>No campaigns yet</Title>
              <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>Create your first cold email campaign to start reaching prospects.</Text>
              <Button type="primary" icon={<MdAdd />} onClick={() => navigate('/dashboard/cold-mail/campaigns/new')} style={{ backgroundColor: '#0F792C' }}>
                Create Campaign
              </Button>
            </div>
          )
        }}
        dataSource={campaigns}
        renderItem={camp => {
          const st = STATUS[camp.status] || STATUS.draft;
          const { sent = 0, opened = 0, clicked = 0, bounced = 0 } = camp.stats || {};
          
          return (
            <Card style={{ marginBottom: 16, borderRadius: 12, border: '1px solid #f0f0f0' }} bodyStyle={{ padding: '20px' }}>
              <Row align="middle" gutter={[24, 24]}>
                
                {/* Title & Status */}
                <Col xs={24} md={6}>
                  <Space align="center" style={{ marginBottom: 8 }}>
                    <Text strong style={{ fontSize: 16 }}>{camp.name}</Text>
                    <Tag color={st.color}>{st.label}</Tag>
                  </Space>
                  <div style={{ color: '#8c8c8c', fontSize: 13 }}>
                    {camp.steps?.length || 0} steps · {camp.contactsCount || 0} contacts
                  </div>
                </Col>

                {/* Stats */}
                <Col xs={24} md={10}>
                  <Row gutter={16} justify="space-around">
                    <Col><Statistic title="Sent" value={sent} valueStyle={{ fontSize: 18 }} /></Col>
                    <Col><Statistic title="Opened" value={opened} suffix={`(${rate(opened, sent)})`} valueStyle={{ fontSize: 18 }} /></Col>
                    <Col><Statistic title="Clicked" value={clicked} suffix={`(${rate(clicked, sent)})`} valueStyle={{ fontSize: 18 }} /></Col>
                    <Col><Statistic title="Bounced" value={bounced} valueStyle={{ fontSize: 18 }} /></Col>
                  </Row>
                </Col>

                {/* Actions */}
                <Col xs={24} md={8} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Space wrap>
                    <Button icon={<MdBarChart />} onClick={() => navigate(`/dashboard/cold-mail/campaigns/${camp._id}/stats`)}>
                      Stats
                    </Button>
                    
                    <Popconfirm
                      title="Send Immediately?"
                      description="This bypasses all schedules and sends to all contacts immediately."
                      onConfirm={() => sendNow(camp._id)}
                      okText="Send Now"
                    >
                      <Button danger icon={<MdFlashOn />}>Send Now</Button>
                    </Popconfirm>

                    {camp.status === 'draft' || camp.status === 'paused' ? (
                      <Button type="primary" icon={<MdPlayArrow />} onClick={() => launch(camp._id)} style={{ backgroundColor: '#0F792C' }}>Launch</Button>
                    ) : camp.status === 'active' ? (
                      <Button icon={<MdPause />} onClick={() => pause(camp._id)} style={{ color: '#d97706', borderColor: '#d97706' }}>Pause</Button>
                    ) : null}

                    <Button
                      icon={<MdEdit />}
                      onClick={() => navigate(`/dashboard/cold-mail/campaigns/${camp._id}/edit`)}
                      disabled={camp.status === 'active'}
                      title={camp.status === 'active' ? 'Pause campaign before editing' : undefined}
                    >
                      Edit
                    </Button>

                    {camp.status === 'draft' || camp.status === 'paused' ? (
                      <Popconfirm title="Delete Campaign?" onConfirm={() => del(camp._id)} okButtonProps={{ danger: true }}>
                        <Button type="text" danger icon={<MdDelete style={{ fontSize: 18 }} />} />
                      </Popconfirm>
                    ) : (
                      <Button type="text" danger icon={<MdDelete style={{ fontSize: 18 }} />} disabled title="Cannot delete active campaign" />
                    )}
                  </Space>
                </Col>

              </Row>
            </Card>
          );
        }}
      />
    </div>
  );
}
