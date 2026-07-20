// src/pages/student/TenantHomepage.jsx
import { instructorProfile, catalogCourses } from "../../mocks/tenantMockData.js";
import CourseCard from "../../components/common/CourseCard.jsx";

export default function TenantHomepage() {
  return (
    <div className="flex flex-col gap-10">
      <section
        className="relative overflow-hidden rounded-[var(--radius-xl)] p-8 sm:p-12"
        style={{ backgroundColor: "var(--color-sidebar)" }}
      >
        <div className="pointer-events-none absolute inset-0 bg-geo-pattern-inverse" />
        {/* Soft accent glow */}
        <div
          className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full opacity-20 blur-3xl"
          style={{ backgroundColor: "var(--color-accent)" }}
        />
        <div className="relative z-10 flex flex-col gap-4">
          <span
            className="w-fit rounded-full px-4 py-1.5 text-xs font-semibold"
            style={{ backgroundColor: "var(--color-accent)", color: "var(--color-accent-ink)" }}
          >
            منصة Math و رياضة
          </span>
          <h1 className="font-display text-3xl sm:text-4xl text-balance" style={{ color: "var(--color-sidebar-ink)" }}>
            {instructorProfile.name}
          </h1>
          <p className="max-w-xl text-sm leading-relaxed" style={{ color: "var(--color-sidebar-ink-muted)" }}>
            {instructorProfile.bio}
          </p>

          <div className="mt-2 flex flex-wrap gap-3">
            <div
              className="flex items-center gap-2 rounded-2xl px-4 py-2.5"
              style={{ backgroundColor: "rgba(255,255,255,0.08)", color: "var(--color-sidebar-ink)" }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" style={{ color: "var(--color-accent)" }}>
                <path d="M4 6h16v12H4z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                <path d="M8 10h8M8 14h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              <span className="text-sm font-semibold">{catalogCourses.length} كورس متاح</span>
            </div>
            <div
              className="flex items-center gap-2 rounded-2xl px-4 py-2.5"
              style={{ backgroundColor: "rgba(255,255,255,0.08)", color: "var(--color-sidebar-ink)" }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" style={{ color: "var(--color-accent)" }}>
                <path d="M12 3l2.5 5 5.5.8-4 3.9.9 5.5L12 16.5 7.1 18.2l.9-5.5-4-3.9L9.5 8z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
              </svg>
              <span className="text-sm font-semibold">تعلّم بذكاء</span>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-xl" style={{ color: "var(--color-ink)" }}>
            الكورسات المتاحة
          </h2>
          <span className="cursor-pointer text-sm font-semibold transition-opacity hover:opacity-80" style={{ color: "var(--color-accent-strong)" }}>
            عرض الكل
          </span>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {catalogCourses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      </section>
    </div>
  );
}
