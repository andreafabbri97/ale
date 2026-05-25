import type { AdminBranchSnapshot } from "@/app/admin/(dashboard)/leads-management/actions";

interface AdminRankCardProps {
  admin: AdminBranchSnapshot;
}

function formatNumber(n: number): string {
  return new Intl.NumberFormat("it-IT").format(n);
}

function formatMoney(n: number): string {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export function AdminRankCard({ admin }: AdminRankCardProps) {
  const totalPoints = admin.pointsLeft + admin.pointsRight;
  const leftIsWeak = admin.weakestLeg === "LEFT";
  const rightIsWeak = admin.weakestLeg === "RIGHT";

  const currentBonus = admin.rank.current?.bonus_amount ?? 0;
  const nextRank = admin.rank.next;

  // Calcolo progresso verso prossimo rank (per ramo debole)
  const progressPct = nextRank
    ? Math.min(
        100,
        Math.round(
          (admin.weakestPoints /
            Math.max(1, Math.floor(nextRank.volume_required / 2))) *
            100,
        ),
      )
    : 100;

  return (
    <div
      className={`card !p-4 sm:!p-5 ${
        admin.isMe ? "border-[var(--color-accent)]" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="min-w-0">
          <div className="text-xs uppercase tracking-widest text-[var(--color-text-faint)]">
            {admin.isMe ? "Tu" : "Admin"}
          </div>
          <div className="text-lg font-bold truncate">{admin.name}</div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-[10px] uppercase tracking-widest text-[var(--color-text-faint)]">
            Bonus mese
          </div>
          <div className="text-xl font-extrabold text-[var(--color-accent)]">
            {formatMoney(currentBonus)}
          </div>
        </div>
      </div>

      {/* Rami SX / DX */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div
          className={`rounded-lg p-2 border ${
            leftIsWeak
              ? "border-[var(--color-danger)]/40 bg-[rgba(231,76,60,0.06)]"
              : "border-[var(--color-border)] bg-[var(--color-bg-2)]"
          }`}
        >
          <div className="text-[10px] uppercase tracking-widest text-[var(--color-text-faint)]">
            Ramo SX {leftIsWeak && "⚠"}
          </div>
          <div className="text-base font-bold">
            {formatNumber(admin.pointsLeft)}
            <span className="text-xs text-[var(--color-text-faint)] font-normal">
              {" "}PV
            </span>
          </div>
        </div>
        <div
          className={`rounded-lg p-2 border ${
            rightIsWeak
              ? "border-[var(--color-danger)]/40 bg-[rgba(231,76,60,0.06)]"
              : "border-[var(--color-border)] bg-[var(--color-bg-2)]"
          }`}
        >
          <div className="text-[10px] uppercase tracking-widest text-[var(--color-text-faint)]">
            Ramo DX {rightIsWeak && "⚠"}
          </div>
          <div className="text-base font-bold">
            {formatNumber(admin.pointsRight)}
            <span className="text-xs text-[var(--color-text-faint)] font-normal">
              {" "}PV
            </span>
          </div>
        </div>
      </div>

      {/* Stato rank */}
      <div className="text-xs space-y-1">
        <div className="flex justify-between text-[var(--color-text-dim)]">
          <span>Rank attuale</span>
          <span className="font-semibold">
            {admin.rank.current?.display_name ?? "—"}
          </span>
        </div>
        <div className="flex justify-between text-[var(--color-text-dim)]">
          <span>PV totali</span>
          <span className="font-semibold">{formatNumber(totalPoints)}</span>
        </div>
        {nextRank && (
          <>
            <div className="flex justify-between text-[var(--color-text-faint)] pt-1 mt-1 border-t border-[var(--color-border)]">
              <span>Prossimo</span>
              <span className="font-semibold text-[var(--color-accent)]">
                {nextRank.display_name} ({formatMoney(nextRank.bonus_amount)})
              </span>
            </div>
            <div className="mt-2 h-1.5 rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-2)] transition-all"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <div className="text-[10px] text-[var(--color-text-faint)] text-center mt-1">
              ramo debole: {formatNumber(admin.weakestPoints)} /{" "}
              {formatNumber(Math.floor(nextRank.volume_required / 2))} PV
            </div>
          </>
        )}
      </div>
    </div>
  );
}
