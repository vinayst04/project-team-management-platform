export const canCreateProject = (user) => user?.role === 'admin';

export const canEditProject = (project, user) => {
  if (!user) return false;
  if (user.role === 'admin') return true;
  const userAssignment = project?.projectUsers?.find((pu) => pu.user?.id === user.id);
  return userAssignment?.role === 'owner';
};

export const getUserProjectRole = (project, userId) => {
  const assignment = project?.projectUsers?.find((pu) => pu.user?.id === userId);
  return assignment?.role || null;
};

