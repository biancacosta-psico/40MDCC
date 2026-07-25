import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { movements } from "@/lib/movements";

export default async function MovimentosPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id: string })?.id;
  const progress = await prisma.progress.findMany({ where: { userId } });
  const completedDays = new Set(progress.map((p) => p.day));
  const nextDay = movements.find((m) => !completedDays.has(m.day))?.day ?? 41;

  const parts = [1, 2, 3, 4];

  return (
    <div className="pt-10 px-6 pb-6">
      <h1 className="font-display text-xl font-semibold text-olive mb-1.5">40 Movimentos</h1>
      <p className="text-sm text-ink-soft mb-2">
        Sua trilha, em ordem. Cada parte constrói sobre a anterior.
      </p>

      {parts.map((part) => {
        const daysInPart = movements.filter((m) => m.part === part);
        const doneCount = daysInPart.filter((m) => completedDays.has(m.day)).length;

        return (
          <div key={part}>
            <div className="flex justify-between items-baseline mt-5 mb-2">
              <span className="font-display font-semibold text-olive text-sm">
                {["I", "II", "III", "IV"][part - 1]} · {daysInPart[0].partName}
              </span>
              <span className="font-mono text-[0.68rem] text-ink-soft">
                {doneCount}/{daysInPart.length}
              </span>
            </div>

            {daysInPart.map((m) => {
              const done = completedDays.has(m.day);
              const isCurrent = m.day === nextDay;
              const locked = !done && !isCurrent;

              const content = (
                <div
                  className={`flex items-center gap-3 py-3 border-b border-line ${
                    locked ? "opacity-50" : "cursor-pointer"
                  }`}
                >
                  <div
                    className={`w-[34px] h-[34px] rounded-[10px] flex items-center justify-center font-mono text-xs font-semibold flex-shrink-0 ${
                      done
                        ? "bg-olive text-white"
                        : isCurrent
                        ? "bg-terracota text-white"
                        : "bg-bege text-ink-soft"
                    }`}
                  >
                    {done ? "✓" : locked ? "🔒" : m.day}
                  </div>
                  <div className="flex-1">
                    <div className="font-mono text-[0.62rem] uppercase tracking-wide text-bronze mb-0.5">
                      Dia {String(m.day).padStart(2, "0")}
                    </div>
                    <div className="text-sm font-semibold text-ink">{m.title}</div>
                    {isCurrent && <div className="text-xs text-ink-soft">Hoje</div>}
                  </div>
                </div>
              );

              return locked ? (
                <div key={m.day}>{content}</div>
              ) : (
                <Link key={m.day} href={`/movimentos/${m.day}`}>
                  {content}
                </Link>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
