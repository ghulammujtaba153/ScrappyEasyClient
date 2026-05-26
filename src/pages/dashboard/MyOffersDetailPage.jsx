import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/authContext';
import { useParams, useNavigate } from 'react-router-dom';
import { BASE_URL } from "../../config/URL";
import { 
    Card, 
    Button, 
    Modal, 
    Form, 
    Space, 
    Empty, 
    Spin, 
    Timeline,
    Tag,
    Divider,
    Row,
    Col,
    BackTop,
    App
} from 'antd';
import { 
    DeleteOutlined, 
    EditOutlined, 
    PlusOutlined,
    ArrowLeftOutlined,
    CalendarOutlined
} from '@ant-design/icons';
import OfferModal from '../../components/modals/OfferModal';
import ActivityModal from '../../components/modals/ActivityModal';

const MyOffersDetailPage = () => {
    const { id } = useParams();
    const { token } = useAuth();
    const navigate = useNavigate();
    const { message } = App.useApp();
    
    const [offer, setOffer] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isActivityModalVisible, setIsActivityModalVisible] = useState(false);
    const [isEditOfferModalVisible, setIsEditOfferModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [activityForm] = Form.useForm();
    const [editingActivity, setEditingActivity] = useState(null);

    // Fetch offer details
    const fetchOfferDetails = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/api/offers/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            if (data.success) {
                setOffer(data.data);
                form.setFieldsValue({
                    name: data.data.name,
                    description: data.data.description,
                    status: data.data.status
                });
            } else {
                message.error('Failed to fetch offer');
            }
        } catch (error) {
            console.error('Error fetching offer:', error);
            message.error('Error fetching offer');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOfferDetails();
    }, [id, token]);

    // Update offer
    const handleUpdateOffer = async (values) => {
        try {
            const response = await fetch(`${BASE_URL}/api/offers/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(values)
            });

            const data = await response.json();
            if (data.success) {
                message.success('Offer updated');
                setOffer(data.data);
                setIsEditOfferModalVisible(false);
            } else {
                message.error(data.message || 'Failed to update offer');
            }
        } catch (error) {
            console.error('Error updating offer:', error);
            message.error('Error updating offer');
        }
    };

    // Add activity
    const handleAddActivity = async (values) => {
        try {
            let url = `${BASE_URL}/api/offers/${id}/activities`;
            let method = 'POST';

            if (editingActivity) {
                url = `${BASE_URL}/api/offers/${id}/activities/${editingActivity._id}`;
                method = 'PUT';
            }

            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(values)
            });

            const data = await response.json();
            if (data.success) {
                message.success(editingActivity ? 'Activity updated' : 'Activity added');
                setOffer(data.data);
                setIsActivityModalVisible(false);
                activityForm.resetFields();
                setEditingActivity(null);
            } else {
                message.error(data.message || 'Failed to save activity');
            }
        } catch (error) {
            console.error('Error saving activity:', error);
            message.error('Error saving activity');
        }
    };

    // Delete activity
    const handleDeleteActivity = (activityId) => {
        Modal.confirm({
            title: 'Delete Activity',
            content: 'Are you sure you want to delete this activity?',
            okText: 'Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: async () => {
                try {
                    const response = await fetch(`${BASE_URL}/api/offers/${id}/activities/${activityId}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        }
                    });

                    const data = await response.json();
                    if (data.success) {
                        message.success('Activity deleted');
                        setOffer(data.data);
                    } else {
                        console.error('Delete activity failed:', data);
                        message.error(data.message || 'Failed to delete activity');
                    }
                } catch (error) {
                    console.error('Error deleting activity:', error);
                    message.error('Error deleting activity');
                }
            }
        });
    };

    // Edit activity
    const handleEditActivity = (activity) => {
        setEditingActivity(activity);
        activityForm.setFieldsValue({
            text: activity.text,
            notes: activity.notes
        });
        setIsActivityModalVisible(true);
    };

    // Close modals
    const handleCloseActivityModal = () => {
        setIsActivityModalVisible(false);
        activityForm.resetFields();
        setEditingActivity(null);
    };

    const handleCloseOfferModal = () => {
        setIsEditOfferModalVisible(false);
    };

    const getStatusColor = (status) => {
        const colors = {
            active: 'green',
            inactive: 'default',
            completed: 'blue'
        };
        return colors[status] || 'default';
    };

    // We'll render activities as a vertical timeline with points on the left

    // Activities are expected to be ordered by `sequence`

    if (loading) {
        return <Spin size="large" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }} />;
    }

    if (!offer) {
        return (
            <div className="p-6 text-center">
                <Empty description="Offer not found" />
                <Button 
                    type="primary" 
                    onClick={() => navigate('/dashboard/myoffers')}
                    className="mt-4 bg-[#0F792C]"
                >
                    Back to Offers
                </Button>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <BackTop />
            
            {/* Header */}
            <div className="mb-6">
                <Button 
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate('/dashboard/myoffers')}
                    className="mb-4"
                >
                    Back to Offers
                </Button>
            </div>

            {/* Main offer info card */}
            <Row gutter={[16, 16]}>
                <Col xs={24} md={16}>
                    <Card className="shadow-lg">
                        <div className="mb-4">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-800 mb-2">{offer.name}</h1>
                                    <Tag color={getStatusColor(offer.status)}>
                                        {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
                                    </Tag>
                                </div>
                                <Button 
                                    type="primary"
                                    icon={<EditOutlined />}
                                    onClick={() => setIsEditOfferModalVisible(true)}
                                    className="bg-[#0F792C]"
                                >
                                    Edit Offer
                                </Button>
                            </div>
                            <Divider />
                            <p className="text-gray-600 text-base mb-2">{offer.description}</p>
                            <div className="text-xs text-gray-500">
                                <CalendarOutlined /> Created: {new Date(offer.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    </Card>
                </Col>

                {/* Stats card */}
                <Col xs={24} md={8}>
                    <Card className="shadow-lg bg-gradient-to-br from-[#0F792C] to-[#0a5a20] text-white">
                                <div className="text-center">
                                    <div className="text-5xl font-bold mb-2">{offer.activities?.length || 0}</div>
                                    <div className="text-lg mb-4">Steps</div>
                                    <Divider className="bg-green-700" />
                                    {offer.activities && offer.activities.length > 0 && (
                                        <div>
                                            <div className="text-sm">Last performed</div>
                                            <div className="text-md font-bold">{new Date(offer.activities[offer.activities.length - 1].date).toLocaleString()}</div>
                                        </div>
                                    )}
                                </div>
                    </Card>
                </Col>
            </Row>

            {/* Activities Section */}
            <Card className="shadow-lg mt-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Activities</h2>
                    <Button 
                        type="primary" 
                        icon={<PlusOutlined />}
                        onClick={() => setIsActivityModalVisible(true)}
                        className="bg-[#0F792C]"
                    >
                        Add Activity
                    </Button>
                </div>

                {offer.activities && offer.activities.length > 0 ? (
                    <Timeline mode="left" className="mt-4">
                        {offer.activities.slice().sort((a,b) => (a.sequence || 0) - (b.sequence || 0)).map(act => (
                            <Timeline.Item
                                key={act._id}
                                dot={<div className="w-4 h-4 rounded-full bg-[#0F792C]" />}
                                color="#0F792C"
                            >
                                <div className="ml-4">
                                    <Card size="small" className="shadow-sm">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1 pr-4">
                                                <div className="font-medium text-gray-800">{act.text}</div>
                                                {act.notes && (
                                                    <div className="text-sm text-gray-500 mt-2">{act.notes}</div>
                                                )}
                                                <div className="text-xs text-gray-400 mt-3">{new Date(act.date).toLocaleString()}</div>
                                            </div>
                                            <div className="flex flex-col gap-2 ml-4">
                                                <Button icon={<EditOutlined />} size="small" onClick={() => handleEditActivity(act)} />
                                                <Button icon={<DeleteOutlined />} size="small" danger onClick={() => handleDeleteActivity(act._id)} />
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            </Timeline.Item>
                        ))}
                    </Timeline>
                ) : (
                    <Empty description="No activities yet">
                        <Button 
                            type="primary"
                            onClick={() => setIsActivityModalVisible(true)}
                            className="bg-[#0F792C]"
                        >
                            Add First Activity
                        </Button>
                    </Empty>
                )}
            </Card>

            {/* Edit Offer Modal */}
            <OfferModal
                visible={isEditOfferModalVisible}
                onCancel={handleCloseOfferModal}
                onSubmit={handleUpdateOffer}
                form={form}
                isEditMode={true}
                includeStatus={true}
            />

            {/* Add/Edit Activity Modal */}
            <ActivityModal
                visible={isActivityModalVisible}
                onCancel={handleCloseActivityModal}
                onSubmit={handleAddActivity}
                form={activityForm}
                isEditMode={!!editingActivity}
            />
        </div>
    )
}

export default MyOffersDetailPage
