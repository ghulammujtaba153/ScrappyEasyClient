import React, { useEffect, useState } from 'react';
import { Modal, Avatar, Typography, Space, Divider, Button, Tag, Descriptions, Spin } from 'antd';
import { 
    UserOutlined, 
    MailOutlined, 
    ClockCircleOutlined,
    VideoCameraOutlined,
    CheckCircleOutlined,
    ManOutlined,
    WomanOutlined,
    CalendarOutlined,
    HeartOutlined,
    PhoneOutlined,
    HomeOutlined,
    GlobalOutlined,
    EnvironmentOutlined
} from '@ant-design/icons';
import axios from 'axios';
import { BASE_URL } from '../../config/URL';

const { Title, Text } = Typography;

// Global primary color
const PRIMARY_COLOR = '#0F792C';

const CollaboratorProfile = ({ visible, onClose, user, onSendMeetingRequest }) => {
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(false);

    // Fetch full user details when modal opens
    useEffect(() => {
        const fetchUserDetails = async () => {
            // Use userId or _id (whichever is available)
            const id = user?.userId || user?._id;
            if (visible && id) {
                setLoading(true);
                try {
                    const res = await axios.get(`${BASE_URL}/api/user/${id}`);
                    if (res.data.success) {
                        setUserDetails(res.data.data);
                    }
                } catch (error) {
                    console.error('Error fetching user details:', error);
                }
                setLoading(false);
            }
        };
        fetchUserDetails();
    }, [visible, user?.userId, user?._id]);

    if (!user) return null;

    const formatTime = (date) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getOnlineDuration = (connectedAt) => {
        if (!connectedAt) return 'Unknown';
        const now = new Date();
        const connected = new Date(connectedAt);
        const diffMs = now - connected;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        
        if (diffHours > 0) {
            return `${diffHours}h ${diffMins % 60}m`;
        }
        return `${diffMins}m`;
    };

    const formatDob = (dob) => {
        if (!dob) return null;
        const date = new Date(dob);
        return date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const calculateAge = (dob) => {
        if (!dob) return null;
        const today = new Date();
        const birthDate = new Date(dob);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const getGenderIcon = (gender) => {
        if (gender === 'male') return <ManOutlined style={{ color: '#1890ff' }} />;
        if (gender === 'female') return <WomanOutlined style={{ color: '#eb2f96' }} />;
        return <UserOutlined style={{ color: PRIMARY_COLOR }} />;
    };

    const getGenderLabel = (gender) => {
        if (gender === 'male') return 'Male';
        if (gender === 'female') return 'Female';
        if (gender === 'other') return 'Other';
        return 'Not specified';
    };

    return (
        <Modal
            open={visible}
            onCancel={onClose}
            footer={[
                <Button key="close" onClick={onClose}>
                    Close
                </Button>,
                <Button 
                    key="meeting" 
                    type="primary" 
                    icon={<VideoCameraOutlined />}
                    onClick={onSendMeetingRequest}
                    style={{ backgroundColor: PRIMARY_COLOR, borderColor: PRIMARY_COLOR }}
                >
                    Send Meeting Request
                </Button>
            ]}
            width={500}
            centered
        >
            {loading ? (
                <div style={{ textAlign: 'center', padding: 60 }}>
                    <Spin size="large" />
                    <Text type="secondary" style={{ display: 'block', marginTop: 16 }}>
                        Loading profile...
                    </Text>
                </div>
            ) : (
                <>
                    <div style={{ textAlign: 'center', paddingTop: 20 }}>
                        {/* Profile Avatar */}
                        <Avatar 
                            size={100} 
                            icon={<UserOutlined />}
                            style={{ 
                                backgroundColor: PRIMARY_COLOR,
                                marginBottom: 16
                            }}
                        />
                        
                        {/* User Name */}
                        <Title level={3} style={{ margin: 0, marginBottom: 4 }}>
                            {user.name || 'Unknown User'}
                        </Title>
                        
                        {/* Online Status & Gender */}
                        <Space style={{ marginBottom: 16 }}>
                            <Tag color="success" icon={<CheckCircleOutlined />}>
                                Online
                            </Tag>
                            {userDetails?.gender && (
                                <Tag color={userDetails.gender === 'male' ? 'blue' : userDetails.gender === 'female' ? 'magenta' : 'default'}>
                                    {getGenderIcon(userDetails.gender)} {getGenderLabel(userDetails.gender)}
                                </Tag>
                            )}
                            {userDetails?.dob && (
                                <Tag color="purple">
                                    {calculateAge(userDetails.dob)} years old
                                </Tag>
                            )}
                        </Space>
                    </div>

                    <Divider />

                    {/* User Details */}
                    <Descriptions column={1} labelStyle={{ fontWeight: 500 }} size="small">
                        

                        {userDetails?.dob && (
                            <Descriptions.Item 
                                label={
                                    <Space>
                                        <CalendarOutlined style={{ color: PRIMARY_COLOR }} />
                                        Date of Birth
                                    </Space>
                                }
                            >
                                {formatDob(userDetails.dob)}
                            </Descriptions.Item>
                        )}

                        {userDetails?.areaOfInterest && (
                            <Descriptions.Item 
                                label={
                                    <Space>
                                        <HeartOutlined style={{ color: PRIMARY_COLOR }} />
                                        Area of Interest
                                    </Space>
                                }
                            >
                                <Text>{userDetails.areaOfInterest}</Text>
                            </Descriptions.Item>
                        )}

                        

                        

                        {userDetails?.country && (
                            <Descriptions.Item 
                                label={
                                    <Space>
                                        <GlobalOutlined style={{ color: PRIMARY_COLOR }} />
                                        Country
                                    </Space>
                                }
                            >
                                <Text>{userDetails.country}</Text>
                            </Descriptions.Item>
                        )}

                        

                        

                        {userDetails?.createdAt && (
                            <Descriptions.Item 
                                label={
                                    <Space>
                                        <CalendarOutlined style={{ color: PRIMARY_COLOR }} />
                                        Member Since
                                    </Space>
                                }
                            >
                                {formatTime(userDetails.createdAt)}
                            </Descriptions.Item>
                        )}
                    </Descriptions>

                    <Divider />

                    <div style={{ 
                        backgroundColor: '#f6ffed', 
                        border: '1px solid #b7eb8f',
                        borderRadius: 8,
                        padding: 12,
                        textAlign: 'center'
                    }}>
                        <Text type="secondary">
                            💡 You can schedule a meeting with this user by clicking the button above
                        </Text>
                    </div>
                </>
            )}
        </Modal>
    );
};

export default CollaboratorProfile;
