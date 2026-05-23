import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/admin/admin-shell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // Il middleware dovrebbe già aver redirectato — safety net
    redirect("/admin/login");
  }

  // Recupera profilo collaborator (per nome, ruolo admin/non admin)
  const { data: collaboratorRaw } = await supabase
    .from("collaborators")
    .select("email, full_name, is_admin")
    .eq("id", user.id)
    .single();

  const collaborator = collaboratorRaw as
    | { email: string; full_name: string; is_admin: boolean }
    | null;

  const userEmail = collaborator?.email ?? user.email ?? "—";
  const isAdmin = collaborator?.is_admin ?? false;

  return (
    <AdminShell userEmail={userEmail} isAdmin={isAdmin}>
      {children}
    </AdminShell>
  );
}
