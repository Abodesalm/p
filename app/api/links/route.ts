import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Links } from "@/models/Links";
import { verifyAdmin } from "@/lib/auth";

export async function GET() {
  await connectDB();
  const data = await Links.find().sort({ createdAt: -1 });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  verifyAdmin(req);
  await connectDB();

  const body = await req.json();
  const created = await Links.create(body);

  return NextResponse.json(created, { status: 201 });
}
