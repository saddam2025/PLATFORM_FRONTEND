import heroImage from '../assets/hero.png';
import teacherOneImage from '../assets/landing-teacher-1.png';
import teacherTwoImage from '../assets/landing-teacher-2.png';

export const landingAssets = {
  // CHANGE THIS IMAGE:
  // src/assets/hero.png
  hero: heroImage,
};

export const landingTeachers = [
  {
    id: 'teacher-1',
    name: 'أ. ياسمين السعدي',
    avatar: teacherOneImage,
    subject: 'الرياضيات',
    bio: 'تخصص في تعليم الرياضيات بأساليب سهلة وممتعة للطلاب.',
    stage: 'الصف التاسع',
    rating: 4.9,
    studentsCount: 320,
  },
  {
    id: 'teacher-2',
    name: 'أ. خالد الشمري',
    avatar: teacherTwoImage,
    subject: 'الرياضيات',
    bio: 'مدرب متمرس يساعد الطلاب على التفوق في الامتحانات.',
    stage: 'الصف الحادي عشر',
    rating: 4.8,
    studentsCount: 410,
  },
];

export const landingFeatures = [
  { id: 'f-1', number: 1, title: 'محتوى منسق', description: 'دروس مرتبة ومبسطة تناسب كل مستوى', icon: '📚' },
  { id: 'f-2', number: 2, title: 'متابعة شخصية', description: 'تقارير وتحديثات لتتبع تقدمك', icon: '👩‍🏫' },
  { id: 'f-3', number: 3, title: 'اختبارات دورية', description: 'اختبارات تساعدك على التقييم والتحسن', icon: '📝' },
  { id: 'f-4', number: 4, title: 'دعم مباشر', description: 'تواصل مع المدرس واستفسر بسهولة', icon: '💬' },
  { id: 'f-5', number: 5, title: 'شهادات إتمام', description: 'احصل على شهادة عند إنهاء المسار', icon: '🏅' },
];

export const landingCourses = [
  { id: 'c-1', title: 'الأساسيات الرياضية', instructorId: 'teacher-1', price: 0, duration: '8 أسابيع', image: teacherOneImage },
  { id: 'c-2', title: 'الجبر المتقدم', instructorId: 'teacher-1', price: 120, duration: '10 أسابيع', image: teacherTwoImage },
  { id: 'c-3', title: 'الهندسة التطبيقية', instructorId: 'teacher-2', price: 150, duration: '12 أسابيع', image: teacherOneImage },
  { id: 'c-4', title: 'التحضير للامتحانات', instructorId: 'teacher-2', price: 200, duration: '6 أسابيع', image: teacherTwoImage },
  { id: 'c-5', title: 'محاضرات سريعة', instructorId: 'teacher-1', price: 30, duration: 'مباشر', image: teacherOneImage },
];
