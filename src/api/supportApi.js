import axios from 'axios';
import { BASE_URL } from '../config/URL';

/**
 * Create a new support request
 */
export const createSupportRequest = async (supportData) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
            `${BASE_URL}/api/support`,
            supportData,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

/**
 * Get user's support requests
 */
export const getUserSupportRequests = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
            `${BASE_URL}/api/support/user`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

/**
 * Get all support requests (Admin only)
 */
export const getAllSupportRequests = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
            `${BASE_URL}/api/support/all`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

/**
 * Update support request status (Admin only)
 */
export const updateSupportStatus = async (id, status) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.patch(
            `${BASE_URL}/api/support/${id}/status`,
            { status },
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};
