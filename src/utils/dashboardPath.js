function userId(user) {
  return user?._id || user?.id || null;
}

/**
 * Dashboard routes use the owning admin's id as the :instructorId segment.
 * Admins are that owner themselves; the other tenant roles receive it in
 * user.instructorId from the login response.
 */
export function dashboardPathFor(user) {
  switch (user?.role) {
    case 'super_admin':
      return '/super-admin';
    case 'admin':
    case 'teacher': {
      const instructorId = userId(user);
      return instructorId ? `/${instructorId}/admin/dashboard` : '/';
    }
    case 'assistant': {
      const instructorId = user?.instructorId;
      return instructorId ? `/${instructorId}/assistant/dashboard` : '/';
    }
    case 'parent': {
      const instructorId = user?.instructorId;
      return instructorId ? `/${instructorId}/parent/dashboard` : '/';
    }
    case 'student': {
      const instructorId = user?.instructorId;
      return instructorId ? `/${instructorId}/dashboard` : '/';
    }
    default:
      return '/';
  }
}
