import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { XP } from "@/models/XP";
import { verifyAdmin } from "@/lib/auth";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
  verifyAdmin(req);
  await connectDB();

  const body = await req.json();
  const updated = await XP.findByIdAndUpdate(params.id, body, { new: true });

  return NextResponse.json(updated);
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  verifyAdmin(req);
  await connectDB();

  await XP.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
}
