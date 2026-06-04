import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api.js';
import toast, { Toaster } from 'react-hot-toast';
import { Card, Steps, Form, Input, Select, Button, Space, Typography, Checkbox, Row, Col, Divider, Alert } from 'antd';
import { MdArrowBack, MdSettings, MdContacts, MdEmail, MdSchedule, MdDelete, MdAdd, MdRocketLaunch } from 'react-icons/md';

const { Title, Text } = Typography;
const { TextArea } = Input;

const TIMEZONES = ['UTC', 'America/New_York', 'America/Chicago', 'America/Los_Angeles', 'Europe/London', 'Europe/Paris', 'Asia/Karachi', 'Asia/Kolkata', 'Asia/Dubai', 'Asia/Singapore'];

const DAYS = [
  { label: 'Sun', value: 0 }, { label: 'Mon', value: 1 }, { label: 'Tue', value: 2 }, 
  { label: 'Wed', value: 3 }, { label: 'Thu', value: 4 }, { label: 'Fri', value: 5 }, { label: 'Sat', value: 6 }
];

const emptyStep = () => ({ subject: '', body: '', delayDays: 0, sendCondition: 'always' });

export default function CampaignBuilderPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  
  const [accounts, setAccounts] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!!id);

  useEffect(() => {
    const loadMeta = async () => {
      const [accRes, ctRes] = await Promise.all([
        api.get('/email-accounts'),
        api.get('/contacts')
      ]);
      setAccounts(accRes.data);
      setContacts(ctRes.data.filter(c => !c.unsubscribed && !c.bounced));
    };
    loadMeta().catch(() => toast.error('Failed to load accounts/contacts'));

    if (id) {
      api.get(`/cold-campaigns/${id}`)
        .then(({ data }) => { 
          // Format date for the datetime-local input
          if (data.schedule?.startDate) {
            data.schedule.startDate = new Date(new Date(data.schedule.startDate).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16);
          }
          form.setFieldsValue(data);
          setLoading(false); 
        })
        .catch(() => { toast.error('Failed to load campaign'); navigate('/dashboard/cold-mail'); });
    } else {
      form.setFieldsValue({
        steps: [emptyStep()],
        schedule: { timezone: 'UTC', daysOfWeek: [1, 2, 3, 4, 5], startHour: 9, endHour: 17 }
      });
    }
  }, [id, form]);

  const save = async (launch = false) => {
    try {
      const values = await form.validateFields();
      if (values.contacts?.length === 0) return toast.error('Select at least one contact');

      // Convert local datetime string back to UTC Date
      if (values.schedule?.startDate) {
        values.schedule.startDate = new Date(values.schedule.startDate).toISOString();
      }

      setSaving(true);
      let campaign;
      if (id) {
        const res = await api.put(`/cold-campaigns/${id}`, values);
        campaign = res.data;
      } else {
        const res = await api.post('/cold-campaigns', values);
        campaign = res.data;
      }
      
      if (launch) {
        await api.post(`/cold-campaigns/${campaign._id}/launch`);
        toast.success('🚀 Campaign launched!');
      } else {
        toast.success('Campaign saved as draft');
      }
      navigate('/dashboard/cold-mail');
    } catch (err) {
      if (err.errorFields) {
        toast.error('Please fill all required fields correctly.');
      } else {
        toast.error(err.response?.data?.message || 'Save failed');
      }
    } finally { 
      setSaving(false); 
    }
  };

  const next = async () => {
    try {
      // Validate only current step fields
      if (currentStep === 0) await form.validateFields(['name', 'accountIds']);
      if (currentStep === 1) {
        const c = form.getFieldValue('contacts') || [];
        if (c.length === 0) return toast.error('Please select at least one contact');
      }
      if (currentStep === 2) await form.validateFields(['steps']);
      
      setCurrentStep(currentStep + 1);
    } catch (e) {
      toast.error('Please complete this step first');
    }
  };

  if (loading) return <div style={{ padding: 60, textAlign: 'center', color: '#8c8c8c' }}>Loading campaign…</div>;

  const stepsList = [
    { title: 'Setup', icon: <MdSettings /> },
    { title: 'Contacts', icon: <MdContacts /> },
    { title: 'Sequence', icon: <MdEmail /> },
    { title: 'Schedule', icon: <MdSchedule /> },
  ];

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', paddingBottom: 40 }}>
      <Toaster position="top-right" />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
        <Button type="text" icon={<MdArrowBack style={{ fontSize: 20 }} />} onClick={() => navigate('/dashboard/cold-mail')} />
        <Title level={3} style={{ margin: 0 }}>{id ? 'Edit Campaign' : 'New Campaign'}</Title>
      </div>

      <Steps current={currentStep} items={stepsList} style={{ marginBottom: 32 }} />

      <Form form={form} layout="vertical">
        <Card bordered={false} style={{ minHeight: 400 }}>
          
          {/* Step 0 — Setup */}
          <div style={{ display: currentStep === 0 ? 'block' : 'none' }}>
            <Title level={4}>Campaign Setup</Title>
            <Divider />
            <Form.Item name="name" label="Campaign Name" rules={[{ required: true, message: 'Name is required' }]}>
              <Input placeholder="e.g. Q3 SaaS Outreach" size="large" />
            </Form.Item>
            <Form.Item name="accountIds" label="Send From Accounts" rules={[{ required: true, message: 'Please select at least one email account' }]}>
              <Select size="large" mode="multiple" placeholder="-- Select accounts --">
                {accounts.map(a => <Select.Option key={a._id} value={a._id}>{a.email} ({a.provider})</Select.Option>)}
              </Select>
            </Form.Item>
          </div>

          {/* Step 1 — Contacts */}
          <div style={{ display: currentStep === 1 ? 'block' : 'none' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Title level={4} style={{ margin: 0 }}>Select Contacts</Title>
              <Button type="link" onClick={() => {
                const current = form.getFieldValue('contacts') || [];
                if (current.length === contacts.length) form.setFieldsValue({ contacts: [] });
                else form.setFieldsValue({ contacts: contacts.map(c => c._id) });
              }}>
                Select / Deselect All
              </Button>
            </div>
            <Divider style={{ marginTop: 0 }} />
            
            {contacts.length === 0 ? (
              <Alert message="No active contacts found. Please add contacts first." type="warning" showIcon />
            ) : (
              <Form.Item name="contacts" valuePropName="value">
                <Checkbox.Group style={{ width: '100%' }}>
                  <div style={{ maxHeight: 360, overflowY: 'auto', border: '1px solid #f0f0f0', borderRadius: 8, padding: 8 }}>
                    {contacts.map(c => (
                      <div key={c._id} style={{ padding: '8px 12px', borderBottom: '1px solid #f5f5f5' }}>
                        <Checkbox value={c._id}>
                          <Text strong style={{ marginLeft: 8 }}>{c.email}</Text>
                          <Text type="secondary" style={{ marginLeft: 8, fontSize: 12 }}>
                            {[c.firstName, c.lastName].filter(Boolean).join(' ')} {c.company ? `— ${c.company}` : ''}
                          </Text>
                        </Checkbox>
                      </div>
                    ))}
                  </div>
                </Checkbox.Group>
              </Form.Item>
            )}
          </div>

          {/* Step 2 — Sequence */}
          <div style={{ display: currentStep === 2 ? 'block' : 'none' }}>
            <Title level={4}>Email Sequence</Title>
            <Alert message="Variables: {{firstName}}, {{lastName}}, {{company}}, {{email}}" type="info" showIcon style={{ marginBottom: 24 }} />
            
            <Form.List name="steps">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }, index) => (
                    <Card key={key} size="small" title={`Step ${index + 1} ${index === 0 ? '(Initial)' : ''}`} 
                          extra={index > 0 ? <Button type="text" danger icon={<MdDelete />} onClick={() => remove(name)} /> : null} 
                          style={{ marginBottom: 16, border: '1px solid #d9d9d9' }}>
                      
                      {index > 0 && (
                        <Row gutter={16}>
                          <Col span={12}>
                            <Form.Item {...restField} name={[name, 'delayDays']} label="Delay (days)" rules={[{ required: true }]}>
                              <Input type="number" min={0} />
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item {...restField} name={[name, 'sendCondition']} label="Send Condition" rules={[{ required: true }]}>
                              <Select>
                                <Select.Option value="always">Always</Select.Option>
                                <Select.Option value="no_reply">Only if no reply</Select.Option>
                              </Select>
                            </Form.Item>
                          </Col>
                        </Row>
                      )}
                      
                      <Form.Item {...restField} name={[name, 'subject']} label="Subject" rules={[{ required: true, message: 'Missing subject' }]}>
                        <Input placeholder="Hey {{firstName}}..." />
                      </Form.Item>
                      
                      <Form.Item {...restField} name={[name, 'body']} label="Body (HTML supported)" rules={[{ required: true, message: 'Missing body' }]}>
                        <TextArea rows={6} placeholder="<p>Hi {{firstName}},</p>" style={{ fontFamily: 'monospace' }} />
                      </Form.Item>
                    </Card>
                  ))}
                  <Button type="dashed" onClick={() => add(emptyStep())} block icon={<MdAdd />}>
                    Add Follow-up Step
                  </Button>
                </>
              )}
            </Form.List>
          </div>

          {/* Step 3 — Schedule */}
          <div style={{ display: currentStep === 3 ? 'block' : 'none' }}>
            <Title level={4}>Delivery Schedule</Title>
            <Divider />
            
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name={['schedule', 'startDate']} label="Start Date & Time (Optional)">
                  <Input type="datetime-local" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name={['schedule', 'timezone']} label="Timezone" rules={[{ required: true }]}>
                  <Select showSearch>
                    {TIMEZONES.map(tz => <Select.Option key={tz} value={tz}>{tz}</Select.Option>)}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name={['schedule', 'daysOfWeek']} label="Days of Week" rules={[{ required: true, message: 'Select at least one day' }]}>
              <Checkbox.Group options={DAYS} />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name={['schedule', 'startHour']} label="Start Hour (0-23)" rules={[{ required: true }]}>
                  <Input type="number" min={0} max={23} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name={['schedule', 'endHour']} label="End Hour (0-23)" rules={[{ required: true }]}>
                  <Input type="number" min={0} max={23} />
                </Form.Item>
              </Col>
            </Row>
          </div>

        </Card>

        {/* Footer Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
          <Button onClick={() => setCurrentStep(currentStep - 1)} disabled={currentStep === 0}>
            Previous
          </Button>
          <Space>
            {currentStep < 3 ? (
              <Button type="primary" onClick={next} style={{ backgroundColor: '#0F792C' }}>
                Next Step
              </Button>
            ) : (
              <>
                <Button onClick={() => save(false)} loading={saving}>Save Draft</Button>
                <Button type="primary" onClick={() => save(true)} loading={saving} icon={<MdRocketLaunch />} style={{ backgroundColor: '#0F792C' }}>
                  Launch Campaign
                </Button>
              </>
            )}
          </Space>
        </div>
      </Form>
    </div>
  );
}
