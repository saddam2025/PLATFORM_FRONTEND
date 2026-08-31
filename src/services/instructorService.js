// src/services/instructorService.js
import { instructorProfile } from '../mocks/tenantMockData';

/**
 * Instructor related API calls.
 * Returns objects shaped like { data, status, headers } to match existing consumers.
 */

const instructorService = {
  list: async (opts = {}) => {
    // TODO: replace this local fallback with GET /public/tenants (or an
    // equivalent unauthenticated, active-tenant endpoint) once the backend
    // exposes one. /super-admin/tenants is role-protected and must never be
    // used by the public instructor selector.
    void opts;
    return { data: [instructorProfile], status: 200, headers: {} };
  },

  get: async (id) => {
    if (!id) throw { message: 'Instructor id is required' };
    // See the public-listing TODO above; preserve mock behaviour meanwhile.
    return { data: instructorProfile.id === id ? instructorProfile : null, status: 200, headers: {} };
  },

  // optional helper to select instructor server-side (if your API supports it)
  select: async (id) => {
    if (!id) throw { message: 'Instructor id is required' };
    return { data: instructorProfile.id === id ? instructorProfile : null, status: 200, headers: {} };
  },
};

export default instructorService;
