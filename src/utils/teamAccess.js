export function getUserId(user) {
  return String(user?._id || user?.id || '');
}

export function isInvitedCollaborator(user, team) {
  if (!user || !team) return false;
  const userId = getUserId(user);
  const ownerId = String(team.owner?._id || team.owner || '');
  const isOwner = ownerId === userId;
  const isMember = (team.members || []).some((m) => String(m._id || m) === userId);
  return isMember && !isOwner;
}

export function isTeamMember(user, team) {
  if (!user || !team) return false;
  const userId = getUserId(user);
  const ownerId = String(team.owner?._id || team.owner || '');
  if (ownerId === userId) return true;
  return (team.members || []).some((m) => String(m._id || m) === userId);
}
