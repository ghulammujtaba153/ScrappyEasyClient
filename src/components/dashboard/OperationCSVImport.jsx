import React, { useState, useMemo, useCallback } from 'react';
import {
  Modal,
  Upload,
  Button,
  message,
  Input,
  Space,
  Typography,
  Table,
  Progress,
  Alert,
  Popconfirm,
  Tag,
} from 'antd';
import { MdCloudUpload, MdInsertDriveFile, MdClose, MdFileDownload, MdArrowBack, MdDelete } from 'react-icons/md';
import axios from 'axios';
import Papa from 'papaparse';
import { BASE_URL } from '../../config/URL';
import { downloadCSVTemplate, CSV_TEMPLATE_HEADERS } from '../../data/csvTemplate';

const { Dragger } = Upload;
const { Text, Title } = Typography;

const BATCH_SIZE = 50;
const FIELDS = CSV_TEMPLATE_HEADERS;

const URL_PATTERN = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w\-._~:/?#[\]@!$&'()*+,;=%]*)?$/i;

function normalizeHeaderKey(key) {
  if (!key) return '';
  const k = key.trim().toLowerCase().replace(/\s+/g, '');
  const map = {
    title: 'title',
    name: 'title',
    businessname: 'title',
    business: 'title',
    rating: 'rating',
    reviews: 'reviews',
    reviewcount: 'reviews',
    phone: 'phone',
    phonenumber: 'phone',
    address: 'address',
    city: 'city',
    location: 'city',
    website: 'website',
    url: 'website',
    googlemapslink: 'googleMapsLink',
    googlemaps: 'googleMapsLink',
    mapslink: 'googleMapsLink',
  };
  return map[k] || k;
}

function mapCsvRow(raw) {
  const row = {};
  Object.entries(raw).forEach(([key, value]) => {
    const field = normalizeHeaderKey(key);
    if (FIELDS.includes(field)) {
      row[field] = value != null ? String(value).trim() : '';
    }
  });
  FIELDS.forEach((f) => {
    if (row[f] === undefined) row[f] = '';
  });
  return row;
}

function validateLeadRow(row, duplicateTitles) {
  const errors = {};

  if (!row.title || !row.title.trim()) {
    errors.title = 'Business name is required';
  } else if (duplicateTitles.has(row.title.trim().toLowerCase())) {
    errors.title = 'Duplicate name in this import';
  }

  if (row.rating && row.rating.trim()) {
    const r = parseFloat(row.rating);
    if (Number.isNaN(r) || r < 0 || r > 5) {
      errors.rating = 'Rating must be 0–5';
    }
  }

  if (row.reviews && row.reviews.trim()) {
    const n = parseInt(row.reviews, 10);
    if (Number.isNaN(n) || n < 0) {
      errors.reviews = 'Reviews must be a positive number';
    }
  }

  if (row.website && row.website.trim()) {
    const w = row.website.trim();
    if (!URL_PATTERN.test(w)) {
      errors.website = 'Invalid website URL';
    }
  }

  if (row.googleMapsLink && row.googleMapsLink.trim()) {
    const g = row.googleMapsLink.trim();
    if (!URL_PATTERN.test(g) && !g.includes('google.com') && !g.includes('goo.gl')) {
      errors.googleMapsLink = 'Invalid maps link';
    }
  }

  return errors;
}

function buildDuplicateSet(rows) {
  const seen = new Map();
  const dupes = new Set();
  rows.forEach((row) => {
    const key = (row.title || '').trim().toLowerCase();
    if (!key) return;
    if (seen.has(key)) dupes.add(key);
    else seen.set(key, true);
  });
  return dupes;
}

const OperationCSVImport = ({ visible, onCancel, onSuccess, userId, defaultSearchString, operationId }) => {
  const [step, setStep] = useState('upload');
  const [fileList, setFileList] = useState([]);
  const [searchString, setSearchString] = useState(defaultSearchString || '');
  const [rows, setRows] = useState([]);
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState({ current: 0, total: 0, imported: 0, skipped: 0 });
  const [resolvedOperationId, setResolvedOperationId] = useState(operationId || null);

  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;

  const duplicateKeys = useMemo(() => buildDuplicateSet(rows), [rows]);

  const rowValidation = useMemo(() => {
    return rows.map((row) => validateLeadRow(row, duplicateKeys));
  }, [rows, duplicateKeys]);

  const invalidCount = useMemo(
    () => rowValidation.filter((e) => Object.keys(e).length > 0).length,
    [rowValidation]
  );

  const validRows = useMemo(
    () => rows.filter((_, i) => Object.keys(rowValidation[i]).length === 0),
    [rows, rowValidation]
  );

  const resetModal = () => {
    setStep('upload');
    setFileList([]);
    setRows([]);
    setImportProgress({ current: 0, total: 0, imported: 0, skipped: 0 });
    setResolvedOperationId(operationId || null);
    setSearchString(defaultSearchString || '');
  };

  const handleClose = () => {
    if (importing) return;
    resetModal();
    onCancel();
  };

  const parseFile = (file) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h) => normalizeHeaderKey(h) || h,
      complete: (results) => {
        const parsed = (results.data || [])
          .map(mapCsvRow)
          .filter((row) => Object.values(row).some((v) => v && v.trim()));

        if (parsed.length === 0) {
          message.error('No data rows found in CSV. Check headers match the template.');
          return;
        }

        setRows(parsed.map((row, index) => ({ ...row, _key: `row-${index}-${Date.now()}` })));
        setStep('review');
        message.success(`Loaded ${parsed.length} row(s). Review and edit before importing.`);
      },
      error: () => message.error('Failed to parse CSV file'),
    });
  };

  const updateRow = useCallback((key, field, value) => {
    setRows((prev) =>
      prev.map((row) => (row._key === key ? { ...row, [field]: value } : row))
    );
  }, []);

  const removeRow = useCallback((key) => {
    setRows((prev) => prev.filter((row) => row._key !== key));
  }, []);

  const handleBatchImport = async () => {
    if (validRows.length === 0) {
      message.error('Fix validation errors or add at least one valid row');
      return;
    }
    if (invalidCount > 0) {
      message.warning(`Fix ${invalidCount} invalid row(s) before importing (red borders)`);
      return;
    }
    if (!operationId && !searchString.trim()) {
      message.error('Enter an operation name');
      return;
    }

    setImporting(true);
    const batches = [];
    for (let i = 0; i < validRows.length; i += BATCH_SIZE) {
      batches.push(validRows.slice(i, i + BATCH_SIZE));
    }

    let totalImported = 0;
    let totalSkipped = 0;
    let opId = resolvedOperationId;

    setImportProgress({ current: 0, total: batches.length, imported: 0, skipped: 0 });

    try {
      for (let i = 0; i < batches.length; i++) {
        const batch = batches[i].map(({ _key, ...lead }) => lead);

        const res = await axios.post(
          `${BASE_URL}/api/data/import-leads-batch`,
          {
            userId,
            operationId: opId || undefined,
            searchString: opId ? undefined : searchString.trim(),
            leads: batch,
          },
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : undefined,
              'Content-Type': 'application/json',
            },
          }
        );

        if (res.data.success) {
          totalImported += res.data.imported || 0;
          totalSkipped += res.data.skipped || 0;
          if (res.data.operationId && !opId) {
            opId = res.data.operationId;
            setResolvedOperationId(opId);
          }
        }

        setImportProgress({
          current: i + 1,
          total: batches.length,
          imported: totalImported,
          skipped: totalSkipped,
        });
      }

      message.success(
        `Import complete: ${totalImported} lead(s) added${totalSkipped ? `, ${totalSkipped} skipped (duplicates)` : ''}`
      );
      if (onSuccess) onSuccess({ imported: totalImported, data: { _id: opId } });
      handleClose();
    } catch (error) {
      console.error('Batch import error:', error);
      message.error(error.response?.data?.message || 'Failed to import leads');
    } finally {
      setImporting(false);
    }
  };

  const uploadProps = {
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
      parseFile(file);
      return false;
    },
    fileList,
    maxCount: 1,
    disabled: importing,
  };

  const cellInput = (field, record, index) => {
    const errors = rowValidation[index] || {};
    const hasError = !!errors[field];

    return (
      <Input
        size="small"
        value={record[field] || ''}
        onChange={(e) => updateRow(record._key, field, e.target.value)}
        status={hasError ? 'error' : undefined}
        className={hasError ? '!border-red-500 !shadow-none' : ''}
        placeholder={field === 'title' ? 'Required' : ''}
      />
    );
  };

  const columns = [
    {
      title: 'Business Name',
      dataIndex: 'title',
      key: 'title',
      width: 180,
      fixed: 'left',
      render: (_, record, index) => cellInput('title', record, index),
    },
    { title: 'Rating', dataIndex: 'rating', width: 90, render: (_, r, i) => cellInput('rating', r, i) },
    { title: 'Reviews', dataIndex: 'reviews', width: 90, render: (_, r, i) => cellInput('reviews', r, i) },
    { title: 'Phone', dataIndex: 'phone', width: 130, render: (_, r, i) => cellInput('phone', r, i) },
    { title: 'Address', dataIndex: 'address', width: 160, render: (_, r, i) => cellInput('address', r, i) },
    { title: 'City', dataIndex: 'city', width: 110, render: (_, r, i) => cellInput('city', r, i) },
    { title: 'Website', dataIndex: 'website', width: 150, render: (_, r, i) => cellInput('website', r, i) },
    {
      title: 'Maps Link',
      dataIndex: 'googleMapsLink',
      width: 150,
      render: (_, r, i) => cellInput('googleMapsLink', r, i),
    },
    {
      title: '',
      key: 'actions',
      width: 56,
      fixed: 'right',
      render: (_, record) => (
        <Popconfirm title="Remove this row?" onConfirm={() => removeRow(record._key)}>
          <Button type="text" danger icon={<MdDelete />} size="small" />
        </Popconfirm>
      ),
    },
  ];

  const modalWidth = step === 'review' ? 1100 : 520;

  return (
    <Modal
      title={null}
      open={visible}
      onCancel={handleClose}
      footer={null}
      centered
      width={modalWidth}
      styles={{ body: { padding: 0, maxHeight: '85vh' } }}
      closeIcon={<MdClose className="text-xl text-gray-400 hover:text-gray-600" />}
      maskClosable={!importing}
      destroyOnClose
    >
      <div className="p-6 md:p-8 flex flex-col max-h-[85vh]">
        {step === 'upload' && (
          <>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-100">
                <MdCloudUpload size={32} />
              </div>
              <Title level={4} className="!mb-1">
                {operationId ? 'Append Leads to Operation' : 'Import CSV Data'}
              </Title>
              <Text type="secondary">
                Upload a CSV, review and edit rows, then import in batches.
              </Text>
            </div>

            <Space direction="vertical" size="large" className="w-full">
              {!operationId && (
                <div>
                  <Text strong className="text-gray-700">Operation Name</Text>
                  <Input
                    placeholder="e.g. Real Estate Leads NYC"
                    value={searchString}
                    onChange={(e) => setSearchString(e.target.value)}
                    className="mt-2 h-11 rounded-xl"
                  />
                </div>
              )}

              <div>
                <div className="flex justify-between items-center mb-2">
                  <Text strong>Select CSV File</Text>
                  <Button type="link" size="small" icon={<MdFileDownload />} onClick={downloadCSVTemplate}>
                    Download Template
                  </Button>
                </div>
                <div className="border-2 border-dashed border-gray-200 rounded-2xl overflow-hidden hover:border-blue-400 transition-colors">
                  <Dragger {...uploadProps} className="!border-none !bg-gray-50/50 py-8">
                    <MdInsertDriveFile size={40} className="text-blue-400 mx-auto mb-2" />
                    <p className="font-semibold text-gray-700">Click or drag CSV here</p>
                    <p className="text-xs text-gray-400">You can edit all rows before importing</p>
                  </Dragger>
                </div>
              </div>

              <Button onClick={handleClose} className="w-full h-11 rounded-xl">
                Cancel
              </Button>
            </Space>
          </>
        )}

        {step === 'review' && (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4 shrink-0">
              <div className="flex items-center gap-3">
                <Button
                  type="text"
                  icon={<MdArrowBack />}
                  onClick={() => !importing && setStep('upload')}
                  disabled={importing}
                >
                  Back
                </Button>
                <div>
                  <Title level={5} className="!mb-0">
                    Review & edit ({rows.length} rows)
                  </Title>
                  <Text type="secondary" className="text-xs">
                    Invalid fields show a red border. Fix all errors before importing.
                  </Text>
                </div>
              </div>
              <Space wrap>
                {invalidCount > 0 && (
                  <Tag color="error">{invalidCount} row(s) need fixes</Tag>
                )}
                <Text type="secondary">{validRows.length} ready to import</Text>
              </Space>
            </div>

            {invalidCount > 0 && (
              <Alert
                type="error"
                showIcon
                className="mb-3 shrink-0"
                message={`${invalidCount} row(s) have validation errors`}
                description="Required: business name. Check ratings (0–5), reviews (numbers), and URLs. Duplicate names in this file are also flagged."
              />
            )}

            <div className="flex-1 min-h-0 overflow-hidden mb-4">
              <Table
                size="small"
                columns={columns}
                dataSource={rows}
                rowKey="_key"
                pagination={{ pageSize: 10, showSizeChanger: true, pageSizeOptions: ['10', '20', '50'] }}
                scroll={{ x: 1000, y: 360 }}
                rowClassName={(_, index) =>
                  Object.keys(rowValidation[index] || {}).length > 0 ? 'csv-import-row-invalid' : ''
                }
              />
            </div>

            {importing && (
              <div className="mb-4 shrink-0">
                <Text className="text-sm text-gray-600 block mb-2">
                  Importing batch {importProgress.current} of {importProgress.total}…
                </Text>
                <Progress
                  percent={
                    importProgress.total
                      ? Math.round((importProgress.current / importProgress.total) * 100)
                      : 0
                  }
                  status="active"
                />
                <Text type="secondary" className="text-xs">
                  {importProgress.imported} imported, {importProgress.skipped} skipped so far
                </Text>
              </div>
            )}

            <div className="flex gap-3 shrink-0">
              <Button onClick={handleClose} disabled={importing} className="flex-1 h-11 rounded-xl">
                Cancel
              </Button>
              <Button
                type="primary"
                onClick={handleBatchImport}
                loading={importing}
                disabled={validRows.length === 0 || invalidCount > 0}
                className="flex-[2] h-11 rounded-xl font-bold"
              >
                Import {validRows.length} lead(s) in batches
              </Button>
            </div>
          </>
        )}
      </div>

      <style>{`
        .csv-import-row-invalid td {
          background-color: #fff1f0 !important;
        }
        .csv-import-row-invalid .ant-input-status-error,
        .csv-import-row-invalid .ant-input.border-red-500 {
          border-color: #ff4d4f !important;
          box-shadow: 0 0 0 1px rgba(255, 77, 79, 0.2);
        }
      `}</style>
    </Modal>
  );
};

export default OperationCSVImport;
