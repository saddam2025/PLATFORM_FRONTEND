import { useEffect, useState } from 'react';
import api from '../services/api';
import instructorService from '../services/instructorService';

export default function useEnrolledCourses(instructorId) {
  const [courses, setCourses] = useState([]);
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    Promise.all([
      api.get('/courses/enrolled'),
      instructorService.get(instructorId).catch(() => null),
    ])
      .then(([courseResponse, tenantResponse]) => {
        if (!active) return;
        setCourses(Array.isArray(courseResponse?.data?.data) ? courseResponse.data.data : []);
        setTenant(tenantResponse?.data || null);
      })
      .catch((requestError) => {
        if (active) setError(requestError?.message || 'تعذر تحميل كورساتك.');
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [instructorId]);

  return { courses, tenant, loading, error };
}
