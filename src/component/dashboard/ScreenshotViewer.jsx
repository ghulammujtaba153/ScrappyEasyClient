import React, { useState } from "react";
import { Modal, Button } from "antd";
import {
    MdImage,
    MdOpenInNew,
    MdZoomIn,
    MdZoomOut,
    MdRefresh
} from "react-icons/md";
import { BASE_URL } from "../../config/URL";

const ScreenshotViewer = ({
    url,
    title = "Website Screenshot",
    trigger = null
}) => {
    const [visible, setVisible] = useState(false);
    const [zoom, setZoom] = useState(1); // 1 = 100%

    if (!url) return null;

    const fullUrl = url.startsWith("http") ? url : `${BASE_URL}${url}`;

    /* =======================
       ZOOM HANDLERS
    ======================= */
    const zoomIn = () => setZoom((z) => Math.min(z + 0.2, 3));   // max 300%
    const zoomOut = () => setZoom((z) => Math.max(z - 0.2, 0.3)); // min 30%
    const resetZoom = () => setZoom(1);

    /* =======================
       TRIGGER
    ======================= */
    const renderTrigger = () => {
        if (trigger) {
            return React.cloneElement(trigger, {
                onClick: (e) => {
                    e?.stopPropagation();
                    setVisible(true);
                    resetZoom();
                }
            });
        }

        return (
            <div
                className="relative inline-block cursor-pointer group"
                onClick={(e) => {
                    e.stopPropagation();
                    setVisible(true);
                    resetZoom();
                }}
            >
                <img
                    src={fullUrl}
                    alt="Thumbnail"
                    className="w-20 h-12 object-cover rounded-lg border-2 border-gray-100 group-hover:border-[#0F792C] transition-all"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/30 rounded-lg transition-opacity">
                    <MdImage className="text-white" size={24} />
                </div>
            </div>
        );
    };

    return (
        <>
            {renderTrigger()}

            <Modal
                open={visible}
                onCancel={() => setVisible(false)}
                destroyOnClose
                centered
                width="90vw"
                className="screenshot-modal"
                bodyStyle={{
                    padding: 0,
                    height: "80vh" // required by AntD
                }}
                title={
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <MdImage className="text-[#0F792C]" size={20} />
                            <span className="font-bold">{title}</span>
                        </div>

                        {/* ZOOM CONTROLS */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={zoomOut}
                                className="p-2 rounded bg-gray-100 hover:bg-gray-200 transition"
                                title="Zoom Out"
                            >
                                <MdZoomOut />
                            </button>
                            <span className="text-xs font-bold w-12 text-center">
                                {Math.round(zoom * 100)}%
                            </span>
                            <button
                                onClick={zoomIn}
                                className="p-2 rounded bg-gray-100 hover:bg-gray-200 transition"
                                title="Zoom In"
                            >
                                <MdZoomIn />
                            </button>
                            <button
                                onClick={resetZoom}
                                className="p-2 rounded bg-gray-100 hover:bg-gray-200 transition"
                                title="Reset Zoom"
                            >
                                <MdRefresh />
                            </button>
                        </div>
                    </div>
                }
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
            >
                {/* =======================
            SCROLL + ZOOM CONTAINER
        ======================= */}
                <div className="h-full overflow-auto bg-gray-50 p-6">
                    <div
                        className="inline-block origin-top-left transition-transform duration-150"
                        style={{
                            transform: `scale(${zoom})`
                        }}
                    >
                        <img
                            src={fullUrl}
                            alt="Website Screenshot"
                            loading="lazy"
                            className="
                block
                max-w-none
                h-auto
                shadow-md
                rounded-lg
              "
                        />
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default ScreenshotViewer;
