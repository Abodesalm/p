import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Info } from "@/models/Info";
import { verifyAdmin } from "@/lib/auth";

export async function GET() {
  await connectDB();
  const data = await Info.findOne();
  return NextResponse.json(data);
}

export async function PUT(req: Request) {
  verifyAdmin(req);
  await connectDB();

  const body = await req.json();

  const updated = await Info.findOneAndUpdate({}, body, {
    new: true,
    upsert: true,
  });

  return NextResponse.json(updated);
}
