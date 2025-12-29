import React, { useState, useEffect } from 'react';
import { Button, Tooltip } from 'antd';
import {
    MdClose,
    MdKeyboardArrowLeft,
    MdKeyboardArrowRight,
    MdOpenInNew,
    MdWeb
} from 'react-icons/md';
import { BASE_URL } from '../../config/URL';

const WebsiteCarouselViewer = ({ isOpen, onClose, websites = [], initialIndex = 0 }) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [loading, setLoading] = useState(true);

    // Sync state with props when modal opens
    useEffect(() => {
        if (isOpen) {
            setCurrentIndex(initialIndex);
        }
    }, [isOpen, initialIndex]);

    // Update loading state when switching sites
    useEffect(() => {
        setLoading(true);
    }, [currentIndex]);

    const handleNext = React.useCallback(() => {
        if (websites.length > 0) {
            setCurrentIndex((prev) => (prev + 1) % websites.length);
        }
    }, [websites.length]);

    const handlePrev = React.useCallback(() => {
        if (websites.length > 0) {
            setCurrentIndex((prev) => (prev - 1 + websites.length) % websites.length);
        }
    }, [websites.length]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowRight') handleNext();
            if (e.key === 'ArrowLeft') handlePrev();
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, handleNext, handlePrev, onClose]);

    if (!isOpen || websites.length === 0) return null;

    const currentSite = websites[currentIndex];

    // Ensure we have a valid URL
    const siteUrl = currentSite?.url?.startsWith('http')
        ? currentSite.url
        : `https://${currentSite.url}`;

    // Use proxy to bypass X-Frame-Options
    const proxyUrl = `${BASE_URL}/api/proxy?url=${encodeURIComponent(siteUrl)}`;

    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-gray-900/95 backdrop-blur-sm animate-in fade-in duration-200">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-white/10 text-white backdrop-blur-md border-b border-white/10 shadow-lg">
                <div className="flex items-center gap-4 overflow-hidden">
                    <div className="h-10 w-10 rounded-lg bg-[#0F792C] flex items-center justify-center shrink-0 shadow-lg shadow-green-900/20">
                        <MdWeb size={24} />
                    </div>
                    <div className="min-w-0 flex flex-col">
                        <h2 className="text-lg font-bold truncate leading-tight">
                            {currentSite?.title || 'Unknown Website'}
                        </h2>
                        <a
                            href={siteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-green-300 hover:text-green-200 flex items-center gap-1 hover:underline truncate"
                        >
                            <MdOpenInNew /> {siteUrl}
                        </a>
                    </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                    <div className="px-3 py-1 bg-black/40 rounded-full text-xs font-mono text-gray-300 border border-white/10">
                        {currentIndex + 1} / {websites.length}
                    </div>

                    <Tooltip title="Close (Esc)">
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-white/10 text-gray-300 hover:text-white transition-all text-xl"
                        >
                            <MdClose />
                        </button>
                    </Tooltip>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 relative bg-white overflow-hidden">
                {/* Loader Overlay */}
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
                        <div className="flex flex-col items-center gap-3 animate-pulse">
                            <span className="h-10 w-10 border-4 border-green-200 border-t-[#0F792C] rounded-full animate-spin"></span>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Loading Website...</span>
                        </div>
                    </div>
                )}

                {/* Fallback Message */}
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 z-0 text-center p-8">
                    <p className="text-gray-400 text-sm mb-4 max-w-md">
                        If the website doesn't load, you can open it in a new tab.
                    </p>
                    <Button
                        type="primary"
                        href={siteUrl}
                        target="_blank"
                        className="bg-[#0F792C] hover:bg-[#0a5a20] border-none"
                    >
                        Open in New Tab
                    </Button>
                </div>

                <iframe
                    src={proxyUrl}
                    className="w-full h-full relative z-10 bg-transparent"
                    title="Website Preview"
                    sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
                    onLoad={() => setLoading(false)}
                    onError={() => setLoading(false)}
                />

                {/* Navigation Arrows (Floating) */}
                <button
                    onClick={handlePrev}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 h-14 w-14 rounded-full bg-black/50 hover:bg-[#0F792C] text-white backdrop-blur-sm shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 group"
                >
                    <MdKeyboardArrowLeft size={32} className="group-hover:-translate-x-1 transition-transform" />
                </button>

                <button
                    onClick={handleNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 h-14 w-14 rounded-full bg-black/50 hover:bg-[#0F792C] text-white backdrop-blur-sm shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 group"
                >
                    <MdKeyboardArrowRight size={32} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

            {/* Footer / Info Bar */}
            <div className="bg-white border-t border-gray-200 px-6 py-2 flex items-center justify-center text-xs text-gray-400 font-medium">
                Use <span className="mx-1 px-1.5 py-0.5 bg-gray-100 rounded border border-gray-200 text-gray-500 font-mono">←</span> <span className="mx-1 px-1.5 py-0.5 bg-gray-100 rounded border border-gray-200 text-gray-500 font-mono">→</span> keys to navigate • Esc to close
            </div>
        </div>
    );
};

export default WebsiteCarouselViewer;
