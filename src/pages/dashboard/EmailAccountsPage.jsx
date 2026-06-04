import React, { useState, useEffect } from 'react';
import api from '../../services/api.js';
import toast, { Toaster } from 'react-hot-toast';
import { Button, Card, Form, Input, List, Progress, Switch, Typography, Space, Popconfirm, Badge, Modal, Tag } from 'antd';
import { MdEmail, MdSettings, MdAdd, MdDelete, MdVpnKey, MdMailOutline } from 'react-icons/md';

const { Title, Text } = Typography;

const PROVIDER_COLORS = { gmail: '#EA4335', smtp: '#0F792C' };

export default function EmailAccountsPage() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSmtp, setShowSmtp] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();

  const load = async () => {
    try {
      const { data } = await api.get('/email-accounts');
      setAccounts(data);
    } catch { toast.error('Failed to load accounts'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const connectGmail = async () => {
    try {
      const { data } = await api.get('/email-accounts/oauth/gmail');
      window.location.href = data.url;
    } catch { toast.error('Failed to initiate Gmail OAuth'); }
  };

  const onSmtpFinish = async (values) => {
    setSaving(true);
    try {
      await api.post('/email-accounts/smtp', values);
      toast.success('SMTP account connected');
      setShowSmtp(false);
      form.resetFields();
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Connection failed — check your credentials');
    } finally { setSaving(false); }
  };

  const disconnect = async (id) => {
    try {
      await api.delete(`/email-accounts/${id}`);
      toast.success('Account disconnected');
      setAccounts(a => a.filter(x => x._id !== id));
    } catch { toast.error('Failed to disconnect'); }
  };

  const toggleWarmup = async (id, checked) => {
    try {
      const { data } = await api.patch(`/email-accounts/${id}/warmup`);
      setAccounts(a => a.map(x => x._id === id ? { ...x, warmupEnabled: data.warmupEnabled } : x));
      toast.success(data.warmupEnabled ? 'Warmup enabled' : 'Warmup disabled');
    } catch { 
      toast.error('Failed to update warmup'); 
      load(); // Reload to revert UI toggle on fail
    }
  };

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <Toaster position="top-right" />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Title level={3} style={{ margin: 0 }}>Email Accounts</Title>
          <Text type="secondary">Connect Gmail or custom SMTP accounts for sending cold emails</Text>
        </div>
        <Space>
          <Button 
            type="primary" 
            icon={<MdEmail />} 
            onClick={connectGmail}
            style={{ backgroundColor: '#EA4335', borderColor: '#EA4335' }}
          >
            Connect Gmail
          </Button>
          <Button 
            icon={<MdSettings />} 
            onClick={() => setShowSmtp(true)}
            style={{ color: '#0F792C', borderColor: '#0F792C' }}
          >
            Connect SMTP
          </Button>
        </Space>
      </div>

      <Modal
        title="Connect SMTP Account"
        open={showSmtp}
        onCancel={() => setShowSmtp(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={onSmtpFinish} style={{ marginTop: 24 }}>
          <Form.Item name="email" label="Sender Email" rules={[{ required: true, type: 'email' }]}>
            <Input prefix={<MdMailOutline />} placeholder="you@example.com" />
          </Form.Item>
          <Space style={{ display: 'flex' }} align="start">
            <Form.Item name="host" label="SMTP Host" rules={[{ required: true }]} style={{ flex: 1 }}>
              <Input placeholder="smtp.gmail.com" />
            </Form.Item>
            <Form.Item name="port" label="Port" rules={[{ required: true }]} style={{ width: 100 }}>
              <Input placeholder="587" />
            </Form.Item>
          </Space>
          <Space style={{ display: 'flex' }} align="start">
            <Form.Item name="user" label="Username" rules={[{ required: true }]} style={{ flex: 1 }}>
              <Input placeholder="you@example.com" />
            </Form.Item>
            <Form.Item name="pass" label="Password" rules={[{ required: true }]} style={{ flex: 1 }}>
              <Input.Password prefix={<MdVpnKey />} placeholder="••••••••" />
            </Form.Item>
          </Space>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
            <Button onClick={() => setShowSmtp(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={saving} style={{ backgroundColor: '#0F792C' }}>
              Connect
            </Button>
          </div>
        </Form>
      </Modal>

      <Card bordered={false} bodyStyle={{ padding: 0, background: 'transparent' }}>
        <List
          loading={loading}
          locale={{ emptyText: <EmptyState onGmail={connectGmail} onSmtp={() => setShowSmtp(true)} /> }}
          dataSource={accounts}
          renderItem={(acc) => (
            <Card style={{ marginBottom: 16, borderRadius: 12, border: '1px solid #f0f0f0' }} bodyStyle={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                {/* Badge Icon */}
                <div style={{ 
                  width: 48, height: 48, borderRadius: 12, 
                  backgroundColor: `${PROVIDER_COLORS[acc.provider]}15`,
                  color: PROVIDER_COLORS[acc.provider],
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 
                }}>
                  {acc.provider === 'gmail' ? <MdEmail /> : <MdSettings />}
                </div>

                {/* Details */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Space align="center" style={{ marginBottom: 4 }}>
                    <Text strong style={{ fontSize: 16 }}>{acc.email}</Text>
                    <Tag color={PROVIDER_COLORS[acc.provider]}>{acc.provider.toUpperCase()}</Tag>
                  </Space>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <Text type="secondary" style={{ fontSize: 12 }}>Daily limit usage</Text>
                      <Text type="secondary" style={{ fontSize: 12 }}>{acc.sentTodayCount} / {acc.dailySendLimit}</Text>
                    </div>
                    <Progress 
                      percent={Math.min(100, (acc.sentTodayCount / acc.dailySendLimit) * 100)} 
                      showInfo={false} 
                      strokeColor="#0F792C"
                      size="small"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <Text type="secondary" style={{ fontSize: 12 }}>Warmup</Text>
                    <Switch 
                      checked={acc.warmupEnabled} 
                      onChange={(c) => toggleWarmup(acc._id, c)} 
                      style={acc.warmupEnabled ? { backgroundColor: '#0F792C' } : {}}
                    />
                  </div>
                  <div style={{ borderLeft: '1px solid #f0f0f0', height: 40, margin: '0 8px' }}></div>
                  <Popconfirm
                    title="Disconnect Account"
                    description="Are you sure you want to disconnect this email account?"
                    onConfirm={() => disconnect(acc._id)}
                    okText="Yes, Disconnect"
                    cancelText="Cancel"
                    okButtonProps={{ danger: true }}
                  >
                    <Button danger type="text" icon={<MdDelete />}>Disconnect</Button>
                  </Popconfirm>
                </div>
              </div>
            </Card>
          )}
        />
      </Card>
    </div>
  );
}

function EmptyState({ onGmail, onSmtp }) {
  return (
    <div style={{ textAlign: 'center', padding: '64px 24px', background: '#fff', borderRadius: 16, border: '1px dashed #d9d9d9' }}>
      <MdEmail style={{ fontSize: 56, color: '#d9d9d9', marginBottom: 16 }} />
      <Title level={4} style={{ margin: '0 0 8px' }}>No email accounts connected</Title>
      <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>Connect Gmail or an SMTP account to start sending cold emails.</Text>
      <Space size="middle">
        <Button type="primary" icon={<MdEmail />} onClick={onGmail} style={{ backgroundColor: '#EA4335', borderColor: '#EA4335' }}>
          Connect Gmail
        </Button>
        <Button icon={<MdSettings />} onClick={onSmtp} style={{ color: '#0F792C', borderColor: '#0F792C' }}>
          Connect SMTP
        </Button>
      </Space>
    </div>
  );
}
