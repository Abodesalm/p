import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAuthenticated } from "@/middleware/auth";

// Call this after any dashboard mutation to instantly refresh public pages
// POST /api/revalidate  { paths: ["/", "/projects", "/articles"] }
export async function POST(req: NextRequest) {
  const authed = await isAuthenticated();
  if (!authed)
    return NextResponse.json(
      { status: "error", message: "Unauthorized" },
      { status: 401 },
    );

  try {
    const { paths } = await req.json();

    const toRevalidate: string[] =
      Array.isArray(paths) && paths.length > 0
        ? paths
        : ["/", "/projects", "/articles"]; // default: revalidate all public pages

    toRevalidate.forEach((p) => revalidatePath(p));

    return NextResponse.json({ status: "success", revalidated: toRevalidate });
  } catch (e: any) {
    return NextResponse.json(
      { status: "error", message: e.message },
      { status: 500 },
    );
  }
}
