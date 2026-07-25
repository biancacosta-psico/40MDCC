import { getServerSession } from "next-auth";
import Link from "next/link";
import { notFound } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getMovement } from "@/lib/movements";
import DayExerciseForm from "@/components/DayExerciseForm";

export default async function DayPage({ params }: { params: Promise<{ dia: string }> }) {
  const { dia } = await params;
  const day = Number(dia);
  const movement = getMovement(day);
  if (!movement) notFound();

  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id: string })?.id;
  const entry = await prisma.progress.findUnique({
    where: { userId_day: { userId, day } },
  });

  return (
    <div className="px-5 py-6 md:px-8 md:py-8">
      <Link
        href="/movimentos"
        className="inline-block text-sm font-semibold text-olive border border-olive rounded-xl px-4 py-2 mb-4"
      >
        ← Voltar à trilha
      </Link>

      <span className="font-mono text-[0.68rem] uppercase tracking-wide text-terracota">
        {movement.partName} · Dia {movement.day} de 40
      </span>
      <h1 className="font-display text-2xl font-semibold text-olive mt-1.5 mb-4">
        {movement.title}
      </h1>

      <div className="bg-olive text-offwhite rounded-2xl p-4.5 mb-3.5">
        <span className="font-mono text-[0.68rem] uppercase tracking-wide text-[#c8cf9e] mb-2 block">
          Frase de impacto
        </span>
        <p className="font-display italic text-lg leading-snug">"{movement.quote}"</p>
        <span className="block mt-3 font-mono text-[0.68rem] uppercase tracking-wide text-bronze">
          {movement.quoteAuthor}
        </span>
      </div>

      <div className="bg-white border border-line rounded-2xl p-4.5 mb-3.5">
        <span className="font-mono text-[0.65rem] uppercase tracking-wide text-bronze mb-2 block">
          Reflexão
        </span>
        <p className="text-sm text-ink-soft leading-relaxed">{movement.reflection}</p>
      </div>

      <DayExerciseForm day={movement.day} initialAnswer={entry?.answer ?? ""} alreadyDone={!!entry} />

      <div className="bg-bege rounded-2xl p-4.5">
        <span className="font-mono text-[0.65rem] uppercase tracking-wide text-bronze mb-2 block">
          Pra fechar com leveza
        </span>
        <p className="text-sm text-ink-soft leading-relaxed">{movement.closing}</p>
      </div>
    </div>
  );
}
