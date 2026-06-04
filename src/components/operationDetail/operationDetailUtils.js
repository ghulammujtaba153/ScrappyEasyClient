import { EXPORT_FIELDS } from './constants';

export function extractCoordinates(url) {
  if (!url) return null;
  const patterns = [/@(-?\d+\.\d+),(-?\d+\.\d+)/, /!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return { lat: parseFloat(match[1]), lon: parseFloat(match[2]) };
  }
  return null;
}

export async function getCityFromCoordinates(lat, lon) {
  const apiUrl = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
  try {
    const response = await fetch(apiUrl, { headers: { 'User-Agent': 'GoldScraper/1.0' } });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    if (data?.address) {
      const address = data.address;
      return (
        address.city ||
        address.town ||
        address.county ||
        address.state_district ||
        address.state ||
        address.country ||
        'Unknown'
      );
    }
    return 'Unknown';
  } catch {
    return 'Unknown';
  }
}

export async function extractCityFromUrl(url) {
  const coords = extractCoordinates(url);
  if (!coords) return null;
  return getCityFromCoordinates(coords.lat, coords.lon);
}

export function isMongoLeadId(id) {
  return Boolean(id && /^[a-f\d]{24}$/i.test(String(id)));
}

export function formatPhoneNumber(phone, contextHint = '') {
  let cleaned = phone.trim().replace(/[^\d+]/g, '');
  if (!cleaned) return null;
  if (cleaned.startsWith('00')) cleaned = '+' + cleaned.slice(2);
  if (cleaned.startsWith('+')) return cleaned;

  const hint = contextHint.toLowerCase();
  let countryCode = '971';
  if (hint.includes('australia')) countryCode = '61';
  else if (hint.includes('uk') || hint.includes('london') || hint.includes('united kingdom')) countryCode = '44';
  else if (hint.includes('usa') || hint.includes('america') || hint.includes('united states')) countryCode = '1';
  else if (hint.includes('india')) countryCode = '91';
  else if (hint.includes('pakistan')) countryCode = '92';
  else if (hint.includes('saudi') || hint.includes('ksa')) countryCode = '966';
  else if (hint.includes('qatar')) countryCode = '974';

  if (cleaned.startsWith('0') && (cleaned.length === 9 || cleaned.length === 10)) {
    return `+${countryCode}${cleaned.slice(1)}`;
  }
  return `+${cleaned}`;
}

export function flattenLeads(record, { cityData, whatsappStatus, screenshotData, emailData, socialData, formatPhone }) {
  const leadsArray = record?.leads?.length > 0 ? record.leads : record?.data || [];
  if (!leadsArray?.length) return [];

  return leadsArray.filter(Boolean).map((item, index) => ({
    key: item._id || `${record._id}-${index}`,
    _id: item._id,
    leadId: item._id || `${record._id}-${index}`,
    recordId: record._id,
    itemIndex: index,
    searchString: record.searchString,
    createdAt: item.createdAt || record.createdAt,
    title: item.title || '',
    rating: item.rating || '',
    reviews: item.reviews || '',
    phone: item.phone || '',
    address: item.address || '',
    city: item.city || cityData[item._id] || cityData[`${record._id}-${index}`] || '',
    website: item.website || '',
    googleMapsLink: item.googleMapsLink || '',
    whatsappStatus:
      item.whatsappStatus ||
      whatsappStatus[formatPhone(item.phone, record.searchString)] ||
      'not-checked',
    addsRunning: item.addsRunning || '',
    favorite: item.favorite || false,
    screenshotUrl: item.screenshotUrl || screenshotData[item._id] || screenshotData[`${record._id}-${index}`] || '',
    emails: item.emails || emailData[item._id] || emailData[`${record._id}-${index}`] || undefined,
    socialMedia: item.socialMedia || socialData[item._id] || socialData[`${record._id}-${index}`] || undefined,
  }));
}

export function getWhatsappStatusLabel(phone, itemStatus, whatsappStatusCache, formatPhone) {
  const status = itemStatus || whatsappStatusCache[formatPhone(phone)];
  if (status === 'verified') return 'Verified';
  if (status === 'not-verified') return 'Not Verified';
  if (status === 'failed') return 'Failed';
  if (status === 'checking') return 'Checking';
  return 'Not Checked';
}

export function getFileBaseName(record) {
  const raw = (record?.searchString || 'operation-data').toString().trim();
  const sanitized = raw
    .replace(/[^\x20-\x7E]+/g, '')
    .replace(/[^A-Za-z0-9\-\s_]/g, '')
    .replace(/\s+/g, '-')
    .toLowerCase();
  return sanitized || 'operation-data';
}

export function buildExportRows(filteredData, { record, cityData, emailData, whatsappStatus, formatPhone }) {
  const getRawFieldValue = (field, item) => {
    if (field.key === 'whatsappStatus') return getWhatsappStatusLabel(item.phone, item.whatsappStatus, whatsappStatus, formatPhone);
    if (field.key === 'city') return cityData[item.key] || item.city || '';
    if (field.key === 'emails') {
      const emails = item.emails || emailData[item.key] || [];
      return Array.isArray(emails) ? emails.join(', ') : emails;
    }
    return item[field.key] ?? '';
  };

  const normalizeFieldValue = (field, item) => {
    const raw = getRawFieldValue(field, item);
    if (field.key === 'createdAt' && raw) return new Date(raw).toLocaleDateString();
    return raw ?? '';
  };

  return { getRawFieldValue, normalizeFieldValue, headers: EXPORT_FIELDS };
}

export function downloadFile(content, mimeType, extension, downloadName) {
  const fileName = downloadName?.includes('.')
    ? downloadName
    : `${downloadName || 'export'}.${extension}`;
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function calcTableScrollY(filteredLength, pageSize, currentPage, viewportHeight, rowHeight = 54) {
  if (!filteredLength) return undefined;
  const rowsOnPage = Math.min(pageSize, Math.max(0, filteredLength - (currentPage - 1) * pageSize));
  if (!rowsOnPage) return undefined;
  const bodyHeight = rowsOnPage * rowHeight;
  const maxBodyHeight = Math.max(240, viewportHeight - 320);
  return Math.min(bodyHeight, maxBodyHeight);
}
