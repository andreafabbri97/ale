import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { getCurrentUser, getCurrentCollaborator } from "@/lib/supabase/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    // Il middleware dovrebbe già aver redirectato — safety net
    redirect("/admin/login");
  }

  const collaborator = await getCurrentCollaborator();
  const userEmail = collaborator?.email ?? user.email ?? "—";
  const isAdmin = collaborator?.is_admin ?? false;

  return (
    <AdminShell userEmail={userEmail} isAdmin={isAdmin}>
      {children}
    </AdminShell>
  );
}
