import React, { useState, useEffect } from 'react';
import { Button, Tooltip } from 'antd';
import {
    MdClose,
    MdKeyboardArrowLeft,
    MdKeyboardArrowRight,
    MdOpenInNew,
    MdWeb,
    MdFavorite,
    MdFavoriteBorder
} from 'react-icons/md';
import { BASE_URL } from '../../config/URL';

const WebsiteCarouselViewer = ({ isOpen, onClose, websites = [], initialIndex = 0, onToggleFavorite }) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [loading, setLoading] = useState(true);

    // Sync state with props when modal opens
    // Using a key on the component from parent is better, but here we can check if it changed
    const [prevInitialIndex, setPrevInitialIndex] = useState(initialIndex);
    const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

    if (isOpen && !prevIsOpen) {
        setPrevIsOpen(true);
        setCurrentIndex(initialIndex);
    } else if (!isOpen && prevIsOpen) {
        setPrevIsOpen(false);
    }

    if (initialIndex !== prevInitialIndex) {
        setPrevInitialIndex(initialIndex);
        setCurrentIndex(initialIndex);
    }

    // Update loading state when switching sites
    const [prevCurrentIndex, setPrevCurrentIndex] = useState(currentIndex);
    if (currentIndex !== prevCurrentIndex) {
        setPrevCurrentIndex(currentIndex);
        setLoading(true);
    }

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

    if (currentSite?.isRestricted) {
        return (
            <div className="fixed inset-0 z-50 flex flex-col bg-gray-900/95 backdrop-blur-sm flex items-center justify-center p-8">
                <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl animate-in zoom-in duration-300">
                    <div className="h-20 w-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6 text-amber-600">
                        <MdWeb size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Premium Feature</h2>
                    <p className="text-gray-600 mb-8">
                        The live website preview is a premium feature. Please upgrade your plan or start a trial to unlock it.
                    </p>
                    <div className="flex gap-4">
                        <Button className="flex-1" onClick={onClose}>Close</Button>
                        <Button type="primary" className="flex-1 bg-[#0F792C]" href="/billing">Upgrade</Button>
                    </div>
                </div>
            </div>
        );
    }

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
                    {onToggleFavorite && (
                        <Tooltip title={currentSite?.favorite ? "Remove from favorites" : "Add to favorites"}>
                            <button
                                onClick={() => onToggleFavorite(currentIndex, !currentSite?.favorite)}
                                className={`p-2 rounded-full transition-all text-xl ${currentSite?.favorite
                                    ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                                    : 'hover:bg-white/10 text-gray-300 hover:text-red-400'
                                    }`}
                            >
                                {currentSite?.favorite ? <MdFavorite /> : <MdFavoriteBorder />}
                            </button>
                        </Tooltip>
                    )}

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
