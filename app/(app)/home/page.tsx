import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getMovement, movements } from "@/lib/movements";

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id: string })?.id;
  const name = session?.user?.name?.split(" ")[0] ?? session?.user?.email?.split("@")[0];

  const progress = await prisma.progress.findMany({ where: { userId } });
  const completedDays = progress.map((p) => p.day);
  const nextDay = Math.min(
    movements.find((m) => !completedDays.includes(m.day))?.day ?? 40,
    40
  );
  const today = getMovement(nextDay)!;

  // streak simples: dias consecutivos concluídos a partir do dia 1
  let streak = 0;
  for (let d = 1; d <= 40; d++) {
    if (completedDays.includes(d)) streak++;
    else break;
  }

  return (
    <div className="px-5 py-6 md:px-8 md:py-8">
      <div className="font-display text-2xl font-semibold text-olive">Bom dia, {name}</div>
      {streak > 0 && (
        <div className="inline-flex items-center gap-1.5 bg-bege px-3 py-1.5 rounded-full font-mono text-xs text-olive mt-2.5">
          🔥 {streak} {streak === 1 ? "dia seguido" : "dias seguidos"}
        </div>
      )}

      <div className="bg-olive text-offwhite rounded-[20px] p-6 my-5">
        <div className="font-mono text-[0.7rem] text-bronze uppercase tracking-wide">
          {today.partName} · Dia {today.day} de 40
        </div>
        <h3 className="font-display text-xl font-semibold mt-2 mb-4">{today.title}</h3>
        <div className="strata mb-4">
          <div className="layer">
            <div
              className="fill bg-bronze"
              style={{ width: `${(completedDays.length / 40) * 100}%` }}
            />
          </div>
        </div>
        <Link
          href={`/movimentos/${today.day}`}
          className="block text-center bg-offwhite text-olive font-semibold text-sm rounded-xl py-3.5"
        >
          Abrir o movimento de hoje
        </Link>
      </div>

      <div className="flex gap-3">
        <Link
          href="/diario"
          className="flex-1 bg-white border border-line rounded-2xl p-3.5 text-center"
        >
          <svg viewBox="0 0 24 24" width="22" height="22" className="mx-auto mb-1.5 text-olive" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 5.5c2-1 5-1 8 .5V19c-3-1.5-6-1.5-8-.5V5.5z" />
            <path d="M20 5.5c-2-1-5-1-8 .5V19c3-1.5 6-1.5 8-.5V5.5z" />
          </svg>
          <div className="text-xs font-semibold text-ink-soft">Diário</div>
        </Link>
        <Link
          href="/dashboard"
          className="flex-1 bg-white border border-line rounded-2xl p-3.5 text-center"
        >
          <svg viewBox="0 0 24 24" width="22" height="22" className="mx-auto mb-1.5 text-olive" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="12" width="4" height="8" rx="1" />
            <rect x="10" y="7" width="4" height="13" rx="1" />
            <rect x="16" y="3" width="4" height="17" rx="1" />
          </svg>
          <div className="text-xs font-semibold text-ink-soft">Progresso</div>
        </Link>
        <Link
          href="/movimentos"
          className="flex-1 bg-white border border-line rounded-2xl p-3.5 text-center"
        >
          <svg viewBox="0 0 24 24" width="22" height="22" className="mx-auto mb-1.5 text-olive" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="5" cy="6" r="2" />
            <circle cx="12" cy="12" r="2" />
            <circle cx="19" cy="18" r="2" />
            <path d="M6.6 7.4L10.4 10.6M13.6 13.4L17.4 16.6" strokeDasharray="2.2 2.2" />
          </svg>
          <div className="text-xs font-semibold text-ink-soft">Trilha</div>
        </Link>
      </div>
    </div>
  );
}
