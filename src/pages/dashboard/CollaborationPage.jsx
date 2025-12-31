import { useState, useEffect, useCallback } from 'react';
import { 
    Card, 
    List, 
    Avatar, 
    Button, 
    Badge, 
    Typography, 
    Empty, 
    Spin, 
    Tag, 
    Space,
    Divider,
    Tooltip,
    Row,
    Col,
    Popconfirm,
    message
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
    ProfileOutlined
} from '@ant-design/icons';
import { useSocket } from '../../context/SocketContext';
import { useAuth } from '../../context/authContext';
import MeetingRequestModal from '../../components/collaboration/MeetingRequestModal';
import axios from 'axios';
import { BASE_URL } from '../../config/URL';
import { io } from 'socket.io-client';
import CollaboratorProfile from '../../components/collaboration/CollaboratorProfile';
import ProfileCompletionForm from '../../components/collaboration/ProfileCompletionForm';

const { Title, Text, Paragraph } = Typography;

// Global primary color
const PRIMARY_COLOR = '#0F792C';

const CollaborationPage = () => {
    const { user, token, updateUser } = useAuth();
    const { 
        isConnected, 
        onlineUsers, 
        incomingRequests, 
        sendMeetingRequest,
        acceptMeetingRequest,
        declineMeetingRequest 
    } = useSocket();
    
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [sendingRequest, setSendingRequest] = useState(false);
    const [pastCollaborations, setPastCollaborations] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isProfileVisible, setIsProfileVisible] = useState(false);
    const [profileCheckLoading, setProfileCheckLoading] = useState(true);
    const [isProfileComplete, setIsProfileComplete] = useState(false);

    // Fetch fresh user data from API to check profile completion
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
                    const complete = !!(userData?.gender && userData?.dob && userData?.areaOfInterest);
                    setIsProfileComplete(complete);
                    // Update local user if needed
                    if (updateUser) {
                        updateUser(userData);
                    }
                }
            } catch (error) {
                console.error('Error checking profile:', error);
                // Fallback to local user data
                setIsProfileComplete(!!(user?.gender && user?.dob && user?.areaOfInterest));
            } finally {
                setProfileCheckLoading(false);
            }
        };
        checkProfileCompletion();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?._id]);

    const handleProfileComplete = (updatedUser) => {
        if (updateUser) {
            updateUser(updatedUser);
        }
        setIsProfileComplete(true);
    };

    // Fetch past collaborations
    const fetchPastCollaborations = useCallback(async () => {
        if (!user?._id) return;
        try {
            setLoadingHistory(true);
            const res = await axios.get(`${BASE_URL}/api/collaboration/user/${user._id}`);
            if (res.data.success) {
                setPastCollaborations(res.data.data || []);
            }
        } catch (error) {
            console.error('Error fetching collaborations:', error);
        } finally {
            setLoadingHistory(false);
        }
    }, [user]);

    useEffect(() => {
        fetchPastCollaborations();
    }, [fetchPastCollaborations]);

    // Real-time collaboration history updates
    useEffect(() => {
        if (!user?._id) return;

        const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
            transports: ['websocket', 'polling'],
        });

        // Listen for collaboration updates (new request sent, accepted, declined)
        socket.on('meeting_request_sent', () => {
            fetchPastCollaborations();
        });

        socket.on('meeting_request_response', () => {
            fetchPastCollaborations();
        });

        socket.on('response_sent', () => {
            fetchPastCollaborations();
        });

        // Also listen for when a new request is received (for receiver's history)
        socket.on('meeting_request_received', () => {
            fetchPastCollaborations();
        });

        return () => {
            socket.disconnect();
        };
    }, [user, fetchPastCollaborations]);

    const handleSendRequest = (data) => {
        setSendingRequest(true);
        sendMeetingRequest(data.receiverId, data.meetLink, data.message);
        setSendingRequest(false);
        setIsModalVisible(false);
    };

    const handleAccept = (request) => {
        acceptMeetingRequest(request.collaborationId);
        // Open the meet link
        if (request.meetLink) {
            window.open(request.meetLink, '_blank');
        }
    };

    const handleDecline = (request) => {
        declineMeetingRequest(request.collaborationId);
    };

    const handleDeleteCollaboration = async (collaborationId) => {
        try {
            const res = await axios.delete(`${BASE_URL}/api/collaboration/${collaborationId}`);
            if (res.data.success) {
                message.success('Collaboration deleted successfully');
                fetchPastCollaborations();
            }
        } catch (error) {
            console.error('Error deleting collaboration:', error);
            message.error('Failed to delete collaboration');
        }
    };

    const formatTime = (date) => {
        return new Date(date).toLocaleString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            month: 'short',
            day: 'numeric'
        });
    };

    // Show loading while checking profile
    if (profileCheckLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 200px)' }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div style={{ padding: '24px' }}>
            {/* Profile Completion Modal */}
            <ProfileCompletionForm 
                visible={!isProfileComplete}
                user={user} 
                onComplete={handleProfileComplete}
                onClose={() => setIsProfileComplete(true)}
                token={token}
            />

            {/* Header */}
            <div style={{ marginBottom: 24 }}>
                <Title level={2} style={{ margin: 0 }}>
                    <TeamOutlined style={{ marginRight: 12 }} />
                    Collaboration Hub
                </Title>
                <Text type="secondary">
                    Connect with online users and schedule meetings in real-time
                </Text>
            </div>

            {/* Connection Status */}
            <Card size="small" style={{ marginBottom: 24 }}>
                <Space>
                    <Badge 
                        status={isConnected ? 'success' : 'error'} 
                        text={isConnected ? 'Connected' : 'Disconnected'} 
                    />
                    <Divider type="vertical" />
                    <Text>
                        <UserOutlined style={{ marginRight: 6 }} />
                        {onlineUsers.length} users online
                    </Text>
                </Space>
            </Card>

            <Row gutter={[24, 24]}>
                {/* Online Users Section */}
                <Col xs={24} lg={12}>
                    <Card 
                        title={
                            <Space className='mt-2'>
                                <Badge count={onlineUsers.length} showZero color={PRIMARY_COLOR}>
                                    <UserOutlined style={{ fontSize: 18 }} />
                                </Badge>
                                <span>Online Users</span>
                            </Space>
                        }
                        extra={
                            
                            <button 
                                className='bg-primary text-white transition-transform transform-smooth hover:scale-105 px-4 py-2 rounded flex items-center gap-2'
                                icon={<VideoCameraOutlined />}
                                onClick={() => setIsModalVisible(true)}
                                disabled={onlineUsers.length === 0}
                            >
                                New Meeting
                            </button>
                        }
                        style={{ height: '100%' }}
                    >
                        {onlineUsers.length === 0 ? (
                            <Empty 
                                description="No other users online"
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                            />
                        ) : (
                            <List
                                itemLayout="horizontal"
                                dataSource={onlineUsers}
                                style={{ maxHeight: 400, overflowY: 'auto' }}
                                renderItem={item => (
                                    <List.Item

                                        actions={[
                                            <Tooltip title="View Profile">
                                                <Button
                                                    type="primary"
                                                    shape="circle"
                                                    icon={<ProfileOutlined />}
                                                    onClick={() => {
                                                        setSelectedUser(item);
                                                        setIsProfileVisible(true);
                                                    }}
                                                    size="small"
                                                />
                                                </Tooltip>,
                                            <Tooltip title="Send meeting request">
                                                
                                                <Button
                                                
                                                    type="primary"
                                                    shape="circle"
                                                    icon={<VideoCameraOutlined />}
                                                    onClick={() => setIsModalVisible(true)}
                                                    size="small"
                                                />
                                            </Tooltip>
                                        ]}
                                    >
                                        <List.Item.Meta
                                            avatar={
                                                <Badge dot status="success" offset={[-4, 32]}>
                                                    <Avatar 
                                                        icon={<UserOutlined />}
                                                        style={{ backgroundColor: PRIMARY_COLOR }}
                                                    />
                                                </Badge>
                                            }
                                            title={item.name}
                                            description={
                                                <Space direction="vertical" size={0}>
                                                    
                                                    <Text type="secondary" style={{ fontSize: 11 }}>
                                                        <ClockCircleOutlined style={{ marginRight: 4 }} />
                                                        Online since {formatTime(item.connectedAt)}
                                                    </Text>
                                                </Space>
                                            }
                                        />
                                    </List.Item>
                                )}
                            />
                        )}
                    </Card>
                </Col>

                {/* Incoming Requests Section */}
                <Col xs={24} lg={12}>
                    <Card 
                        title={
                            <Space className='mt-2'>
                                <Badge count={incomingRequests.length} showZero>
                                    <BellOutlined style={{ fontSize: 18 }} />
                                </Badge>
                                <span>Incoming Requests</span>
                            </Space>
                        }
                        style={{ height: '100%' }}
                    >
                        {incomingRequests.length === 0 ? (
                            <Empty 
                                description="No pending requests"
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                            />
                        ) : (
                            <List
                                itemLayout="vertical"
                                dataSource={incomingRequests}
                                style={{ maxHeight: 400, overflowY: 'auto' }}
                                renderItem={request => (
                                    <List.Item
                                        key={request.collaborationId}
                                        actions={[
                                            <Button 
                                                type="primary" 
                                                icon={<CheckOutlined />}
                                                onClick={() => handleAccept(request)}
                                            >
                                                Accept
                                            </Button>,
                                            <Button 
                                                danger
                                                icon={<CloseOutlined />}
                                                onClick={() => handleDecline(request)}
                                            >
                                                Decline
                                            </Button>
                                        ]}
                                    >
                                        <List.Item.Meta
                                            avatar={
                                                <Avatar 
                                                    icon={<UserOutlined />}
                                                    style={{ backgroundColor: PRIMARY_COLOR }}
                                                />
                                            }
                                            title={
                                                <Space>
                                                    <Text strong>{request.senderName}</Text>
                                                    <Tag color="blue">Meeting Request</Tag>
                                                </Space>
                                            }
                                            description={
                                                <Space direction="vertical" size={4}>
                                                    <Paragraph 
                                                        style={{ margin: 0 }}
                                                        ellipsis={{ rows: 2 }}
                                                    >
                                                        {request.message}
                                                    </Paragraph>
                                                    <Space>
                                                        <LinkOutlined />
                                                        <a 
                                                            href={request.meetLink} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                        >
                                                            {request.meetLink}
                                                        </a>
                                                    </Space>
                                                    <Text type="secondary" style={{ fontSize: 11 }}>
                                                        <ClockCircleOutlined style={{ marginRight: 4 }} />
                                                        {formatTime(request.createdAt)}
                                                    </Text>
                                                </Space>
                                            }
                                        />
                                    </List.Item>
                                )}
                            />
                        )}
                    </Card>
                </Col>

                {/* Past Collaborations */}
                <Col xs={24}>
                    <Card 
                        title={
                            <Space>
                                <TeamOutlined style={{ fontSize: 18 }} />
                                <span>Collaboration History</span>
                            </Space>
                        }
                    >
                        {loadingHistory ? (
                            <div style={{ textAlign: 'center', padding: 40 }}>
                                <Spin size="large" />
                            </div>
                        ) : pastCollaborations.length === 0 ? (
                            <Empty 
                                description="No collaboration history"
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                            />
                        ) : (
                            <List
                                itemLayout="horizontal"
                                dataSource={pastCollaborations}
                                pagination={{ pageSize: 5 }}
                                renderItem={collab => (
                                    <List.Item
                                        actions={[
                                            collab.meetLink && (
                                                <Button 
                                                    type="link" 
                                                    href={collab.meetLink}
                                                    target="_blank"
                                                    icon={<LinkOutlined />}
                                                >
                                                    Open Link
                                                </Button>
                                            ),
                                            <Popconfirm
                                                title="Delete collaboration"
                                                description="Are you sure you want to delete this collaboration?"
                                                onConfirm={() => handleDeleteCollaboration(collab._id)}
                                                okText="Yes"
                                                cancelText="No"
                                                okButtonProps={{ danger: true }}
                                            >
                                                <Button 
                                                    type="text" 
                                                    danger
                                                    icon={<DeleteOutlined />}
                                                >
                                                    Delete
                                                </Button>
                                            </Popconfirm>
                                        ].filter(Boolean)}
                                    >
                                        <List.Item.Meta
                                            avatar={
                                                <Avatar 
                                                    icon={<VideoCameraOutlined />}
                                                    style={{ 
                                                        backgroundColor: collab.status === 'accepted' 
                                                            ? PRIMARY_COLOR 
                                                            : collab.status === 'declined'
                                                            ? '#ff4d4f'
                                                            : '#faad14'
                                                    }}
                                                />
                                            }
                                            title={
                                                <Space>
                                                    <Text>Meeting</Text>
                                                    <Tag color={
                                                        collab.status === 'accepted' ? 'green' :
                                                        collab.status === 'declined' ? 'red' : 'orange'
                                                    }>
                                                        {collab.status}
                                                    </Tag>
                                                </Space>
                                            }
                                            description={
                                                <Space direction="vertical" size={0}>
                                                    <Text type="secondary">{collab.message}</Text>
                                                    <Text type="secondary" style={{ fontSize: 11 }}>
                                                        {formatTime(collab.createdAt)}
                                                    </Text>
                                                </Space>
                                            }
                                        />
                                    </List.Item>
                                )}
                            />
                        )}
                    </Card>
                </Col>
            </Row>

            {/* Meeting Request Modal */}
            <MeetingRequestModal
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onSubmit={handleSendRequest}
                onlineUsers={onlineUsers}
                loading={sendingRequest}
            />

            {/* Collaborator Profile Modal */}
            <CollaboratorProfile
                visible={isProfileVisible}
                onClose={() => {
                    setIsProfileVisible(false);
                    setSelectedUser(null);
                }}
                user={selectedUser}
                onSendMeetingRequest={() => {
                    setIsProfileVisible(false);
                    setIsModalVisible(true);
                }}
            />
        </div>
    );
};

export default CollaborationPage;
