import { useEffect, useState } from 'react';
import { catalogCourses, instructorProfile } from '../mocks/tenantMockData.js';

export default function useTenantData(instructorId) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    instructorProfile: null,
    catalogCourses: [],
  });

  useEffect(() => {
    setLoading(true);
    setError(null);

    const timer = window.setTimeout(() => {
      if (!instructorId) {
        setData({ instructorProfile: null, catalogCourses: [] });
        setError('لم يتم العثور على المعلم.');
      } else {
        setData({ instructorProfile, catalogCourses });
      }
      setLoading(false);
    }, 50);

    return () => window.clearTimeout(timer);
  }, [instructorId]);

  return {
    instructorProfile: data.instructorProfile,
    catalogCourses: data.catalogCourses,
    loading,
    error,
  };
}
