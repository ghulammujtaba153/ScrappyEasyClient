import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Modal, message } from 'antd';
import axios from 'axios';
import WhatsAppConnectModal from '../../components/dashboard/WhatsAppConnectModal';
import SaveNumbersModal from '../../components/dashboard/SaveNumbersModal';
import SaveQualifiedLeadsModal from '../../components/dashboard/SaveQualifiedLeadsModal';
import OperationCSVImport from '../../components/dashboard/OperationCSVImport';
import EditLeadModal from '../../components/dashboard/EditLeadModal';
import SaveColdCallsModal from '../../components/dashboard/SaveColdCallsModal';
import WebsiteCarouselViewer from '../../components/dashboard/WebsiteCarouselViewer';
import LinkedInInformation from '../../components/dashboard/LinkedInInformation';
import StackAnalysisModal from '../../components/dashboard/StackAnalysisModal';
import ExportToTeamModal from '../../components/dashboard/ExportToTeamModal';
import SubscriptionRestrictedModal from '../../components/SubscriptionRestrictedModal';
import Notes from '../../components/dashboard/Notes';
import Loader from '../../components/common/Loader';
import OperationNotFound from '../../components/operationDetail/OperationNotFound';
import OperationDetailHeader from '../../components/operationDetail/OperationDetailHeader';
import OperationDetailToolbar from '../../components/operationDetail/OperationDetailToolbar';
import OperationWhatsAppBanner from '../../components/operationDetail/OperationWhatsAppBanner';
import OperationDetailFilters from '../../components/operationDetail/OperationDetailFilters';
import OperationLeadsTable from '../../components/operationDetail/OperationLeadsTable';
import OperationRecommendCitiesModal from '../../components/operationDetail/OperationRecommendCitiesModal';
import OperationBulkProgressModal from '../../components/operationDetail/OperationBulkProgressModal';
import OperationDuplicatesModal from '../../components/operationDetail/OperationDuplicatesModal';
import { useLeadsTableColumns } from '../../components/operationDetail/useLeadsTableColumns';
import { DEFAULT_FILTERS, EXPORT_FIELDS } from '../../components/operationDetail/constants';
import { trackMetaCustomEvent } from '../../utils/analytics';
import { filterLeads, computeVerificationStats } from '../../components/operationDetail/leadFilters';
import {
  formatPhoneNumber as formatPhoneUtil,
  isMongoLeadId,
  flattenLeads,
  extractCoordinates,
  extractCityFromUrl,
  getFileBaseName,
  buildExportRows,
  downloadFile,
  escapeHtml,
  calcTableScrollY,
} from '../../components/operationDetail/operationDetailUtils';
import { trackMetaEvent } from '../../utils/analytics';
import { BASE_URL } from '../../config/URL';
import { useAuth } from '../../context/authContext';
import { useOperations } from '../../context/operationsContext';
import { checkAccessStatus } from '../../api/subscriptionApi';

const OperationDetailPage = () => {

  const handleAnalyzeAllClick = async () => {
    if (analyzingAdsRef.current) {
      return;
    }
    analyzingAdsRef.current = true;

    // Use leadId (reliable) and only include valid Mongo ObjectId-like ids
    const websitesToAnalyze = [...new Set(
      filteredData
        .filter(item => item.website && item.leadId && /^[0-9a-fA-F]{24}$/.test(String(item.leadId)))
        .map(item => item.leadId)
    )];

    if (websitesToAnalyze.length === 0) {
      message.warning('No websites available to analyze');
      analyzingAdsRef.current = false;
      return;
    }

    setAnalyzingAds(true);
    setBulkProgress({
      isOpen: true,
      type: 'ads',
      title: 'Analyzing websites for ads',
      total: websitesToAnalyze.length,
      success: 0,
      failed: 0,
      extraLabel: 'Running Ads',
      extraCount: 0,
      isProcessing: true
    });

    const BATCH_SIZE = 10;
    let totalRunning = 0;
    let totalNotRunning = 0;
    const newResultsMap = { ...adsAnalysisResults };

    try {
      for (let i = 0; i < websitesToAnalyze.length; i += BATCH_SIZE) {
        const batch = websitesToAnalyze.slice(i, i + BATCH_SIZE);
        const currentBatchNum = Math.floor(i / BATCH_SIZE) + 1;
        const totalBatches = Math.ceil(websitesToAnalyze.length / BATCH_SIZE);

        setBulkProgress(prev => ({
          ...prev,
          title: `Analyzing ads... (Batch ${currentBatchNum}/${totalBatches})`
        }));

        const res = await axios.post(`${BASE_URL}/api/data/analyze-websites-for-ads`, {
          leadIds: batch
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.data.success) {
          const { data } = res.data;
          
          // Store results in state incrementally
          data.results.forEach(result => {
            newResultsMap[result.leadId] = result.status;
          });
          
          totalRunning += data.running;
          totalNotRunning += data.notRunning;
          
          setAdsAnalysisResults({ ...newResultsMap });
          
          // Update bulk progress with results
          setBulkProgress(prev => ({
            ...prev,
            success: totalRunning,
            failed: totalNotRunning,
            extraCount: totalRunning
          }));
        }

        // Brief delay between batches to stay safe
        if (i + BATCH_SIZE < websitesToAnalyze.length) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }

      message.success(`Analyzed all websites - Running: ${totalRunning}, No Ads: ${totalNotRunning}`);
      
      // Refresh data from database to get updated ads status
      await fetchRecord(true);
    } catch (error) {
      console.error('Error analyzing websites:', error);
      message.error(error.response?.data?.message || 'Failed to analyze websites for ads');
    } finally {
      analyzingAdsRef.current = false;
      setAnalyzingAds(false);
      setBulkProgress(prev => ({ ...prev, isProcessing: false, title: 'Ad Analysis Complete' }));
    }
  };
  const { operationId } = useParams();
  const navigate = useNavigate();
  const { token, user } = useAuth();

  // Use context for data persistence
  const { fetchOperationDetails, updateOperationCache, operationCache, setIsBlocking, adjustOperationCount } = useOperations();

  const cachedData = operationCache[operationId] || {};
  const record = cachedData.record || null;

  const cityData = useMemo(() => cachedData.cityData || {}, [cachedData.cityData]);
  const screenshotData = useMemo(() => cachedData.screenshotData || {}, [cachedData.screenshotData]);
  const whatsappStatus = useMemo(() => cachedData.whatsappStatus || {}, [cachedData.whatsappStatus]);
  const emailData = useMemo(() => cachedData.emailData || {}, [cachedData.emailData]);
  const socialData = useMemo(() => cachedData.socialData || {}, [cachedData.socialData]);

  const [loading, setLoading] = useState(!record);
  const [filters, setFilters] = useState({ ...DEFAULT_FILTERS });

  // WhatsApp Connection State
  const [whatsappInitialized, setWhatsappInitialized] = useState(false);
  const [verifyingPhone, setVerifyingPhone] = useState(null);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isColdCallModalOpen, setIsColdCallModalOpen] = useState(false);
  const [isQualifiedLeadsModalOpen, setIsQualifiedLeadsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isExportTeamModalOpen, setIsExportTeamModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  // Carousel State
  const [isCarouselOpen, setIsCarouselOpen] = useState(false);

  const [verifyingAll, setVerifyingAll] = useState(false);
  const [extractingCities, setExtractingCities] = useState(false);

  const [extractingAllSocial, setExtractingAllSocial] = useState(false);

    const [analyzingAds, setAnalyzingAds] = useState(false);
    const [analyzingProgress, setAnalyzingProgress] = useState(0);
    const [adsAnalysisResults, setAdsAnalysisResults] = useState({});

    const [extractingSocial, setExtractingSocial] = useState({});
  const analyzingAdsRef = useRef(false);
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(
    () => (typeof window !== 'undefined' ? window.innerHeight : 800)
  );

  useEffect(() => {
    setSelectedRowKeys([]);
  }, [operationId]);

  useEffect(() => {
    const onResize = () => setViewportHeight(window.innerHeight);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Recommend Cities State
  const [recommendedCities, setRecommendedCities] = useState([]);
  const [isRecommendModalOpen, setIsRecommendModalOpen] = useState(false);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);

  // LinkedIn Personnel State
  const [isLinkedInModalOpen, setIsLinkedInModalOpen] = useState(false);
  const [selectedLeadForLinkedIn, setSelectedLeadForLinkedIn] = useState(null);

  // Stack Analysis State
  const [isStackModalOpen, setIsStackModalOpen] = useState(false);
  const [selectedLeadForStack, setSelectedLeadForStack] = useState(null);

  // Subscription/Trial State
  const [isAuthorized, setIsAuthorized] = useState(true);
  const [isLockedModalOpen, setIsLockedModalOpen] = useState(false);
  const [lockedFeature, setLockedFeature] = useState('');

  // Generic Bulk Operation Progress State
  const [bulkProgress, setBulkProgress] = useState({
    isOpen: false,
    type: '', // 'city', 'whatsapp', 'social'
    title: 'Operation Progress',
    total: 0,
    success: 0,
    failed: 0,
    extraLabel: '',
    extraCount: 0,
    isProcessing: false
  });

  const [isDuplicatesModalOpen, setIsDuplicatesModalOpen] = useState(false);
  const [duplicatesLoading, setDuplicatesLoading] = useState(false);
  const [removingDuplicates, setRemovingDuplicates] = useState(false);
  const [duplicatePreview, setDuplicatePreview] = useState(null);

  // Wrapper setters to update cache (mimicking local state setters)
  const setCityData = (newData) => {
    const data = typeof newData === 'function' ? newData(cityData) : newData;
    updateOperationCache(operationId, { cityData: data });
  };

  const setWhatsappStatus = (newData) => {
    const data = typeof newData === 'function' ? newData(whatsappStatus) : newData;
    updateOperationCache(operationId, { whatsappStatus: data });
  };

  const setEmailData = (newData) => {
    const data = typeof newData === 'function' ? newData(emailData) : newData;
    updateOperationCache(operationId, { emailData: data });
  };

  const setSocialData = (newData) => {
    const data = typeof newData === 'function' ? newData(socialData) : newData;
    updateOperationCache(operationId, { socialData: data });
  };

  // Get recommended nearby cities based on Google Maps coordinates in data
  const getRecommendedCities = async () => {
    if (!isAuthorized) {
      setLockedFeature('City Recommendations');
      setIsLockedModalOpen(true);
      return;
    }

    if (!filteredData.length) {
      message.warning('No data available to analyze');
      return;
    }

    setLoadingRecommendations(true);

    try {
      // Collect all coordinates from Google Maps links
      const allCoords = [];
      filteredData.forEach((item) => {
        if (item.googleMapsLink) {
          const coords = extractCoordinates(item.googleMapsLink);
          if (coords) {
            allCoords.push(coords);
          }
        }
      });

      if (allCoords.length === 0) {
        message.warning('No Google Maps coordinates found in your data');
        setLoadingRecommendations(false);
        return;
      }

      // Calculate average/center coordinates
      const avgLat = allCoords.reduce((sum, c) => sum + c.lat, 0) / allCoords.length;
      const avgLon = allCoords.reduce((sum, c) => sum + c.lon, 0) / allCoords.length;

      console.log(`📍 Center coordinates: ${avgLat}, ${avgLon} (from ${allCoords.length} locations)`);

      // Call API to get neighboring cities
      const res = await axios.get(`${BASE_URL}/api/location/city-neighbors`, {
        params: {
          lat: avgLat,
          lng: avgLon,
          limit: 5
        }
      });

      if (res.data.success && res.data.neighbors?.length > 0) {
        setRecommendedCities(res.data.neighbors);
        setIsRecommendModalOpen(true);
        message.success(`Found ${res.data.neighbors.length} nearby cities to explore`);
      } else {
        message.info('No nearby cities found');
      }
    } catch (error) {
      console.error('Error getting recommended cities:', error);
      message.error('Failed to get city recommendations');
    }

    setLoadingRecommendations(false);
  };

  const copyRecommendedLocation = async (city) => {
    const operationTitle = record?.searchString || record?.title || 'Operation';
    const locationText = city?.city || '';
    const copyText = `${operationTitle} ${locationText}`.trim();

    try {
      await navigator.clipboard.writeText(copyText);
      message.success('Copied recommended location');
    } catch (error) {
      console.error('Copy recommended location failed:', error);
      message.error('Failed to copy location text');
    }
  };

  // Extract cities for all items in record
  const extractCitiesForRecord = async () => {
    if (!isAuthorized) {
      setLockedFeature('City Extraction');
      setIsLockedModalOpen(true);
      return;
    }

    if (!filteredData.length) {
      message.warning('No data to process');
      return;
    }

    const totalItems = filteredData.length;
    setExtractingCities(true);
    setBulkProgress({
      isOpen: true,
      type: 'city',
      title: 'Discovering Cities',
      total: totalItems,
      success: 0,
      failed: 0,
      extraLabel: 'Cities Found',
      extraCount: 0,
      isProcessing: true
    });

    const newCityData = { ...cityData };
    const cityDataToSave = {}; // Store leadId -> city for backend
    let updated = false;
    let processedCount = 0;
    let skippedCount = 0;
    let successCount = 0;
    let failedCount = 0;

    console.log(`🏙️ Starting city extraction for ${totalItems} items...`);

    try {
      for (let i = 0; i < filteredData.length; i++) {
        const item = filteredData[i];
        const leadId = item.leadId || item._id;

        // Skip if city already stored in lead or cached
        if (item.city || newCityData[leadId]) {
          skippedCount++;
          console.log(`⏭️ [${i + 1}/${totalItems}] Skipping - City already exists: ${item.city || newCityData[leadId]}`);
          continue;
        }

        if (item.googleMapsLink) {
          processedCount++;
          console.log(`🔍 [${i + 1}/${totalItems}] Extracting city from: ${item.title || 'Unknown business'}`);

          const city = await extractCityFromUrl(item.googleMapsLink);

          if (city && city !== 'Unknown') {
            newCityData[leadId] = city;
            cityDataToSave[leadId] = city; // Use leadId as key
            updated = true;
            successCount++;
            console.log(`✅ [${i + 1}/${totalItems}] Found city: ${city}`);

            // Update UI immediately (via context cache)
            setCityData({ ...newCityData });
          } else {
            failedCount++;
            console.log(`❌ [${i + 1}/${totalItems}] Failed to extract city`);
          }

          setBulkProgress(prev => ({
            ...prev,
            success: successCount,
            failed: failedCount,
            extraCount: successCount
          }));

          // Rate limiting: 1.5 second delay between requests
          await new Promise(resolve => setTimeout(resolve, 1500));
        } else {
          skippedCount++;
          console.log(`⏭️ [${i + 1}/${totalItems}] Skipping - No Google Maps link`);
        }
      }

      console.log(`\n📊 City Extraction Summary:`);
      console.log(`   Total Items: ${totalItems}`);
      console.log(`   Processed: ${processedCount}`);
      console.log(`   Skipped (cached): ${skippedCount}`);
      console.log(`   Success: ${successCount}`);
      console.log(`   Failed: ${failedCount}`);

      if (updated) {
        // Save to backend using leadId -> city format
        await axios.post(`${BASE_URL}/api/data/update-city`, {
          recordId: record._id,
          cityData: cityDataToSave
        }, { headers: { Authorization: `Bearer ${token}` } });

        // Track Search Event for City Discovery
        trackMetaEvent('Search', {
          content_name: 'City Discovery',
          content_category: 'Lead Enrichment',
          value: successCount
        });

        // Final update to cache
        setCityData(newCityData);

        // Refresh the record to get updated leads with city data
        await fetchRecord();

        console.log(`✅ Successfully saved cities to database`);
        message.success(`Cities extracted: ${successCount} successful, ${failedCount} failed`);
      } else {
        console.log(`ℹ️ No new cities to extract`);
        message.info('All cities already extracted');
      }
    } catch (error) {
      console.error('❌ Failed to extract cities:', error);
      message.error('Failed to extract cities: ' + error.message);
    } finally {
      setExtractingCities(false);
      setBulkProgress(prev => ({ ...prev, isProcessing: false }));
      console.log(`🏁 City extraction process completed\n`);
    }
  };

  const extractSocialsForLead = async (leadId, url) => {
    if (!url) return;
    setExtractingSocial(prev => ({ ...prev, [leadId]: true }));
    try {
      const res = await axios.post(`${BASE_URL}/api/social-media/extract`, { url, leadId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success && res.data.data) {
        const { socials, emails, count } = res.data.data;
        setSocialData(prev => ({ ...prev, [leadId]: socials }));
        setEmailData(prev => ({ ...prev, [leadId]: emails }));
        
        if (count > 0) {
          message.success(`Found ${count} profiles/emails!`);
        } else {
          message.info('No profiles or emails found');
        }
      }
    } catch (error) {
      console.error('Extraction error:', error);
      message.error('Failed to extract social media profiles');
    } finally {
      setExtractingSocial(prev => ({ ...prev, [leadId]: false }));
    }
  };

  const extractAllSocials = async () => {
    if (!isAuthorized) {
      setLockedFeature('Bulk Social Media Extraction');
      setIsLockedModalOpen(true);
      return;
    }
    const leadsWithWebsite = filteredData.filter(item =>
      item.website && 
      !socialData[item.leadId] && 
      (!item.socialMedia || !Object.values(item.socialMedia || {}).some(Boolean)) &&
      (!item.emails || item.emails.length === 0)
    );

    if (leadsWithWebsite.length === 0) {
      message.warning('No new websites to extract from');
      return;
    }

    setExtractingAllSocial(true);
    setBulkProgress({
      isOpen: true,
      type: 'social',
      title: 'Global Social & Email Discovery',
      total: leadsWithWebsite.length,
      success: 0,
      failed: 0,
      extraLabel: 'Total Items Found',
      extraCount: 0,
      isProcessing: true
    });

    let successCount = 0;
    let failedCount = 0;
    let totalItemsFound = 0;

    const newSocialData = { ...socialData };
    const newEmailData = { ...emailData };

    try {
      for (let i = 0; i < leadsWithWebsite.length; i++) {
        const item = leadsWithWebsite[i];
        
        try {
          const res = await axios.post(`${BASE_URL}/api/social-media/extract`, { 
            url: item.website, 
            leadId: item.leadId 
          }, {
            headers: { Authorization: `Bearer ${token}` }
          });

          if (res.data.success && res.data.data) {
            const { socials, emails, count } = res.data.data;
            newSocialData[item.leadId] = socials;
            newEmailData[item.leadId] = emails;
            totalItemsFound += count;
            successCount++;

            // Update UI/Cache immediately
            setSocialData({ ...newSocialData });
            setEmailData({ ...newEmailData });
          } else {
            failedCount++;
          }
        } catch (err) {
          console.error(`Failed to extract from ${item.website}:`, err);
          failedCount++;
        }

        // Update Progress
        setBulkProgress(prev => ({
          ...prev,
          success: successCount,
          failed: failedCount,
          extraCount: totalItemsFound
        }));
      }

      message.success(`Discovery complete! Found ${totalItemsFound} items.`);
      
      // Track Lead Enrichment (Socials/Emails)
      trackMetaEvent('Lead', {
        content_name: 'Social & Email Discovery',
        content_category: 'Lead Enrichment',
        value: totalItemsFound
      });

      fetchRecord(true);
    } catch (error) {
      console.error('Bulk extraction loop error:', error);
      message.error('Bulk extraction encountered an issue.');
    } finally {
      setExtractingAllSocial(false);
      setBulkProgress(prev => ({ ...prev, isProcessing: false }));
    }
  };

  const fetchRecord = async (force = false) => {
    if (!operationId) {
      setLoading(false);
      return;
    }

    if (!record || force) {
       setLoading(true);
    }

    await fetchOperationDetails(operationId, force);
    setLoading(false);
  };

  const checkWhatsAppStatus = async () => {
    if (!isAuthorized) return null;
    try {
      const res = await axios.get(`${BASE_URL}/api/verification/status`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success && res.data.data) {
        const status = res.data.data;
        setWhatsappInitialized(status.isConnected);
        return status;
      }
    } catch (error) {
      console.error('WhatsApp status check failed:', error);
    }
    return null;
  };

  const disconnectWhatsApp = async () => {
    const userId = user?._id || user?.id;
    try {
      const res = await axios.post(`${BASE_URL}/api/verification/disconnect`, { userId }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        setWhatsappInitialized(false);
        setWhatsappStatus({});
        message.success('WhatsApp disconnected successfully. You can now link a different device.');
      }
    } catch (error) {
      console.error('Disconnect error:', error);
      message.error(error.response?.data?.error || 'Failed to disconnect WhatsApp');
    }
  };

  // Toggle favorite status for a data item
  const toggleFavorite = async (leadId, itemIndex, favorite) => {
    try {
      const res = await axios.post(`${BASE_URL}/api/data/toggle-favorite`, {
        recordId: record._id,
        leadId,
        itemIndex,
        favorite
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        // Update the local cache
        const updatedRecord = { ...record };
        updatedRecord.leads = record.leads.map((lead, idx) =>
          (lead._id === leadId || idx === itemIndex) ? { ...lead, favorite } : lead
        );
        updateOperationCache(operationId, { record: updatedRecord });
        message.success(favorite ? 'Added to favorites' : 'Removed from favorites');
        
        // Track Favorite Interaction
        if (favorite) {
            trackMetaEvent('Contact', { 
                content_name: 'Lead Favorited', 
                content_category: 'Lead Management' 
            });
        }
      }
    } catch (error) {
      console.error('Toggle favorite error:', error);
      message.error('Failed to update favorite status');
    }
  };

  useEffect(() => {
    if (!user || !token) return;

    const init = async () => {
      const status = await checkAccessStatus(user?._id || user?.id, token);
      setIsAuthorized(status.isAuthorized);

      fetchRecord();
      if (status.isAuthorized) {
        checkWhatsAppStatus();
      }
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [operationId, user, token]);
  
  // Navigation blocking logic
  useEffect(() => {
    const isBusy = verifyingAll || extractingCities || extractingAllSocial;
    setIsBlocking(isBusy);

    const handleBeforeUnload = (e) => {
      if (isBusy) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      // Clean up global state on unmount just in case
      setIsBlocking(false);
    };
  }, [verifyingAll, extractingCities, extractingAllSocial, setIsBlocking]);



  const handleEditClick = (lead) => {
    setEditingLead(lead);
    setIsEditModalOpen(true);
  };


  const handleDeleteClick = (lead) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this lead?',
      content: 'This action cannot be undone.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'No',
      centered: true,
      onOk: async () => {
        try {
          const res = await axios.delete(`${BASE_URL}/api/data/lead/${lead.leadId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.data.success) {
            message.success('Lead deleted successfully');
            setSelectedRowKeys((prev) => prev.filter((id) => id !== lead.leadId));
            adjustOperationCount(operationId, -1);
            fetchRecord(true);
          }
        } catch (error) {
          console.error('Delete error:', error);
          message.error(error.response?.data?.message || 'Failed to delete lead');
        }
      }
    });
  };

  const fetchDuplicatePreview = async () => {
    if (!operationId) return;
    setDuplicatesLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/data/record/${operationId}/duplicates`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        const data = res.data.data;
        if (!data.totalDuplicates) {
          message.info('No duplicate business names found in this operation');
          return;
        }
        setDuplicatePreview(data);
        setIsDuplicatesModalOpen(true);
      }
    } catch (error) {
      console.error('Duplicate preview error:', error);
      message.error(error.response?.data?.message || 'Failed to load duplicates');
    } finally {
      setDuplicatesLoading(false);
    }
  };

  const handleRemoveDuplicates = async () => {
    if (!operationId || !duplicatePreview?.totalDuplicates) return;

    setRemovingDuplicates(true);
    try {
      const res = await axios.delete(`${BASE_URL}/api/data/record/${operationId}/duplicates`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        const removed = res.data.removedCount || 0;
        message.success(removed > 0 ? `Removed ${removed} duplicate lead(s)` : 'No duplicates to remove');
        if (removed > 0) {
          adjustOperationCount(operationId, -removed);
          await fetchRecord(true);
        }
        setIsDuplicatesModalOpen(false);
        setDuplicatePreview(null);
      }
    } catch (error) {
      console.error('Remove duplicates error:', error);
      message.error(error.response?.data?.message || 'Failed to remove duplicates');
    } finally {
      setRemovingDuplicates(false);
    }
  };

  const duplicateTableRows = useMemo(() => {
    if (!duplicatePreview?.duplicateGroups?.length) return [];
    return duplicatePreview.duplicateGroups.flatMap((group) =>
      group.items.map((item) => ({
        key: item._id,
        title: item.title,
        phone: item.phone || '—',
        city: item.city || '—',
        createdAt: item.createdAt ? new Date(item.createdAt).toLocaleString() : '—',
        status: item.willKeep ? 'keep' : 'remove',
        groupCount: group.count,
      }))
    );
  }, [duplicatePreview]);

  const formatPhoneNumber = (phone, contextHint) =>
    formatPhoneUtil(phone, contextHint ?? record?.searchString ?? '');

  const persistLeadWhatsAppStatus = async (leadId, normalizedPhone, status) => {
    if (!isMongoLeadId(leadId)) {
      throw new Error('Cannot save verification: lead ID is missing. Try refreshing the operation.');
    }

    const saveRes = await axios.post(
      `${BASE_URL}/api/data/update-whatsapp-status`,
      { leadId, whatsappStatus: status },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!saveRes.data?.success) {
      throw new Error(saveRes.data?.message || 'Failed to save WhatsApp status');
    }

    setWhatsappStatus((prev) => ({ ...prev, [normalizedPhone]: status }));

    if (record?.leads?.length) {
      const leadIdStr = String(leadId);
      const updatedRecord = {
        ...record,
        leads: record.leads.map((lead) =>
          String(lead._id) === leadIdStr ? { ...lead, whatsappStatus: status } : lead
        ),
      };
      updateOperationCache(operationId, { record: updatedRecord });
    }
  };

  const handleVerifyPhoneClick = (phone, leadId) => {
    if (!whatsappInitialized) {
      message.error('Please connect WhatsApp by scanning the QR code first');
      setIsConnectModalOpen(true);
      return;
    }
    verifyWhatsAppNumber(phone, { leadId });
  };

  const verifyWhatsAppNumber = async (phone, options = {}) => {
    const { silent = false, formattedNumber, leadId } = options;

    if (!phone) {
      if (!silent) message.warning('No phone number available');
      return;
    }

    const normalized = formattedNumber || formatPhoneNumber(phone, record?.searchString || '');

    if (!whatsappInitialized) {
      if (!silent) message.error('Please connect WhatsApp by scanning the QR code first');
      return;
    }

    if (!normalized || normalized === '+') {
      if (!silent) message.warning('Invalid phone number format');
      return;
    }

    if (verifyingPhone === normalized) return;

    setVerifyingPhone(normalized);

    try {
      const res = await axios.post(`${BASE_URL}/api/verification/check`, {
        userId: user?._id || user?.id,
        phoneNumbers: [normalized],
        operationId: operationId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success && res.data.data) {
        const result = res.data.data.results[0];

        if (!result?.success) {
          const errMsg = result?.error || 'Verification failed';
          if (!silent) message.error(errMsg);
          return;
        }

        const isRegistered = result.isRegistered;
        const status = isRegistered ? 'verified' : 'not-verified';

        await persistLeadWhatsAppStatus(leadId, normalized, status);

        if (!silent) {
          if (isRegistered) message.success('WhatsApp number verified!');
          else message.info('Number does not have WhatsApp');
        }
      } else {
        const errorMessage = res.data.error || 'Failed to verify WhatsApp number';
        if (!silent) message.error(errorMessage);
      }
    } catch (error) {
      const backendMessage = error.response?.data?.error || error.message;
      console.error('Verification error:', backendMessage);
      if (!silent) message.error(`Failed to verify WhatsApp number: ${backendMessage}`);
    } finally {
      setVerifyingPhone((current) => (current === normalized ? null : current));
    }
  };

  const verifyAllNumbers = async (phoneNumbers) => {
    if (!isAuthorized) {
      setLockedFeature('Bulk WhatsApp Verification');
      setIsLockedModalOpen(true);
      return;
    }

    if (!whatsappInitialized) {
      message.error('Please connect WhatsApp first');
      return;
    }

    if (!phoneNumbers || phoneNumbers.length === 0) {
      message.warning('No phone numbers to verify');
      return;
    }

    // Filter out already verified numbers and format
    const formattedList = [...new Set(phoneNumbers)]
      .filter(phone => {
        const formatted = formatPhoneNumber(phone);
        // Skip if already verified in cache
        return formatted && !whatsappStatus[phone];
      })
      .map(phone => formatPhoneNumber(phone))
      .filter(Boolean);

    if (formattedList.length === 0) {
      message.info('All numbers already verified');
      return;
    }

    const phoneToLeadId = new Map();
    filteredData.forEach((row) => {
      if (!row.phone || !isMongoLeadId(row.leadId)) return;
      const formatted = formatPhoneNumber(row.phone);
      if (formatted) phoneToLeadId.set(formatted, row.leadId);
      phoneToLeadId.set(row.phone, row.leadId);
    });

    const BATCH_SIZE = 10;
    const totalBatches = Math.ceil(formattedList.length / BATCH_SIZE);

    message.info(`Verifying ${formattedList.length} numbers in ${totalBatches} batches...`);
    setVerifyingAll(true);
    setBulkProgress({
      isOpen: true,
      type: 'whatsapp',
      title: `Verifying... (Batch 1/${totalBatches})`,
      total: formattedList.length,
      success: 0,
      failed: 0,
      extraLabel: 'Verified Numbers',
      extraCount: 0,
      isProcessing: true
    });

    let totalSuccessful = 0;
    let totalFailed = 0;

    try {
      for (let i = 0; i < formattedList.length; i += BATCH_SIZE) {
        const batch = formattedList.slice(i, i + BATCH_SIZE);
        const currentBatchNum = Math.floor(i / BATCH_SIZE) + 1;

        // Update progress title for each batch
        setBulkProgress(prev => ({
          ...prev,
          title: `Verifying... (Batch ${currentBatchNum}/${totalBatches})`
        }));

        const res = await axios.post(`${BASE_URL}/api/verification/check`, {
          userId: user?._id || user?.id,
          phoneNumbers: batch,
          operationId: operationId
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.data.success && res.data.data) {
          const { results, successful, failed } = res.data.data;
          totalSuccessful += successful;
          totalFailed += failed;

          const newStatus = {};
          for (const result of results) {
            const phone = result.phoneNumber;
            if (!result.success) continue;

            const status = result.isRegistered ? 'verified' : 'not-verified';
            newStatus[phone] = status;

            const leadId = phoneToLeadId.get(phone);
            if (leadId) {
              try {
                await persistLeadWhatsAppStatus(leadId, phone, status);
              } catch (saveErr) {
                console.error(`Failed to save status for ${phone}:`, saveErr);
              }
            }
          }

          if (Object.keys(newStatus).length > 0) {
            setWhatsappStatus((prev) => ({ ...prev, ...newStatus }));
          }
          setBulkProgress(prev => ({
            ...prev,
            success: totalSuccessful,
            failed: totalFailed,
            extraCount: totalSuccessful
          }));
        }

        // Delay between batches to prevent rate limiting
        if (i + BATCH_SIZE < formattedList.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      message.success(`Verified ${totalSuccessful} numbers successfully. ${totalFailed} failed.`);
      setBulkProgress(prev => ({
        ...prev,
        title: 'WhatsApp Verification Complete',
        isProcessing: false
      }));

      // Refresh record to get updated whatsappStatus from database
      await fetchRecord();

      // Track Verification Event
      trackMetaEvent('Contact', {
        content_name: 'Bulk WhatsApp Verification',
        content_category: 'Verification',
        value: totalSuccessful
      });
    } catch (error) {
      console.error('Batch verification error:', error);
      message.error('Failed to verify numbers: ' + (error.response?.data?.error || error.message));
    } finally {
      setVerifyingAll(false);
    }
  };

  const flattenedData = useMemo(
    () =>
      record
        ? flattenLeads(record, {
            cityData,
            whatsappStatus,
            screenshotData,
            emailData,
            socialData,
            formatPhone: (phone) => formatPhoneNumber(phone, record.searchString),
          })
        : [],
    [record, cityData, whatsappStatus, screenshotData, emailData, socialData]
  );

  const verificationStats = useMemo(() => computeVerificationStats(flattenedData), [flattenedData]);

  const filteredData = useMemo(() => filterLeads(flattenedData, filters), [flattenedData, filters]);

  const selectableLeadIds = useMemo(
    () => filteredData.filter((row) => isMongoLeadId(row.leadId)).map((row) => row.leadId),
    [filteredData]
  );

  const rowSelection = useMemo(
    () => ({
      selectedRowKeys,
      onChange: (keys) => setSelectedRowKeys(keys),
      preserveSelectedRowKeys: true,
      getCheckboxProps: (record) => ({
        disabled: !isMongoLeadId(record.leadId),
      }),
    }),
    [selectedRowKeys]
  );

  const handleSelectAllFiltered = () => {
    setSelectedRowKeys(selectableLeadIds);
  };

  const handleBulkDelete = () => {
    const leadIds = selectedRowKeys.filter((id) => isMongoLeadId(id));
    if (leadIds.length === 0) {
      message.warning('Select at least one lead to delete');
      return;
    }

    Modal.confirm({
      title: `Delete ${leadIds.length} selected lead${leadIds.length !== 1 ? 's' : ''}?`,
      content: 'This action cannot be undone.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      centered: true,
      onOk: async () => {
        setBulkDeleting(true);
        try {
          const res = await axios.post(
            `${BASE_URL}/api/data/leads/bulk-delete`,
            { leadIds },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (res.data.success) {
            const removed = res.data.deletedCount ?? leadIds.length;
            message.success(res.data.message || `Deleted ${removed} lead(s)`);
            setSelectedRowKeys([]);
            adjustOperationCount(operationId, -removed);
            await fetchRecord(true);
          }
        } catch (error) {
          console.error('Bulk delete error:', error);
          message.error(error.response?.data?.message || 'Failed to delete selected leads');
        } finally {
          setBulkDeleting(false);
        }
      },
    });
  };

  const tableScrollY = useMemo(
    () => calcTableScrollY(filteredData.length, pageSize, currentPage, viewportHeight),
    [filteredData.length, pageSize, currentPage, viewportHeight]
  );

  const exportContext = useMemo(
    () => buildExportRows(filteredData, { record, cityData, emailData, whatsappStatus, formatPhone: formatPhoneNumber }),
    [filteredData, record, cityData, emailData, whatsappStatus]
  );

  const normalizeFieldValue = (field, item) => {
    const value = exportContext.normalizeFieldValue(field, item);
    if (value === null || value === undefined) return '';
    if ((field.key === 'createdAt' || field.key === 'updatedAt') && value) {
      const date = new Date(value);
      if (!Number.isNaN(date.getTime())) return date.toLocaleString();
    }
    return String(value);
  };

  const exportToCSV = () => {
    if (!isAuthorized) {
      setLockedFeature('CSV Export');
      setIsLockedModalOpen(true);
      return;
    }
    if (!filteredData.length) {
      message.warning('No data to export');
      return;
    }

    const header = EXPORT_FIELDS.map(field => field.label).join(',');
    const rows = filteredData.map(item =>
      EXPORT_FIELDS.map(field => {
        const value = normalizeFieldValue(field, item);
        if (value.includes('"') || value.includes(',') || value.includes('\n')) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    );

    const csvContent = [header, ...rows].join('\n');
    const timestamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0];
    downloadFile(`\ufeff${csvContent}`, 'text/csv;charset=utf-8;', `csv`, `${getFileBaseName(record)}-${timestamp}`);
    message.success('CSV export ready');

    // Track Export Event
    trackMetaCustomEvent('DataExportCSV', {
      content_name: 'CSV Export',
      content_category: 'Data Export',
      value: filteredData.length
    });
  };

  const exportToXLS = () => {
    if (!isAuthorized) {
      setLockedFeature('XLS Export');
      setIsLockedModalOpen(true);
      return;
    }
    if (!filteredData.length) {
      message.warning('No data to export');
      return;
    }

    const headerHtml = EXPORT_FIELDS
      .map(field => `<th>${escapeHtml(field.label)}</th>`)
      .join('');

    const rowsHtml = filteredData
      .map(item => {
        const cells = EXPORT_FIELDS
          .map(field => `<td>${escapeHtml(normalizeFieldValue(field, item))}</td>`)
          .join('');
        return `<tr>${cells}</tr>`;
      })
      .join('');

    const htmlContent = `<table><thead><tr>${headerHtml}</tr></thead><tbody>${rowsHtml}</tbody></table>`;
    const timestamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0];
    downloadFile(`\ufeff${htmlContent}`, 'application/vnd.ms-excel', `xls`, `${getFileBaseName(record)}-${timestamp}`);
    message.success('XLS export ready');

    // Track Export Event
    trackMetaCustomEvent('DataExportXLS', {
      content_name: 'XLS Export',
      content_category: 'Data Export',
      value: filteredData.length
    });
  };

  // Screenshot queue helpers are intentionally kept out of the UI for now.

  const handleVerifyAllClick = async () => {
    const numbers = [...new Set(
      filteredData
        .map(item => item.phone)
        .filter(Boolean)
    )];

    if (numbers.length === 0) {
      message.warning('No phone numbers available to verify');
      return;
    }

    setVerifyingAll(true);
    try {
      await verifyAllNumbers(numbers);
    } finally {
      setVerifyingAll(false);
    }
  };

  const columns = useLeadsTableColumns({
    currentPage,
    pageSize,
    screenshotData,
    extractingSocial,
    extractSocialsForLead,
    extractAllSocials,
    extractingAllSocial,
    isAuthorized,
    setLockedFeature,
    setIsLockedModalOpen,
    setSelectedLeadForStack,
    setIsStackModalOpen,
    formatPhoneNumber,
    whatsappStatus,
    handleVerifyPhoneClick,
    verifyingPhone,
    whatsappInitialized,
    handleVerifyAllClick,
    verifyingAll,
    adsAnalysisResults,
    handleAnalyzeAllClick,
    analyzingAds,
    toggleFavorite,
    handleEditClick,
    handleDeleteClick,
  });

  if (loading) {
    return <Loader />;
  }

  if (!record) {
    return <OperationNotFound onBack={() => navigate('/dashboard/operations')} />;
  }

  const lockFeature = (name) => {
    setLockedFeature(name);
    setIsLockedModalOpen(true);
  };
  return (
    <div className="space-y-6">
      {/* Premium Header Section */}
      <OperationDetailHeader
        record={record}
        verificationStats={verificationStats}
        loading={loading}
        onBack={() => navigate('/dashboard/operations')}
        onRefresh={fetchRecord}
      >
        <div className="p-6 md:p-8 pt-0">
          <OperationDetailToolbar
            record={record}
            filteredData={filteredData}
            isAuthorized={isAuthorized}
            onLockFeature={lockFeature}
            onExtractAllSocials={extractAllSocials}
            extractingAllSocial={extractingAllSocial}
            onOpenCarousel={() => setIsCarouselOpen(true)}
            onAnalyzeAds={handleAnalyzeAllClick}
            analyzingAds={analyzingAds}
            onRecommendCities={getRecommendedCities}
            loadingRecommendations={loadingRecommendations}
            onExtractCities={extractCitiesForRecord}
            extractingCities={extractingCities}
            onSaveQualified={() => setIsQualifiedLeadsModalOpen(true)}
            onExportCsv={exportToCSV}
            onExportXls={exportToXLS}
            onImportCsv={() => setIsImportModalOpen(true)}
            onRemoveDuplicates={fetchDuplicatePreview}
            duplicatesLoading={duplicatesLoading}
            onExportTeam={() => setIsExportTeamModalOpen(true)}
            onVerifyAll={handleVerifyAllClick}
            verifyingAll={verifyingAll}
          />
        </div>
      </OperationDetailHeader>

      <OperationWhatsAppBanner
        connected={whatsappInitialized}
        onDisconnect={disconnectWhatsApp}
        onConnect={() => setIsConnectModalOpen(true)}
        isAuthorized={isAuthorized}
        onLockFeature={lockFeature}
      />

      <WhatsAppConnectModal
        visible={isConnectModalOpen}
        onCancel={() => setIsConnectModalOpen(false)}
        onConnected={() => {
          setWhatsappInitialized(true);
          setIsConnectModalOpen(false); // Close modal on success
          checkWhatsAppStatus(); // Double check status
        }}
        onDisconnected={() => {
          setWhatsappInitialized(false);
          checkWhatsAppStatus();
        }}
      />

      <SaveNumbersModal
        visible={isSaveModalOpen}
        onCancel={() => setIsSaveModalOpen(false)}
        filteredData={filteredData}
        userId={user?._id || user?.id}
        operationId={operationId}
        searchString={record?.searchString}
      />

      <SaveColdCallsModal
        visible={isColdCallModalOpen}
        onCancel={() => setIsColdCallModalOpen(false)}
        filteredData={filteredData}
        userId={user?._id || user?.id}
        operationId={operationId}
        searchString={record?.searchString}
      />

      <OperationCSVImport
        visible={isImportModalOpen}
        onCancel={() => setIsImportModalOpen(false)}
        userId={user?._id || user?.id}
        operationId={operationId}
        defaultSearchString={record?.searchString ? `${record.searchString} (Import)` : ''}
        onSuccess={({ imported }) => {
           // Bump the count in the operations list by however many were actually imported
           if (imported > 0) adjustOperationCount(operationId, imported);
           fetchRecord(true);
        }}
      />

      <EditLeadModal
        visible={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        lead={editingLead}
        token={token}
        onSuccess={() => {
          setIsEditModalOpen(false);
          fetchRecord(true);
        }}
      />

      <SaveQualifiedLeadsModal
        visible={isQualifiedLeadsModalOpen}
        onCancel={() => setIsQualifiedLeadsModalOpen(false)}
        filteredData={filteredData}
        filters={filters}
        userId={user?._id || user?.id}
        operationId={operationId}
        searchString={record?.searchString}
        cityData={cityData}
        whatsappStatus={whatsappStatus}
        formatPhoneNumber={formatPhoneNumber}
      />

      <OperationRecommendCitiesModal
        open={isRecommendModalOpen}
        onClose={() => setIsRecommendModalOpen(false)}
        recommendedCities={recommendedCities}
        onCopyLocation={copyRecommendedLocation}
      />

      <OperationDetailFilters filters={filters} setFilters={setFilters} />

      <OperationLeadsTable
        columns={columns}
        dataSource={filteredData}
        loading={loading}
        tableScrollY={tableScrollY}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={(page, size) => {
          setCurrentPage(page);
          setPageSize(size);
        }}
        rowSelection={rowSelection}
        selectedCount={selectedRowKeys.length}
        totalSelectable={selectableLeadIds.length}
        onSelectAllFiltered={handleSelectAllFiltered}
        onClearSelection={() => setSelectedRowKeys([])}
        onBulkDelete={handleBulkDelete}
        bulkDeleting={bulkDeleting}
      />

      <WebsiteCarouselViewer
        isOpen={isCarouselOpen}
        onClose={() => setIsCarouselOpen(false)}
        websites={filteredData
          .filter(item => item.website)
          .map(item => ({
            title: item.title,
            url: item.website,
            screenshotUrl: item.screenshotUrl || screenshotData[item.key],
            favorite: item.favorite,
            itemIndex: item.itemIndex,
            leadId: item.leadId,
            isRestricted: !isAuthorized
          }))}
        onToggleFavorite={(carouselIndex, favorite) => {
          const websitesWithIndex = filteredData.filter(item => item.website);
          const item = websitesWithIndex[carouselIndex];
          if (item) {
            toggleFavorite(item.leadId, item.itemIndex, favorite);
          }
        }}
      />

      <LinkedInInformation
        isOpen={isLinkedInModalOpen}
        onClose={() => {
          setIsLinkedInModalOpen(false);
          setSelectedLeadForLinkedIn(null);
        }}
        leadData={selectedLeadForLinkedIn}
      />

      <StackAnalysisModal 
        visible={isStackModalOpen}
        onCancel={() => {
          setIsStackModalOpen(false);
          setSelectedLeadForStack(null);
        }}
        url={selectedLeadForStack?.website}
        leadName={selectedLeadForStack?.title}
        token={token}
      />

      <ExportToTeamModal
        visible={isExportTeamModalOpen}
        onCancel={() => setIsExportTeamModalOpen(false)}
        leads={filteredData}
        userId={user?._id || user?.id}
        token={token}
        onSuccess={() => {
          message.success('Leads successfully exported to team');
        }}
      />


      <Notes operationId={operationId} />

      <SubscriptionRestrictedModal
        open={isLockedModalOpen}
        onClose={() => setIsLockedModalOpen(false)}
        featureName={lockedFeature}

      />

      <OperationBulkProgressModal
        bulkProgress={bulkProgress}
        setBulkProgress={setBulkProgress}
        adsAnalysisResults={adsAnalysisResults}
        flattenedData={flattenedData}
      />

      <OperationDuplicatesModal
        open={isDuplicatesModalOpen}
        onClose={() => {
          if (removingDuplicates) return;
          setIsDuplicatesModalOpen(false);
          setDuplicatePreview(null);
        }}
        duplicatePreview={duplicatePreview}
        duplicateTableRows={duplicateTableRows}
        removingDuplicates={removingDuplicates}
        onRemove={handleRemoveDuplicates}
      />
    </div>
  );

};

export default OperationDetailPage;
