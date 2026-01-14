import axios from 'axios';
import { BASE_URL } from '../config/URL';

/**
 * Checks the user's access status (Trial or Subscription)
 * @param {string} userId 
 * @param {string} token 
 * @returns {Promise<{isAuthorized: boolean, type: 'trial'|'subscription', trial?: any, subscription?: any}>}
 */
export const checkAccessStatus = async (userId, token) => {
    try {
        if (!userId || !token) return { isAuthorized: false };

        const res = await axios.get(`${BASE_URL}/api/trial/check/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (res.data.success) {
            return {
                isAuthorized: res.data.isAuthorized,
                type: res.data.type,
                trial: res.data.trial,
                subscription: res.data.subscription
            };
        }
        return { isAuthorized: false };
    } catch (error) {
        console.error('Error checking access status:', error);
        return { isAuthorized: false };
    }
};

/**
 * Helper to show restriction message or block feature
 * @param {boolean} isAuthorized 
 * @param {string} featureName 
 */
export const handleFeatureRestriction = (isAuthorized) => {
    if (!isAuthorized) {
        return false;
    }
    return true;
};
