import React, { useState, useEffect } from 'react';
import { Modal, Input, message } from 'antd';
import axios from 'axios';
import { BASE_URL } from '../../config/URL';

const EditLeadModal = ({ visible, onCancel, onSuccess, lead, token }) => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    phone: '',
    address: '',
    city: '',
    website: ''
  });

  useEffect(() => {
    if (lead) {
      setForm({
        title: lead.title || '',
        phone: lead.phone || '',
        address: lead.address || '',
        city: lead.city || '',
        website: lead.website || ''
      });
    }
  }, [lead, visible]);

  const handleSubmit = async () => {
    if (!lead) return;
    
    setLoading(true);
    try {
      const leadId = lead.leadId || lead._id;
      const res = await axios.put(`${BASE_URL}/api/data/lead/${leadId}`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        message.success('Lead updated successfully');
        onSuccess();
      }
    } catch (error) {
      console.error('Update error:', error);
      message.error(error.response?.data?.message || 'Failed to update lead');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Edit Lead Details"
      open={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      confirmLoading={loading}
      centered
      width={600}
    >
      <div className="space-y-4 py-4">
        <div className="space-y-1">
          <span className="text-sm font-semibold text-gray-700">Business Name</span>
          <Input 
            value={form.title} 
            onChange={(e) => setForm({...form, title: e.target.value})} 
          />
        </div>
        <div className="space-y-1">
          <span className="text-sm font-semibold text-gray-700">Phone</span>
          <Input 
            value={form.phone} 
            onChange={(e) => setForm({...form, phone: e.target.value})} 
          />
        </div>
        <div className="space-y-1">
          <span className="text-sm font-semibold text-gray-700">Address</span>
          <Input 
            value={form.address} 
            onChange={(e) => setForm({...form, address: e.target.value})} 
          />
        </div>
        <div className="space-y-1">
          <span className="text-sm font-semibold text-gray-700">City</span>
          <Input 
            value={form.city} 
            onChange={(e) => setForm({...form, city: e.target.value})} 
          />
        </div>
        <div className="space-y-1">
          <span className="text-sm font-semibold text-gray-700">Website</span>
          <Input 
            value={form.website} 
            onChange={(e) => setForm({...form, website: e.target.value})} 
          />
        </div>
      </div>
    </Modal>
  );
};

export default EditLeadModal;
