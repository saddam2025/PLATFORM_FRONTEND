// src/mocks/studentMockData.js
// Mock data for the logged-in student's own dashboard/profile views
// (StudentDashboard.jsx and related student pages).

export const studentProfile = {
  id: 'student-1',
  name: 'يوسف الكعبي',
  email: 'youssef.k@example.com',
  avatar: '/images/avatars/boy1.png',
  grade: 'الصف السابع',
  stage: 'grade-7',
  instructorId: 'ins-1',
  subscriptionType: 'monthly', // 'monthly' | 'per-lecture'
  subscriptionStatus: 'active', // 'active' | 'expired' | 'pending-exam'
  subscriptionRenewsAt: '2026-08-01T00:00:00Z',
  monthlyExamPassed: true,
  averageScore: 88,
  completedLessons: 24,
  pendingAssignments: 2,
  totalWatchHours: 37
};

export const enrolledCourses = [
  {
    id: 'course-101',
    title: 'أساسيات الجبر',
    instructor: 'أ. أحمد العتيبي',
    thumbnail: '/images/courses/algebra.png',
    category: 'الشهر الأول',
    progressPercent: 72,
    lastActivity: '2026-07-15T10:30:00Z',
    accessExpiresAt: '2026-07-25T00:00:00Z',
    viewsUsed: 3,
    maxViews: 10,
    nextLessonLocked: false
  },
  {
    id: 'course-201',
    title: 'الهندسة المبسطة',
    instructor: 'أ. فاطمة',
    thumbnail: '/images/courses/geometry.png',
    category: 'الوحدة الثانية',
    progressPercent: 40,
    lastActivity: '2026-07-10T14:20:00Z',
    accessExpiresAt: '2026-07-20T00:00:00Z',
    viewsUsed: 6,
    maxViews: 10,
    nextLessonLocked: true
  },
  {
    id: 'course-301',
    title: 'مقدمة في الإحصاء',
    instructor: 'أ. خالد',
    thumbnail: '/images/courses/stats.png',
    category: 'الشهر الأول',
    progressPercent: 15,
    lastActivity: '2026-07-05T09:00:00Z',
    accessExpiresAt: '2026-07-30T00:00:00Z',
    viewsUsed: 1,
    maxViews: 10,
    nextLessonLocked: false
  }
];