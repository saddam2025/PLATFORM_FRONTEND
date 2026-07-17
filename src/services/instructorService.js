// src/services/instructorService.js
import api from './api';

/**
 * Instructor related API calls.
 * Returns objects shaped like { data, status, headers } to match existing consumers.
 */

const instructorService = {
  list: async (opts = {}) => {
    // opts can include pagination or filters; we pass them as query params
    const config = {};
    if (opts && Object.keys(opts).length) config.params = opts;
    return api.get('/instructors', config);
  },

  get: async (id) => {
    if (!id) throw { message: 'Instructor id is required' };
    return api.get(`/instructors/${id}`);
  },

  // optional helper to select instructor server-side (if your API supports it)
  select: async (id) => {
    if (!id) throw { message: 'Instructor id is required' };
    return api.post(`/instructors/${id}/select`);
  },
};

export default instructorService;
