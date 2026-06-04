import React, { useState } from 'react';
import { Card, Input, Button, Table, Typography, Space, Tag, message, Progress } from 'antd';
import { MdCheckCircle, MdError, MdHourglassEmpty } from 'react-icons/md';
import api from '../../services/api.js';

const { Title, Text } = Typography;
const { TextArea } = Input;

const VerifyMailsPage = () => {
  const [emailsInput, setEmailsInput] = useState('');
  const [results, setResults] = useState([]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleVerify = async () => {
    // Extract unique emails
    const rawEmails = emailsInput.split(/[\n,;]+/).map(e => e.trim()).filter(e => e);
    const uniqueEmails = [...new Set(rawEmails)];

    if (uniqueEmails.length === 0) {
      message.error("Please enter at least one email address to verify.");
      return;
    }

    setIsVerifying(true);
    setProgress(0);

    // Initialize results with pending status
    const initialResults = uniqueEmails.map((email, index) => ({
      key: index,
      email,
      status: 'pending',
      reason: null
    }));
    setResults(initialResults);

    // Process emails sequentially to avoid rate limiting
    let completed = 0;
    const updatedResults = [...initialResults];

    for (let i = 0; i < uniqueEmails.length; i++) {
      const email = uniqueEmails[i];
      try {
        const response = await api.post('/verifyMail/verify-email', { email }, { timeout: 12000 });
        const data = response.data;
        updatedResults[i] = {
          ...updatedResults[i],
          status: data.status, // 'valid' | 'invalid' | 'risky'
          reason: data.reason || data.message || null
        };
      } catch (err) {
        console.error(err);
        updatedResults[i] = {
          ...updatedResults[i],
          status: 'error',
          reason: 'Server error'
        };
      }

      completed++;
      setProgress(Math.round((completed / uniqueEmails.length) * 100));
      setResults([...updatedResults]); // Trigger re-render with updated data
    }

    setIsVerifying(false);
    message.success("Verification complete!");
  };

  const columns = [
    {
      title: 'Email Address',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
    switch (status) {
          case 'valid':
            return <Tag color="success" icon={<MdCheckCircle />}>Valid</Tag>;
          case 'risky':
            return <Tag color="orange" icon={<MdHourglassEmpty />}>Risky</Tag>;
          case 'invalid':
            return <Tag color="error" icon={<MdError />}>Invalid</Tag>;
          case 'error':
            return <Tag color="warning" icon={<MdError />}>Error</Tag>;
          default:
            return <Tag color="default" icon={<MdHourglassEmpty />}>Pending</Tag>;
        }
      }
    },
    {
      title: 'Reason (if invalid)',
      dataIndex: 'reason',
      key: 'reason',
      render: (reason) => reason ? <Text type="danger">{reason}</Text> : <Text type="secondary">-</Text>
    }
  ];

  const validCount   = results.filter(r => r.status === 'valid').length;
  const invalidCount  = results.filter(r => r.status === 'invalid').length;
  const riskyCount    = results.filter(r => r.status === 'risky').length;

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <Title level={3}>Verify Email Addresses</Title>
      <Text type="secondary">Enter a list of emails to verify their deliverability. Separated by comma or new line.</Text>

      <Card style={{ marginTop: 24 }}>
        <TextArea
          rows={6}
          placeholder="example1@test.com&#10;example2@test.com"
          value={emailsInput}
          onChange={(e) => setEmailsInput(e.target.value)}
          disabled={isVerifying}
        />
        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            type="primary"
            size="large"
            icon={<MdCheckCircle />}
            onClick={handleVerify}
            loading={isVerifying}
          >
            Verify Emails
          </Button>
          {isVerifying && (
            <div style={{ width: 300 }}>
              <Progress percent={progress} size="small" />
            </div>
          )}
        </div>
      </Card>

      {results.length > 0 && (
        <Card style={{ marginTop: 24 }}>
          <Space style={{ marginBottom: 16 }}>
            <Tag color="blue">Total: {results.length}</Tag>
            <Tag color="success">Valid: {validCount}</Tag>
            <Tag color="orange">Risky: {riskyCount}</Tag>
            <Tag color="error">Invalid: {invalidCount}</Tag>
          </Space>
          <Table
            dataSource={results}
            columns={columns}
            pagination={{ pageSize: 10 }}
            size="middle"
          />
        </Card>
      )}
    </div>
  );
};

export default VerifyMailsPage;
