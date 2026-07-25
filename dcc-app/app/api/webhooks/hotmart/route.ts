import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { Resend } from "resend";

// Eventos que LIBERAM acesso
const GRANT_EVENTS = ["PURCHASE_APPROVED", "PURCHASE_COMPLETE"];
// Eventos que REVOGAM acesso
const REVOKE_EVENTS = [
  "PURCHASE_REFUNDED",
  "PURCHASE_CHARGEBACK",
  "PURCHASE_CANCELED",
  "PURCHASE_EXPIRED",
  "PURCHASE_PROTEST",
];

function generatePassword(length = 10) {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  let out = "";
  for (let i = 0; i < length; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

async function sendCredentialsEmail(email: string, name: string | undefined, password: string) {
  if (!process.env.RESEND_API_KEY) {
    // Em desenvolvimento, sem RESEND_API_KEY configurada, só loga no console.
    console.log(`[dev] Credenciais para ${email}: senha ${password}`);
    return;
  }
  const resend = new Resend(process.env.RESEND_API_KEY);
  const loginUrl = `${process.env.NEXTAUTH_URL ?? ""}/login`;

  await resend.emails.send({
    from: process.env.EMAIL_FROM ?? "acesso@seudominio.com",
    to: email,
    subject: "Seu acesso: Da Consciência ao Comportamento",
    html: `
      <div style="font-family: Georgia, serif; max-width:480px; margin:0 auto; padding:24px; background:#FAF3E7; color:#2B2318;">
        <p>Olá${name ? `, ${name}` : ""}!</p>
        <p>Sua compra foi confirmada e seu acesso já está liberado.</p>
        <p style="background:#E4D3B8; padding:16px; border-radius:8px;">
          <strong>Login:</strong> ${email}<br/>
          <strong>Senha:</strong> ${password}
        </p>
        <p><a href="${loginUrl}" style="background:#A8552E; color:#fff; padding:12px 20px; border-radius:8px; text-decoration:none; display:inline-block;">Acessar agora</a></p>
        <p style="font-size:13px; color:#7A715E;">Recomendamos trocar essa senha no primeiro acesso.</p>
      </div>
    `,
  });
}

export async function POST(req: NextRequest) {
  // A Hotmart envia o token configurado no cabeçalho X-HOTMART-HOTTOK
  // (em versões antigas, pode vir via query string ?hottok=)
  const hottok =
    req.headers.get("x-hotmart-hottok") ?? req.nextUrl.searchParams.get("hottok");

  if (!process.env.HOTMART_HOTTOK || hottok !== process.env.HOTMART_HOTTOK) {
    return NextResponse.json({ error: "hottok inválido" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "payload inválido" }, { status: 400 });
  }

  const event: string | undefined = body.event;
  const buyerEmail: string | undefined = body?.data?.buyer?.email;
  const buyerName: string | undefined = body?.data?.buyer?.name;
  const transactionId: string | undefined = body?.data?.purchase?.transaction;

  if (!buyerEmail) {
    return NextResponse.json({ error: "e-mail do comprador não encontrado" }, { status: 400 });
  }

  const email = buyerEmail.toLowerCase().trim();

  if (event && GRANT_EVENTS.includes(event)) {
    const existing = await prisma.user.findUnique({ where: { email } });

    if (existing) {
      // Reativa acesso se tinha sido revogado antes (ex: reembolso seguido de nova compra)
      await prisma.user.update({
        where: { email },
        data: { active: true, hotmartTransactionId: transactionId ?? existing.hotmartTransactionId },
      });
      return NextResponse.json({ received: true, action: "reactivated" });
    }

    const tempPassword = generatePassword();
    const passwordHash = await hash(tempPassword, 10);

    await prisma.user.create({
      data: {
        email,
        name: buyerName,
        passwordHash,
        hotmartTransactionId: transactionId,
      },
    });

    await sendCredentialsEmail(email, buyerName, tempPassword);

    return NextResponse.json({ received: true, action: "created" });
  }

  if (event && REVOKE_EVENTS.includes(event)) {
    await prisma.user.updateMany({
      where: { email },
      data: { active: false },
    });
    return NextResponse.json({ received: true, action: "revoked" });
  }

  return NextResponse.json({ received: true, ignored: event ?? "sem evento" });
}
