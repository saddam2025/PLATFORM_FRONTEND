// src/services/instructorService.js
import api, { resolveApiAssetUrl } from './api';

function mapTenant(tenant) {
  if (!tenant) return null;
  return {
    id: tenant.subdomain,
    subdomain: tenant.subdomain,
    name: tenant.name,
    avatar: resolveApiAssetUrl(tenant.logoUrl),
    logoUrl: resolveApiAssetUrl(tenant.logoUrl),
    tagline: tenant.tagline || '',
    bio: tenant.bio || '',
    subject: tenant.subject || '',
    location: tenant.location || '',
    coverPhotoUrl: resolveApiAssetUrl(tenant.coverPhotoUrl),
    stagesOffered: Array.isArray(tenant.stagesOffered) ? tenant.stagesOffered : [],
    monthlyPrice: tenant.monthlyPrice,
    perLecturePrice: tenant.perLecturePrice,
    themeColors: tenant.themeColors || {}
  };
}

function mapCourse(course) {
  return {
    id: course._id,
    title: course.title_ar || course.title_en,
    subtitle: course.description_ar || course.description_en || '',
    image: resolveApiAssetUrl(course.thumbnailUrl),
    price: course.price,
    stage: course.stage,
    category: course.categoryId?.name || '',
    accessPeriodDays: course.accessPeriodDays,
    maxViews: course.maxViews,
    isPublished: course.isPublished,
    locked: course.locked
  };
}

/**
 * Instructor related API calls.
 * Returns objects shaped like { data, status, headers } to match existing consumers.
 */

const instructorService = {
  list: async ({ page = 1, limit = 12 } = {}) => {
    const response = await api.get('/tenants/public', { params: { page, limit } });
    return { ...response, data: (response.data.data || []).map(mapTenant), pagination: response.data.pagination };
  },

  get: async (subdomain) => {
    if (!subdomain) throw { message: 'Tenant subdomain is required' };
    const response = await api.get(`/tenants/public/${encodeURIComponent(subdomain)}`);
    return { ...response, data: mapTenant(response.data.data) };
  },

  getCourses: async (instructorId, filters = {}) => {
    const params = Object.fromEntries(Object.entries(filters).filter(([, value]) => value));
    const response = await api.get(`/instructors/${encodeURIComponent(instructorId)}/courses`, { params });
    return { ...response, data: (response.data.data || []).map(mapCourse) };
  },

  getCourse: async (instructorId, courseId) => {
    const response = await api.get(`/instructors/${encodeURIComponent(instructorId)}/courses/${encodeURIComponent(courseId)}`);
    return { ...response, data: mapCourse(response.data.data) };
  }
};

export default instructorService;
