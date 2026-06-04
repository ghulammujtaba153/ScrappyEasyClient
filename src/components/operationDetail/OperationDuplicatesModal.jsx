import React from 'react';
import { Modal, Button, Alert, Table, Tag } from 'antd';

export default function OperationDuplicatesModal({
  open,
  onClose,
  duplicatePreview,
  duplicateTableRows,
  removingDuplicates,
  onRemove,
}) {
  return (
    <Modal
      title="Duplicate Leads in This Operation"
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose} disabled={removingDuplicates}>
          Cancel
        </Button>,
        <Button
          key="remove"
          type="primary"
          danger
          loading={removingDuplicates}
          disabled={!duplicatePreview?.totalDuplicates}
          onClick={onRemove}
        >
          Remove {duplicatePreview?.totalDuplicates || 0} Duplicate(s)
        </Button>,
      ]}
      width={900}
      centered
    >
      {!duplicatePreview?.totalDuplicates ? (
        <div className="py-8 text-center text-gray-500">No duplicate business names found in this operation.</div>
      ) : (
        <div className="space-y-4">
          <Alert
            type="warning"
            showIcon
            message={`${duplicatePreview.totalGroups} duplicate name group(s) found`}
            description={`${duplicatePreview.totalDuplicates} lead(s) will be removed from this operation only. The oldest entry for each name is kept.`}
          />
          <Table
            size="small"
            pagination={{ pageSize: 10 }}
            dataSource={duplicateTableRows}
            columns={[
              { title: 'Business Name', dataIndex: 'title', key: 'title', ellipsis: true },
              { title: 'Phone', dataIndex: 'phone', key: 'phone', width: 140 },
              { title: 'City', dataIndex: 'city', key: 'city', width: 120, ellipsis: true },
              { title: 'Added', dataIndex: 'createdAt', key: 'createdAt', width: 170 },
              {
                title: 'Action',
                dataIndex: 'status',
                key: 'status',
                width: 110,
                render: (status) =>
                  status === 'keep' ? <Tag color="green">Keep</Tag> : <Tag color="red">Remove</Tag>,
              },
            ]}
          />
        </div>
      )}
    </Modal>
  );
}
