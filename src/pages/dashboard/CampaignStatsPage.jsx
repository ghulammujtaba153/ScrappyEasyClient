import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api.js';
import toast, { Toaster } from 'react-hot-toast';
import { Card, Row, Col, Statistic, Progress, Table, Tag, Button, Typography, Space } from 'antd';
import { MdArrowBack, MdOutbox, MdVisibility, MdAdsClick, MdReply, MdErrorOutline, MdBlock } from 'react-icons/md';

const { Title, Text } = Typography;

const STATUS_BADGE = {
  queued:       { color: 'default' },
  sent:         { color: 'blue' },
  opened:       { color: 'success' },
  clicked:      { color: 'purple' },
  replied:      { color: 'success' },
  bounced:      { color: 'error' },
  failed:       { color: 'error' },
  unsubscribed: { color: 'warning' },
};

export default function CampaignStatsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/cold-campaigns/${id}/stats`)
      .then(({ data }) => { setData(data); setLoading(false); })
      .catch(() => { toast.error('Failed to load stats'); navigate('/dashboard/cold-mail'); });
  }, [id]);

  if (loading) return <div style={{ padding: 60, textAlign: 'center', color: '#8c8c8c' }}>Loading analytics…</div>;

  const { stats, events } = data;
  const openRate   = stats.sent ? ((stats.opened  / stats.sent) * 100).toFixed(1) : 0;
  const clickRate  = stats.sent ? ((stats.clicked / stats.sent) * 100).toFixed(1) : 0;
  const bounceRate = stats.sent ? ((stats.bounced / stats.sent) * 100).toFixed(1) : 0;

  const statCards = [
    { label: 'Sent',         value: stats.sent,         color: '#1677ff', icon: <MdOutbox /> },
    { label: 'Opened',       value: stats.opened,       color: '#52c41a', icon: <MdVisibility /> },
    { label: 'Clicked',      value: stats.clicked,      color: '#722ed1', icon: <MdAdsClick /> },
    { label: 'Replied',      value: stats.replied,      color: '#13c2c2', icon: <MdReply /> },
    { label: 'Bounced',      value: stats.bounced,      color: '#ff4d4f', icon: <MdErrorOutline /> },
    { label: 'Unsubscribed', value: stats.unsubscribed, color: '#faad14', icon: <MdBlock /> },
  ];

  const columns = [
    {
      title: 'Contact',
      key: 'contact',
      render: (_, record) => {
        const c = record.contactId;
        if (!c) return <Text type="secondary">Deleted Contact</Text>;
        return (
          <div>
            <Text strong>{c.email}</Text>
            {c.firstName && <div style={{ fontSize: 12, color: '#8c8c8c' }}>{c.firstName} {c.lastName}</div>}
          </div>
        );
      }
    },
    {
      title: 'Step',
      dataIndex: 'stepIndex',
      key: 'stepIndex',
      render: (val) => <Tag>Step {val + 1}</Tag>
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag color={STATUS_BADGE[status]?.color || 'default'} style={{ textTransform: 'capitalize' }}>{status}</Tag>
    },
    {
      title: 'Time',
      dataIndex: 'updatedAt',
      key: 'time',
      render: (time) => <Text type="secondary">{new Date(time).toLocaleString()}</Text>
    }
  ];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <Toaster position="top-right" />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <Button type="text" icon={<MdArrowBack style={{ fontSize: 20 }} />} onClick={() => navigate('/dashboard/cold-mail')} />
        <div>
          <Title level={3} style={{ margin: 0 }}>Campaign Analytics</Title>
          <Text type="secondary">{events.length} recent events</Text>
        </div>
      </div>

      {/* Stat Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {statCards.map(card => (
          <Col xs={12} sm={8} md={4} key={card.label}>
            <Card bordered={false} style={{ height: '100%' }}>
              <Statistic 
                title={<Space>{card.icon} {card.label}</Space>}
                value={card.value} 
                valueStyle={{ color: card.color, fontWeight: 700 }} 
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Visual rate bars */}
      {stats.sent > 0 && (
        <Card title="Funnel Overview" bordered={false} style={{ marginBottom: 24 }}>
          {[
            { label: 'Open Rate',   pct: openRate,   color: '#52c41a' },
            { label: 'Click Rate',  pct: clickRate,  color: '#722ed1' },
            { label: 'Bounce Rate', pct: bounceRate, color: '#ff4d4f' },
          ].map(row => (
            <div key={row.label} style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <Text strong>{row.label}</Text>
                <Text strong>{row.pct}%</Text>
              </div>
              <Progress percent={row.pct} showInfo={false} strokeColor={row.color} />
            </div>
          ))}
        </Card>
      )}

      {/* Events Table */}
      <Card title="Recent Events" bordered={false} bodyStyle={{ padding: 0 }}>
        <Table 
          columns={columns} 
          dataSource={events} 
          rowKey="_id"
          pagination={{ pageSize: 15 }}
          size="middle"
        />
      </Card>
    </div>
  );
}
