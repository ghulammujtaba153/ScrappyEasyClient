import React from 'react';
import { Button } from 'antd';
import { MdClose } from 'react-icons/md';

export default function OperationNotFound({ onBack }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="text-center max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <MdClose size={32} />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Operation Not Found</h2>
        <p className="text-sm text-gray-500 mb-6">
          The operation data you&apos;re looking for could not be found or has been removed.
        </p>
        <Button type="primary" onClick={onBack} className="h-11 px-8 rounded-xl font-bold border-none bg-primary">
          Back to Operations
        </Button>
      </div>
    </div>
  );
}
