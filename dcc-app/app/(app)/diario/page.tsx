import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getMovement } from "@/lib/movements";

export default async function DiarioPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id: string })?.id;

  const entries = await prisma.progress.findMany({
    where: { userId, NOT: { answer: null } },
    orderBy: { day: "desc" },
  });

  return (
    <div className="px-5 py-6 md:px-8 md:py-8">
      <h1 className="font-display text-xl font-semibold text-olive mb-1.5">Diário</h1>
      <p className="text-sm text-ink-soft mb-2">Suas respostas aos exercícios, no seu ritmo.</p>

      {entries.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-sm text-ink-soft">
            Suas respostas aparecem aqui assim que você completar o primeiro movimento.
          </p>
        </div>
      ) : (
        <div className="mt-4">
          {entries.map((entry) => {
            const movement = getMovement(entry.day);
            return (
              <div key={entry.id} className="flex gap-3.5 py-4 border-b border-line">
                <div className="font-mono text-[0.68rem] text-terracota w-14 flex-shrink-0 pt-0.5">
                  DIA {String(entry.day).padStart(2, "0")}
                </div>
                <div>
                  <div className="text-sm font-semibold mb-1">{movement?.title}</div>
                  <div className="text-[0.8rem] text-ink-soft leading-relaxed">{entry.answer}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
