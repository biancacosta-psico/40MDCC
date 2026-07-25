"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("E-mail ou senha incorretos. Verifique o e-mail que você recebeu após a compra.");
      return;
    }

    router.push("/home");
    router.refresh();
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-bege to-offwhite px-6">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <div className="font-display text-lg font-semibold text-olive mb-2">Bianca Costa</div>
          <div className="flex justify-center gap-1.5 mb-6">
            <span className="w-10 h-1.5 rounded bg-olive" />
            <span className="w-6 h-1.5 rounded bg-terracota" />
            <span className="w-3 h-1.5 rounded bg-bronze" />
          </div>
          <h1 className="font-display text-2xl font-semibold text-olive leading-tight">
            Da Consciência ao Comportamento
          </h1>
          <p className="text-ink-soft text-sm mt-2">
            Acesse com o e-mail e a senha que você recebeu após a compra na Hotmart.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-olive mb-1.5" htmlFor="email">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-terracota"
              placeholder="voce@email.com"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-olive mb-1.5" htmlFor="password">
              Senha
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-terracota"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-sm text-terracota bg-terracota/10 border border-terracota/30 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-terracota text-white font-semibold text-sm py-3.5 hover:brightness-110 transition disabled:opacity-60"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="text-center text-xs text-ink-soft mt-8">
          Ainda não comprou?{" "}
          <a href="https://hotmart.com" className="text-terracota font-semibold underline">
            Conheça o método
          </a>
        </p>
      </div>
    </main>
  );
}
