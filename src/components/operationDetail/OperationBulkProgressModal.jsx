import React from 'react';
import { Modal, Button, Tag } from 'antd';
import { MdCheckCircle, MdEmail, MdLocationOn, MdAnalytics } from 'react-icons/md';
import { BsWhatsapp } from 'react-icons/bs';
import ExtractionLoader from '../common/ExtractionLoader';

export default function OperationBulkProgressModal({ bulkProgress, setBulkProgress, adsAnalysisResults, flattenedData }) {
  const { isOpen, isProcessing, type, title, total, success, failed, extraLabel, extraCount } = bulkProgress;

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          {type === 'mail' && <MdEmail className="text-primary text-xl" />}
          {type === 'city' && <MdLocationOn className="text-primary text-xl" />}
          {type === 'whatsapp' && <BsWhatsapp className="text-primary text-xl" />}
          {type === 'ads' && <MdAnalytics className="text-blue-600 text-xl" />}
          <span>{title}</span>
        </div>
      }
      open={isOpen}
      onCancel={() => !isProcessing && setBulkProgress((prev) => ({ ...prev, isOpen: false }))}
      footer={[
        <Button
          key="close"
          type="primary"
          onClick={() => setBulkProgress((prev) => ({ ...prev, isOpen: false }))}
          disabled={isProcessing}
        >
          {isProcessing ? 'Processing...' : 'Done'}
        </Button>,
      ]}
      centered
      closable={!isProcessing}
      maskClosable={!isProcessing}
      className="rounded-2xl"
      width={type === 'ads' ? 800 : 500}
    >
      <div className="space-y-6 py-4">
        {isProcessing && (
          <div className="flex flex-col items-center justify-center space-y-4">
            <ExtractionLoader
              count={success + failed}
              total={total}
              isLoading={isProcessing}
              label={type === 'whatsapp' ? 'Verified' : 'Scanned'}
            />
            <p className="text-gray-500 font-medium animate-pulse">
              {type === 'social'
                ? 'Performing deep exploration...'
                : type === 'mail'
                  ? 'Analyzing domains...'
                  : type === 'city'
                    ? 'Mapping coordinates...'
                    : 'Verifying credentials...'}
            </p>
            {total > 0 && (
              <p className="text-xs text-gray-400 font-bold bg-gray-100 px-3 py-1 rounded-full">
                Estimated time: ~
                {(() => {
                  const remaining = total - (success + failed);
                  const seconds = remaining * 5;
                  const m = Math.floor(seconds / 60);
                  const s = seconds % 60;
                  return m > 0 ? `${m}m ${s}s` : `${s}s`;
                })()}{' '}
                remaining
              </p>
            )}
          </div>
        )}

        {!isProcessing && (
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center">
              <MdCheckCircle size={40} />
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-5 rounded-2xl text-center border border-blue-100 shadow-sm">
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-2">Processed</p>
            <p className="text-3xl font-black text-blue-900 leading-none">{total}</p>
            <p className="text-[10px] text-blue-400 mt-2 font-bold uppercase tracking-tighter">Total Leads Scanned</p>
          </div>
          <div className="bg-green-50 p-5 rounded-2xl text-center border border-green-100 shadow-sm relative overflow-hidden">
            <p className="text-[10px] font-black text-green-600 uppercase tracking-[0.2em] mb-2">
              {type === 'whatsapp' ? 'Verified' : 'Extracted'}
            </p>
            <p className="text-3xl font-black text-green-900 leading-none">{success}</p>
            <p className="text-[10px] text-green-400 mt-2 font-bold uppercase tracking-tighter">Successfully Captured</p>
          </div>
        </div>

        {extraLabel && (
          <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-bold text-gray-700 uppercase tracking-widest">{extraLabel}</p>
              <Tag color="purple" className="font-bold border-none bg-purple-100 text-purple-600 rounded-full px-3">
                +{extraCount} Found
              </Tag>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${total ? (success / total) * 100 : 0}%` }}
              />
            </div>
          </div>
        )}

        {type === 'ads' && !isProcessing && Object.keys(adsAnalysisResults).length > 0 && (
          <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 max-h-96 overflow-y-auto">
            <p className="text-xs font-bold text-gray-700 uppercase tracking-widest mb-4">Detailed Results</p>
            <div className="space-y-2">
              {flattenedData
                .filter((item) => item.website && adsAnalysisResults[item.leadId])
                .map((item) => (
                  <div
                    key={item.leadId}
                    className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">{item.title}</p>
                      <p className="text-xs text-gray-500 truncate">{item.website}</p>
                    </div>
                    <Tag
                      color={
                        adsAnalysisResults[item.leadId] === 'running'
                          ? 'green'
                          : adsAnalysisResults[item.leadId] === 'not-running'
                            ? 'default'
                            : 'orange'
                      }
                      className="rounded-full ml-2"
                    >
                      {adsAnalysisResults[item.leadId] === 'running'
                        ? '🎯 Running'
                        : adsAnalysisResults[item.leadId] === 'not-running'
                          ? 'No Ads'
                          : 'N/A'}
                    </Tag>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
