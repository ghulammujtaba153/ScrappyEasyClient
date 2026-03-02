import React, { useState } from 'react';
import { Modal, Upload, Button, message, Input, Space, Typography } from 'antd';
import { MdCloudUpload, MdInsertDriveFile, MdClose, MdFileDownload } from 'react-icons/md';
import axios from 'axios';
import { BASE_URL } from '../../config/URL';
import { downloadCSVTemplate } from '../../data/csvTemplate';

const { Dragger } = Upload;
const { Text, Title } = Typography;

const OperationCSVImport = ({ visible, onCancel, onSuccess, userId, defaultSearchString, operationId }) => {
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [searchString, setSearchString] = useState(defaultSearchString || '');

  const handleUpload = async () => {
    if (fileList.length === 0) {
      message.error('Please select a CSV file first');
      return;
    }

    const formData = new FormData();
    formData.append('file', fileList[0]);
    formData.append('userId', userId);
    
    if (operationId) {
      formData.append('operationId', operationId);
    } else {
      formData.append('searchString', searchString || 'CSV Import ' + new Date().toLocaleDateString());
    }

    setUploading(true);
    try {
      const response = await axios.post(`${BASE_URL}/api/data/import-csv`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201 || response.status === 200) {
        message.success(operationId ? 'Leads appended successfully' : 'CSV data imported successfully');
        setFileList([]);
        if (onSuccess) onSuccess(response.data.data);
        onCancel();
      }
    } catch (error) {
      console.error('Import error:', error);
      message.error(error.response?.data?.message || 'Failed to import CSV data');
    } finally {
      setUploading(false);
    }
  };

  const props = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      const isCSV = file.type === 'text/csv' || file.name.endsWith('.csv');
      if (!isCSV) {
        message.error(`${file.name} is not a CSV file`);
        return Upload.LIST_IGNORE;
      }
      setFileList([file]);
      return false;
    },
    fileList,
    maxCount: 1,
  };

  return (
    <Modal
      title={null}
      open={visible}
      onCancel={onCancel}
      footer={null}
      centered
      width={500}
      styles={{ body: { padding: 0 } }}
      closeIcon={<MdClose className="text-xl text-gray-400 hover:text-gray-600 transition-colors" />}
    >
      <div className="p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-100 shadow-sm">
            <MdCloudUpload size={32} />
          </div>
          <Title level={4} className="!mb-1">{operationId ? 'Append Leads to Operation' : 'Import CSV Data'}</Title>
          <Text type="secondary">
            {operationId 
              ? `Adding new records to your existing operation.` 
              : 'Follow the CSV format to import your leads seamlessly.'}
          </Text>
        </div>

        <Space direction="vertical" size="large" className="w-full">
          {!operationId && (
            <div className="space-y-2">
              <Text strong className="text-gray-700">Operation Name</Text>
              <Input 
                placeholder="e.g. Real Estate Leads NYC" 
                value={searchString}
                onChange={(e) => setSearchString(e.target.value)}
                className="h-11 rounded-xl border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary/20"
              />
            </div>
          )}

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Text strong className="text-gray-700">Select CSV File</Text>
              <Button 
                type="link" 
                size="small" 
                icon={<MdFileDownload className="text-lg" />}
                onClick={downloadCSVTemplate}
                className="p-0 flex items-center gap-1 text-primary hover:text-primary/80 font-semibold"
              >
                Download Template
              </Button>
            </div>
            {/* Wrapper to control border strictly and avoid antd double borders */}
            <div className="bg-gray-50/50 border-2 border-dashed border-gray-200 hover:border-blue-400 hover:bg-white transition-all rounded-2xl overflow-hidden group">
              <Dragger {...props} className="!border-none !bg-transparent py-8">
                <p className="ant-upload-drag-icon flex justify-center text-primary mb-2">
                  <MdInsertDriveFile size={40} className="text-blue-400 transition-transform group-hover:scale-110" />
                </p>
                <p className="ant-upload-text font-semibold text-gray-700">Click or drag file to this area to upload</p>
                <p className="ant-upload-hint text-xs text-gray-400">
                  Duplicates from the existing operation will be skipped automatically.
                </p>
              </Dragger>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <Button 
              onClick={onCancel} 
              className="flex-1 h-12 rounded-xl font-semibold border-gray-200 hover:text-gray-900"
            >
              Cancel
            </Button>
            <Button
              type="primary"
              onClick={handleUpload}
              disabled={fileList.length === 0}
              loading={uploading}
              className="flex-3 h-12 rounded-xl bg-primary font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform"
            >
              {operationId ? 'Append Leads' : 'Start Import'}
            </Button>
          </div>
        </Space>
      </div>
    </Modal>
  );
};

export default OperationCSVImport;
