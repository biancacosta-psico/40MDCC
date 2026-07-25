import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function ManutencaoPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id: string })?.id;
  const day40 = await prisma.progress.findUnique({ where: { userId_day: { userId, day: 40 } } });

  return (
    <div className="px-5 py-6 md:px-8 md:py-8">
      <Link
        href="/dashboard"
        className="inline-block text-sm font-semibold text-olive border border-olive rounded-xl px-4 py-2 mb-4"
      >
        ← Voltar
      </Link>

      {!day40 ? (
        <div className="text-center py-16">
          <p className="text-sm text-ink-soft">
            Essa página é liberada ao concluir o Dia 40. Continue sua trilha até lá.
          </p>
        </div>
      ) : (
        <>
          <span className="font-mono text-[0.68rem] uppercase tracking-wide text-terracota">
            Desbloqueado no Dia 40
          </span>
          <h1 className="font-display text-2xl font-semibold text-olive mt-1.5 mb-4">
            Plano de manutenção
          </h1>

          <div className="bg-white border border-line rounded-2xl p-5.5 font-display italic text-ink leading-relaxed mb-4">
            Guarde a data de hoje. Daqui a 21 dias, releia a carta que você escreveu no Dia 40 e
            observe, com as suas próprias palavras, a distância que você já percorreu.
            <span className="block mt-3 not-italic font-mono text-[0.7rem] text-terracota">
              Com carinho, Bianca
            </span>
          </div>

          <div className="bg-white border border-line rounded-2xl p-4.5">
            <span className="font-mono text-[0.65rem] uppercase tracking-wide text-bronze mb-2 block">
              Sua ação de manutenção
            </span>
            <p className="text-sm text-ink-soft leading-relaxed">
              A mesma ação pequena do Protocolo de 21 dias continua sendo registrada aqui.
              Constância é feita de retorno, não de perfeição.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
