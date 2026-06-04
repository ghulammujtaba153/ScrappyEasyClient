import React from 'react';
import { Table, Button, Space } from 'antd';
import { isMongoLeadId } from './operationDetailUtils';

export default function OperationLeadsTable({
  columns,
  dataSource,
  loading,
  tableScrollY,
  currentPage,
  pageSize,
  onPageChange,
  rowSelection,
  selectedCount = 0,
  totalSelectable = 0,
  onSelectAllFiltered,
  onClearSelection,
  onBulkDelete,
  bulkDeleting = false,
}) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {selectedCount > 0 && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
          <Space wrap>
            <span className="text-sm font-bold text-gray-800">
              {selectedCount} row{selectedCount !== 1 ? 's' : ''} selected
            </span>
            {selectedCount < totalSelectable && onSelectAllFiltered && (
              <Button type="link" size="small" onClick={onSelectAllFiltered} className="font-bold px-0">
                Select all {totalSelectable} in this list
              </Button>
            )}
            {onClearSelection && (
              <Button type="link" size="small" onClick={onClearSelection} className="text-gray-500 px-0">
                Clear selection
              </Button>
            )}
          </Space>
          <Button
            danger
            loading={bulkDeleting}
            onClick={onBulkDelete}
            className="font-bold rounded-lg"
          >
            Delete selected ({selectedCount})
          </Button>
        </div>
      )}

      <Table
        rowKey={(record) => (isMongoLeadId(record.leadId) ? record.leadId : record.key)}
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        rowSelection={rowSelection}
        scroll={{
          x: 1200,
          ...(tableScrollY ? { y: tableScrollY } : {}),
        }}
        pagination={{
          current: currentPage,
          pageSize,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} records`,
          onChange: onPageChange,
        }}
      />
    </div>
  );
}
