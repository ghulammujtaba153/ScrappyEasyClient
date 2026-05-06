/**
 * Helper function to track Meta Pixel events
 * @param {string} eventName - Standard or Custom event name
 * @param {Object} eventData - Optional data for the event (e.g. { value: 10, currency: 'USD' })
 * @param {string} eventID - Optional event ID for deduplication with CAPI
 */
export const trackMetaEvent = (eventName, eventData = {}, eventID = null) => {
    if (typeof window !== "undefined" && window.fbq) {
        if (eventID) {
            window.fbq('track', eventName, eventData, { eventID });
        } else {
            window.fbq('track', eventName, eventData);
        }
        console.log(`[Meta Pixel] Tracked: ${eventName}`, eventData);
    } else {
        console.warn(`[Meta Pixel] window.fbq not found. Event ${eventName} skipped.`);
    }
};

/**
 * Helper for custom events
 */
export const trackMetaCustomEvent = (eventName, eventData = {}, eventID = null) => {
    if (typeof window !== "undefined" && window.fbq) {
        if (eventID) {
            window.fbq('trackCustom', eventName, eventData, { eventID });
        } else {
            window.fbq('trackCustom', eventName, eventData);
        }
        console.log(`[Meta Pixel] Tracked Custom: ${eventName}`, eventData);
    }
};
