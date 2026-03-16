import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Article } from "@/models/Article";
import { verifyAdmin } from "@/lib/auth";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
  verifyAdmin(req);
  await connectDB();

  const body = await req.json();
  const updated = await Article.findByIdAndUpdate(params.id, body, {
    new: true,
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  verifyAdmin(req);
  await connectDB();

  await Article.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
}
