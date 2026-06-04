import React from 'react';
import { Alert, Button } from 'antd';
import { MdClose } from 'react-icons/md';
import { BsWhatsapp } from 'react-icons/bs';

export default function OperationWhatsAppBanner({
  connected,
  onDisconnect,
  onConnect,
  isAuthorized,
  onLockFeature,
}) {
  if (connected) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 border border-green-100">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <Alert
            type="success"
            showIcon
            message="WhatsApp Connected"
            description="You can verify phone numbers directly from this table."
            className="bg-green-50 border-green-100 text-green-800 flex-1"
          />
          <Button danger icon={<MdClose />} onClick={onDisconnect}>
            Disconnect WhatsApp
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-yellow-100">
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800">Connect WhatsApp</h3>
          <p className="text-gray-600 mt-2">Link your WhatsApp account to verify phone numbers.</p>
        </div>
        <Button
          type="primary"
          icon={<BsWhatsapp />}
          onClick={() => {
            if (!isAuthorized) {
              onLockFeature('WhatsApp Connect');
              return;
            }
            onConnect();
          }}
          size="large"
          className="bg-[#0F792C] hover:bg-[#0a5a20] border-none"
        >
          Connect WhatsApp
        </Button>
      </div>
    </div>
  );
}
