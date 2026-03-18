import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { isAuthenticated } from "@/middleware/auth";
import { Model } from "mongoose";

// ── helpers ──────────────────────────────────────────────────────────────────

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

// ── factory ──────────────────────────────────────────────────────────────────

/**
 * Creates the four standard handlers for a collection route  /api/<resource>
 * and a document route  /api/<resource>/[id]
 *
 * Usage in route.ts:
 *   import { makeCollectionHandlers } from "@/lib/routeFactory";
 *   import { MyModel } from "@/models/MyModel";
 *   export const { GET, POST } = makeCollectionHandlers(MyModel);
 *
 * Usage in [id]/route.ts:
 *   import { makeDocumentHandlers } from "@/lib/routeFactory";
 *   import { MyModel } from "@/models/MyModel";
 *   export const { GET, PATCH, DELETE } = makeDocumentHandlers(MyModel);
 */

// ── Collection: GET all + POST new ───────────────────────────────────────────
export function makeCollectionHandlers(Model: Model<any>) {
  const GET = async (req: NextRequest) => {
    try {
      await connectDB();
      const docs = await Model.find().sort({ createdAt: -1 });
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
export function makeDocumentHandlers(Model: Model<any>) {
  const GET = async (
    req: NextRequest,
    { params }: { params: { id: string } },
  ) => {
    try {
      await connectDB();
      const doc = await Model.findById(params.id);
      if (!doc) return err("Not found", 404);
      return ok(doc);
    } catch (e: any) {
      return err(e.message, 500);
    }
  };

  const PATCH = async (
    req: NextRequest,
    { params }: { params: { id: string } },
  ) => {
    const denied = await guard();
    if (denied) return denied;
    try {
      await connectDB();
      const body = await req.json();
      const doc = await Model.findByIdAndUpdate(params.id, body, {
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
    { params }: { params: { id: string } },
  ) => {
    const denied = await guard();
    if (denied) return denied;
    try {
      await connectDB();
      const doc = await Model.findByIdAndDelete(params.id);
      if (!doc) return err("Not found", 404);
      return ok({ deleted: true });
    } catch (e: any) {
      return err(e.message, 500);
    }
  };

  return { GET, PATCH, DELETE };
}
