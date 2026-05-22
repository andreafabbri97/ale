import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = {
  title: "Accedi al pannello",
  robots: { index: false, follow: false },
};

interface PageProps {
  searchParams: Promise<{ redirect?: string }>;
}

export default async function LoginPage({ searchParams }: PageProps) {
  const { redirect } = await searchParams;

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-[var(--color-bg)]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 font-extrabold text-xl tracking-tight mb-6"
          >
            <span className="grid place-items-center w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-2)] text-[var(--color-bg)] font-black text-lg">
              N
            </span>
            <span>NOA × One Tribe</span>
          </Link>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Pannello <span className="text-[var(--color-accent)]">amministrazione</span>
          </h1>
          <p className="text-sm text-[var(--color-text-dim)] mt-2">
            Accesso riservato ai collaboratori autorizzati.
          </p>
        </div>

        <div className="card">
          <LoginForm redirect={redirect} />
        </div>

        <p className="text-center text-xs text-[var(--color-text-faint)] mt-6">
          <Link href="/" className="hover:text-[var(--color-accent)] underline">
            ← Torna al sito pubblico
          </Link>
        </p>
      </div>
    </main>
  );
}
