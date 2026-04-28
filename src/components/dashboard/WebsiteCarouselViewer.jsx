import React, { useState, useEffect } from 'react';
import { Tooltip } from 'antd';
import {
    MdClose,
    MdKeyboardArrowLeft,
    MdKeyboardArrowRight,
    MdOpenInNew,
    MdWeb,
    MdFavorite,
    MdFavoriteBorder,
    MdFullscreen,
    MdInfo,
    MdShare,
    MdContentCopy
} from 'react-icons/md';
import { BsWhatsapp, BsFacebook, BsInstagram, BsLinkedin } from 'react-icons/bs';
import { BASE_URL } from '../../config/URL';

const WebsiteCarouselViewer = ({ isOpen, onClose, websites = [], initialIndex = 0, onToggleFavorite }) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [loading, setLoading] = useState(true);
    const [showInfo, setShowInfo] = useState(false);

    // Sync state with props when modal opens
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

    // Safety timeout: Hide loader if it takes too long
    useEffect(() => {
        let timeout;
        if (loading) {
            timeout = setTimeout(() => {
                setLoading(false);
            }, 8000); // 8 seconds safety timeout
        }
        return () => clearTimeout(timeout);
    }, [loading, currentIndex]);

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
            if (e.key === 'i') setShowInfo(prev => !prev);
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

    const copyToClipboard = () => {
        navigator.clipboard.writeText(siteUrl);
    };

    if (currentSite?.isRestricted) {
        return (
            <div className="fixed inset-0 z-50 flex flex-col bg-gray-900/95 backdrop-blur-sm items-center justify-center p-0 md:p-8">
                <div className="bg-white md:rounded-3xl p-10 max-w-lg w-full h-full md:h-auto text-center shadow-2xl animate-in zoom-in duration-300 border border-gray-100 flex flex-col items-center justify-center">
                    <div className="relative">
                        <div className="h-24 w-24 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-orange-500/30">
                            <MdWeb size={48} className="text-white" />
                        </div>
                        <div className="absolute -top-1 -right-1 h-8 w-8 bg-amber-500 rounded-full flex items-center justify-center shadow-lg">
                            <MdStar className="text-white" size={16} />
                        </div>
                    </div>
                    <h2 className="text-3xl font-black text-gray-800 mb-3">Premium Feature</h2>
                    <p className="text-gray-500 mb-8 text-lg leading-relaxed">
                        Unlock the live website preview to see exactly how your leads appear online. 
                        Stand out with deeper insights.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 w-full">
                        <button 
                            className="flex-1 h-12 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors font-bold" 
                            onClick={onClose}
                        >
                            Maybe Later
                        </button>
                        <a 
                            className="flex-1 h-12 rounded-xl bg-gradient-to-r from-[#0F792C] to-[#0a5a20] text-white flex items-center justify-center font-bold shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transition-all"
                            href="/dashboard/support"
                        >
                            Upgrade Now
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-gray-950 animate-in fade-in duration-300 w-screen h-screen overflow-hidden">
            {/* Premium Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white border-b border-gray-700/50 shadow-2xl shrink-0">
                <div className="flex items-center gap-4 overflow-hidden flex-1 min-w-0">
                    <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-[#0F792C] to-[#0a5a20] flex items-center justify-center shrink-0 shadow-lg shadow-green-900/30 ring-2 ring-green-500/20">
                        <MdWeb size={24} />
                    </div>
                    <div className="min-w-0 flex flex-col flex-1">
                        <h2 className="text-lg font-bold truncate leading-tight flex items-center gap-2">
                            <span className="text-green-400">
                                {currentIndex + 1}
                            </span>
                            <span className="text-gray-300">/</span>
                            <span>{websites.length}</span>
                            <span className="mx-2 text-gray-600">•</span>
                            <span className="truncate text-white">{currentSite?.title || 'Unknown Website'}</span>
                        </h2>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                            <a
                                href={siteUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-green-400 hover:text-green-300 flex items-center gap-1 hover:underline truncate max-w-[300px]"
                            >
                                <MdOpenInNew size={12} /> {siteUrl.replace(/^https?:\/\//, '')}
                            </a>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    <Tooltip title="Copy URL">
                        <button
                            onClick={copyToClipboard}
                            className="p-2.5 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-all text-lg"
                        >
                            <MdContentCopy />
                        </button>
                    </Tooltip>
                    
                    {onToggleFavorite && (
                        <Tooltip title={currentSite?.favorite ? "Remove from favorites" : "Add to favorites"}>
                            <button
                                onClick={() => onToggleFavorite(currentIndex, !currentSite?.favorite)}
                                className={`p-2.5 rounded-xl transition-all text-xl ${currentSite?.favorite
                                    ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 shadow-lg shadow-red-500/20'
                                    : 'hover:bg-white/10 text-gray-400 hover:text-red-400'
                                    }`}
                            >
                                {currentSite?.favorite ? <MdFavorite /> : <MdFavoriteBorder />}
                            </button>
                        </Tooltip>
                    )}

                    <Tooltip title="Open in New Tab">
                        <a
                            href={siteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2.5 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-all text-lg inline-flex items-center justify-center"
                        >
                            <MdOpenInNew />
                        </a>
                    </Tooltip>

                    <Tooltip title="Website Info">
                        <button
                            onClick={() => setShowInfo(!showInfo)}
                            className={`p-2.5 rounded-xl transition-all text-lg ${showInfo ? 'bg-green-500/20 text-green-400' : 'hover:bg-white/10 text-gray-400 hover:text-white'}`}
                        >
                            <MdInfo />
                        </button>
                    </Tooltip>

                    <div className="h-8 w-px bg-gray-700 mx-1"></div>

                    <Tooltip title="Close (Esc)">
                        <button
                            onClick={onClose}
                            className="p-2.5 rounded-xl hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-all text-lg"
                        >
                            <MdClose />
                        </button>
                    </Tooltip>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 relative bg-gray-900 overflow-hidden h-full">
                {/* Loading Overlay */}
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 backdrop-blur-sm z-20">
                        <div className="flex flex-col items-center gap-6">
                            <div className="relative">
                                <div className="h-20 w-20 border-4 border-gray-800 border-t-[#0F792C] rounded-full animate-spin"></div>
                                <div className="absolute inset-2 h-16 w-16 border-4 border-transparent border-b-green-400 rounded-full animate-spin" style={{ animationDuration: '0.8s' }}></div>
                            </div>
                            <div className="text-center">
                                <p className="text-lg font-semibold text-white mb-1">Loading Website</p>
                                <p className="text-sm text-gray-500">{currentSite?.title || 'Preparing preview...'}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Info Panel */}
                {showInfo && (
                    <div className="absolute top-4 left-4 z-30 w-80 bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden animate-in slide-in-from-left duration-300">
                        <div className="p-4 border-b border-gray-700/50">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <MdInfo className="text-green-400" />
                                Website Details
                            </h3>
                        </div>
                        <div className="p-4 space-y-4">
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Business Name</label>
                                <p className="text-white font-medium mt-1">{currentSite?.title || 'N/A'}</p>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">URL</label>
                                <p className="text-green-400 text-sm mt-1 break-all">{siteUrl}</p>
                            </div>
                        </div>
                        <div className="p-4 bg-gray-800/50 border-t border-gray-700/50">
                            <a
                                href={siteUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full bg-[#0F792C] hover:bg-[#0a5a20] text-white h-10 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
                            >
                                <MdOpenInNew />
                                Open Full Website
                            </a>
                        </div>
                    </div>
                )}

                {/* Fallback Message */}
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800 z-0 text-center p-8">
                    <div className="max-w-md">
                        <div className="h-16 w-16 bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <MdWeb size={32} className="text-gray-500" />
                        </div>
                        <p className="text-gray-400 text-sm mb-6">
                            If the website doesn't load properly, you can open it in a new tab to see the full content.
                        </p>
                        <a
                            href={siteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-[#0F792C] hover:bg-[#0a5a20] text-white h-12 px-8 rounded-xl font-semibold shadow-lg shadow-green-500/20 transition-colors"
                        >
                            <MdOpenInNew />
                            Open in New Tab
                        </a>
                    </div>
                </div>

                <iframe
                    key={currentIndex}
                    src={proxyUrl}
                    className="w-full h-full relative z-10 bg-white border-none shadow-inner"
                    title="Website Preview"
                    sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation"
                    onLoad={() => setLoading(false)}
                    onError={() => setLoading(false)}
                />

                {/* Navigation Arrows - Premium Style */}
                <button
                    onClick={handlePrev}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 h-16 w-16 rounded-2xl bg-gray-800/80 hover:bg-[#0F792C] text-white backdrop-blur-xl shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 group border border-gray-700/50 hover:border-green-500/50"
                >
                    <MdKeyboardArrowLeft size={36} className="group-hover:-translate-x-1 transition-transform" />
                </button>

                <button
                    onClick={handleNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 h-16 w-16 rounded-2xl bg-gray-800/80 hover:bg-[#0F792C] text-white backdrop-blur-xl shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 group border border-gray-700/50 hover:border-green-500/50"
                >
                    <MdKeyboardArrowRight size={36} className="group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Progress Indicator */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
                    <div className="flex items-center gap-1.5 px-3 py-2 bg-gray-900/80 backdrop-blur-xl rounded-full border border-gray-700/50 shadow-2xl">
                        {websites.slice(0, 15).map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`transition-all duration-300 rounded-full ${
                                    idx === currentIndex 
                                        ? 'w-8 h-2 bg-green-500' 
                                        : idx < currentIndex 
                                            ? 'w-2 h-2 bg-green-500/60' 
                                            : 'w-2 h-2 bg-gray-600 hover:bg-gray-500'
                                }`}
                            />
                        ))}
                        {websites.length > 15 && (
                            <span className="text-xs text-gray-500 ml-1">+{websites.length - 15}</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Premium Footer */}
            <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-t border-gray-700/50 px-6 py-3 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1.5">
                        <kbd className="px-2 py-1 bg-gray-800 rounded-lg border border-gray-700 text-gray-300 font-mono text-[10px]">←</kbd>
                        <kbd className="px-2 py-1 bg-gray-800 rounded-lg border border-gray-700 text-gray-300 font-mono text-[10px]">→</kbd>
                        <span className="ml-1">Navigate</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                        <kbd className="px-2 py-1 bg-gray-800 rounded-lg border border-gray-700 text-gray-300 font-mono text-[10px]">i</kbd>
                        <span className="ml-1">Info</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                        <kbd className="px-2 py-1 bg-gray-800 rounded-lg border border-gray-700 text-gray-300 font-mono text-[10px]">Esc</kbd>
                        <span className="ml-1">Close</span>
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Website Preview Mode</span>
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></div>
                </div>
            </div>
        </div>
    );
};

export default WebsiteCarouselViewer;
