import { redirect } from "next/navigation";
import { AdminDashboard } from "@/components/AdminDashboard";
import { isAuthenticated } from "@/lib/auth";
import { readStore } from "@/lib/content";
import { getStatsSummary } from "@/lib/stats";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAuthenticated())) {
    redirect("/admin/login");
  }

  const [store, stats] = await Promise.all([readStore(), getStatsSummary()]);

  return (
    <AdminDashboard
      initialProjects={store.projects}
      initialTestimonials={store.testimonials}
      initialProposals={store.proposals}
      initialStats={stats}
    />
  );
}
