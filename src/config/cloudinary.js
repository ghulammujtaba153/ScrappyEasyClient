export const CLOUDINARY_CLOUD_NAME =
  import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

export const CLOUDINARY_UPLOAD_PRESET =
  import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

/** Cloudinary unsigned image uploads are typically capped at 10 MB per file. */
export const MAX_PAYMENT_SCREENSHOT_MB = 10;
export const MAX_PAYMENT_SCREENSHOT_BYTES = MAX_PAYMENT_SCREENSHOT_MB * 1024 * 1024;
