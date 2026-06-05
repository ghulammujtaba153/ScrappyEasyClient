import axios from 'axios';
import { BASE_URL } from '../config/URL';

/**
 * Resolves premium access for the logged-in user:
 * own subscription OR coverage via a team owner's active plan.
 */
export const checkAccessStatus = async (_userId, token) => {
    try {
        if (!token) return { isAuthorized: false, canCreateTeam: false, isTeamMember: false };

        const res = await axios.get(`${BASE_URL}/api/user/access-status/me`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data?.success) {
            return {
                isAuthorized: res.data.isAuthorized,
                canCreateTeam: res.data.canCreateTeam ?? false,
                isTeamMember: res.data.isTeamMember ?? false,
                type: res.data.type || 'none',
                subscription: res.data.subscription,
                teamId: res.data.teamId,
                teamName: res.data.teamName,
            };
        }

        return { isAuthorized: false, canCreateTeam: false, isTeamMember: false };
    } catch (error) {
        console.error('Error checking access status:', error);
        return { isAuthorized: false, canCreateTeam: false, isTeamMember: false };
    }
};

export const handleFeatureRestriction = (isAuthorized) => Boolean(isAuthorized);
