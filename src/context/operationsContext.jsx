import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { message } from 'antd';
import { BASE_URL } from '../config/URL';
import { useAuth } from './authContext';

const OperationsContext = createContext(null);

export const OperationsProvider = ({ children }) => {
    const { user } = useAuth();
    const [uniqueSearches, setUniqueSearches] = useState([]);
    const [uniqueCities, setUniqueCities] = useState([]);
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem('token');

    // Pagination & Search States
    const [keyword, setKeyword] = useState('');
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });

    // Track if data has been fetched at least once to avoid re-fetching on nav
    const [isDataLoaded, setIsDataLoaded] = useState(false);

    // Operation Details Cache
    const [operationCache, setOperationCache] = useState({});

    const fetchUniqueSearches = useCallback(async (page, pageSize, search) => {
        if (!user?._id && !user?.id) return;

        // Use provided arguments or fall back to current state
        const targetPage = page !== undefined ? page : pagination.current;
        const targetPageSize = pageSize !== undefined ? pageSize : pagination.pageSize;
        const targetSearch = search !== undefined ? search : keyword;

        setLoading(true);
        try {
            // Fetch paginated searches
            const response = await axios.get(`${BASE_URL}/api/data/unique/${user._id || user.id}`, {
                params: {
                    page: targetPage,
                    limit: targetPageSize,
                    search: targetSearch
                },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data?.success) {
                setUniqueSearches(response.data.data || []);
                setPagination({
                    current: targetPage,
                    pageSize: targetPageSize,
                    total: response.data.pagination?.total || 0
                });

                // Update keyword state if it changed via argument
                if (search !== undefined) {
                    setKeyword(search);
                }

                setIsDataLoaded(true);
            } else {
                message.error(response.data?.message || 'Failed to load operations');
            }

            // Fetch global stats (Cities)
            if (uniqueCities.length === 0) {
                const dataResponse = await axios.get(`${BASE_URL}/api/data/${user._id || user.id}?limit=1000`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (dataResponse.data?.success && dataResponse.data?.uniqueCities) {
                    setUniqueCities(dataResponse.data.uniqueCities || []);
                }
            }
        } catch (error) {
            console.error('Failed to load operations overview:', error);
            message.error(error.response?.data?.message || 'Unable to fetch operations');
        } finally {
            setLoading(false);
        }
    }, [user, pagination.current, pagination.pageSize, keyword, uniqueCities.length]);

    // Fetch operation details with caching
    const fetchOperationDetails = useCallback(async (operationId) => {
        if (!operationId || (!user?._id && !user?.id)) return null;

        // Return cached data if exists
        if (operationCache[operationId]) {
            return operationCache[operationId];
        }

        setLoading(true); // Helper loading state (global) - might want to separate local loading?
        try {
            const response = await axios.get(`${BASE_URL}/api/data/record/${operationId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.data?.success) {
                const data = response.data.data;

                // Process initial derived data from leads (normalized schema)
                let initialWhatsappStatus = {};
                let initialCityData = {};
                let initialScreenshotData = {};

                // If leads are populated, extract status/city/screenshot from LeadData
                if (data.leads && Array.isArray(data.leads)) {
                    data.leads.forEach((lead, index) => {
                        const leadId = lead._id;
                        const itemKey = leadId || `${data._id}-${index}`;

                        // Extract whatsapp status from lead
                        if (lead.whatsappStatus) {
                            const phone = lead.phone?.replace(/\D/g, '');
                            if (phone) {
                                initialWhatsappStatus[`+${phone}`] = lead.whatsappStatus;
                            }
                        }

                        // Extract city from lead
                        if (lead.city) {
                            initialCityData[itemKey] = lead.city;
                        }

                        // Extract screenshot from lead
                        if (lead.screenshotUrl) {
                            initialScreenshotData[itemKey] = lead.screenshotUrl;
                        }
                    });
                }

                // Also check legacy data for backward compatibility
                if (data.whatsappVerifications) {
                    const verifications = data.whatsappVerifications;
                    const entries = verifications instanceof Map ?
                        Array.from(verifications.entries()) :
                        Object.entries(verifications);

                    entries.forEach(([phone, verificationData]) => {
                        if (!initialWhatsappStatus[phone]) {
                            initialWhatsappStatus[phone] = verificationData.isRegistered ? 'verified' : 'not-verified';
                        }
                    });
                }

                if (data.cityData) {
                    const cities = data.cityData;
                    const entries = cities instanceof Map ?
                        Array.from(cities.entries()) :
                        Object.entries(cities);

                    entries.forEach(([index, city]) => {
                        const itemKey = `${data._id}-${index}`;
                        if (!initialCityData[itemKey]) {
                            initialCityData[itemKey] = city;
                        }
                    });
                }

                if (data.screenshotData) {
                    const screenshots = data.screenshotData;
                    const entries = screenshots instanceof Map ?
                        Array.from(screenshots.entries()) :
                        Object.entries(screenshots);

                    entries.forEach(([index, url]) => {
                        const itemKey = `${data._id}-${index}`;
                        if (!initialScreenshotData[itemKey]) {
                            initialScreenshotData[itemKey] = url;
                        }
                    });
                }

                const cachedData = {
                    record: data,
                    cityData: initialCityData,
                    screenshotData: initialScreenshotData,
                    whatsappStatus: initialWhatsappStatus,
                    lastUpdated: Date.now()
                };

                setOperationCache(prev => ({
                    ...prev,
                    [operationId]: cachedData
                }));

                return cachedData;
            } else {
                message.error(response.data?.message || 'Failed to load record');
                return null;
            }
        } catch (error) {
            console.error('Failed to load record details:', error);
            message.error(error.response?.data?.message || 'Unable to fetch record');
            return null;
        } finally {
            setLoading(false);
        }
    }, [user, operationCache]);

    // Update specific parts of the cache
    const updateOperationCache = useCallback((operationId, updates) => {
        setOperationCache(prev => {
            const currentCache = prev[operationId] || {};

            // Check if we are updating nested objects that need merging
            let processedUpdates = { ...updates };

            if (updates.screenshotData && currentCache.screenshotData) {
                processedUpdates.screenshotData = {
                    ...currentCache.screenshotData,
                    ...updates.screenshotData
                };
            }

            if (updates.whatsappStatus && currentCache.whatsappStatus) {
                processedUpdates.whatsappStatus = {
                    ...currentCache.whatsappStatus,
                    ...updates.whatsappStatus
                };
            }

            if (updates.cityData && currentCache.cityData) {
                processedUpdates.cityData = {
                    ...currentCache.cityData,
                    ...updates.cityData
                };
            }

            return {
                ...prev,
                [operationId]: {
                    ...currentCache,
                    ...processedUpdates
                }
            };
        });
    }, []);

    // Cleanup or reset if user logout/change
    useEffect(() => {
        if (!user) {
            setUniqueSearches([]);
            setUniqueCities([]);
            setIsDataLoaded(false);
            setKeyword('');
            setPagination({ current: 1, pageSize: 10, total: 0 });
            setOperationCache({});
        }
    }, [user]);

    const value = {
        uniqueSearches,
        uniqueCities,
        loading,
        pagination,
        keyword,
        fetchUniqueSearches,
        setKeyword,
        isDataLoaded,
        operationCache,
        fetchOperationDetails,
        updateOperationCache
    };

    return <OperationsContext.Provider value={value}>{children}</OperationsContext.Provider>;
};

export const useOperations = () => {
    const context = useContext(OperationsContext);
    if (!context) {
        throw new Error('useOperations must be used within an OperationsProvider');
    }
    return context;
};

export default OperationsContext;
