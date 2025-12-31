import { useState } from 'react';
import { Modal, Form, Input, Select, Button, Avatar, Typography } from 'antd';
import { 
    VideoCameraOutlined, 
    LinkOutlined, 
    MessageOutlined,
    UserOutlined 
} from '@ant-design/icons';

const { TextArea } = Input;
const { Text, Title } = Typography;

const MeetingRequestModal = ({ 
    visible, 
    onCancel, 
    onSubmit, 
    onlineUsers = [], 
    loading = false 
}) => {
    const [form] = Form.useForm();
    const [selectedUser, setSelectedUser] = useState(null);

    const handleSubmit = () => {
        form.validateFields().then(values => {
            onSubmit({
                receiverId: values.receiver,
                meetLink: values.meetLink,
                message: values.message
            });
            form.resetFields();
            setSelectedUser(null);
        });
    };

    const handleCancel = () => {
        form.resetFields();
        setSelectedUser(null);
        onCancel();
    };

    const handleUserSelect = (userId) => {
        const user = onlineUsers.find(u => u.userId === userId);
        setSelectedUser(user);
    };

    

    return (
        <Modal
            title={
                <div className='flex items-center gap-10'>
                    <VideoCameraOutlined className='text-xl text-primary'  />
                    <span>Send Meeting Request</span>
                </div>
            }
            open={visible}
            onCancel={handleCancel}
            footer={[
                <Button key="cancel" onClick={handleCancel}>
                    Cancel
                </Button>,
                <Button 
                    key="submit" 
                    className='bg-primary text-white' 
                    loading={loading}
                    onClick={handleSubmit}
                    icon={<VideoCameraOutlined />}
                >
                    Send Request
                </Button>
            ]}
            width={500}
        >
            <Form 
                form={form} 
                layout="vertical"
                style={{ marginTop: 20 }}
            >
                {/* Select User */}
                <Form.Item
                    name="receiver"
                    label="Select User to Meet"
                    rules={[{ required: true, message: 'Please select a user' }]}
                >
                    <Select
                        placeholder="Choose an online user"
                        onChange={handleUserSelect}
                        showSearch
                        optionFilterProp="children"
                        size="large"
                    >
                        {onlineUsers.map(user => (
                            <Select.Option key={user.userId} value={user.userId}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <Avatar 
                                        size="small" 
                                        icon={<UserOutlined />}
                                        style={{ backgroundColor: '#52c41a' }}
                                    />
                                    <div>
                                        <Text strong>{user.name}</Text>
                                        <Text type="secondary" style={{ marginLeft: 8, fontSize: 12 }}>
                                            {user.email}
                                        </Text>
                                    </div>
                                </div>
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                {/* Selected User Preview */}
                {selectedUser && (
                    <div style={{ 
                        padding: 12, 
                        background: '#f5f5f5', 
                        borderRadius: 8,
                        marginBottom: 16,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12
                    }}>
                        <Avatar 
                            size={48} 
                            icon={<UserOutlined />}
                            style={{ backgroundColor: '#52c41a' }}
                        />
                        <div>
                            <Title level={5} style={{ margin: 0 }}>{selectedUser.name}</Title>
                            <Text type="secondary">{selectedUser.email}</Text>
                            <div>
                                <span style={{ 
                                    color: '#52c41a', 
                                    fontSize: 12,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 4
                                }}>
                                    <span style={{ 
                                        width: 6, 
                                        height: 6, 
                                        borderRadius: '50%', 
                                        backgroundColor: '#52c41a',
                                        display: 'inline-block'
                                    }} />
                                    Online
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Meet Link */}
                <Form.Item
                    name="meetLink"
                    label="Meeting Link"
                    rules={[
                        { required: true, message: 'Please enter a meeting link' },
                        { type: 'url', message: 'Please enter a valid URL' }
                    ]}
                >
                    <Input
                        prefix={<LinkOutlined />}
                        placeholder="https://meet.google.com/xxx-xxxx-xxx"
                        size="large"
                        
                    />
                </Form.Item>

                {/* Message/Reason */}
                <Form.Item
                    name="message"
                    label="Message / Reason"
                    rules={[{ required: true, message: 'Please enter a reason for the meeting' }]}
                >
                    <TextArea
                        prefix={<MessageOutlined />}
                        placeholder="Hi! I'd like to discuss a potential collaboration on..."
                        rows={4}
                        showCount
                        maxLength={500}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default MeetingRequestModal;
