import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Popconfirm, message } from 'antd';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import axios from 'axios';
import { BASE_URL } from '../../config/URL';
import CategoryModal from '../../component/dashboard/CategoryModal';

const CategoryPage = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);

    // Fetch all categories
    const fetchCategories = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${BASE_URL}/api/category`);
            setCategories(res.data);
        } catch (err) {
            message.error("Failed to load categories");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // Delete Category
    const handleDelete = async (id) => {
        try {
            await axios.delete(`${BASE_URL}/api/category/${id}`);
            message.success("Category deleted");
            fetchCategories();
        } catch (err) {
            message.error("Delete failed");
        }
    };

    // Open Edit Modal
    const handleEdit = (record) => {
        setEditData(record);
        setModalOpen(true);
    };

    // Open Add Modal
    const handleAdd = () => {
        setEditData(null);
        setModalOpen(true);
    };

    // On Modal Close
    const handleModalClose = () => {
        setModalOpen(false);
        setEditData(null);
    };

    // On Modal Success
    const handleModalSuccess = () => {
        setModalOpen(false);
        setEditData(null);
        fetchCategories();
    };

    const columns = [
        {
            title: '#',
            width: 60,
            render: (_, __, index) => index + 1,
        },
        {
            title: 'Category Name',
            dataIndex: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Created',
            dataIndex: 'createdAt',
            render: (date) => new Date(date).toLocaleDateString(),
        },
        {
            title: 'Actions',
            width: 150,
            render: (_, record) => (
                <Space>
                    <Button
                        type="primary"
                        icon={<FiEdit2 />}
                        size="small"
                        onClick={() => handleEdit(record)}
                    >
                        Edit
                    </Button>

                    <Popconfirm
                        title="Delete Category?"
                        onConfirm={() => handleDelete(record._id)}
                    >
                        <Button danger size="small" icon={<FiTrash2 />}>
                            Delete
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Category Management</h1>
                    <p className="text-gray-600 mt-1">Manage your categories</p>
                </div>

                <Button type="primary" icon={<FiPlus />} size="large" onClick={handleAdd}>
                    Add Category
                </Button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-md shadow p-6">
                <Table
                    columns={columns}
                    dataSource={categories}
                    loading={loading}
                    rowKey="_id"
                    pagination={{
                        pageSize: 10,
                        showTotal: (total) => `Total ${total} categories`,
                    }}
                />
            </div>

            {/* Modal */}
            <CategoryModal
                open={modalOpen}
                onCancel={handleModalClose}
                onSuccess={handleModalSuccess}
                editData={editData}
            />
        </div>
    );
};

export default CategoryPage;
