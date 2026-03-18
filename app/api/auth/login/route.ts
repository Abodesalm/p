import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { sessionOptions, SessionData } from "@/lib/lib";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD as string;

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();

    if (!password || password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { status: "error", message: "Invalid password" },
        { status: 401 },
      );
    }

    const session = await getIronSession<SessionData>(
      await cookies(),
      sessionOptions,
    );

    session.isLoged = true;
    await session.save();

    return NextResponse.json({ status: "success", message: "Logged in" });
  } catch {
    return NextResponse.json(
      { status: "error", message: "Something went wrong" },
      { status: 500 },
    );
  }
}
