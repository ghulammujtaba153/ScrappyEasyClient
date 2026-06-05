import { useAuth } from '../context/authContext';

/** Premium feature access via own plan or team-owner coverage. */
export function useFeatureAccess() {
  const { accessStatus } = useAuth();

  return {
    isAuthorized: accessStatus?.isAuthorized ?? false,
    canCreateTeam: accessStatus?.canCreateTeam ?? false,
    isTeamMember: accessStatus?.isTeamMember ?? false,
    accessStatus,
  };
}
