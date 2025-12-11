import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Alert,
  Button,
  InputNumber,
  Select,
  Space,
  Spin,
  Table,
  Tag,
  message
} from 'antd';
import {
  FiArrowLeft,
  FiCheck,
  FiDownload,
  FiExternalLink,
  FiFileText,
  FiRefreshCw,
  FiX
} from 'react-icons/fi';
import { BsWhatsapp } from 'react-icons/bs';
import axios from 'axios';
import { QRCodeCanvas } from 'qrcode.react';
import { BASE_URL } from '../../config/URL';
import { useAuth } from '../../context/authContext';
import countries from '../../data/countries';
import ukCities from '../../data/uk';
import Notes from '../../component/dashboard/Notes';

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
  const { token } = useAuth();

  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ ...defaultFilters });
  const [whatsappStatus, setWhatsappStatus] = useState({});
  const [whatsappInitialized, setWhatsappInitialized] = useState(false);
  const [qrCodeValue, setQrCodeValue] = useState(null);
  const [fetchingQr, setFetchingQr] = useState(false);
  const [verifyingAll, setVerifyingAll] = useState(false);
  const [cityData, setCityData] = useState({});
  const [extractingCities, setExtractingCities] = useState(false);

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
        
        console.log(`   ✓ Resolved to: ${city} (from ${address.city ? 'city' : address.town ? 'town' : address.county ? 'county' : address.state_district ? 'state_district' : address.state ? 'state' : 'country'})`);
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
            
            // Update UI immediately to show the extracted city
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
        setCityData(newCityData);
        
        console.log(`💾 Saving ${Object.keys(newCityData).length} cities to backend...`);
        
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
    try {
      const response = await axios.get(`${BASE_URL}/api/data/record/${operationId}`);
      if (response.data?.success) {
        setRecord(response.data.data);
        
        // Load cached verification results
        if (response.data.data?.whatsappVerifications) {
          const cachedStatus = {};
          // Handle both object and Map formats from MongoDB
          const verifications = response.data.data.whatsappVerifications;
          const entries = verifications instanceof Map ? 
            Array.from(verifications.entries()) : 
            Object.entries(verifications);
          
          entries.forEach(([phone, verificationData]) => {
            cachedStatus[phone] = verificationData.isRegistered ? 'verified' : 'not-verified';
          });
          
          setWhatsappStatus(cachedStatus);
          console.log(`Loaded ${Object.keys(cachedStatus).length} cached verification results`);
        }

        // Load city data from database
        if (response.data.data?.cityData) {
          const cities = {};
          const cityDataFromDB = response.data.data.cityData;
          const cityEntries = cityDataFromDB instanceof Map ? 
            Array.from(cityDataFromDB.entries()) : 
            Object.entries(cityDataFromDB);
          
          cityEntries.forEach(([index, city]) => {
            const itemKey = `${response.data.data._id}-${index}`;
            cities[itemKey] = city;
          });
          
          setCityData(cities);
          console.log(`Loaded ${Object.keys(cities).length} cached city locations`);
        }
      } else {
        message.error(response.data?.message || 'Failed to load record');
      }
    } catch (error) {
      console.error('Failed to load record details:', error);
      message.error(error.response?.data?.message || 'Unable to fetch record');
    } finally {
      setLoading(false);
    }
  };

  const initializeWhatsApp = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/api/verification/initialize`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        console.log('WhatsApp initialization started');
        return true;
      }
    } catch (error) {
      console.error('WhatsApp initialization failed:', error);
      message.error(error.response?.data?.error || 'Failed to initialize WhatsApp');
    }
    return false;
  };

  const checkWhatsAppStatus = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/verification/status`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success && res.data.data) {
        const status = res.data.data;
        setWhatsappInitialized(status.isConnected);

        if (status.qrCode) {
          setQrCodeValue(status.qrCode);
        } else if (!status.hasQRCode) {
          setQrCodeValue(null);
        }

        return status;
      }
    } catch (error) {
      console.error('WhatsApp status check failed:', error);
    }
    return null;
  };

  const refreshQrCode = async () => {
    setFetchingQr(true);
    try {
      // Check current status first
      const status = await checkWhatsAppStatus();
      
      // If not initialized, initialize the session
      if (status && !status.initialized) {
        await initializeWhatsApp();
        // Wait a bit for initialization to start
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      // Check status again after initialization
      const updatedStatus = await checkWhatsAppStatus();
      if (updatedStatus?.qrCode) {
        setQrCodeValue(updatedStatus.qrCode);
        return;
      }

      // Try to get QR code
      const res = await axios.get(`${BASE_URL}/api/verification/qr`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success && res.data.data?.qrCode) {
        setQrCodeValue(res.data.data.qrCode);
      } else if (res.data.success && res.data.data?.isConnected) {
        setWhatsappInitialized(true);
        message.success('WhatsApp already connected');
      } else if (res.data.error) {
        message.info(res.data.error);
      }
    } catch (error) {
      console.error('QR refresh error:', error);
      message.error(error.response?.data?.error || 'Failed to fetch QR code');
    } finally {
      setFetchingQr(false);
    }
  };

  const disconnectWhatsApp = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/api/verification/disconnect`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.data.success) {
        setWhatsappInitialized(false);
        setQrCodeValue(null);
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

    // Poll status frequently when waiting for connection
    // - Every 3 seconds to catch connection updates quickly
    // - Also refreshes QR code if it becomes stale
    const interval = setInterval(async () => {
      if (!whatsappInitialized) {
        const status = await checkWhatsAppStatus();
        
        // If we have QR displayed but status has new QR, update it
        if (status?.qrCode && status.qrCode !== qrCodeValue) {
          setQrCodeValue(status.qrCode);
        }
      }
    }, 3000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [operationId, whatsappInitialized]);

  useEffect(() => {
    if (!whatsappInitialized && !qrCodeValue) {
      refreshQrCode();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [whatsappInitialized, qrCodeValue]);

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
      setWhatsappStatus(prev => ({ ...prev, [phone]: 'unknown' }));
      return;
    }

    const normalized = formattedNumber || formatPhoneNumber(phone);

    if (!normalized) {
      if (!silent) {
        message.warning('Invalid phone number format');
      }
      setWhatsappStatus(prev => ({ ...prev, [phone]: 'unknown' }));
      return;
    }

    setWhatsappStatus(prev => ({ ...prev, [phone]: 'checking' }));

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

        setWhatsappStatus(prev => ({ ...prev, [phone]: status }));

        if (!silent) {
          if (isRegistered) {
            message.success('WhatsApp number verified!');
          } else {
            message.info('Number does not have WhatsApp');
          }
        }
      } else {
        const errorMessage = res.data.error || 'Failed to verify WhatsApp number';
        setWhatsappStatus(prev => ({ ...prev, [phone]: 'unknown' }));
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
    const totalPhones = phonesWithNumbers.length;
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

  const getAllCountries = () => {
    const countryNames = countries.map(c => c.name);
    countryNames.push('United Kingdom');
    return countryNames;
  };

  const getAllStates = () => {
    const states = new Set();
    countries.forEach(country => {
      if (filters.countries.length === 0 || filters.countries.includes(country.name)) {
        if (country.states) {
          country.states.forEach(state => states.add(state.name));
        }
      }
    });
    return Array.from(states);
  };

  const getAllCities = () => {
    const cities = new Set();

    countries.forEach(country => {
      if (filters.countries.length === 0 || filters.countries.includes(country.name)) {
        if (country.states) {
          country.states.forEach(state => {
            if (filters.states.length === 0 || filters.states.includes(state.name)) {
              state.cities.forEach(city => cities.add(city));
            }
          });
        }
      }
    });

    if (filters.countries.length === 0 || filters.countries.includes('United Kingdom')) {
      ukCities.forEach(city => cities.add(city));
    }

    return Array.from(cities);
  };

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
        const status = whatsappStatus[item.phone];
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
  }, [ flattenedData, filters, whatsappStatus]);

  const getWhatsappStatusLabel = (phone) => {
    const status = whatsappStatus[phone];
    if (status === 'verified') return 'Verified';
    if (status === 'not-verified') return 'Not Verified';
    if (status === 'failed') return 'Failed';
    if (status === 'checking') return 'Checking';
    return 'Not Checked';
  };

  const getFileBaseName = () => {
    const raw = (record?.searchString || 'operation-data').toString().trim();
      const sanitized = raw
        .replace(/[^\u0000-\u007F]+/g, '')
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
        <Tag color="gold">⭐ {rating}</Tag>
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
          return <Tag color="blue">{city}</Tag>;
        }
        return <span className="text-gray-400">-</span>;
      },
    },
    {
      title: 'Website',
      dataIndex: 'website',
      key: 'website',
      width: 120,
      render: (website) => website ? (
        <a href={website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
          <FiExternalLink className="inline" /> Link
        </a>
      ) : '-',
    },
    {
      title: 'Google Maps',
      dataIndex: 'googleMapsLink',
      key: 'googleMapsLink',
      width: 120,
      render: (link) => link ? (
        <a href={link} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-800">
          <FiExternalLink className="inline" /> View
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
              <Tag color="success" icon={<FiCheck />}>Verified</Tag>
            </Space>
          );
        }

        if (status === 'not-verified') {
          return (
            <Space>
              <Tag color="error" icon={<FiX />}>No WhatsApp</Tag>
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
            icon={<FiArrowLeft />}
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
        <Space>
          <Button
            type="default"
            onClick={extractCitiesForRecord}
            loading={extractingCities}
            disabled={extractingCities || !record}
          >
            {extractingCities ? 'Extracting Cities...' : '📍 Extract Cities'}
          </Button>
          {whatsappInitialized && (
            <Button
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
            icon={<FiDownload />}
            onClick={exportToCSV}
            disabled={filteredData.length === 0}
          >
            Export CSV
          </Button>
          <Button
            icon={<FiFileText />}
            onClick={exportToXLS}
            disabled={filteredData.length === 0}
          >
            Export XLS
          </Button>
          <Button
            icon={<FiRefreshCw />}
            onClick={fetchRecord}
            loading={loading}
          >
            Refresh Data
          </Button>
        </Space>
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
              icon={<FiX />}
              onClick={disconnectWhatsApp}
            >
              Disconnect WhatsApp
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6 border border-yellow-100">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-800">Connect WhatsApp</h3>
              <p className="text-gray-600 mt-2">
                Scan the QR code with WhatsApp on your phone to link your account. Keep WhatsApp open until the connection completes.
              </p>
              <div className="mt-4">
                <Button
                  icon={<FiRefreshCw />}
                  onClick={refreshQrCode}
                  loading={fetchingQr}
                >
                  {fetchingQr ? 'Fetching QR...' : 'Refresh QR'}
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-center w-full md:w-auto">
              {qrCodeValue ? (
                <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                  <QRCodeCanvas value={qrCodeValue} size={220} includeMargin />
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-gray-500">
                  <Spin />
                  <span className="text-sm">Waiting for QR code...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Filters</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country
              </label>
              <Select
                mode="multiple"
                placeholder="Select countries"
                style={{ width: '100%' }}
                value={filters.countries}
                onChange={(value) => setFilters({ ...filters, countries: value, states: [], cities: [] })}
              >
                {getAllCountries().map(country => (
                  <Option key={country} value={country}>{country}</Option>
                ))}
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State
              </label>
              <Select
                mode="multiple"
                placeholder="Select states"
                style={{ width: '100%' }}
                value={filters.states}
                onChange={(value) => setFilters({ ...filters, states: value, cities: [] })}
                disabled={filters.countries.length === 0}
              >
                {getAllStates().map(state => (
                  <Option key={state} value={state}>{state}</Option>
                ))}
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <Select
                mode="multiple"
                placeholder="Select cities"
                style={{ width: '100%' }}
                value={filters.cities}
                onChange={(value) => setFilters({ ...filters, cities: value })}
                disabled={filters.countries.length === 0}
              >
                {getAllCities().map(city => (
                  <Option key={city} value={city}>{city}</Option>
                ))}
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                WhatsApp status
              </label>
              <Select
                placeholder="Select status"
                style={{ width: '100%' }}
                value={filters.whatsappStatus || undefined}
                onChange={(value) => setFilters({ ...filters, whatsappStatus: value || '' })}
                allowClear
              >
                <Option value="verified">Has WhatsApp</Option>
                <Option value="not-verified">No WhatsApp</Option>
                <Option value="not-checked">Not checked</Option>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reviews (min)
              </label>
              <InputNumber
                min={0}
                style={{ width: '100%' }}
                value={filters.reviewsMin}
                placeholder="e.g. 50"
                onChange={(value) => setFilters({ ...filters, reviewsMin: value ?? null })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reviews (max)
              </label>
              <InputNumber
                min={0}
                style={{ width: '100%' }}
                value={filters.reviewsMax}
                placeholder="e.g. 500"
                onChange={(value) => setFilters({ ...filters, reviewsMax: value ?? null })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Has website
              </label>
              <Select
                placeholder="Filter by website"
                style={{ width: '100%' }}
                value={filters.hasWebsite || undefined}
                onChange={(value) => setFilters({ ...filters, hasWebsite: value || '' })}
                allowClear
              >
                <Option value="yes">Has website</Option>
                <Option value="no">No website</Option>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Has phone number
              </label>
              <Select
                placeholder="Filter by phone"
                style={{ width: '100%' }}
                value={filters.hasPhone || undefined}
                onChange={(value) => setFilters({ ...filters, hasPhone: value || '' })}
                allowClear
              >
                <Option value="yes">Has phone</Option>
                <Option value="no">No phone</Option>
              </Select>
            </div>
          </div>
        </div>

        {(filters.countries.length > 0 ||
          filters.states.length > 0 ||
          filters.cities.length > 0 ||
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

      <Notes operationId={operationId} />
    </div>
  );
};

export default OperationDetailPage;
