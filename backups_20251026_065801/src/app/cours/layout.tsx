// src/app/cours/layout.tsx
import RequireAccess from "../../components/access/RequireAccess";

export default async function CoursesLayout({ children }: { children: React.ReactNode }) {
  return <RequireAccess>{children}</RequireAccess>;
}
