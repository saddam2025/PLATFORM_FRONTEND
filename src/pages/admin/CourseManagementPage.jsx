// src/pages/admin/CourseManagementPage.jsx
export const route = {
  path: '/:instructorId/admin/courses',
  index: false,
  auth: 'required',
  roles: ['admin', 'teacher', 'assistant'],
  title: 'إدارة الدورات'
};

import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import courseService from '../../services/courseService';

function formatPrice(n) {
  return `${n.toLocaleString('ar-EG')} ج.م`;
}

export default function CourseManagementPage() {
  const { instructorId } = useParams();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');
  const [confirmingDeleteId, setConfirmingDeleteId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadCourses = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await courseService.list(instructorId);
      setCourses(response.data.data || []);
    } catch (requestError) {
      setError(requestError.message || 'تعذر تحميل الدورات.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCourses(); }, [instructorId]);

  const filteredCourses = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return courses;
    return courses.filter((c) => (c.title_ar || c.title_en || '').toLowerCase().includes(q));
  }, [courses, search]);

  const handleTogglePublish = async (course) => {
    try {
      await courseService.update(instructorId, course._id, { isPublished: !course.isPublished });
      await loadCourses();
    } catch (requestError) {
      setError(requestError.message || 'تعذر تحديث حالة النشر.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await courseService.remove(instructorId, id);
      setConfirmingDeleteId(null);
      await loadCourses();
    } catch (requestError) {
      setError(requestError.message || 'تعذر حذف الدورة.');
    }
  };

  return (
    <div dir="rtl" className="space-y-8">
      {/* Page header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-ink-900">إدارة الكورسات</h1>
          <p className="text-sm text-ink-500 mt-2 leading-relaxed">
            إدارة وتحديث جميع الدورات التعليمية المتاحة على المنصة.
          </p>
        </div>
        <Button variant="primary" onClick={() => navigate(`/${instructorId}/admin/courses/edit/new`)}>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          دورة جديدة
        </Button>
      </div>
      {error && <div role="alert" className="rounded-xl bg-danger-soft p-4 text-sm text-danger-DEFAULT">{error}</div>}

      {/* Toolbar: sort / filter / search */}
      <div className="bg-surface-default rounded-2xl shadow-card p-4 flex items-center gap-3 flex-wrap">
        <Button variant="subtle" size="sm">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
            <path d="M3 6h18M6 12h12M10 18h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
          ترتيب
        </Button>
        <Button variant="subtle" size="sm">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
            <path d="M4 5h16l-6 8v5l-4 2v-7L4 5z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          تصفية
        </Button>
        <div className="relative flex-1 min-w-[220px]">
          <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-ink-400">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.7" />
              <path d="M20 20l-3-3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          </span>
          <Input
            className="pr-12"
            placeholder="البحث عن كورس بواسطة العنوان، المرحلة، أو التصنيف..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface-default rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead>
              <tr className="bg-surface-muted/60 text-ink-500">
                <th className="px-5 py-4 font-medium">العنوان</th>
                <th className="px-5 py-4 font-medium">المرحلة</th>
                <th className="px-5 py-4 font-medium">التصنيف</th>
                <th className="px-5 py-4 font-medium">السعر</th>
                <th className="px-5 py-4 font-medium">الحالة</th>
                <th className="px-5 py-4 font-medium">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.map((course) => (
                <tr
                  key={course._id}
                  className="border-t border-surface-border/70 transition-colors hover:bg-surface-muted/40"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/12 text-brand-600">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                          <path d="M4 5h16v14H4z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                          <path d="M8 9h8M8 13h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                        </svg>
                      </span>
                      <span className="font-semibold text-ink-900">{course.title_ar || course.title_en}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-ink-700">{course.stage}</td>
                  <td className="px-5 py-4">
                    <span className="inline-flex rounded-full bg-surface-muted px-3 py-1 text-xs text-ink-600">
                      {course.categoryId?.name || '—'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-bold text-ink-900">{formatPrice(course.price)}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-col items-start gap-2">
                      <button
                        type="button"
                        onClick={() => handleTogglePublish(course)}
                        role="switch"
                        aria-checked={course.isPublished}
                        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                          course.isPublished ? 'bg-success-DEFAULT' : 'bg-surface-muted'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                            course.isPublished ? '-translate-x-1' : '-translate-x-6'
                          }`}
                        />
                      </button>
                      <Badge variant={course.isPublished ? 'success' : 'neutral'}>
                        {course.isPublished ? 'منشورة' : 'مسودة'}
                      </Badge>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    {confirmingDeleteId === course._id ? (
                      <div className="flex items-center gap-2 rounded-xl bg-danger-DEFAULT/8 px-3 py-2">
                        <span className="text-xs font-medium text-danger-DEFAULT">تأكيد الحذف؟</span>
                        <Button variant="primary" size="sm" onClick={() => handleDelete(course._id)}>
                          نعم
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setConfirmingDeleteId(null)}>
                          إلغاء
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          aria-label="تعديل"
                          onClick={() => navigate(`/${instructorId}/admin/courses/edit/${course._id}`)}
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                            <path d="M4 20h4l10-10-4-4L4 16v4z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                          </svg>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-danger-DEFAULT"
                          aria-label="حذف"
                          onClick={() => setConfirmingDeleteId(course._id)}
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                            <path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}

              {!loading && filteredCourses.length === 0 && (
                <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-ink-500">
                    لا توجد دورات مطابقة للبحث
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer / pagination */}
        <div className="flex items-center justify-between gap-4 border-t border-surface-border/70 px-5 py-4">
          <span className="text-xs text-ink-500">
            عرض 1 - {filteredCourses.length} من {courses.length} كورس
          </span>
          <div className="flex items-center gap-1">
            <button className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-500 hover:bg-surface-muted" aria-label="التالي">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button className="flex h-8 min-w-8 items-center justify-center rounded-lg bg-accent px-2 text-sm font-semibold text-accent-ink">1</button>
            <button className="flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-sm text-ink-600 hover:bg-surface-muted">2</button>
            <button className="flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-sm text-ink-600 hover:bg-surface-muted">3</button>
            <span className="px-1 text-ink-400">…</span>
            <button className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-500 hover:bg-surface-muted" aria-label="السابق">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
