"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DayExerciseForm({
  day,
  initialAnswer,
  alreadyDone,
}: {
  day: number;
  initialAnswer: string;
  alreadyDone: boolean;
}) {
  const router = useRouter();
  const [answer, setAnswer] = useState(initialAnswer);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(alreadyDone);

  async function handleComplete() {
    setSaving(true);
    await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ day, answer }),
    });
    setSaving(false);
    setDone(true);
    router.push("/home");
    router.refresh();
  }

  return (
    <>
      <div className="bg-[#FBEFE8] border border-[#e8c9b6] rounded-2xl p-4.5 mb-3.5">
        <span className="font-mono text-[0.65rem] uppercase tracking-wide text-bronze mb-2 block">
          Exercício do dia
        </span>
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Escreva o que aconteceu..."
          className="w-full min-h-[90px] rounded-xl border border-line bg-white p-3 text-sm focus:outline-none focus:ring-2 focus:ring-terracota"
        />
      </div>

      <div className="px-0 pb-6">
        <button
          onClick={handleComplete}
          disabled={saving}
          className="w-full rounded-xl bg-terracota text-white font-semibold text-sm py-3.5 disabled:opacity-60"
        >
          {saving
            ? "Salvando..."
            : done
            ? `Dia ${day} concluído · atualizar resposta`
            : `Marcar Dia ${day} como concluído`}
        </button>
      </div>
    </>
  );
}
