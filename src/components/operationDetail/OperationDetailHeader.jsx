import React from 'react';
import { Button } from 'antd';
import { MdArrowBack, MdRefresh } from 'react-icons/md';
import OperationDetailStats from './OperationDetailStats';

export default function OperationDetailHeader({
  record,
  verificationStats,
  loading,
  onBack,
  onRefresh,
  children,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-primary/5 to-transparent p-6 md:p-8">
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-start">
            <div>
              <Button
                type="text"
                icon={<MdArrowBack />}
                onClick={onBack}
                className="mb-2 p-0 text-gray-400 hover:text-primary flex items-center gap-1 transition-colors"
              >
                Back to Operations
              </Button>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-none">
                {record?.searchString || 'Operation Detail'}
              </h1>
              <div className="flex flex-col gap-1 mt-2 text-gray-500 text-sm">
                <span>
                  <strong className="text-gray-700">{verificationStats.allLeads}</strong> leads in this operation
                  {verificationStats.withoutPhone > 0 && (
                    <span className="text-gray-400"> · {verificationStats.withoutPhone} without a phone number</span>
                  )}
                </span>
                <span className="text-gray-400 text-xs">
                  {record?.updatedAt
                    ? `Last updated ${new Date(record.updatedAt).toLocaleDateString()}`
                    : 'Not synced'}
                </span>
              </div>
            </div>
            <Button
              icon={<MdRefresh />}
              onClick={onRefresh}
              loading={loading}
              className="rounded-xl h-10 px-4 bg-gray-50 border-gray-200 hover:bg-gray-100 transition-all font-medium"
            >
              Refresh
            </Button>
          </div>
          <OperationDetailStats verificationStats={verificationStats} />
        </div>
      </div>
      {children}
    </div>
  );
}
