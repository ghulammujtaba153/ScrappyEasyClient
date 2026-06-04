import axios from 'axios';
import {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_UPLOAD_PRESET,
  MAX_PAYMENT_SCREENSHOT_BYTES,
  MAX_PAYMENT_SCREENSHOT_MB,
} from '../config/cloudinary';

export function validatePaymentScreenshotFile(file) {
  if (!file) {
    return 'Please select an image file';
  }
  if (!file.type?.startsWith('image/')) {
    return 'Only image files are allowed (JPG, PNG, etc.)';
  }
  if (file.size > MAX_PAYMENT_SCREENSHOT_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    return `Image is too large (${sizeMb} MB). Maximum size is ${MAX_PAYMENT_SCREENSHOT_MB} MB.`;
  }
  return null;
}

/**
 * Upload an image file to Cloudinary (unsigned preset).
 * @returns {Promise<string>} Public HTTPS URL
 */
export async function uploadToCloudinary(file) {
  const validationError = validatePaymentScreenshotFile(file);
  if (validationError) {
    throw new Error(validationError);
  }

  const data = new FormData();
  data.append('file', file);
  data.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  const res = await axios.post(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    data,
    { timeout: 120000 }
  );

  const url = res.data?.secure_url || res.data?.url;
  if (!url) {
    throw new Error('Cloudinary upload did not return a URL');
  }

  return url;
}
