import React, { useState } from 'react';
import { Modal, Button } from 'antd';
import { MdImage, MdOpenInNew } from 'react-icons/md';
import { BASE_URL } from '../../config/URL';

const ScreenshotViewer = ({ url, title = 'Website Screenshot', trigger = null }) => {
    const [visible, setVisible] = useState(false);

    if (!url) return null;

    const fullUrl = url.startsWith('http') ? url : `${BASE_URL}${url}`;

    const renderTrigger = () => {
        if (trigger) {
            return React.cloneElement(trigger, {
                onClick: (e) => {
                    if (e) e.stopPropagation();
                    setVisible(true);
                }
            });
        }

        return (
            <div
                className="relative cursor-pointer group inline-block"
                style={{ lineHeight: 0 }}
                onClick={(e) => {
                    e.stopPropagation();
                    setVisible(true);
                }}
            >
                <img
                    src={fullUrl}
                    alt="Thumbnail"
                    className="w-20 h-12 object-cover rounded border-2 border-gray-100 group-hover:border-[#0F792C] transition-all"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black bg-opacity-30 rounded transition-opacity">
                    <MdImage className="text-white" size={24} />
                </div>
            </div>
        );
    };

    return (
        <>
            {renderTrigger()}
            <Modal
                title={
                    <div className="flex items-center gap-2">
                        <MdImage className="text-[#0F792C]" size={20} />
                        <span>{title}</span>
                    </div>
                }
                open={visible}
                onCancel={() => setVisible(false)}
                destroyOnClose
                getContainer={() => document.body}
                footer={[
                    <Button key="close" onClick={() => setVisible(false)}>
                        Close
                    </Button>,
                    <Button
                        key="open"
                        type="primary"
                        icon={<MdOpenInNew />}
                        href={fullUrl}
                        target="_blank"
                        className="bg-[#0F792C] border-none"
                    >
                        Open Original Image
                    </Button>
                ]}
                width={1000}
                centered
                className="screenshot-modal"
            >
                <div className="max-h-[70vh] overflow-y-auto rounded-lg border border-gray-100 bg-gray-50 flex justify-center">
                    <img
                        src={fullUrl}
                        alt="Website Capture"
                        className="max-w-full h-auto shadow-sm"
                        loading="lazy"
                    />
                </div>
            </Modal>
        </>
    );
};

export default ScreenshotViewer;
