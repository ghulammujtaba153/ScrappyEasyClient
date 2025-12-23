import React, { useEffect, useState } from 'react';
import { Table, Button, message, Popconfirm, Space, Input, Card, Statistic, Progress, Tooltip } from 'antd';
import { SearchOutlined, ReloadOutlined, PlayCircleOutlined, DeleteOutlined, PhoneOutlined, CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useAuth } from '../../context/authContext';
import { BASE_URL } from '../../config/URL';
import { useNavigate } from 'react-router-dom';

const ColdCallerPage = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState('');

  const fetchData = async () => {
    if (!user?._id && !user?.id) return;
    setLoading(true);
    try {
      const userId = user._id || user.id;
      const res = await axios.get(`${BASE_URL}/api/coldcall/all/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      message.error('Failed to load cold call lists');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, token]);

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`${BASE_URL}/api/coldcall/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        message.success('List deleted successfully');
        fetchData();
      }
    } catch (error) {
      console.error('Delete error:', error);
      message.error('Failed to delete list');
    }
  };

  const getListStats = (numbers) => {
    if (!numbers || !Array.isArray(numbers)) return { total: 0, success: 0, failed: 0, pending: 0 };
    const total = numbers.length;
    const success = numbers.filter(n => n.status === 'successful').length;
    const failed = numbers.filter(n => n.status === 'failed').length;
    const pending = numbers.filter(n => n.status === 'pending').length;
    return { total, success, failed, pending };
  };

  const filteredData = data.filter(item =>
    item.name.toLowerCase().includes(searchText.toLowerCase())
  );

  // Calculate Global Stats
  const globalStats = data.reduce((acc, curr) => {
    const stats = getListStats(curr.numbers);
    acc.totalLists += 1;
    acc.totalNumbers += stats.total;
    acc.totalSuccess += stats.success;
    acc.totalFailed += stats.failed;
    return acc;
  }, { totalLists: 0, totalNumbers: 0, totalSuccess: 0, totalFailed: 0 });

  const columns = [
    {
      title: 'Campaign Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <span className="font-semibold text-gray-800">{text}</span>,
    },
    {
      title: 'Progress',
      key: 'progress',
      render: (_, record) => {
        const { total, success } = getListStats(record.numbers);
        const percent = total > 0 ? Math.round((success / total) * 100) : 0;
        return (
          <div style={{ width: 150 }}>
            <Progress
              percent={percent}
              size="small"
              strokeColor="#0F792C"
              format={() => `${success}/${total}`}
            />
          </div>
        );
      }
    },
    {
      title: 'Status Breakdown',
      key: 'breakdown',
      render: (_, record) => {
        const { success, failed, pending } = getListStats(record.numbers);
        return (
          <Space size="middle">
            <Tooltip title="Successful">
              <span className="text-green-600 flex items-center gap-1"><CheckCircleOutlined /> {success}</span>
            </Tooltip>
            <Tooltip title="Failed">
              <span className="text-red-600 flex items-center gap-1"><CloseCircleOutlined /> {failed}</span>
            </Tooltip>
            <Tooltip title="Pending">
              <span className="text-blue-600 flex items-center gap-1"><ClockCircleOutlined /> {pending}</span>
            </Tooltip>
          </Space>
        );
      }
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<PlayCircleOutlined />}
            size="small"
            onClick={() => navigate(`/dashboard/cold-caller/${record._id}`)}
            style={{ backgroundColor: '#0F792C', borderColor: '#0F792C' }}
          >
            Open
          </Button>
          <Popconfirm
            title="Delete this campaign?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              size="small"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cold Call Dashboard</h1>
          <p className="text-gray-500 text-sm">Manage and monitor your automated cold call campaigns.</p>
        </div>
        <Space>
          <Input
            placeholder="Search campaigns..."
            prefix={<SearchOutlined className="text-gray-400" />}
            onChange={(e) => setSearchText(e.target.value)}
            className="rounded-lg w-64"
            size="large"
          />
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchData}
            loading={loading}
            size="large"
            className="rounded-lg"
            style={{ color: '#0F792C', borderColor: '#0F792C' }}
          >
            Refresh
          </Button>
        </Space>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card bordered={false} className="shadow-sm border-l-4 border-blue-500">
          <Statistic
            title="Total Campaigns"
            value={globalStats.totalLists}
            prefix={<PhoneOutlined className="text-blue-500" />}
          />
        </Card>
        <Card bordered={false} className="shadow-sm border-l-4 border-gray-500">
          <Statistic
            title="Total Leads"
            value={globalStats.totalNumbers}
            prefix={<ClockCircleOutlined className="text-gray-500" />}
          />
        </Card>
        <Card bordered={false} className="shadow-sm border-l-4 border-green-600">
          <Statistic
            title="Success Cases"
            value={globalStats.totalSuccess}
            valueStyle={{ color: '#0F792C' }}
            prefix={<CheckCircleOutlined className="text-green-600" />}
          />
        </Card>
        <Card bordered={false} className="shadow-sm border-l-4 border-red-500">
          <Statistic
            title="Failed Calls"
            value={globalStats.totalFailed}
            valueStyle={{ color: '#cf1322' }}
            prefix={<CloseCircleOutlined className="text-red-500" />}
          />
        </Card>
      </div>

      {/* Main Table */}
      <Card className="shadow-sm rounded-xl">
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="_id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50']
          }}
        />
      </Card>
    </div>
  );
};

export default ColdCallerPage;
