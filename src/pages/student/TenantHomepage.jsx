// src/pages/student/TenantHomepage.jsx
import { instructorProfile, catalogCourses } from "../../mocks/tenantMockData.js";
import CourseCard from "../../components/common/CourseCard.jsx";

export default function TenantHomepage() {
  return (
    <div className="flex flex-col gap-8">
      <section
        className="relative overflow-hidden rounded-[var(--radius-xl)] p-8"
        style={{ backgroundColor: "var(--color-sidebar)" }}
      >
        <div className="pointer-events-none absolute inset-0 bg-geo-pattern-inverse" />
        <div className="relative z-10 flex flex-col gap-3">
          <span
            className="w-fit rounded-full px-4 py-1.5 text-xs font-semibold"
            style={{ backgroundColor: "var(--color-accent)", color: "var(--color-accent-ink)" }}
          >
            منصة Math و رياضة
          </span>
          <h1 className="font-display text-2xl" style={{ color: "var(--color-sidebar-ink)" }}>
            {instructorProfile.name}
          </h1>
          <p className="max-w-xl text-sm" style={{ color: "var(--color-sidebar-ink-muted)" }}>
            {instructorProfile.bio}
          </p>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg" style={{ color: "var(--color-ink)" }}>
            الكورسات المتاحة
          </h2>
          <span className="text-sm font-semibold" style={{ color: "var(--color-accent-strong)" }}>
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