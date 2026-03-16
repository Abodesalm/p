import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Project } from "@/models/Project";
import { verifyAdmin } from "@/lib/auth";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
  verifyAdmin(req);
  await connectDB();

  const body = await req.json();
  const updated = await Project.findByIdAndUpdate(params.id, body, {
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

  await Project.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
}
