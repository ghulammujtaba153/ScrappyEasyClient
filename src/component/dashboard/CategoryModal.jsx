import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, message } from "antd";
import axios from "axios";
import { BASE_URL } from "../../config/URL";

const CategoryModal = ({ open, onCancel, onSuccess, editData }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (editData) {
            form.setFieldsValue({
                name: editData.name,
                description: editData.description,
            });
        } else {
            form.resetFields();
        }
    }, [editData, form, open]);

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            if (editData) {
                // Edit existing category
                await axios.put(`${BASE_URL}/api/category/${editData._id}`, values);
                message.success("Category updated successfully");
            } else {
                // Add new category
                await axios.post(`${BASE_URL}/api/category`, values);
                message.success("Category created successfully");
            }
            form.resetFields();
            onSuccess();
        } catch (error) {
            console.error(error);
            message.error(error.response?.data?.message || "Operation failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title={editData ? "Edit Category" : "Add Category"}
            open={open}
            onCancel={() => {
                form.resetFields();
                onCancel();
            }}
            footer={null}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                autoComplete="off"
            >
                <Form.Item
                    label="Category Name"
                    name="name"
                    rules={[
                        { required: true, message: "Please enter category name" },
                        { min: 2, message: "Name must be at least 2 characters" },
                    ]}
                >
                    <Input placeholder="Enter category name" />
                </Form.Item>



                <Form.Item className="mb-0">
                    <div className="flex justify-end gap-2">
                        <Button onClick={() => {
                            form.resetFields();
                            onCancel();
                        }}>
                            Cancel
                        </Button>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            {editData ? "Update" : "Create"}
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CategoryModal;