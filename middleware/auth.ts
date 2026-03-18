import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { sessionOptions, SessionData } from "@/lib/lib";

// Methods that require authentication (only you can use these)
const PROTECTED_METHODS = ["POST", "PATCH", "PUT", "DELETE"];

/**
 * Wraps an API route handler with auth protection.
 * - GET requests pass through freely (public)
 * - POST / PATCH / PUT / DELETE require a valid session (isLoged === true)
 *
 * Usage in any route file:
 *   export const POST = withAuth(async (req) => { ... });
 *   export const GET  = async (req) => { ... };  // no auth needed
 */
export function withAuth(
  handler: (req: NextRequest, context?: any) => Promise<NextResponse>,
) {
  return async (req: NextRequest, context?: any) => {
    if (PROTECTED_METHODS.includes(req.method)) {
      const session = await getIronSession<SessionData>(
        await cookies(),
        sessionOptions,
      );

      if (!session.isLoged) {
        return NextResponse.json(
          { status: "error", message: "Unauthorized" },
          { status: 401 },
        );
      }
    }

    return handler(req, context);
  };
}

/**
 * Standalone auth check — use inside a handler if you need
 * to verify auth manually (e.g. for dynamic checks).
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions,
  );
  return session.isLoged === true;
}
