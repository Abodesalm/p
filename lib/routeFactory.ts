import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { isAuthenticated } from "@/middleware/auth";
import { Model } from "mongoose";

function ok(data: any, status = 200) {
  return NextResponse.json({ status: "success", data }, { status });
}

function err(message: string, status = 400) {
  return NextResponse.json({ status: "error", message }, { status });
}

async function guard() {
  const authed = await isAuthenticated();
  if (!authed)
    return NextResponse.json(
      { status: "error", message: "Unauthorized" },
      { status: 401 },
    );
  return null;
}

// ── Collection: GET all + POST new ───────────────────────────────────────────
// Public GET filters out hidden items automatically
// Dashboard can pass ?all=true to get everything including hidden
export function makeCollectionHandlers(Model: Model<any>) {
  const GET = async (req: NextRequest) => {
    try {
      await connectDB();
      const { searchParams } = new URL(req.url);
      const showAll = searchParams.get("all") === "true";

      // If ?all=true, require auth and return everything (for dashboard)
      if (showAll) {
        const authed = await isAuthenticated();
        if (!authed)
          return NextResponse.json(
            { status: "error", message: "Unauthorized" },
            { status: 401 },
          );
        const docs = await Model.find().sort({ createdAt: -1 });
        return ok(docs);
      }

      // Public: filter out hidden items
      const docs = await Model.find({ hidden: { $ne: true } }).sort({
        createdAt: -1,
      });
      return ok(docs);
    } catch (e: any) {
      return err(e.message, 500);
    }
  };

  const POST = async (req: NextRequest) => {
    const denied = await guard();
    if (denied) return denied;
    try {
      await connectDB();
      const body = await req.json();
      const doc = await Model.create(body);
      return ok(doc, 201);
    } catch (e: any) {
      return err(e.message, 500);
    }
  };

  return { GET, POST };
}

// ── Document: GET one + PATCH + DELETE ───────────────────────────────────────
// Next.js 15: params is a Promise — must be awaited
export function makeDocumentHandlers(Model: Model<any>) {
  const GET = async (
    req: NextRequest,
    context: { params: Promise<{ id: string }> },
  ) => {
    try {
      const { id } = await context.params;
      await connectDB();
      const doc = await Model.findById(id);
      if (!doc) return err("Not found", 404);
      return ok(doc);
    } catch (e: any) {
      return err(e.message, 500);
    }
  };

  const PATCH = async (
    req: NextRequest,
    context: { params: Promise<{ id: string }> },
  ) => {
    const denied = await guard();
    if (denied) return denied;
    try {
      const { id } = await context.params;
      await connectDB();
      const body = await req.json();
      const doc = await Model.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true,
      });
      if (!doc) return err("Not found", 404);
      return ok(doc);
    } catch (e: any) {
      return err(e.message, 500);
    }
  };

  const DELETE = async (
    req: NextRequest,
    context: { params: Promise<{ id: string }> },
  ) => {
    const denied = await guard();
    if (denied) return denied;
    try {
      const { id } = await context.params;
      await connectDB();
      const doc = await Model.findByIdAndDelete(id);
      if (!doc) return err("Not found", 404);
      return ok({ deleted: true });
    } catch (e: any) {
      return err(e.message, 500);
    }
  };

  return { GET, PATCH, DELETE };
}
