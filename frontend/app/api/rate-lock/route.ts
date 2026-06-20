import { NextResponse } from "next/server";

function parseRateLock(text: string) {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split(/\s+/);
      const days = parts.find((part) => /^\d{2,3}$/.test(part)) ?? "";
      const rate = parts.find((part) => /^\d\.\d{2,3}%?$/.test(part)) ?? "";
      const price = parts.find((part) => /^-?\d+\.\d{2,3}$/.test(part) && part !== rate.replace("%", "")) ?? "";
      return { raw: line, lockPeriodDays: days, rate: rate.includes("%") ? rate : `${rate}%`, price };
    });
}

export async function POST(request: Request) {
  const body = (await request.json()) as { text?: string };
  return NextResponse.json({ rows: parseRateLock(body.text ?? "") });
}
