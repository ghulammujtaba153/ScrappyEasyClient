import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/authContext';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from "../../config/URL";
import { Card, Button, Modal, Form, Empty, Spin, Row, Col, Tag, Space, App, Pagination } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import OfferModal from '../../components/modals/OfferModal';

const MyOffersPage = () => {
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const { message } = App.useApp();
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [editingOffer, setEditingOffer] = useState(null);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(12);
    const [total, setTotal] = useState(0);
    const [isSaving, setIsSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    // Fetch offers (paginated)
    const fetchOffers = async (p = page, limit = pageSize) => {
        setLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/api/offers?page=${p}&limit=${limit}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            if (data.success) {
                setOffers(data.data);
                if (data.meta) {
                    setTotal(data.meta.total || 0);
                    setPage(data.meta.page || p);
                    setPageSize(data.meta.limit || limit);
                }
            } else {
                message.error('Failed to fetch offers');
            }
        } catch (error) {
            console.error('Error fetching offers:', error);
            message.error('Error fetching offers');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOffers(page, pageSize);
    }, [token, page, pageSize]);

    // Create or update offer
    const handleSaveOffer = async (values) => {
        try {
            setIsSaving(true);
            const method = editingOffer ? 'PUT' : 'POST';
            const url = editingOffer 
                ? `${BASE_URL}/api/offers/${editingOffer._id}`
                : `${BASE_URL}/api/offers`;

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
                message.success(editingOffer ? 'Offer updated' : 'Offer created');
                setIsModalVisible(false);
                form.resetFields();
                setEditingOffer(null);
                fetchOffers(1, pageSize); // refresh first page
            } else {
                message.error(data.message || 'Failed to save offer');
            }
        } catch (error) {
            console.error('Error saving offer:', error);
            message.error('Error saving offer');
        }
        finally {
            setIsSaving(false);
        }
    };

    // Delete offer
    const handleDeleteOffer = (offerId) => {
        Modal.confirm({
            title: 'Delete Offer',
            content: 'Are you sure you want to delete this offer?',
            okText: 'Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: async () => {
                try {
                    setDeletingId(offerId);
                    const response = await fetch(`${BASE_URL}/api/offers/${offerId}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        }
                    });

                    const data = await response.json();
                    if (data.success) {
                        message.success('Offer deleted');
                        // Adjust page if last item on page removed
                        const remaining = Math.max(0, total - 1);
                        const lastPage = Math.max(1, Math.ceil(remaining / pageSize));
                        if (page > lastPage) setPage(lastPage);
                        fetchOffers(page, pageSize);
                    } else {
                        message.error('Failed to delete offer');
                    }
                } catch (error) {
                    console.error('Error deleting offer:', error);
                    message.error('Error deleting offer');
                } finally {
                    setDeletingId(null);
                }
            }
        });
    };

    // Edit offer
    const handleEditOffer = (offer) => {
        setEditingOffer(offer);
        form.setFieldsValue({
            name: offer.name,
            description: offer.description
        });
        setIsModalVisible(true);
    };

    // Close modal
    const handleCloseModal = () => {
        setIsModalVisible(false);
        form.resetFields();
        setEditingOffer(null);
    };

    // Navigate to detail page
    const handleViewDetails = (offer) => {
        navigate(`/dashboard/myoffers/${offer._id}`);
    };

    const getStatusColor = (status) => {
        const colors = {
            active: 'green',
            inactive: 'default',
            completed: 'blue'
        };
        return colors[status] || 'default';
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="mb-6 flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">My Offers</h1>
                <Button 
                    type="primary" 
                    icon={<PlusOutlined />}
                    onClick={() => setIsModalVisible(true)}
                    className="bg-[#0F792C]"
                >
                    Add New Offer
                </Button>
            </div>

            <Spin spinning={loading}>
                {offers.length === 0 ? (
                    <Empty 
                        description="No offers yet" 
                        style={{ marginTop: '50px' }}
                    >
                        <Button 
                            type="primary"
                            onClick={() => setIsModalVisible(true)}
                            className="bg-[#0F792C]"
                        >
                            Create First Offer
                        </Button>
                    </Empty>
                ) : (
                    <Row gutter={[16, 16]}>
                        {offers.map((offer) => (
                            <Col key={offer._id} xs={24} sm={24} md={12} lg={8}>
                                <Card 
                                    hoverable
                                    className="shadow-lg h-full"
                                    style={{ height: 320, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                                >
                                    <div className="mb-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-lg font-bold text-gray-800 truncate flex-1">{offer.name}</h3>
                                            <Tag color={getStatusColor(offer.status)}>
                                                {offer.status}
                                            </Tag>
                                        </div>
                                        <p className="text-gray-600 text-sm mb-3" style={{
                                            display: '-webkit-box',
                                            WebkitLineClamp: 3,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden'
                                        }}>
                                            {offer.description}
                                        </p>
                                    </div>

                                    <div className="mb-4 p-3 bg-gray-50 rounded">
                                        <div className="text-2xl font-bold text-[#0F792C]">
                                            {offer.activities?.length || 0}
                                        </div>
                                        <div className="text-xs text-gray-600">Steps</div>
                                        {offer.activities && offer.activities.length > 0 && (
                                            <div className="text-xs text-gray-500 mt-2">
                                                Last: {new Date(offer.activities[offer.activities.length - 1].date).toLocaleString()}
                                            </div>
                                        )}
                                    </div>

                                    <div style={{ marginTop: 8 }}>
                                        <Button 
                                            block
                                            type="primary"
                                            onClick={() => handleViewDetails(offer)}
                                            className="bg-[#0F792C]"
                                        >
                                            View Details
                                        </Button>
                                        <div className="flex gap-2 mt-2">
                                            <Button 
                                                style={{ flex: 1 }}
                                                icon={<EditOutlined />}
                                                onClick={() => handleEditOffer(offer)}
                                                loading={isSaving && editingOffer?._id === offer._id}
                                            >
                                                Edit
                                            </Button>
                                            <Button 
                                                style={{ flex: 1 }}
                                                icon={<DeleteOutlined />}
                                                danger
                                                onClick={() => handleDeleteOffer(offer._id)}
                                                loading={deletingId === offer._id}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}
            </Spin>

            <div className="mt-6 flex justify-center">
                <Pagination
                    current={page}
                    pageSize={pageSize}
                    total={total}
                    onChange={(p, ps) => { setPage(p); setPageSize(ps); }}
                    showSizeChanger
                    pageSizeOptions={[6,12,24,48]}
                />
            </div>

            {/* Create/Edit Modal */}
            <OfferModal
                visible={isModalVisible}
                onCancel={handleCloseModal}
                onSubmit={handleSaveOffer}
                form={form}
                isEditMode={!!editingOffer}
                includeStatus={false}
            />
        </div>
    )
}

export default MyOffersPage
