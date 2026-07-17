// src/pages/admin/CourseManagementPage.jsx
export const route = {
  path: '/:instructorId/admin/courses',
  index: false,
  auth: 'admin',
  title: 'إدارة الدورات'
};

import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

const MOCK_COURSES = [
  { id: 'c1', title: 'المعادلات الخطية', stage: 'الصف الأول الثانوي', category: 'الشهر 1', price: 150, isPublished: true, studentsEnrolled: 214 },
  { id: 'c2', title: 'الهندسة التحليلية', stage: 'الصف الثاني الثانوي', category: 'الشهر 2', price: 180, isPublished: true, studentsEnrolled: 176 },
  { id: 'c3', title: 'التفاضل والتكامل', stage: 'الصف الثالث الثانوي', category: 'الشهر 1', price: 220, isPublished: false, studentsEnrolled: 0 },
  { id: 'c4', title: 'المتتاليات والمتسلسلات', stage: 'الصف الثالث الثانوي', category: 'الشهر 3', price: 200, isPublished: true, studentsEnrolled: 98 },
  { id: 'c5', title: 'حساب المثلثات', stage: 'الصف الأول الثانوي', category: 'الشهر 2', price: 150, isPublished: true, studentsEnrolled: 312 },
  { id: 'c6', title: 'الإحصاء والاحتمالات', stage: 'الصف الثاني الثانوي', category: 'الشهر 1', price: 170, isPublished: false, studentsEnrolled: 0 },
  { id: 'c7', title: 'الجبر المتجهي', stage: 'الصف الثالث الثانوي', category: 'الشهر 2', price: 220, isPublished: true, studentsEnrolled: 87 },
  { id: 'c8', title: 'الأعداد المركبة', stage: 'الصف الثالث الثانوي', category: 'الشهر 4', price: 220, isPublished: true, studentsEnrolled: 54 }
];

function formatPrice(n) {
  return `${n.toLocaleString('ar-EG')} ج.م`;
}

export default function CourseManagementPage() {
  const { instructorId } = useParams();
  const navigate = useNavigate();

  const [courses, setCourses] = useState(MOCK_COURSES);
  const [search, setSearch] = useState('');
  const [confirmingDeleteId, setConfirmingDeleteId] = useState(null);

  const filteredCourses = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return courses;
    return courses.filter((c) => c.title.toLowerCase().includes(q));
  }, [courses, search]);

  const handleTogglePublish = (id) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isPublished: !c.isPublished } : c))
    );
  };

  const handleDelete = (id) => {
    setCourses((prev) => prev.filter((c) => c.id !== id));
    setConfirmingDeleteId(null);
  };

  return (
    <div dir="rtl" className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-semibold text-ink-900">إدارة الدورات</h1>
          <p className="text-sm text-ink-500 mt-1">{courses.length} دورة إجمالاً</p>
        </div>
        <Button variant="primary" onClick={() => navigate(`/${instructorId}/admin/courses/edit/new`)}>
          دورة جديدة
        </Button>
      </div>

      {/* Search / filter */}
      <div className="max-w-sm">
        <Input
          placeholder="ابحث بعنوان الدورة..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="bg-surface-default rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead>
              <tr className="border-b border-surface-border text-ink-500">
                <th className="px-4 py-3 font-medium">العنوان</th>
                <th className="px-4 py-3 font-medium">المرحلة</th>
                <th className="px-4 py-3 font-medium">الفئة</th>
                <th className="px-4 py-3 font-medium">السعر</th>
                <th className="px-4 py-3 font-medium">عدد الطلاب</th>
                <th className="px-4 py-3 font-medium">الحالة</th>
                <th className="px-4 py-3 font-medium">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.map((course) => (
                <tr key={course.id} className="border-b border-surface-border last:border-b-0">
                  <td className="px-4 py-3 text-ink-900 font-medium">{course.title}</td>
                  <td className="px-4 py-3 text-ink-700">{course.stage}</td>
                  <td className="px-4 py-3 text-ink-700">{course.category}</td>
                  <td className="px-4 py-3 text-ink-700">{formatPrice(course.price)}</td>
                  <td className="px-4 py-3 text-ink-700">{course.studentsEnrolled.toLocaleString('ar-EG')}</td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => handleTogglePublish(course.id)}
                      role="switch"
                      aria-checked={course.isPublished}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        course.isPublished ? 'bg-success-DEFAULT' : 'bg-surface-muted'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          course.isPublished ? '-translate-x-1' : '-translate-x-6'
                        }`}
                      />
                    </button>
                    <div className="mt-1">
                      <Badge variant={course.isPublished ? 'success' : 'neutral'}>
                        {course.isPublished ? 'منشورة' : 'مسودة'}
                      </Badge>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {confirmingDeleteId === course.id ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-ink-700">تأكيد الحذف؟</span>
                        <Button variant="primary" size="sm" onClick={() => handleDelete(course.id)}>
                          نعم
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setConfirmingDeleteId(null)}>
                          إلغاء
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/${instructorId}/admin/courses/edit/${course.id}`)}
                        >
                          تعديل
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-danger-DEFAULT"
                          onClick={() => setConfirmingDeleteId(course.id)}
                        >
                          حذف
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}

              {filteredCourses.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-ink-500">
                    لا توجد دورات مطابقة للبحث
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}