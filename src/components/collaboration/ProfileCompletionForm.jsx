import React, { useState } from 'react';
import { Modal, Form, Input, Select, DatePicker, Button, Typography, Space, Alert } from 'antd';
import { 
    UserOutlined, 
    CalendarOutlined, 
    HeartOutlined,
    CheckCircleOutlined
} from '@ant-design/icons';
import axios from 'axios';
import { BASE_URL } from '../../config/URL';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

// Global primary color
const PRIMARY_COLOR = '#0F792C';

const ProfileCompletionForm = ({ visible, user, onComplete, onClose, token }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values) => {
        try {
            setLoading(true);
            const res = await axios.put(
                `${BASE_URL}/api/user/update-profile`,
                {
                    gender: values.gender,
                    dob: values.dob ? values.dob.toISOString() : null,
                    areaOfInterest: values.areaOfInterest
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            if (res.data.success) {
                // Merge existing user with new fields since server might not return all fields
                const updatedUser = {
                    ...user,
                    gender: values.gender,
                    dob: values.dob ? values.dob.toISOString() : null,
                    areaOfInterest: values.areaOfInterest
                };
                onComplete(updatedUser);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            open={visible}
            onCancel={onClose}
            footer={null}
            width={500}
            centered
            closeIcon={
                <span style={{ 
                    fontSize: 18, 
                    color: '#999',
                    padding: 8,
                    borderRadius: '50%',
                    transition: 'all 0.3s'
                }}>
                    ✕
                </span>
            }
        >
            <div style={{ textAlign: 'center', marginBottom: 24, paddingTop: 10 }}>
                <div style={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    backgroundColor: `${PRIMARY_COLOR}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px'
                }}>
                    <UserOutlined style={{ fontSize: 36, color: PRIMARY_COLOR }} />
                </div>
                <Title level={3} style={{ margin: 0, marginBottom: 8 }}>
                    Complete Your Profile
                </Title>
                <Text type="secondary">
                    Please fill in the following details to access the Collaboration Hub
                </Text>
            </div>

            <Alert
                message="Why is this needed?"
                description="This information helps other users know more about you and find collaborators with similar interests."
                type="info"
                showIcon
                style={{ marginBottom: 24 }}
            />

            <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={{
                        gender: user?.gender || undefined,
                        dob: user?.dob ? dayjs(user.dob) : undefined,
                        areaOfInterest: user?.areaOfInterest || ''
                    }}
                >
                    <Form.Item
                        name="gender"
                        label={
                            <Space>
                                <UserOutlined style={{ color: PRIMARY_COLOR }} />
                                Gender
                            </Space>
                        }
                        rules={[{ required: true, message: 'Please select your gender' }]}
                    >
                        <Select placeholder="Select your gender" size="large">
                            <Option value="male">Male</Option>
                            <Option value="female">Female</Option>
                            <Option value="other">Other</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="dob"
                        label={
                            <Space>
                                <CalendarOutlined style={{ color: PRIMARY_COLOR }} />
                                Date of Birth
                            </Space>
                        }
                        rules={[{ required: true, message: 'Please select your date of birth' }]}
                    >
                        <DatePicker 
                            style={{ width: '100%' }} 
                            size="large"
                            placeholder="Select your date of birth"
                            disabledDate={(current) => current && current > dayjs().endOf('day')}
                        />
                    </Form.Item>

                    <Form.Item
                        name="areaOfInterest"
                        label={
                            <Space>
                                <HeartOutlined style={{ color: PRIMARY_COLOR }} />
                                Area of Interest
                            </Space>
                        }
                        rules={[{ required: true, message: 'Please enter your area of interest' }]}
                    >
                        <TextArea 
                            rows={3} 
                            placeholder="e.g., Web Development, Data Science, Marketing, Design..."
                            maxLength={200}
                            showCount
                        />
                    </Form.Item>

                    <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            icon={<CheckCircleOutlined />}
                            size="large"
                            block
                            style={{ 
                                backgroundColor: PRIMARY_COLOR, 
                                borderColor: PRIMARY_COLOR,
                                height: 48
                            }}
                        >
                            Complete Profile & Continue
                        </Button>
                    </Form.Item>
                </Form>
        </Modal>
    );
};

export default ProfileCompletionForm;
