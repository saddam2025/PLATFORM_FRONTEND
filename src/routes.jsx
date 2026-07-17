import React, { lazy } from 'react';

/* Public pages */
const InstructorSelectorPage = lazy(() =>
  import('./pages/public/InstructorSelectorPage.jsx')
);
const LoginPage = lazy(() => import('./pages/public/LoginPage.jsx'));
const RegisterPage = lazy(() => import('./pages/public/RegisterPage.jsx'));

/* Student pages (scoped under /:instructorId/) */
const TenantHomepage = lazy(() => import('./pages/student/TenantHomepage.jsx'));
const CourseCatalogPage = lazy(() => import('./pages/student/CourseCatalogPage.jsx'));
const CourseDetailPage = lazy(() => import('./pages/student/CourseDetailPage.jsx'));
const CheckoutPage = lazy(() => import('./pages/student/CheckoutPage.jsx'));
const StudentDashboard = lazy(() => import('./pages/student/StudentDashboard.jsx'));
const CoursePlayerPage = lazy(() => import('./pages/student/CoursePlayerPage.jsx'));
const AssignmentSubmissionPage = lazy(() =>
  import('./pages/student/AssignmentSubmissionPage.jsx')
);
const QuizTakingPage = lazy(() => import('./pages/student/QuizTakingPage.jsx'));
const QuizResultsPage = lazy(() => import('./pages/student/QuizResultsPage.jsx'));

/* Assistant pages */
const AssistantDashboard = lazy(() => import('./pages/assistant/AssistantDashboard.jsx'));
const AssignmentGradingPage = lazy(() =>
  import('./pages/assistant/AssignmentGradingPage.jsx')
);

/* Admin pages */
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard.jsx'));
const CourseManagementPage = lazy(() => import('./pages/admin/CourseManagementPage.jsx'));
const CourseEditorPage = lazy(() => import('./pages/admin/CourseEditorPage.jsx'));
const QuizBuilderPage = lazy(() => import('./pages/admin/QuizBuilderPage.jsx'));
const ScratchCardManager = lazy(() => import('./pages/admin/ScratchCardManager.jsx'));
const TenantSettingsPage = lazy(() => import('./pages/admin/TenantSettingsPage.jsx'));

/* Parent pages */
const ParentDashboard = lazy(() => import('./pages/parent/ParentDashboard.jsx'));
const ChildReportsPage = lazy(() => import('./pages/parent/ChildReportsPage.jsx'));
const ParentActivityPage = lazy(() => import('./pages/parent/ParentActivityPage.jsx'));

/* Route collections */
const publicRoutes = [
  { path: '/select-instructor', element: InstructorSelectorPage },
  { path: '/login', element: LoginPage },
  { path: '/register', element: RegisterPage },
];

const scopedRoutes = [
  // student (make tenant homepage an explicit index route)
  { index: true, element: TenantHomepage }, // renders at "/:instructorId"
  { path: 'catalog', element: CourseCatalogPage },
  { path: 'courses/:courseId', element: CourseDetailPage },
  { path: 'checkout/:courseId', element: CheckoutPage },
  { path: 'dashboard', element: StudentDashboard },
  { path: 'player/:courseId', element: CoursePlayerPage },
  { path: 'assignments/submit/:assignmentId', element: AssignmentSubmissionPage },
  { path: 'quiz/take/:quizId', element: QuizTakingPage },
  { path: 'quiz/results/:submissionId', element: QuizResultsPage },

  // assistant
  { path: 'assistant', element: AssistantDashboard },
  { path: 'assistant/grade/:assignmentId', element: AssignmentGradingPage },

  // admin
  { path: 'admin', element: AdminDashboard },
  { path: 'admin/courses', element: CourseManagementPage },
  { path: 'admin/courses/editor/:courseId', element: CourseEditorPage },
  { path: 'admin/quiz-builder', element: QuizBuilderPage },
  { path: 'admin/scratchcards', element: ScratchCardManager },
  { path: 'admin/settings', element: TenantSettingsPage },

  // parent
  { path: 'parent', element: ParentDashboard },
  { path: 'parent/reports/:childId', element: ChildReportsPage },
  { path: 'parent/activity/:childId', element: ParentActivityPage },
];

export default {
  public: publicRoutes,
  scoped: scopedRoutes,
};
