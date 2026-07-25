import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { movements, getPartProgress } from "@/lib/movements";

const PART_COLORS = ["#48501F", "#A8552E", "#A8823F", "#A8823F"];

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id: string })?.id;

  const progress = await prisma.progress.findMany({ where: { userId } });
  const completedDays = progress.map((p) => p.day);
  const parts = getPartProgress(completedDays);

  let streak = 0;
  for (let d = 1; d <= 40; d++) {
    if (completedDays.includes(d)) streak++;
    else break;
  }

  // Protocolo de 21 dias começa no Dia 30 (Parte III concluída)
  const protocolStarted = completedDays.includes(30);
  const protocolDays = Array.from({ length: 21 }, (_, i) => i + 1);
  const protocolCompleted = completedDays.filter((d) => d > 30).length;

  const unlocked40 = completedDays.includes(40);

  return (
    <div className="pt-10 px-6 pb-6">
      <h1 className="font-display text-xl font-semibold text-olive mb-4">Seu progresso</h1>

      <div className="flex gap-2.5 mb-5">
        <div className="flex-1 bg-white border border-line rounded-2xl p-3.5 text-center">
          <div className="font-display text-2xl font-semibold text-olive">{streak}</div>
          <div className="text-[0.68rem] text-ink-soft mt-0.5">dias seguidos</div>
        </div>
        <div className="flex-1 bg-white border border-line rounded-2xl p-3.5 text-center">
          <div className="font-display text-2xl font-semibold text-olive">
            {completedDays.length}/40
          </div>
          <div className="text-[0.68rem] text-ink-soft mt-0.5">movimentos</div>
        </div>
        <div className="flex-1 bg-white border border-line rounded-2xl p-3.5 text-center">
          <div className="font-display text-2xl font-semibold text-olive">
            {parts.filter((p) => p.done === p.total).length}/4
          </div>
          <div className="text-[0.68rem] text-ink-soft mt-0.5">partes</div>
        </div>
      </div>

      <div className="bg-white border border-line rounded-2xl p-4.5 mb-4">
        <span className="font-mono text-[0.65rem] uppercase tracking-wide text-terracota mb-3 block">
          Progresso por parte
        </span>
        <div className="strata gap-2.5">
          {parts.map((p, i) => (
            <div className="layer h-3.5" key={p.part}>
              <div
                className="fill"
                style={{
                  width: `${(p.done / p.total) * 100}%`,
                  background: PART_COLORS[i],
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-line rounded-2xl p-4.5 mb-4">
        <span className="font-mono text-[0.65rem] uppercase tracking-wide text-terracota mb-1 block">
          Protocolo de 21 dias
        </span>
        <p className="text-sm text-ink-soft mb-2.5">
          {protocolStarted
            ? "Sua ação diária escolhida no Dia 25, em prática desde o Dia 30."
            : "Desbloqueia ao concluir a Parte III (Dia 30)."}
        </p>
        <div className="grid grid-cols-7 gap-1.5">
          {protocolDays.map((d) => {
            const day = 30 + d;
            const isDone = completedDays.includes(day);
            return (
              <div
                key={d}
                className={`aspect-square rounded-lg flex items-center justify-center font-mono text-[0.62rem] ${
                  isDone ? "bg-terracota text-white" : "bg-bege text-ink-soft"
                }`}
              >
                {d}
              </div>
            );
          })}
        </div>
      </div>

      {unlocked40 && (
        <Link
          href="/manutencao"
          className="block text-center border border-olive text-olive font-semibold text-sm rounded-xl py-3.5 mb-5"
        >
          Ver plano de manutenção
        </Link>
      )}
    </div>
  );
}
