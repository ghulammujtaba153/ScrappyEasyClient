export const DEFAULT_FILTERS = {
  countries: [],
  states: [],
  cities: [],
  whatsappStatus: '',
  ratingMin: null,
  ratingMax: null,
  reviewsMin: null,
  reviewsMax: null,
  hasWebsite: '',
  hasPhone: '',
  hasEmail: '',
  hasSocials: '',
  favorite: '',
  addsRunning: '',
};

export const EXPORT_FIELDS = [
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
  { key: 'whatsappStatus', label: 'WhatsApp Status' },
  { key: 'emails', label: 'Emails' },
];

export const TABLE_ROW_HEIGHT = 54;
