import axios from 'axios';
import { BASE_URL } from '../config/URL';

export const captureWebsite = async (url) => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.post(`${BASE_URL}/api/screenshot/capture`,
            { url },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('API Error: Failed to capture website', error);
        throw error;
    }
};
