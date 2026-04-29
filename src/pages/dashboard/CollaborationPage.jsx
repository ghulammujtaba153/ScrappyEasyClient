import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
    Card, 
    List, 
    Avatar, 
    Button, 
    Badge, 
    Typography, 
    Empty, 
    Tag, 
    Space,
    Divider,
    Tooltip,
    Row,
    Col,
    Popconfirm,
    message,
    Input,
    Statistic,
    Modal
} from 'antd';
import { 
    UserOutlined, 
    VideoCameraOutlined, 
    CheckOutlined, 
    CloseOutlined,
    TeamOutlined,
    BellOutlined,
    LinkOutlined,
    ClockCircleOutlined,
    DeleteOutlined,
    ProfileOutlined,
    SearchOutlined,
    ClearOutlined,
    HistoryOutlined,
    GlobalOutlined,
    ArrowUpOutlined
} from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { useSocket } from '../../context/SocketContext';
import { useAuth } from '../../context/authContext';
import MeetingRequestModal from '../../components/collaboration/MeetingRequestModal';
import axios from 'axios';
import { BASE_URL } from '../../config/URL';
import CollaboratorProfile from '../../components/collaboration/CollaboratorProfile';
import ProfileCompletionForm from '../../components/collaboration/ProfileCompletionForm';
import Loader from '../../components/common/Loader';

const { Title, Text, Paragraph } = Typography;

// Premium Design Constants
const PRIMARY_COLOR = '#0F792C';
const ACCENT_COLOR = '#064E3B';
const GLASS_BG = 'rgba(255, 255, 255, 0.8)';
const GLASS_BORDER = '1px solid rgba(255, 255, 255, 0.3)';

const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
        opacity: 1, 
        y: 0,
        transition: { duration: 0.5, staggerChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
};

const CollaborationPage = () => {
    const { user, token, updateUser } = useAuth();
    const { 
        isConnected, 
        onlineUsers, 
        incomingRequests, 
        sendMeetingRequest,
        acceptMeetingRequest,
        declineMeetingRequest,
        subscribeToEvent 
    } = useSocket();
    
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editingCollab, setEditingCollab] = useState(null);
    const [editFormValues, setEditFormValues] = useState({ message: '', meetLink: '' });
    const [sendingRequest, setSendingRequest] = useState(false);
    const [updatingCollab, setUpdatingCollab] = useState(false);
    const [pastCollaborations, setPastCollaborations] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isProfileVisible, setIsProfileVisible] = useState(false);
    const [profileCheckLoading, setProfileCheckLoading] = useState(true);
    const [isProfileComplete, setIsProfileComplete] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [emailFilter, setEmailFilter] = useState('');
    const [collaborationFilter, setCollaborationFilter] = useState('');

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const checkProfileCompletion = async () => {
            if (!user?._id) {
                setProfileCheckLoading(false);
                return;
            }
            try {
                const res = await axios.get(`${BASE_URL}/api/user/${user._id}`);
                if (res.data.success) {
                    const userData = res.data.data;
                    const complete = userData?.isProfileComplete || !!(userData?.gender && userData?.dob && userData?.areaOfInterest?.length > 0);
                    setIsProfileComplete(complete);
                    if (updateUser) updateUser(userData);
                }
            } catch (error) {
                console.error('Error checking profile:', error);
                const complete = user?.isProfileComplete || !!(user?.gender && user?.dob && user?.areaOfInterest?.length > 0);
                setIsProfileComplete(complete);
            } finally {
                setProfileCheckLoading(false);
            }
        };
        checkProfileCompletion();
    }, [user?._id, updateUser]);

    const handleProfileComplete = (updatedUser) => {
        if (updateUser) updateUser(updatedUser);
        setIsProfileComplete(true);
    };

    const fetchPastCollaborations = useCallback(async () => {
        if (!user?._id) return;
        try {
            setLoadingHistory(true);
            const res = await axios.get(`${BASE_URL}/api/collaboration/user/${user._id}`);
            if (res.data.success) setPastCollaborations(res.data.data || []);
        } catch (error) {
            console.error('Error fetching collaborations:', error);
        } finally {
            setLoadingHistory(false);
        }
    }, [user?._id]);

    useEffect(() => {
        fetchPastCollaborations();
    }, [fetchPastCollaborations]);

    useEffect(() => {
        if (!user?._id) return;
        const unsubscribe = subscribeToEvent('collaboration_updated', fetchPastCollaborations);
        return () => unsubscribe();
    }, [user?._id, fetchPastCollaborations, subscribeToEvent]);

    const handleSendRequest = (data) => {
        setSendingRequest(true);
        sendMeetingRequest(data.receiverId, data.meetLink, data.message);
        setSendingRequest(false);
        setIsModalVisible(false);
        message.success('Meeting request sent successfully!');
    };

    const handleUpdateCollaboration = async () => {
        if (!editingCollab) return;
        setUpdatingCollab(true);
        try {
            const res = await axios.put(`${BASE_URL}/api/collaboration/${editingCollab._id}`, editFormValues);
            if (res.data.success) {
                message.success('Collaboration updated successfully');
                setIsEditModalVisible(false);
                fetchPastCollaborations();
            }
        } catch (error) {
            message.error('Failed to update collaboration');
        } finally {
            setUpdatingCollab(false);
        }
    };

    const handleAccept = (request) => {
        acceptMeetingRequest(request.collaborationId);
        if (request.meetLink) window.open(request.meetLink, '_blank');
    };

    const handleDecline = (request) => {
        declineMeetingRequest(request.collaborationId);
        message.info('Request declined');
    };

    const handleDeleteCollaboration = async (collaborationId) => {
        try {
            const res = await axios.delete(`${BASE_URL}/api/collaboration/${collaborationId}`);
            if (res.data.success) {
                message.success('Collaboration deleted');
                fetchPastCollaborations();
            }
        } catch (error) {
            message.error('Failed to delete');
        }
    };

    const formatTime = (date) => new Date(date).toLocaleString('en-US', {
        hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric'
    });

    const filteredUsers = useMemo(() => {
        if (!emailFilter.trim()) return onlineUsers;
        const query = emailFilter.toLowerCase();
        return onlineUsers.filter(u => u.email?.toLowerCase().includes(query) || u.name?.toLowerCase().includes(query));
    }, [onlineUsers, emailFilter]);

    const filteredCollaborations = useMemo(() => {
        if (!collaborationFilter.trim()) return pastCollaborations;
        const query = collaborationFilter.toLowerCase();
        return pastCollaborations.filter(collab => {
            const partner = collab.sentByYou ? collab.participants[1] : collab.participants[0];
            return partner?.name?.toLowerCase().includes(query) || partner?.email?.toLowerCase().includes(query);
        });
    }, [pastCollaborations, collaborationFilter]);

    if (profileCheckLoading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f8fafc' }}>
            <Loader />
        </div>
    );

    return (
        <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            style={{ 
                padding: '32px', 
                maxWidth: '1600px', 
                margin: '0 auto',
                background: '#f8fafc',
                minHeight: '100vh'
            }}
        >
            {/* Glassmorphism Header */}
            <div style={{ 
                marginBottom: 40, 
                padding: '32px', 
                background: `linear-gradient(135deg, ${PRIMARY_COLOR} 0%, ${ACCENT_COLOR} 100%)`,
                borderRadius: '24px',
                color: 'white',
                boxShadow: '0 20px 40px rgba(15, 121, 44, 0.15)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <Row justify="space-between" align="middle">
                        <Col>
                            <Space align="center" size={16}>
                                <div style={{ 
                                    padding: '12px', 
                                    background: 'rgba(255, 255, 255, 0.2)', 
                                    borderRadius: '16px',
                                    backdropFilter: 'blur(10px)'
                                }}>
                                    <TeamOutlined style={{ fontSize: 32 }} />
                                </div>
                                <div>
                                    <Title level={1} style={{ margin: 0, color: 'white', letterSpacing: '-0.5px' }}>
                                        Collaboration Hub
                                    </Title>
                                    <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: 16 }}>
                                        Empowering connections in real-time
                                    </Text>
                                </div>
                            </Space>
                        </Col>
                        <Col>
                            <Badge status={isConnected ? 'success' : 'error'} text={
                                <span style={{ color: 'white', fontWeight: 500 }}>
                                    {isConnected ? 'LIVE NETWORK ACTIVE' : 'NETWORK DISCONNECTED'}
                                </span>
                            } />
                        </Col>
                    </Row>
                </div>
                {/* Decorative Elements */}
                <div style={{ 
                    position: 'absolute', 
                    top: '-50px', 
                    right: '-50px', 
                    width: '200px', 
                    height: '200px', 
                    background: 'rgba(255, 255, 255, 0.1)', 
                    borderRadius: '50%' 
                }} />
            </div>

            {/* Quick Stats Grid */}
            <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
                {[
                    { title: 'Online Now', value: onlineUsers.length, icon: <UserOutlined />, color: '#10b981' },
                    { title: 'Pending Requests', value: incomingRequests.length, icon: <BellOutlined />, color: '#f59e0b' },
                    { title: 'Total History', value: pastCollaborations.length, icon: <HistoryOutlined />, color: '#6366f1' },
                    { title: 'Network Quality', value: 'Excellent', icon: <GlobalOutlined />, color: '#3b82f6' }
                ].map((stat, idx) => (
                    <Col xs={24} sm={12} lg={6} key={idx}>
                        <motion.div whileHover={{ y: -5 }}>
                            <Card style={{ 
                                borderRadius: '20px', 
                                border: 'none', 
                                boxShadow: '0 4px 6px rgba(0,0,0,0.02)',
                                background: 'white'
                            }}>
                                <Statistic 
                                    title={<span style={{ color: '#64748b', fontWeight: 500 }}>{stat.title}</span>}
                                    value={stat.value}
                                    prefix={
                                        <div style={{ 
                                            marginRight: 12, 
                                            color: stat.color, 
                                            background: `${stat.color}15`, 
                                            padding: '8px', 
                                            borderRadius: '12px' 
                                        }}>
                                            {stat.icon}
                                        </div>
                                    }
                                    valueStyle={{ color: '#1e293b', fontWeight: 700 }}
                                />
                            </Card>
                        </motion.div>
                    </Col>
                ))}
            </Row>

            <Row gutter={[32, 32]}>
                {/* Left Panel: Online Users */}
                <Col xs={24} lg={14}>
                    <Card 
                        title={
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                <Space>
                                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} />
                                    <span style={{ fontSize: 18, fontWeight: 600 }}>Active Users</span>
                                </Space>
                                <Tag color="green">{onlineUsers.length} Online</Tag>
                            </div>
                        }
                        style={{ 
                            borderRadius: '24px', 
                            boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
                            border: 'none',
                            minHeight: '500px'
                        }}
                    >
                        <Input
                            placeholder="Search by name or email..."
                            prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
                            className="premium-search"
                            value={emailFilter}
                            onChange={e => setEmailFilter(e.target.value)}
                            style={{ 
                                borderRadius: '12px', 
                                padding: '12px 16px', 
                                marginBottom: 24,
                                border: '1px solid #e2e8f0',
                                background: '#f8fafc'
                            }}
                        />

                        <List
                            dataSource={filteredUsers}
                            pagination={{ 
                                pageSize: 6, 
                                size: 'small', 
                                hideOnSinglePage: true,
                                style: { marginTop: 16, textAlign: 'center' }
                            }}
                            renderItem={(item, index) => (
                                <motion.div 
                                    variants={itemVariants}
                                    whileHover={{ x: 5, backgroundColor: '#f1f5f9' }}
                                    style={{ 
                                        padding: '12px 16px', 
                                        borderRadius: '16px', 
                                        marginBottom: 4, 
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <List.Item style={{ border: 'none', padding: 0 }}>
                                        <List.Item.Meta
                                            avatar={
                                                <Badge dot status="success" offset={[-2, 36]}>
                                                    <Avatar 
                                                        size={44}
                                                        icon={<UserOutlined />}
                                                        style={{ background: `linear-gradient(135deg, ${PRIMARY_COLOR} 0%, ${ACCENT_COLOR} 100%)` }}
                                                    />
                                                </Badge>
                                            }
                                            title={<span style={{ fontSize: 15, fontWeight: 600, color: '#1e293b' }}>{item.name}</span>}
                                            description={
                                                <Space direction="vertical" size={0}>
                                                    <Text type="secondary" style={{ fontSize: 12 }}>{item.email}</Text>
                                                    <Text style={{ fontSize: 11, color: '#94a3b8' }}>
                                                        <ClockCircleOutlined style={{ marginRight: 4 }} />
                                                        {formatTime(item.connectedAt)}
                                                    </Text>
                                                </Space>
                                            }
                                        />
                                        <Space size={8}>
                                            <Tooltip title="View Profile">
                                                <Button 
                                                    icon={<ProfileOutlined />} 
                                                    shape="circle" 
                                                    size="small"
                                                    onClick={() => { setSelectedUser(item); setIsProfileVisible(true); }}
                                                />
                                            </Tooltip>
                                            <Button 
                                                type="primary" 
                                                icon={<VideoCameraOutlined />} 
                                                size="small"
                                                style={{ borderRadius: '8px', background: PRIMARY_COLOR }}
                                                onClick={() => setIsModalVisible(true)}
                                            >
                                                Connect
                                            </Button>
                                        </Space>
                                    </List.Item>
                                </motion.div>
                            )}
                            locale={{ emptyText: <Empty description="No collaborators online" /> }}
                        />
                    </Card>
                </Col>

                {/* Right Panel: Incoming Requests */}
                <Col xs={24} lg={10}>
                    <Card 
                        title={
                            <Space>
                                <BellOutlined style={{ color: '#f59e0b' }} />
                                <span style={{ fontSize: 18, fontWeight: 600 }}>Active Requests</span>
                            </Space>
                        }
                        style={{ 
                            borderRadius: '24px', 
                            boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
                            border: 'none',
                            background: '#ffffff',
                            minHeight: '500px'
                        }}
                    >
                        <AnimatePresence>
                            {incomingRequests.length === 0 ? (
                                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="All caught up!" />
                            ) : (
                                <List
                                    dataSource={incomingRequests}
                                    pagination={{ 
                                        pageSize: 6, 
                                        size: 'small', 
                                        hideOnSinglePage: true,
                                        style: { marginTop: 16, textAlign: 'center' }
                                    }}
                                    renderItem={(req) => (
                                        <motion.div 
                                            key={req.collaborationId}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            style={{ 
                                                padding: '16px', 
                                                background: '#fdfdfd', 
                                                border: '1px solid #f1f5f9', 
                                                borderRadius: '20px', 
                                                marginBottom: 12,
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
                                            }}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                                <Space>
                                                    <Avatar icon={<UserOutlined />} style={{ background: PRIMARY_COLOR }} size="small" />
                                                    <div>
                                                        <Text strong style={{ display: 'block', fontSize: 14 }}>{req.senderName}</Text>
                                                        <Tag color="gold" style={{ borderRadius: '6px', fontSize: 9 }}>MEETING</Tag>
                                                    </div>
                                                </Space>
                                                <Text type="secondary" style={{ fontSize: 10 }}>{formatTime(req.createdAt)}</Text>
                                            </div>
                                            <Paragraph ellipsis={{ rows: 1 }} style={{ color: '#64748b', marginBottom: 12, fontSize: 12 }}>
                                                "{req.message}"
                                            </Paragraph>
                                            <Row gutter={8}>
                                                <Col span={12}>
                                                    <Button 
                                                        block 
                                                        type="primary" 
                                                        size="small"
                                                        icon={<CheckOutlined />} 
                                                        onClick={() => handleAccept(req)}
                                                        style={{ borderRadius: '8px', background: PRIMARY_COLOR }}
                                                    >
                                                        Accept
                                                    </Button>
                                                </Col>
                                                <Col span={12}>
                                                    <Button 
                                                        block 
                                                        danger 
                                                        size="small"
                                                        icon={<CloseOutlined />} 
                                                        onClick={() => handleDecline(req)}
                                                        style={{ borderRadius: '8px' }}
                                                    >
                                                        Decline
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </motion.div>
                                    )}
                                />
                            )}
                        </AnimatePresence>
                    </Card>
                </Col>

                {/* History Section: Full Width Bottom */}
                <Col xs={24}>
                    <Card 
                        title={
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                <Space>
                                    <HistoryOutlined style={{ fontSize: 20, color: PRIMARY_COLOR }} />
                                    <span style={{ fontSize: 18, fontWeight: 600 }}>Collaboration Journey</span>
                                </Space>
                                <Input
                                    placeholder="Filter history..."
                                    prefix={<SearchOutlined />}
                                    value={collaborationFilter}
                                    onChange={e => setCollaborationFilter(e.target.value)}
                                    style={{ width: '300px', borderRadius: '10px' }}
                                />
                            </div>
                        }
                        style={{ 
                            borderRadius: '24px', 
                            boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
                            border: 'none',
                            marginTop: 16
                        }}
                    >
                        {loadingHistory ? <Loader /> : (
                            <List
                                grid={{ gutter: 24, xs: 1, sm: 1, md: 2, lg: 3, xl: 3, xxl: 4 }}
                                dataSource={filteredCollaborations}
                                pagination={{ 
                                    pageSize: 6, 
                                    hideOnSinglePage: true,
                                    style: { textAlign: 'center', marginTop: 24 }
                                }}
                                renderItem={collab => {
                                    const partner = collab.sentByYou ? collab.participants[1] : collab.participants[0];
                                    const statusColor = collab.status === 'accepted' ? '#10b981' : collab.status === 'declined' ? '#ef4444' : '#f59e0b';
                                    
                                    return (
                                        <List.Item>
                                            <Card 
                                                hoverable 
                                                style={{ 
                                                    borderRadius: '20px', 
                                                    border: '1px solid #f1f5f9',
                                                    overflow: 'hidden'
                                                }}
                                                bodyStyle={{ padding: '20px' }}
                                            >
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                                                    <Avatar 
                                                        size={40} 
                                                        icon={<VideoCameraOutlined />} 
                                                        style={{ background: `${statusColor}20`, color: statusColor }} 
                                                    />
                                                    <Space>
                                                        {collab.sentByYou && (
                                                            <Button 
                                                                type="text" 
                                                                icon={<ProfileOutlined style={{ color: '#6366f1' }} />} 
                                                                size="small" 
                                                                onClick={() => {
                                                                    setEditingCollab(collab);
                                                                    setEditFormValues({ 
                                                                        message: collab.message || '', 
                                                                        meetLink: collab.meetLink || '' 
                                                                    });
                                                                    setIsEditModalVisible(true);
                                                                }}
                                                            />
                                                        )}
                                                        <Popconfirm title="Delete this record?" onConfirm={() => handleDeleteCollaboration(collab._id)}>
                                                            <Button type="text" danger icon={<DeleteOutlined />} size="small" />
                                                        </Popconfirm>
                                                    </Space>
                                                </div>
                                                <Title level={5} style={{ marginBottom: 4 }}>Meeting with {partner?.name || 'User'}</Title>
                                                <Text type="secondary" block style={{ marginBottom: 12, fontSize: 12 }}>{partner?.email}</Text>
                                                
                                                <div style={{ marginBottom: 16 }}>
                                                    <Tag color={collab.sentByYou ? 'blue' : 'purple'} style={{ borderRadius: '6px' }}>
                                                        {collab.sentByYou ? 'OUTGOING' : 'INCOMING'}
                                                    </Tag>
                                                    <Tag color={collab.status === 'accepted' ? 'green' : collab.status === 'declined' ? 'red' : 'orange'} style={{ borderRadius: '6px' }}>
                                                        {collab.status.toUpperCase()}
                                                    </Tag>
                                                </div>

                                                <div style={{ 
                                                    background: '#f8fafc', 
                                                    padding: '12px', 
                                                    borderRadius: '12px', 
                                                    marginBottom: 16,
                                                    fontSize: 13,
                                                    minHeight: '60px'
                                                }}>
                                                    {collab.message || 'No message provided'}
                                                </div>

                                                <Row justify="space-between" align="middle">
                                                    <Text style={{ fontSize: 11, color: '#94a3b8' }}>{formatTime(collab.createdAt)}</Text>
                                                    {collab.meetLink && (
                                                        <Button type="link" href={collab.meetLink} target="_blank" icon={<LinkOutlined />} size="small">
                                                            Join
                                                        </Button>
                                                    )}
                                                </Row>
                                            </Card>
                                        </List.Item>
                                    );
                                }}
                            />
                        )}
                    </Card>
                </Col>
            </Row>

            {/* Modals */}
            <MeetingRequestModal
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onSubmit={handleSendRequest}
                onlineUsers={onlineUsers}
                loading={sendingRequest}
            />

            <CollaboratorProfile
                visible={isProfileVisible}
                onClose={() => { setIsProfileVisible(false); setSelectedUser(null); }}
                user={selectedUser}
                onSendMeetingRequest={() => { setIsProfileVisible(false); setIsModalVisible(true); }}
            />

            <ProfileCompletionForm 
                visible={!isProfileComplete}
                user={user} 
                onComplete={handleProfileComplete}
                onClose={() => setIsProfileComplete(true)}
                token={token}
            />

            {/* Edit Collaboration Modal */}
            <Modal
                title={
                    <Space>
                        <ProfileOutlined style={{ color: '#6366f1' }} />
                        <span>Edit Collaboration Details</span>
                    </Space>
                }
                open={isEditModalVisible}
                onCancel={() => setIsEditModalVisible(false)}
                footer={[
                    <Button key="cancel" onClick={() => setIsEditModalVisible(false)}>Cancel</Button>,
                    <Button 
                        key="submit" 
                        type="primary" 
                        loading={updatingCollab} 
                        onClick={handleUpdateCollaboration}
                        style={{ background: PRIMARY_COLOR }}
                    >
                        Save Changes
                    </Button>
                ]}
                centered
                borderRadius={16}
            >
                <div style={{ padding: '8px 0' }}>
                    <Text strong style={{ display: 'block', marginBottom: 8 }}>Meeting Message</Text>
                    <Input.TextArea 
                        rows={4} 
                        value={editFormValues.message}
                        onChange={e => setEditFormValues({ ...editFormValues, message: e.target.value })}
                        placeholder="Update your collaboration message..."
                        style={{ borderRadius: '12px', marginBottom: 20 }}
                    />
                    
                    <Text strong style={{ display: 'block', marginBottom: 8 }}>Meeting Link</Text>
                    <Input 
                        prefix={<LinkOutlined />}
                        value={editFormValues.meetLink}
                        onChange={e => setEditFormValues({ ...editFormValues, meetLink: e.target.value })}
                        placeholder="Update meeting URL (Zoom, Google Meet, etc.)"
                        style={{ borderRadius: '12px' }}
                    />
                </div>
            </Modal>
        </motion.div>
    );
};

export default CollaborationPage;
