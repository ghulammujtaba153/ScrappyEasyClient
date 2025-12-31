import React from 'react';
import { Progress, Button, Card, Typography, Tooltip } from 'antd';
import { MdClose, MdMinimize, MdWeb, MdCheckCircle, MdError, MdExpandLess } from 'react-icons/md';
import { useScreenshot } from '../../context/screenshotContext';

const { Text } = Typography;

const GlobalCaptureProgress = () => {
    const { progress, toggleMinimize, closeProgress } = useScreenshot();

    // Don't render if no activity
    if (progress.total === 0) return null;

    const percent = Math.round((progress.current / progress.total) * 100) || 0;
    const isFinished = progress.current >= progress.total && progress.total > 0;

    if (progress.minimized) {
        return (
            <Tooltip title="Click to expand capture progress">
                <div
                    className="fixed bottom-4 right-4 z-50 bg-[#0F792C] text-white p-3 rounded-full shadow-lg cursor-pointer flex items-center gap-2 hover:bg-[#0a5a20] transition-all"
                    onClick={toggleMinimize}
                >
                    <MdWeb size={24} />
                    {progress.isProcessing && (
                        <span className="text-xs font-bold">{percent}%</span>
                    )}
                    {isFinished && <MdCheckCircle size={16} />}
                </div>
            </Tooltip>
        );
    }

    return (
        <Card
            className="fixed bottom-4 right-4 z-50 w-80 shadow-2xl border-green-500 border-t-4 animate-slide-up"
            styles={{ body: { padding: '12px' } }}
        >
            <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                    <div className="bg-green-100 p-1.5 rounded-full">
                        <MdWeb className="text-[#0F792C]" size={20} />
                    </div>
                    <div>
                        <Text strong className="block text-gray-800">
                            {isFinished ? 'Capture Complete' : 'Capturing Websites...'}
                        </Text>
                        <Text type="secondary" className="text-xs">
                            {progress.current} of {progress.total} processed
                        </Text>
                    </div>
                </div>
                <div className="flex gap-1">
                    <Button
                        type="text"
                        size="small"
                        icon={<MdMinimize className="-translate-y-1" />}
                        onClick={toggleMinimize}
                    />
                    {isFinished && (
                        <Button
                            type="text"
                            size="small"
                            icon={<MdClose />}
                            onClick={closeProgress}
                            danger
                        />
                    )}
                </div>
            </div>

            <Progress
                percent={percent}
                status={progress.isProcessing ? 'active' : isFinished ? 'success' : 'normal'}
                strokeColor="#0F792C"
                showInfo={false}
                size="small"
            />

            <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span className="flex items-center gap-1 text-green-600">
                    <MdCheckCircle /> {progress.success} Successful
                </span>
                <span className="flex items-center gap-1 text-red-500">
                    <MdError /> {progress.failed} Failed
                </span>
            </div>

            {isFinished && (
                <div className="mt-3 text-right">
                    <Button type="primary" size="small" onClick={closeProgress} className="bg-[#0F792C]">
                        Close
                    </Button>
                </div>
            )}
        </Card>
    );
};

export default GlobalCaptureProgress;
