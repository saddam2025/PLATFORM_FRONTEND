// src/mocks/tenantMockData.js
// Mock data for a single instructor's public-facing tenant homepage/catalog
// (TenantHomepage.jsx, CourseCatalogPage.jsx).

export const instructorProfile = {
  id: 'ins-1',
  name: 'أ. أحمد العتيبي',
  avatar: '/images/instructors/ahmed.png',
  tagline: 'مدرس متخصص يقدم محتوى متميز ومتابعة شخصية',
  bio: 'خبرة أكثر من 12 عامًا في تدريس الرياضيات لجميع المراحل الإعدادية والثانوية.',
  subject: 'رياضيات',
  location: 'القاهرة',
  stagesOffered: ['grade-7', 'grade-8', 'grade-9', 'grade-10', 'grade-11', 'grade-12'],
  monthlyPrice: 199,
  perLecturePrice: 15,
  studentsCount: 1284,
  coursesCount: 37
};

export const catalogCourses = [
  {
    id: 'course-101',
    title: 'أساسيات الجبر',
    thumbnail: '/images/courses/algebra.png',
    stage: 'grade-7',
    category: 'الشهر الأول',
    price: 15,
    lessonsCount: 12,
    isPublished: true
  },
  {
    id: 'course-201',
    title: 'الهندسة المبسطة',
    thumbnail: '/images/courses/geometry.png',
    stage: 'grade-8',
    category: 'الوحدة الثانية',
    price: 15,
    lessonsCount: 9,
    isPublished: true
  },
  {
    id: 'course-301',
    title: 'مقدمة في الإحصاء',
    thumbnail: '/images/courses/stats.png',
    stage: 'grade-9',
    category: 'الشهر الأول',
    price: 15,
    lessonsCount: 14,
    isPublished: true
  },
  {
    id: 'course-401',
    title: 'التفاضل والتكامل',
    thumbnail: '/images/courses/calculus.png',
    stage: 'grade-11',
    category: 'الوحدة الثالثة',
    price: 20,
    lessonsCount: 16,
    isPublished: false
  }
];