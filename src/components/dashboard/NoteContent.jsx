import React, { useRef, useState, useEffect } from 'react';
import { MdExpandMore, MdClose } from 'react-icons/md';

const NoteContent = ({ content, title, maxHeight = '150px', color = '#ffffff' }) => {
    const contentRef = useRef(null);
    const [isOverflowing, setIsOverflowing] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const checkOverflow = () => {
            if (contentRef.current) {
                const element = contentRef.current;
                const isOverflow = element.scrollHeight > element.clientHeight;
                setIsOverflowing(isOverflow);
            }
        };

        checkOverflow();
        // Recheck on window resize
        window.addEventListener('resize', checkOverflow);
        return () => window.removeEventListener('resize', checkOverflow);
    }, [content]);

    // Close modal on escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && showModal) {
                setShowModal(false);
            }
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [showModal]);

    return (
        <>
            {/* Content Container */}
            <div className="relative">
                <style>{`
                    .note-content-display ul { list-style-type: disc !important; padding-left: 1.5rem !important; margin-bottom: 0.5rem; }
                    .note-content-display ol { list-style-type: decimal !important; padding-left: 1.5rem !important; margin-bottom: 0.5rem; }
                    .note-content-display p { margin-bottom: 0.5rem; }
                    .note-content-display blockquote { border-left: 3px solid #0F792C; padding-left: 1em; margin: 1em 0; color: #666; }
                `}</style>
                <article
                    ref={contentRef}
                    className="prose prose-sm max-w-none text-gray-700 flex-grow overflow-hidden relative note-content-display"
                    style={{ maxHeight }}
                >
                    <div dangerouslySetInnerHTML={{ __html: content }} />
                </article>

                {/* Read More Button - Only shown when content overflows */}
                {isOverflowing && (
                    <div className="absolute bottom-[-40px] left-0 right-0 flex justify-center pb-1">
                        <button
                            onClick={() => setShowModal(true)}
                            className=" py-1 text-xs font-medium text-gray-700 hover:text-[#0F792C] transition-colors shadow-sm flex items-center gap-1"
                        >
                            Read More
                            <MdExpandMore className="text-sm" />
                        </button>
                    </div>
                )}
            </div>

            {/* Custom Modal Overlay */}
            {showModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className="p-8 rounded-lg shadow-2xl relative max-w-3xl w-full max-h-[90vh] overflow-y-auto"
                        style={{ backgroundColor: color }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-4 right-4 p-2 hover:bg-black/5 rounded-full transition-colors text-gray-600 z-10"
                        >
                            <MdClose className="text-xl" />
                        </button>

                        {/* Title */}
                        {title && (
                            <h3 className="font-bold text-2xl text-gray-800 mb-4 pr-10">
                                {title}
                            </h3>
                        )}

                        {/* Content */}
                        <article
                            className="prose prose-sm max-w-none text-gray-700 note-content-display"
                            dangerouslySetInnerHTML={{ __html: content }}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default NoteContent;
