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

const MOCK_COURSES = [
  { id: 'c-1', title: 'أساسيات الجبر', description: 'مقدمة في المفاهيم الجبرية الأساسية', price: 150, thumbnailUrl: null, stageId: 'grade-7', category: 'الشهر الأول' },
  { id: 'c-2', title: 'الهندسة المستوية', description: 'دراسة الأشكال والزوايا والمساحات', price: 180, thumbnailUrl: null, stageId: 'grade-7', category: 'الشهر الأول' },
  { id: 'c-3', title: 'المعادلات الخطية', description: 'حل المعادلات من الدرجة الأولى', price: 160, thumbnailUrl: null, stageId: 'grade-7', category: 'الشهر الثاني' },
  { id: 'c-4', title: 'الكسور والنسب', description: 'العمليات على الكسور والنسب المئوية', price: 140, thumbnailUrl: null, stageId: 'grade-7', category: 'الشهر الثاني' },
  { id: 'c-5', title: 'التفاضل والتكامل', description: 'أساسيات التفاضل مع تطبيقات عملية', price: 220, thumbnailUrl: null, stageId: 'grade-7', category: 'الشهر الثالث' },
  { id: 'c-6', title: 'الإحصاء والاحتمالات', description: 'فهم البيانات والتوقعات الإحصائية', price: 170, thumbnailUrl: null, stageId: 'grade-7', category: 'الشهر الثالث' },
  { id: 'c-7', title: 'نظرية فيثاغورس', description: 'تطبيقات المثلث القائم الزاوية', price: 150, thumbnailUrl: null, stageId: 'grade-8', category: 'الشهر الأول' },
  { id: 'c-8', title: 'الدوال الأسية', description: 'دراسة الدوال الأسية واللوغاريتمية', price: 200, thumbnailUrl: null, stageId: 'grade-8', category: 'الشهر الثاني' },
  { id: 'c-9', title: 'المتجهات', description: 'مقدمة في المتجهات والعمليات عليها', price: 190, thumbnailUrl: null, stageId: 'grade-9', category: 'الشهر الأول' },
  { id: 'c-10', title: 'المصفوفات', description: 'أساسيات الجبر الخطي والمصفوفات', price: 210, thumbnailUrl: null, stageId: 'grade-9', category: 'الشهر الثاني' },
];

export default function CourseCatalogPage() {
  const { instructorId, stageId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => setSearch(searchParams.get('search') || ''), [searchParams]);

  const stageCourses = useMemo(() => {
    if (!stageId) return MOCK_COURSES;
    return MOCK_COURSES.filter((c) => c.stageId === stageId);
  }, [stageId]);

  const categories = useMemo(
    () => [...new Set(stageCourses.map((c) => c.category))],
    [stageCourses]
  );

  const filteredCourses = useMemo(() => {
    return stageCourses.filter((c) => {
      const matchesSearch = c.title.toLowerCase().includes(search.trim().toLowerCase());
      const matchesCategory = !activeCategory || c.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [stageCourses, search, activeCategory]);

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

      {filteredCourses.length === 0 ? (
        <div className="bg-surface-muted rounded-2xl p-10 text-center text-ink-500">
          لا توجد دورات مطابقة
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCourses.map((course) => (
            // src/pages/student/CourseCatalogPage.jsx — only the CourseCard usage changes
        <CourseCard
          key={course.id}
          course={{
            title: course.title,
            subtitle: course.description,
            image: course.thumbnailUrl,
            price: course.price,
            lessonsCount: 0,
            tasksCount: 0,
            instructor: { name: null, avatar: null },
          }}
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
