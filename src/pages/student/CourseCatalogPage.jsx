// src/pages/student/CourseCatalogPage.jsx
export const route = {
  path: ['/:instructorId/catalog', '/:instructorId/stages/:stageId/courses'],
  index: false,
  auth: null,
  title: 'الدورات',
};

import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import CourseCard from '../../components/common/CourseCard';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import instructorService from '../../services/instructorService';

export default function CourseCatalogPage() {
  const { instructorId, stageId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => setSearch(searchParams.get('search') || ''), [searchParams]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    instructorService.getCourses(instructorId, { stage: stageId, category: activeCategory })
      .then((response) => { if (active) setCourses(response.data); })
      .catch((requestError) => { if (active) setError(requestError.message || 'تعذر تحميل الدورات.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [instructorId, stageId, activeCategory]);

  const stageCourses = useMemo(() => {
    return courses;
  }, [courses]);

  const categories = useMemo(
    () => [...new Set(stageCourses.map((c) => c.category))],
    [stageCourses]
  );

  const filteredCourses = useMemo(() => {
    return stageCourses.filter((c) => {
      const matchesSearch = c.title.toLowerCase().includes(search.trim().toLowerCase());
      return matchesSearch;
    });
  }, [stageCourses, search]);

  return (
    <div dir="rtl" className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-ink-900">الدورات المتاحة</h1>
        <p className="text-sm text-ink-500 mt-1">تصفح الدورات الخاصة بهذه المرحلة الدراسية</p>
      </div>

      <Input
        placeholder="ابحث عن دورة..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {loading && <div className="text-sm text-ink-500">جارٍ تحميل الدورات...</div>}
      {error && <div role="alert" className="text-sm text-danger-DEFAULT">{error}</div>}

      {categories.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <button type="button" onClick={() => setActiveCategory(null)}>
            <Badge variant={!activeCategory ? 'brand' : 'neutral'} className="cursor-pointer">
              الكل
            </Badge>
          </button>
          {categories.map((cat) => (
            <button key={cat} type="button" onClick={() => setActiveCategory(cat)}>
              <Badge variant={activeCategory === cat ? 'brand' : 'neutral'} className="cursor-pointer">
                {cat}
              </Badge>
            </button>
          ))}
        </div>
      )}

      {!loading && filteredCourses.length === 0 ? (
        <div className="bg-surface-muted rounded-2xl p-10 text-center text-ink-500">
          لا توجد دورات مطابقة
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCourses.map((course) => (
        <CourseCard
          key={course.id}
          course={course}
          openLabel="عرض التفاصيل"
          onOpen={() => navigate(`/${instructorId}/courses/${course.id}`)}
          onEnroll={() => navigate(`/${instructorId}/checkout/${course.id}`)}
        />
          ))}
        </div>
      )}
    </div>
  );
}
