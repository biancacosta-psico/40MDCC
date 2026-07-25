import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const userId = (session.user as { id: string }).id;
  const progress = await prisma.progress.findMany({
    where: { userId },
    orderBy: { day: "asc" },
  });

  return NextResponse.json({ progress });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const userId = (session.user as { id: string }).id;
  const body = await req.json().catch(() => null);
  const day = Number(body?.day);
  const answer: string | undefined = body?.answer;

  if (!day || day < 1 || day > 40) {
    return NextResponse.json({ error: "dia inválido" }, { status: 400 });
  }

  const entry = await prisma.progress.upsert({
    where: { userId_day: { userId, day } },
    update: { answer },
    create: { userId, day, answer },
  });

  return NextResponse.json({ entry });
}
