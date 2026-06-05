import React from 'react';
import { Modal, Button, Tag } from 'antd';
import { MdCheckCircle, MdEmail, MdLocationOn, MdAnalytics, MdShare } from 'react-icons/md';
import { BsWhatsapp } from 'react-icons/bs';
import ExtractionLoader from '../common/ExtractionLoader';
import { getBulkProgressCopy } from './bulkProgressLabels';

export default function OperationBulkProgressModal({ bulkProgress, setBulkProgress, adsAnalysisResults, flattenedData }) {
  const { isOpen, isProcessing, type, title, total, success, failed, extraCount } = bulkProgress;
  const copy = getBulkProgressCopy(type);
  const done = success + failed;
  const progressPct = total > 0 ? Math.min(100, Math.round((done / total) * 100)) : 0;

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          {type === 'mail' && <MdEmail className="text-primary text-xl" />}
          {type === 'city' && <MdLocationOn className="text-primary text-xl" />}
          {type === 'whatsapp' && <BsWhatsapp className="text-primary text-xl" />}
          {type === 'ads' && <MdAnalytics className="text-blue-600 text-xl" />}
          {type === 'social' && <MdShare className="text-primary text-xl" />}
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
          {isProcessing ? 'Running...' : 'Close'}
        </Button>,
      ]}
      centered
      closable={!isProcessing}
      maskClosable={!isProcessing}
      className="rounded-2xl"
      width={type === 'ads' ? 800 : 500}
    >
      <div className="space-y-5 py-4">
        {isProcessing ? (
          <div className="flex flex-col items-center space-y-3">
            <ExtractionLoader count={done} total={total} isLoading={isProcessing} label={copy.ringLabel} />
            <p className="text-sm text-gray-600 text-center px-2">{copy.status}</p>
            {total > 0 && done < total && (
              <p className="text-xs text-gray-400 font-semibold bg-gray-100 px-3 py-1 rounded-full">
                About ~
                {(() => {
                  const left = total - done;
                  const sec = left * copy.etaPerItem;
                  const m = Math.floor(sec / 60);
                  const s = sec % 60;
                  return m > 0 ? `${m}m ${s}s` : `${s}s`;
                })()}{' '}
                left
              </p>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 mb-1">
            <div className="w-14 h-14 bg-green-50 text-green-500 rounded-full flex items-center justify-center">
              <MdCheckCircle size={36} />
            </div>
            <p className="text-sm font-semibold text-gray-600">Complete</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-2xl text-center border border-blue-100">
            <p className="text-xs font-bold text-blue-700 mb-1">{copy.leftTitle}</p>
            <p className="text-3xl font-black text-blue-900">{done}</p>
            <p className="text-[11px] text-blue-500 mt-1">{copy.leftSub(done, total)}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-2xl text-center border border-green-100">
            <p className="text-xs font-bold text-green-700 mb-1">{copy.rightTitle}</p>
            <p className="text-3xl font-black text-green-900">{success}</p>
            <p className="text-[11px] text-green-600 mt-1">{copy.rightSub}</p>
          </div>
        </div>

        {failed > 0 && (
          <p className="text-center text-xs text-red-500 font-medium">
            {failed} {copy.failNote}
          </p>
        )}

        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold text-gray-700">{copy.bottomTitle}</p>
            <Tag color="purple" className="font-semibold border-none bg-purple-100 text-purple-700 rounded-full px-3">
              {extraCount} {copy.bottomUnit}
            </Tag>
          </div>
          <div className="flex justify-between text-[10px] text-gray-400 font-semibold mb-1">
            <span>Job progress</span>
            <span>{progressPct}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {type === 'ads' && !isProcessing && Object.keys(adsAnalysisResults).length > 0 && (
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 max-h-80 overflow-y-auto">
            <p className="text-xs font-bold text-gray-700 mb-3">Results per website</p>
            <div className="space-y-2">
              {flattenedData
                .filter((item) => item.website && adsAnalysisResults[item.leadId])
                .map((item) => (
                  <div key={item.leadId} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">{item.title}</p>
                      <p className="text-xs text-gray-500 truncate">{item.website}</p>
                    </div>
                    <Tag
                      color={adsAnalysisResults[item.leadId] === 'running' ? 'green' : 'default'}
                      className="rounded-full ml-2"
                    >
                      {adsAnalysisResults[item.leadId] === 'running' ? 'Running ads' : 'No ads'}
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
