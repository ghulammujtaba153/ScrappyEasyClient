import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import WhatsAppConnectModal from '../../components/dashboard/WhatsAppConnectModal';
import SaveNumbersModal from '../../components/dashboard/SaveNumbersModal';
import {
  Alert,
  Button,
  InputNumber,
  Input,
  Select,
  Space,
  Table,
  Tag,
  Modal,
  Spin,
  message
} from 'antd';
import {
  MdArrowBack,
  MdCheckCircle,
  MdDownload,
  MdOpenInNew,
  MdDescription,
  MdRefresh,
  MdClose,
  MdSave,
  MdPhone,
  MdCameraAlt,
  MdImage,
  MdSearch,
  MdWeb,
  MdLocationOn
} from 'react-icons/md';
import { BsWhatsapp } from 'react-icons/bs';
import axios from 'axios';
import { QRCodeCanvas } from 'qrcode.react';
import { BASE_URL } from '../../config/URL';
import { useAuth } from '../../context/authContext';
import { useOperations } from '../../context/operationsContext';
import { useScreenshot } from '../../context/screenshotContext';
import Notes from '../../components/dashboard/Notes';
import SaveColdCallsModal from '../../components/dashboard/SaveColdCallsModal';
import ScreenshotViewer from '../../components/dashboard/ScreenshotViewer';
import WebsiteCarouselViewer from '../../components/dashboard/WebsiteCarouselViewer';

const { Option } = Select;

const defaultFilters = {
  countries: [],
  states: [],
  cities: [],
  whatsappStatus: '',
  ratingMin: null,
  ratingMax: null,
  reviewsMin: null,
  reviewsMax: null,
  hasWebsite: '',
  hasPhone: ''
};

const EXPORT_FIELDS = [
  { key: 'searchString', label: 'Search Query' },
  { key: 'title', label: 'Business Name' },
  { key: 'rating', label: 'Rating' },
  { key: 'reviews', label: 'Reviews' },
  { key: 'phone', label: 'Phone' },
  { key: 'address', label: 'Address' },
  { key: 'city', label: 'City/Location' },
  { key: 'website', label: 'Website' },
  { key: 'googleMapsLink', label: 'Google Maps' },
  { key: 'createdAt', label: 'Scraped Date' },
  { key: 'whatsappStatus', label: 'WhatsApp Status' }
];

const OperationDetailPage = () => {
  const { operationId } = useParams();
  const navigate = useNavigate();
  const { token, user } = useAuth();

  // Use context for data persistence
  const { fetchOperationDetails, updateOperationCache, operationCache } = useOperations();

  const cachedData = operationCache[operationId] || {};
  const record = cachedData.record || null;
  const cityData = cachedData.cityData || {};
  const screenshotData = cachedData.screenshotData || {};
  const whatsappStatus = cachedData.whatsappStatus || {};

  const { addToQueue, queue, progress } = useScreenshot();

  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ ...defaultFilters });

  // WhatsApp Connection State
  const [whatsappInitialized, setWhatsappInitialized] = useState(false);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isColdCallModalOpen, setIsColdCallModalOpen] = useState(false);
  // Carousel State
  const [isCarouselOpen, setIsCarouselOpen] = useState(false);

  const [verifyingAll, setVerifyingAll] = useState(false);

  const [extractingCities, setExtractingCities] = useState(false);

  // Recommend Cities State
  const [recommendedCities, setRecommendedCities] = useState([]);
  const [isRecommendModalOpen, setIsRecommendModalOpen] = useState(false);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);

  // Wrapper setters to update cache (mimicking local state setters)
  const setCityData = (newData) => {
    const data = typeof newData === 'function' ? newData(cityData) : newData;
    updateOperationCache(operationId, { cityData: data });
  };

  const setWhatsappStatus = (newData) => {
    const data = typeof newData === 'function' ? newData(whatsappStatus) : newData;
    updateOperationCache(operationId, { whatsappStatus: data });
  };

  // Extract coordinates from Google Maps URL
  const extractCoordinates = (url) => {
    if (!url) return null;

    const patterns = [
      /@(-?\d+\.\d+),(-?\d+\.\d+)/,
      /!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return {
          lat: parseFloat(match[1]),
          lon: parseFloat(match[2])
        };
      }
    }

    return null;
  };

  // Get city name from coordinates using OpenStreetMap Nominatim
  const getCityFromCoordinates = async (lat, lon) => {
    const apiUrl = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;

    console.log(`   📍 Querying OpenStreetMap for coordinates: ${lat}, ${lon}`);

    try {
      const response = await fetch(apiUrl, {
        headers: {
          'User-Agent': 'GoldScraper/1.0'
        }
      });

      if (!response.ok) {
        console.log(`   ⚠️ API returned status ${response.status}`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data && data.address) {
        const address = data.address;
        const city = address.city ||
          address.town ||
          address.county ||
          address.state_district ||
          address.state ||
          address.country ||
          'Unknown';

        console.log(`   ✓ Resolved to: ${city} (from ${address.city ? 'city' : address.town ? 'town' : address.county ? 'county' : address.state_district ? 'state' : address.state ? 'state' : 'country'})`);
        return city;
      }

      console.log(`   ⚠️ No address data in response`);
      return 'Unknown';
    } catch (error) {
      console.error(`   ❌ City lookup error for ${lat}, ${lon}:`, error.message);
      return 'Unknown';
    }
  };

  // Extract city from Google Maps URL
  const extractCityFromUrl = async (url) => {
    const coords = extractCoordinates(url);
    if (!coords) return null;

    const city = await getCityFromCoordinates(coords.lat, coords.lon);
    return city;
  };

  // Get recommended nearby cities based on Google Maps coordinates in data
  const getRecommendedCities = async () => {
    if (!record || !record.data) {
      message.warning('No data available to analyze');
      return;
    }

    setLoadingRecommendations(true);
    
    try {
      // Collect all coordinates from Google Maps links
      const allCoords = [];
      record.data.forEach((item) => {
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

  // Extract cities for all items in record
  const extractCitiesForRecord = async () => {
    if (!record || !record.data) return;

    setExtractingCities(true);
    const newCityData = { ...cityData };
    let updated = false;
    const totalItems = record.data.length;
    let processedCount = 0;
    let skippedCount = 0;
    let successCount = 0;
    let failedCount = 0;

    console.log(`🏙️ Starting city extraction for ${totalItems} items...`);

    try {
      for (let i = 0; i < record.data.length; i++) {
        const item = record.data[i];
        const itemKey = `${record._id}-${i}`;

        // Skip if city already extracted
        if (newCityData[itemKey]) {
          skippedCount++;
          console.log(`⏭️ [${i + 1}/${totalItems}] Skipping - City already cached: ${newCityData[itemKey]}`);
          continue;
        }

        if (item.googleMapsLink) {
          processedCount++;
          console.log(`🔍 [${i + 1}/${totalItems}] Extracting city from: ${item.title || 'Unknown business'}`);

          const city = await extractCityFromUrl(item.googleMapsLink);

          if (city && city !== 'Unknown') {
            newCityData[itemKey] = city;
            updated = true;
            successCount++;
            console.log(`✅ [${i + 1}/${totalItems}] Found city: ${city}`);

            // Update UI immediately (via context cache)
            setCityData({ ...newCityData });
          } else {
            failedCount++;
            console.log(`❌ [${i + 1}/${totalItems}] Failed to extract city`);
          }

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
        // Save to backend
        const cityDataToSave = {};
        Object.entries(newCityData).forEach(([key, city]) => {
          const index = key.split('-')[1];
          cityDataToSave[index] = city;
        });

        await axios.post(`${BASE_URL}/api/data/update-city`, {
          recordId: record._id,
          cityData: cityDataToSave
        });

        // Final update to cache
        setCityData(newCityData);

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
      console.log(`🏁 City extraction process completed\n`);
    }
  };

  const fetchRecord = async () => {
    if (!operationId) {
      return;
    }

    setLoading(true);
    await fetchOperationDetails(operationId);
    setLoading(false);
  };

  const checkWhatsAppStatus = async () => {
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
    try {
      const res = await axios.post(`${BASE_URL}/api/verification/disconnect`, {}, {
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

  useEffect(() => {
    fetchRecord();
    checkWhatsAppStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [operationId]);



  const formatPhoneNumber = (phone) => {
    if (!phone) return null;
    const digits = phone.replace(/\D/g, '');
    if (!digits) return null;
    return `+${digits}`;
  };

  const verifyWhatsAppNumber = async (phone, options = {}) => {
    const { silent = false, formattedNumber } = options;

    if (!phone) {
      if (!silent) {
        message.warning('No phone number available');
      }
      return;
    }

    if (!whatsappInitialized) {
      if (!silent) {
        message.error('Please connect WhatsApp by scanning the QR code first');
      }
      setWhatsappStatus(prev => ({ ...prev, [formatPhoneNumber(phone)]: 'unknown' }));
      return;
    }

    const normalized = formattedNumber || formatPhoneNumber(phone);

    // Verify WhatsApp Number - use normalized phone as key
    if (!normalized) {
      if (!silent) {
        message.warning('Invalid phone number format');
      }
      setWhatsappStatus(prev => ({ ...prev, [formatPhoneNumber(phone)]: 'unknown' }));
      return;
    }

    setWhatsappStatus(prev => ({ ...prev, [normalized]: 'checking' }));

    try {
      const res = await axios.post(`${BASE_URL}/api/verification/check`, {
        phoneNumbers: [normalized],
        operationId: operationId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success && res.data.data) {
        const result = res.data.data.results[0];
        const isRegistered = result?.isRegistered;
        const status = isRegistered ? 'verified' : 'not-verified';

        setWhatsappStatus(prev => ({ ...prev, [normalized]: status }));

        if (!silent) {
          if (isRegistered) {
            message.success('WhatsApp number verified!');
          } else {
            message.info('Number does not have WhatsApp');
          }
        }
      } else {
        const errorMessage = res.data.error || 'Failed to verify WhatsApp number';
        setWhatsappStatus(prev => ({ ...prev, [normalized]: 'unknown' }));
        if (!silent) {
          message.error(errorMessage);
        }
      }
    } catch (error) {
      const backendMessage = error.response?.data?.error || error.message;
      console.error('Verification error:', backendMessage);
      setWhatsappStatus(prev => ({ ...prev, [phone]: 'failed' }));
      if (!silent) {
        message.error(`Failed to verify WhatsApp number: ${backendMessage}`);
      }
    }
  };

  const verifyAllNumbers = async (phoneNumbers) => {
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

    message.info(`Verifying ${formattedList.length} phone numbers...`);
    setVerifyingAll(true);

    try {
      // Send batch request with operationId
      const res = await axios.post(`${BASE_URL}/api/verification/check`, {
        phoneNumbers: formattedList,
        operationId: operationId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success && res.data.data) {
        const { results, successful, failed } = res.data.data;

        // Update status for all results
        const newStatus = {};
        results.forEach(result => {
          const phone = result.phoneNumber;
          if (result.success) {
            newStatus[phone] = result.isRegistered ? 'verified' : 'not-verified';
          } else {
            newStatus[phone] = 'failed';
          }
        });

        setWhatsappStatus(prev => ({ ...prev, ...newStatus }));
        message.success(`Verified ${successful} numbers successfully. ${failed} failed.`);
      }
    } catch (error) {
      console.error('Batch verification error:', error);
      message.error('Failed to verify numbers: ' + (error.response?.data?.error || error.message));
    } finally {
      setVerifyingAll(false);
    }
  };

  const flattenedData = useMemo(() => {
    if (!record?.data) {
      return [];
    }

    return record.data.map((item, index) => ({
      key: `${record._id}-${index}`,
      recordId: record._id,
      searchString: record.searchString,
      createdAt: record.createdAt,
      ...item
    }));
  }, [record]);

  // Calculate verification statistics
  const verificationStats = useMemo(() => {
    const phonesWithNumbers = flattenedData.filter(item => item.phone);
    const uniquePhones = new Set(phonesWithNumbers.map(item => formatPhoneNumber(item.phone)).filter(Boolean));

    let verified = 0;
    let notVerified = 0;
    let notChecked = 0;

    uniquePhones.forEach(phone => {
      const status = whatsappStatus[phone];
      if (status === 'verified') verified++;
      else if (status === 'not-verified') notVerified++;
      else notChecked++;
    });

    return {
      total: uniquePhones.size,
      verified,
      notVerified,
      notChecked
    };
  }, [flattenedData, whatsappStatus]);



  const filteredData = useMemo(() => {
    if (!flattenedData.length) {
      return [];
    }

    let filtered = [...flattenedData];



    if (filters.countries.length > 0) {
      filtered = filtered.filter(item =>
        filters.countries.some(country => {
          const lowerCountry = country.toLowerCase();
          return item.searchString?.toLowerCase().includes(lowerCountry) ||
            item.address?.toLowerCase().includes(lowerCountry);
        })
      );
    }

    if (filters.states.length > 0) {
      filtered = filtered.filter(item =>
        filters.states.some(state => {
          const lowerState = state.toLowerCase();
          return item.searchString?.toLowerCase().includes(lowerState) ||
            item.address?.toLowerCase().includes(lowerState);
        })
      );
    }

    if (filters.cities.length > 0) {
      filtered = filtered.filter(item =>
        filters.cities.some(city => {
          const lowerCity = city.toLowerCase();
          return item.searchString?.toLowerCase().includes(lowerCity) ||
            item.address?.toLowerCase().includes(lowerCity);
        })
      );
    }

    if (filters.whatsappStatus) {
      filtered = filtered.filter(item => {
        const status = whatsappStatus[formatPhoneNumber(item.phone)];
        if (filters.whatsappStatus === 'verified') {
          return status === 'verified';
        } else if (filters.whatsappStatus === 'not-verified') {
          return status === 'not-verified';
        } else if (filters.whatsappStatus === 'not-checked') {
          return !status || status === 'unknown';
        }
        return true;
      });
    }

    if (filters.ratingMin !== null) {
      filtered = filtered.filter(item => {
        const rating = parseFloat(item.rating);
        return !Number.isNaN(rating) && rating >= filters.ratingMin;
      });
    }

    if (filters.ratingMax !== null) {
      filtered = filtered.filter(item => {
        const rating = parseFloat(item.rating);
        return !Number.isNaN(rating) && rating <= filters.ratingMax;
      });
    }

    if (filters.reviewsMin !== null) {
      filtered = filtered.filter(item => {
        const reviews = parseInt(item.reviews, 10);
        return !Number.isNaN(reviews) && reviews >= filters.reviewsMin;
      });
    }

    if (filters.reviewsMax !== null) {
      filtered = filtered.filter(item => {
        const reviews = parseInt(item.reviews, 10);
        return !Number.isNaN(reviews) && reviews <= filters.reviewsMax;
      });
    }

    if (filters.hasWebsite) {
      filtered = filtered.filter(item => {
        const hasWebsite = !!item.website;
        return filters.hasWebsite === 'yes' ? hasWebsite : !hasWebsite;
      });
    }

    if (filters.hasPhone) {
      filtered = filtered.filter(item => {
        const hasPhone = !!item.phone;
        return filters.hasPhone === 'yes' ? hasPhone : !hasPhone;
      });
    }

    return filtered;
  }, [flattenedData, filters, whatsappStatus]);

  const getWhatsappStatusLabel = (phone) => {
    const status = whatsappStatus[formatPhoneNumber(phone)];
    if (status === 'verified') return 'Verified';
    if (status === 'not-verified') return 'Not Verified';
    if (status === 'failed') return 'Failed';
    if (status === 'checking') return 'Checking';
    return 'Not Checked';
  };

  const getFilteredPhoneNumbers = () => {
    return [...new Set(
      filteredData
        .map(item => item.phone)
        .filter(Boolean)
        .map(phone => formatPhoneNumber(phone))
        .filter(Boolean)
    )];
  };

  const getFileBaseName = () => {
    const raw = (record?.searchString || 'operation-data').toString().trim();
    const sanitized = raw
      .replace(/[^\x20-\x7E]+/g, '')
      .replace(/[^A-Za-z0-9\-\s_]/g, '')
      .replace(/\s+/g, '-')
      .toLowerCase();
    return sanitized || 'operation-data';
  };

  const getRawFieldValue = (field, item) => {
    if (field.key === 'whatsappStatus') {
      return getWhatsappStatusLabel(item.phone);
    }

    if (field.key === 'city') {
      return cityData[item.key] || '';
    }

    const value = item[field.key];
    if ((field.key === 'createdAt' || field.key === 'updatedAt') && value) {
      const date = new Date(value);
      if (!Number.isNaN(date.getTime())) {
        return date.toLocaleString();
      }
    }
    return value;
  };

  const normalizeFieldValue = (field, item) => {
    const value = getRawFieldValue(field, item);
    if (value === null || value === undefined) {
      return '';
    }
    return String(value);
  };

  const downloadFile = (content, mimeType, extension) => {
    const timestamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0];
    const fileName = `${getFileBaseName()}-${timestamp}.${extension}`;
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportToCSV = () => {
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
    downloadFile(`\ufeff${csvContent}`, 'text/csv;charset=utf-8;', 'csv');
    message.success('CSV export ready');
  };

  const escapeHtml = (value) => {
    const stringValue = value === null || value === undefined ? '' : String(value);
    return stringValue
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  };

  const exportToXLS = () => {
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
    downloadFile(`\ufeff${htmlContent}`, 'application/vnd.ms-excel', 'xls');
    message.success('XLS export ready');
  };

  const handleCapture = async (url, key) => {
    if (!url) return;

    addToQueue([{
      url,
      key,
      recordId: record._id,
      title: record.title // or item title if available, but key usually maps to index so title is harder to get here without looking up item?
      // Actually handleCapture is called with website and key. We'll rely on context logic.
    }], record._id);

    message.success('Added to capture queue');
  };

  const captureAllScreenshots = async (onlyFiltered = true) => {
    const dataToProcess = onlyFiltered ? filteredData : flattenedData;
    const websitesToCapture = dataToProcess.filter(item => item.website && !screenshotData[item.key]);

    if (websitesToCapture.length === 0) {
      message.warning('No new websites to capture');
      return;
    }

    const items = websitesToCapture.map(item => ({
      url: item.website,
      key: item.key,
      recordId: record._id,
      title: item.title
    }));

    addToQueue(items, record._id);
    message.success(`Added ${items.length} websites to capture queue`);
  };

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

  const columns = [
    {
      title: '#',
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Business Name',
      dataIndex: 'title',
      key: 'title',
      width: 260,
      sorter: (a, b) => (a.title || '').localeCompare(b.title || ''),
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      width: 140,
      render: (rating) => rating ? (
        <Tag color="green">⭐ {rating}</Tag>
      ) : '-',
      sorter: (a, b) => (parseFloat(a.rating) || 0) - (parseFloat(b.rating) || 0),
    },
    {
      title: 'Reviews',
      dataIndex: 'reviews',
      key: 'reviews',
      width: 140,
      sorter: (a, b) => (parseInt(a.reviews) || 0) - (parseInt(b.reviews) || 0),
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      width: 150,
      render: (phone) => phone || '-',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      width: 250,
      ellipsis: true,
      render: (address) => address || '-',
    },
    {
      title: 'City/Location',
      key: 'city',
      width: 150,
      render: (_, record) => {
        const city = cityData[record.key];
        if (city) {
          return <Tag color="green">{city}</Tag>;
        }
        return <span className="text-gray-400">-</span>;
      },
    },
    {
      title: 'Website',
      dataIndex: 'website',
      key: 'website',
      width: 200,
      render: (website, record) => website ? (
        <Space direction="vertical" size={2}>
          <a href={website} target="_blank" rel="noopener noreferrer" className="text-[#0F792C] hover:text-[#0a5a20] whitespace-nowrap">
            <MdOpenInNew className="inline" /> Link
          </a>
          <div className="flex items-center gap-2">
            {screenshotData[record.key] && (
              <ScreenshotViewer url={screenshotData[record.key]} title={record.title} />
            )}
            <Button
              size="small"
              type="text"
              icon={<MdCameraAlt className="text-blue-500" />}
              onClick={() => handleCapture(website, record.key)}
              loading={queue.some(i => i.key === record.key && (i.status === 'pending' || i.status === 'processing'))}
              className="flex items-center gap-1 hover:bg-blue-50 transition-colors"
            >
              {screenshotData[record.key] ? 'Recapture' : 'Capture'}
            </Button>
          </div>
        </Space>
      ) : '-',
    },
    {
      title: 'Google Maps',
      dataIndex: 'googleMapsLink',
      key: 'googleMapsLink',
      width: 120,
      render: (link) => link ? (
        <a href={link} target="_blank" rel="noopener noreferrer" className="text-[#0F792C] hover:text-[#0a5a20]">
          <MdOpenInNew className="inline" /> View
        </a>
      ) : '-',
    },
    {
      title: 'WhatsApp',
      dataIndex: 'phone',
      key: 'whatsapp',
      width: 140,
      render: (phone) => {
        if (!phone) return <Tag color="default">N/A</Tag>;

        const formattedPhone = formatPhoneNumber(phone);
        if (!formattedPhone) return <Tag color="default">Invalid</Tag>;

        const status = whatsappStatus[formattedPhone];

        if (status === 'checking') {
          return <Spin size="small" />;
        }

        if (status === 'verified') {
          return (
            <Space>
              <Tag color="success" icon={<MdCheckCircle />}>Verified</Tag>
            </Space>
          );
        }

        if (status === 'not-verified') {
          return (
            <Space>
              <Tag color="error" icon={<MdClose />}>No WhatsApp</Tag>
            </Space>
          );
        }

        return (
          <Button
            size="small"
            icon={<BsWhatsapp />}
            onClick={() => verifyWhatsAppNumber(phone)}
          >
            Check
          </Button>
        );
      },
    },
    {
      title: 'Scraped Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 140,
      render: (date) => new Date(date).toLocaleDateString(),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <Button
            icon={<MdArrowBack />}
            onClick={() => navigate('/dashboard/operations')}
            className="mb-2"
          >
            Back to Operations
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">{record?.searchString || 'Operation Detail'}</h1>
          {record && (
            <div className="space-y-1">
              <p className="text-gray-600">
                {record.data?.length || 0} records • Last updated {record.updatedAt ? new Date(record.updatedAt).toLocaleString() : 'N/A'}
              </p>
              {verificationStats.total > 0 && (
                <div className="flex gap-3 text-sm">
                  <span className="text-gray-600">
                    📞 Total: <span className="font-semibold">{verificationStats.total}</span>
                  </span>
                  <span className="text-green-600">
                    ✓ Verified: <span className="font-semibold">{verificationStats.verified}</span>
                  </span>
                  <span className="text-red-600">
                    ✗ No WhatsApp: <span className="font-semibold">{verificationStats.notVerified}</span>
                  </span>
                  <span className="text-orange-600">
                    ⏳ Not Checked: <span className="font-semibold">{verificationStats.notChecked}</span>
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-2 justify-end">
            <Button
              type="default"
              icon={<MdLocationOn />}
              onClick={extractCitiesForRecord}
              loading={extractingCities}
              disabled={extractingCities || !record}
            >
              {extractingCities ? 'Extracting Cities...' : 'Extract Cities'}
            </Button>
            <Button
              type="primary"
              icon={<MdLocationOn />}
              onClick={getRecommendedCities}
              loading={loadingRecommendations}
              disabled={loadingRecommendations || !record}
              className="bg-blue-600 hover:bg-blue-700 border-blue-600"
            >
              {loadingRecommendations ? 'Finding...' : 'Recommend Cities'}
            </Button>
            <Button
              type="default"
              icon={<MdWeb />}
              onClick={() => setIsCarouselOpen(true)}
              disabled={filteredData.filter(item => item.website).length === 0}
            >
              Show in iFrame
            </Button>
            <Button
              type="default"
              icon={<MdCameraAlt />}
              onClick={() => captureAllScreenshots(true)}
              loading={progress.isProcessing && progress.operationId === record?._id}
              disabled={progress.isProcessing || filteredData.length === 0}
            >
              {progress.isProcessing ? 'Capture Pending...' : 'Capture Filtered Websites'}
            </Button>
            <Button
              icon={<MdSave />}
              onClick={() => setIsSaveModalOpen(true)}
              disabled={getFilteredPhoneNumbers().length === 0}
              className="bg-white text-[#0F792C] border-[#0F792C] hover:bg-[#0F792C] hover:text-white transition-all"
            >
              Save for Messages
            </Button>
            <Button
              icon={<MdPhone />}
              onClick={() => setIsColdCallModalOpen(true)}
              disabled={getFilteredPhoneNumbers().length === 0}
              className="bg-white text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white transition-all"
            >
              Save for Cold Calls
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 justify-end">
            {whatsappInitialized && (
              <Button
                className="bg-[#0F792C] hover:bg-[#0a5a20] border-[#0F792C] text-white"
                type="primary"
                icon={<BsWhatsapp />}
                onClick={handleVerifyAllClick}
                loading={verifyingAll}
                disabled={verifyingAll || filteredData.length === 0}
              >
                {verifyingAll ? 'Verifying...' : 'Verify Visible Numbers'}
              </Button>
            )}
            <Button
              icon={<MdDownload />}
              onClick={exportToCSV}
              disabled={filteredData.length === 0}
            >
              Export CSV
            </Button>
            <Button
              icon={<MdDescription />}
              onClick={exportToXLS}
              disabled={filteredData.length === 0}
            >
              Export XLS
            </Button>
            <Button
              icon={<MdRefresh />}
              onClick={fetchRecord}
              loading={loading}
            >
              Refresh Data
            </Button>
          </div>
        </div>
      </div>

      {whatsappInitialized ? (
        <div className="bg-white rounded-lg shadow-md p-6 border border-green-100">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <Alert
              type="success"
              showIcon
              message="WhatsApp Connected"
              description="You can verify phone numbers directly from this table."
              className="bg-green-50 border-green-100 text-green-800 flex-1"
            />
            <Button
              danger
              icon={<MdClose />}
              onClick={disconnectWhatsApp}
            >
              Disconnect WhatsApp
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6 border border-yellow-100">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-800">Connect WhatsApp</h3>
              <p className="text-gray-600 mt-2">
                Link your WhatsApp account to verify phone numbers.
              </p>
            </div>
            <Button
              type="primary"
              icon={<BsWhatsapp />}
              onClick={() => setIsConnectModalOpen(true)}
              size="large"
              className="bg-[#0F792C] hover:bg-[#0a5a20] border-none"
            >
              Connect WhatsApp
            </Button>
          </div>
        </div>
      )}

      <WhatsAppConnectModal
        visible={isConnectModalOpen}
        onCancel={() => setIsConnectModalOpen(false)}
        onConnected={() => {
          setWhatsappInitialized(true);
          setIsConnectModalOpen(false); // Close modal on success
          checkWhatsAppStatus(); // Double check status
        }}
      />

      <SaveNumbersModal
        visible={isSaveModalOpen}
        onCancel={() => setIsSaveModalOpen(false)}
        numbers={getFilteredPhoneNumbers()}
        userId={user?._id || user?.id}
      />

      <SaveColdCallsModal
        visible={isColdCallModalOpen}
        onCancel={() => setIsColdCallModalOpen(false)}
        numbers={getFilteredPhoneNumbers()}
        userId={user?._id || user?.id}
      />

      {/* Recommended Cities Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <MdLocationOn className="text-blue-600 text-xl" />
            <span>Recommended Cities to Explore</span>
          </div>
        }
        open={isRecommendModalOpen}
        onCancel={() => setIsRecommendModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setIsRecommendModalOpen(false)}>
            Close
          </Button>
        ]}
        width={600}
      >
        <p className="text-gray-600 mb-4">
          Based on your current data locations, here are 5 nearby cities you should consider searching for more leads:
        </p>
        <div className="space-y-3">
          {recommendedCities.map((city, index) => (
            <div
              key={city.id || index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-blue-50 transition-colors"
            >
              <div className="flex-1">
                <div className="font-semibold text-gray-800">
                  {index + 1}. {city.city}
                </div>
                <div className="text-sm text-gray-600">
                  {city.admin_name && `${city.admin_name}, `}{city.country}
                </div>
                {city.population && (
                  <div className="text-xs text-gray-500">
                    Population: {city.population.toLocaleString()}
                  </div>
                )}
              </div>
              <div className="text-right">
                <Tag color="green">{city.distance_km} km away</Tag>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            💡 <strong>Tip:</strong> Search for businesses in these cities using the same keywords to expand your reach!
          </p>
        </div>
      </Modal>

      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100 table-container">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span className="bg-primary/10 p-1 rounded-full"><MdSearch className="text-primary" /></span>
          Filters
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Location Search (Country, State, City)
              </label>
              <Input
                placeholder="Search by city, state, or country..."
                value={filters.locationSearch}
                onChange={(e) => setFilters({ ...filters, locationSearch: e.target.value })}
                prefix={<MdSearch className="text-gray-600" />}
                allowClear
                className=" border-primary/20 focus:bg-primary/50 placeholder-gray-600 font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                WhatsApp status
              </label>
              <Select
                placeholder="Select status"
                style={{ width: '100%' }}
                value={filters.whatsappStatus || undefined}
                onChange={(value) => setFilters({ ...filters, whatsappStatus: value || '' })}
                allowClear
                className="custom-select-primary"
                popupClassName="bg-white"
              >
                <Option value="verified">Has WhatsApp</Option>
                <Option value="not-verified">No WhatsApp</Option>
                <Option value="not-checked">Not checked</Option>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Has website
              </label>
              <Select
                placeholder="Filter by website"
                style={{ width: '100%' }}
                value={filters.hasWebsite || undefined}
                onChange={(value) => setFilters({ ...filters, hasWebsite: value || '' })}
                allowClear
                className="custom-select-primary"
              >
                <Option value="yes">Has website</Option>
                <Option value="no">No website</Option>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Rating (min)
              </label>
              <InputNumber
                min={0}
                max={5}
                step={0.1}
                style={{ width: '100%' }}
                value={filters.ratingMin}
                placeholder="e.g. 3.5"
                onChange={(value) => setFilters({ ...filters, ratingMin: value ?? null })}
                className="border-primary/20 w-full rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Rating (max)
              </label>
              <InputNumber
                min={0}
                max={5}
                step={0.1}
                style={{ width: '100%' }}
                value={filters.ratingMax}
                placeholder="e.g. 4.8"
                onChange={(value) => setFilters({ ...filters, ratingMax: value ?? null })}
                className=" border-primary/20 w-full rounded-md"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Reviews (min)
              </label>
              <InputNumber
                min={0}
                style={{ width: '100%' }}
                value={filters.reviewsMin}
                placeholder="e.g. 50"
                onChange={(value) => setFilters({ ...filters, reviewsMin: value ?? null })}
                className=" border-primary/20 w-full rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Reviews (max)
              </label>
              <InputNumber
                min={0}
                style={{ width: '100%' }}
                value={filters.reviewsMax}
                placeholder="e.g. 500"
                onChange={(value) => setFilters({ ...filters, reviewsMax: value ?? null })}
                className=" border-primary/20 w-full rounded-md"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Has phone number
              </label>
              <Select
                placeholder="Filter by phone"
                style={{ width: '100%' }}
                value={filters.hasPhone || undefined}
                onChange={(value) => setFilters({ ...filters, hasPhone: value || '' })}
                allowClear
                className="custom-select-primary"
              >
                <Option value="yes">Has phone</Option>
                <Option value="no">No phone</Option>
              </Select>
            </div>
          </div>
        </div>

        {(filters.locationSearch ||
          filters.whatsappStatus ||
          filters.ratingMin !== null ||
          filters.ratingMax !== null ||
          filters.reviewsMin !== null ||
          filters.reviewsMax !== null ||
          filters.hasWebsite ||
          filters.hasPhone) && (
            <div className="mt-4">
              <Button
                onClick={() => setFilters({ ...defaultFilters })}
                size="small"
                className="bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              >
                Clear All Filters
              </Button>
            </div>
          )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <Table
          columns={columns}
          dataSource={filteredData}
          loading={loading}
          scroll={{ x: 1200 }}
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} records`,
          }}
        />
      </div>

      <WebsiteCarouselViewer
        isOpen={isCarouselOpen}
        onClose={() => setIsCarouselOpen(false)}
        websites={filteredData
          .filter(item => item.website)
          .map(item => ({
            title: item.title,
            url: item.website,
            screenshotUrl: screenshotData[item.key] // Pass stored screenshot
          }))}
      />

      <Notes operationId={operationId} />
    </div>
  );
};

export default OperationDetailPage;
