import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Skill } from "@/models/Skill";
import { verifyAdmin } from "@/lib/auth";

export async function GET() {
  await connectDB();
  const data = await Skill.find().sort({ createdAt: -1 });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  verifyAdmin(req);
  await connectDB();

  const body = await req.json();
  const created = await Skill.create(body);

  return NextResponse.json(created, { status: 201 });
}
