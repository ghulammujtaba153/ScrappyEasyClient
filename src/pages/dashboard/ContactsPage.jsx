import React, { useState, useEffect } from 'react';
import api from '../../services/api.js';
import toast, { Toaster } from 'react-hot-toast';
import { Table, Button, Input, Space, Tag, Typography, Popconfirm, Upload, Modal, Form } from 'antd';
import { MdSearch, MdPersonAdd, MdFileUpload, MdDelete, MdContacts } from 'react-icons/md';

const { Title, Text } = Typography;

const STATUS_BADGE = {
  active:       { color: 'success', label: 'Active' },
  unsubscribed: { color: 'warning', label: 'Unsubscribed' },
  bounced:      { color: 'error',   label: 'Bounced' },
};

export default function ContactsPage() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [importing, setImporting] = useState(false);
  const [form] = Form.useForm();

  const load = async () => {
    try {
      const { data } = await api.get('/contacts');
      setContacts(data);
    } catch { toast.error('Failed to load contacts'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const addContact = async (values) => {
    setSaving(true);
    try {
      const { data } = await api.post('/contacts', values);
      setContacts(c => {
        const idx = c.findIndex(x => x._id === data._id);
        return idx >= 0 ? c.map((x, i) => i === idx ? data : x) : [data, ...c];
      });
      toast.success('Contact saved');
      setShowAdd(false);
      form.resetFields();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save contact');
    } finally { setSaving(false); }
  };

  const deleteContact = async (id) => {
    try {
      await api.delete(`/contacts/${id}`);
      setContacts(c => c.filter(x => x._id !== id));
      toast.success('Contact deleted');
    } catch { toast.error('Failed to delete contact'); }
  };

  const customRequest = async ({ file, onSuccess, onError }) => {
    setImporting(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const { data } = await api.post('/contacts/import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success(`Imported ${data.imported} contacts`);
      onSuccess(data, file);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Import failed');
      onError(err);
    } finally {
      setImporting(false);
    }
  };

  const filtered = contacts.filter(c =>
    [c.email, c.firstName, c.lastName, c.company].join(' ').toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (text) => <Text strong>{text}</Text>,
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: 'First Name',
      dataIndex: 'firstName',
      key: 'firstName',
      render: (text) => text || '—',
    },
    {
      title: 'Last Name',
      dataIndex: 'lastName',
      key: 'lastName',
      render: (text) => text || '—',
    },
    {
      title: 'Company',
      dataIndex: 'company',
      key: 'company',
      render: (text) => text || '—',
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => {
        const st = record.bounced ? 'bounced' : record.unsubscribed ? 'unsubscribed' : 'active';
        const badge = STATUS_BADGE[st];
        return <Tag color={badge.color}>{badge.label}</Tag>;
      },
      filters: [
        { text: 'Active', value: 'active' },
        { text: 'Bounced', value: 'bounced' },
        { text: 'Unsubscribed', value: 'unsubscribed' }
      ],
      onFilter: (value, record) => {
        const st = record.bounced ? 'bounced' : record.unsubscribed ? 'unsubscribed' : 'active';
        return st === value;
      }
    },
    {
      title: '',
      key: 'action',
      width: 60,
      render: (_, record) => (
        <Popconfirm
          title="Delete Contact"
          description="Are you sure you want to delete this contact?"
          onConfirm={() => deleteContact(record._id)}
          okText="Yes"
          cancelText="No"
          okButtonProps={{ danger: true }}
        >
          <Button type="text" danger icon={<MdDelete style={{ fontSize: 18 }} />} />
        </Popconfirm>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <Toaster position="top-right" />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Title level={3} style={{ margin: 0 }}>Contacts</Title>
          <Text type="secondary">{contacts.length} total contacts</Text>
        </div>
        <Space>
          <Upload customRequest={customRequest} showUploadList={false} accept=".csv">
            <Button icon={<MdFileUpload />} loading={importing}>Import CSV</Button>
          </Upload>
          <Button type="primary" icon={<MdPersonAdd />} onClick={() => setShowAdd(true)} style={{ backgroundColor: '#0F792C' }}>
            Add Contact
          </Button>
        </Space>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Input
          prefix={<MdSearch style={{ color: '#bfbfbf' }} />}
          placeholder="Search by email, name, or company…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: 320 }}
          allowClear
        />
        <Text type="secondary" style={{ fontSize: 13 }}>
          CSV Format: <Text code>email</Text> <Text code>firstName</Text> <Text code>lastName</Text> <Text code>company</Text>
        </Text>
      </div>

      <Modal
        title="Add Contact"
        open={showAdd}
        onCancel={() => setShowAdd(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={addContact} style={{ marginTop: 24 }}>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
            <Input placeholder="lead@company.com" />
          </Form.Item>
          <Space style={{ display: 'flex' }} align="start">
            <Form.Item name="firstName" label="First Name" style={{ flex: 1 }}>
              <Input placeholder="John" />
            </Form.Item>
            <Form.Item name="lastName" label="Last Name" style={{ flex: 1 }}>
              <Input placeholder="Doe" />
            </Form.Item>
          </Space>
          <Form.Item name="company" label="Company">
            <Input placeholder="Acme Inc" />
          </Form.Item>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
            <Button onClick={() => setShowAdd(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={saving} style={{ backgroundColor: '#0F792C' }}>
              Save Contact
            </Button>
          </div>
        </Form>
      </Modal>

      <Table 
        columns={columns} 
        dataSource={filtered} 
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 20 }}
        locale={{
          emptyText: (
            <div style={{ padding: '40px 0' }}>
              <MdContacts style={{ fontSize: 48, color: '#d9d9d9', marginBottom: 16 }} />
              <div style={{ color: '#8c8c8c' }}>No contacts found</div>
            </div>
          )
        }}
        style={{ border: '1px solid #f0f0f0', borderRadius: 8 }}
      />
    </div>
  );
}
