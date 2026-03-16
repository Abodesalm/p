import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Article } from "@/models/Article";
import { verifyAdmin } from "@/lib/auth";

export async function GET() {
  await connectDB();
  const data = await Article.find().sort({ createdAt: -1 });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  verifyAdmin(req);
  await connectDB();

  const body = await req.json();
  const created = await Article.create(body);

  return NextResponse.json(created, { status: 201 });
}
