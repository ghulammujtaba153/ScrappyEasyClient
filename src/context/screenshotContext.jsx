import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { message } from 'antd';
import { captureWebsite } from '../api/screenshotApi';
import { BASE_URL } from '../config/URL';
import { useOperations } from './operationsContext';

const ScreenshotContext = createContext(null);

export const ScreenshotProvider = ({ children }) => {
    const { updateOperationCache } = useOperations();
    const [queue, setQueue] = useState([]);
    const [progress, setProgress] = useState({
        current: 0,
        total: 0,
        success: 0,
        failed: 0,
        isProcessing: false,
        minimized: false
    });

    // Use a ref to track processing state to avoid race conditions in effect
    const processingRef = useRef(false);

    const addToQueue = (items, operationId) => {
        // Items should be an array of { url, key, recordId, title }
        const newItems = items.map(item => ({ ...item, status: 'pending', operationId }));

        setQueue(prev => {
            const updatedQueue = [...prev, ...newItems];
            return updatedQueue;
        });

        setProgress(prev => ({
            ...prev,
            total: prev.total + newItems.length,
            isProcessing: true,
            minimized: false // Auto-expand on new items
        }));
    };

    const processQueueItem = async (item) => {
        if (!item.url) return { success: false, error: 'No URL' };

        const fullUrl = item.url.startsWith('http') ? item.url : `https://${item.url}`;

        try {
            const res = await captureWebsite(fullUrl);

            if (res.success) {
                const newUrl = res.screenshotUrl;
                const index = item.key.split('-')[1];

                // 1. Update Backend
                try {
                    await axios.post(`${BASE_URL}/api/data/update-screenshots`, {
                        recordId: item.recordId,
                        screenshotData: { [index]: newUrl }
                    });
                } catch (saveError) {
                    console.error("Failed to save screenshot to DB:", saveError);
                    // We still count as success if capture worked, but maybe log warning
                }

                // 2. Update Operations Cache (Live UI Update)
                // We assume updateOperationCache handles merging deeply
                updateOperationCache(item.operationId, {
                    screenshotData: { [item.key]: newUrl }
                });

                return { success: true, url: newUrl };
            } else {
                return { success: false, error: res.message };
            }
        } catch (error) {
            console.error(`Capture failed for ${item.url}:`, error);
            return { success: false, error: error.message };
        }
    };

    // Process queue items one by one
    useEffect(() => {
        const processNextItem = async () => {
            // If already processing or nothing to process, skip
            if (processingRef.current) return;

            // Find next pending item
            const nextItemIndex = queue.findIndex(item => item.status === 'pending');

            // If no pending items, check if we are done
            if (nextItemIndex === -1) {
                // If we were processing (implied by this effect running after an update), 
                // and now nothing is pending, consider if we should turn off isProcessing.
                // However, isProcessing is part of 'progress' state.

                // Let's verify if all items are terminal states (completed/failed)
                const isAllDone = queue.length > 0 && queue.every(i => i.status === 'completed' || i.status === 'failed');

                if (isAllDone && progress.isProcessing) {
                    setProgress(prev => ({ ...prev, isProcessing: false }));
                }
                return;
            }

            // Start processing
            processingRef.current = true;
            const item = queue[nextItemIndex];

            // Mark as processing in state
            setQueue(prev => {
                const newQ = [...prev];
                newQ[nextItemIndex] = { ...item, status: 'processing' };
                return newQ;
            });

            // Do the work
            const result = await processQueueItem(item);

            // Mark as completed/failed
            setQueue(prev => {
                const newQ = [...prev];
                newQ[nextItemIndex] = {
                    ...item,
                    status: result.success ? 'completed' : 'failed',
                    error: result.error
                };
                return newQ;
            });

            // Update stats
            setProgress(prev => ({
                ...prev,
                current: prev.current + 1,
                success: result.success ? prev.success + 1 : prev.success,
                failed: !result.success ? prev.failed + 1 : prev.failed
            }));

            // Release lock
            processingRef.current = false;

            // Artificial delay for UX
            await new Promise(resolve => setTimeout(resolve, 500));
        };

        // Only run if there are pending items and we assume we aren't already running deep in a promise chain.
        // Actually, with the above logic, 'setQueue' triggers re-render, creating new effect run.
        // 'processingRef.current' prevents double execution.
        if (queue.some(i => i.status === 'pending')) {
            processNextItem();
        } else {
            // If queue has items and none are pending, we might need to close out 'isProcessing'
            const isAllDone = queue.length > 0 && queue.every(i => i.status === 'completed' || i.status === 'failed');
            if (isAllDone && progress.isProcessing) {
                setProgress(prev => ({ ...prev, isProcessing: false }));
            }
        }

    }, [queue]); // Removed updateOperationCache from deps to verify stability, though it should be stable.

    const clearCompleted = () => {
        setQueue(prev => prev.filter(i => i.status === 'pending' || i.status === 'processing'));
        setProgress({
            current: 0,
            total: queue.filter(i => i.status === 'pending' || i.status === 'processing').length,
            success: 0,
            failed: 0,
            isProcessing: queue.some(i => i.status === 'pending'),
            minimized: false
        });
    };

    const toggleMinimize = () => {
        setProgress(prev => ({ ...prev, minimized: !prev.minimized }));
    };

    const closeProgress = () => {
        // Only allow closing if finished? Or allow cancelling?
        // For now, let's just clear completed and hide
        if (progress.isProcessing) {
            message.warning("Capture in progress. Please wait or minimize.");
            return;
        }
        setQueue([]);
        setProgress({
            current: 0,
            total: 0,
            success: 0,
            failed: 0,
            isProcessing: false,
            minimized: false
        });
    };

    const value = {
        addToQueue,
        queue,
        progress,
        clearCompleted,
        toggleMinimize,
        closeProgress
    };

    return <ScreenshotContext.Provider value={value}>{children}</ScreenshotContext.Provider>;
};

export const useScreenshot = () => {
    const context = useContext(ScreenshotContext);
    if (!context) {
        throw new Error('useScreenshot must be used within a ScreenshotProvider');
    }
    return context;
};
