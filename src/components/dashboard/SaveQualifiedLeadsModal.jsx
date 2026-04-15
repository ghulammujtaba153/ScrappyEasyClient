import React, { useState } from 'react';
import { Modal, Input, Button, message, Form, Tag, Divider } from 'antd';
import axios from 'axios';
import { MdStar, MdFilterList } from 'react-icons/md';
import { BASE_URL } from '../../config/URL';
import { useAuth } from '../../context/authContext';

const SaveQualifiedLeadsModal = ({ 
    visible, 
    onCancel, 
    filteredData, 
    filters, 
    userId, 
    operationId, 
    searchString,
    cityData,
    whatsappStatus,
    formatPhoneNumber
}) => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const { token } = useAuth();

    const getWhatsappStatusLabel = (phone) => {
        const status = whatsappStatus[formatPhoneNumber(phone)];
        if (status === 'verified') return 'Verified';
        if (status === 'not-verified') return 'Not Verified';
        return 'Not Checked';
    };

    const handleSave = async (values) => {
        if (!filteredData || filteredData.length === 0) {
            message.error('No data to save');
            return;
        }

        setLoading(true);
        try {
            // Extract leadIds from the filtered data (each item should have a _id field from LeadData)
            const leadIds = filteredData.map(item => item._id).filter(Boolean);

            if (leadIds.length === 0) {
                message.error('No valid leads to save');
                setLoading(false);
                return;
            }

            const payload = {
                name: values.name,
                userId: userId,
                operationId: operationId,
                searchString: searchString,
                filters: {
                    locationSearch: filters.locationSearch || '',
                    countries: filters.countries || [],
                    states: filters.states || [],
                    cities: filters.cities || [],
                    whatsappStatus: filters.whatsappStatus || '',
                    ratingMin: filters.ratingMin,
                    ratingMax: filters.ratingMax,
                    reviewsMin: filters.reviewsMin,
                    reviewsMax: filters.reviewsMax,
                    hasWebsite: filters.hasWebsite || '',
                    hasPhone: filters.hasPhone || '',
                    favorite: filters.favorite || '',
                },
                leadIds: leadIds,
            };

            const res = await axios.post(`${BASE_URL}/api/qualified-leads/create`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data) {
                message.success(`Successfully saved ${leadIds.length} qualified leads as "${values.name}"`);
                form.resetFields();
                onCancel();
            }
        } catch (error) {
            console.error('Save failed:', error);
            message.error(error.response?.data?.message || 'Failed to save qualified leads');
        } finally {
            setLoading(false);
        }
    };

    // Get active filters for display
    const getActiveFilters = () => {
        const active = [];
        if (filters.locationSearch) active.push(`Location: "${filters.locationSearch}"`);
        if (filters.whatsappStatus) active.push(`WhatsApp: ${filters.whatsappStatus}`);
        if (filters.ratingMin !== null) active.push(`Rating ≥ ${filters.ratingMin}`);
        if (filters.ratingMax !== null) active.push(`Rating ≤ ${filters.ratingMax}`);
        if (filters.reviewsMin !== null) active.push(`Reviews ≥ ${filters.reviewsMin}`);
        if (filters.reviewsMax !== null) active.push(`Reviews ≤ ${filters.reviewsMax}`);
        if (filters.hasWebsite) active.push(`Website: ${filters.hasWebsite}`);
        if (filters.hasPhone) active.push(`Phone: ${filters.hasPhone}`);
        if (filters.favorite) active.push(`Favorites: ${filters.favorite}`);
        return active;
    };

    const activeFilters = getActiveFilters();

    return (
        <Modal
            title={
                <div className="flex items-center gap-2">
                    <MdStar className="text-yellow-500 text-xl" />
                    <span>Save to Qualified Leads</span>
                </div>
            }
            open={visible}
            onCancel={onCancel}
            footer={null}
            destroyOnClose
            width={500}
        >
            <div className="mb-4">
                <div className="text-gray-600 mb-3">
                    You are about to save <strong className="text-green-600">{filteredData?.length || 0}</strong> records 
                    as qualified leads.
                </div>
                
                {searchString && (
                    <div className="mb-3 p-2 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-500">Search Query:</span>
                        <div className="font-medium text-gray-800">{searchString}</div>
                    </div>
                )}

                {activeFilters.length > 0 && (
                    <>
                        <Divider className="my-3" />
                        <div className="mb-3">
                            <div className="flex items-center gap-2 mb-2">
                                <MdFilterList className="text-blue-500" />
                                <span className="text-sm font-medium text-gray-700">Applied Filters:</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {activeFilters.map((filter, index) => (
                                    <Tag key={index} color="blue" className="text-xs">
                                        {filter}
                                    </Tag>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>

            <Form
                form={form}
                layout="vertical"
                onFinish={handleSave}
            >
                <Form.Item
                    name="name"
                    label="List Name"
                    rules={[{ required: true, message: 'Please enter a name for this qualified leads list' }]}
                >
                    <Input 
                        placeholder="e.g. High Rating Restaurants - New York" 
                        className="rounded-lg"
                    />
                </Form.Item>

                <Form.Item>
                    <div className="flex justify-end gap-2">
                        <Button onClick={onCancel}>
                            Cancel
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            icon={<MdStar />}
                            className="bg-yellow-500 hover:bg-yellow-600 border-yellow-500"
                        >
                            Save Qualified Leads
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default SaveQualifiedLeadsModal;
