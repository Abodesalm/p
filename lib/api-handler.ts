import { NextResponse } from "next/server";

export async function apiHandler(callback: () => Promise<any>) {
  try {
    const data = await callback();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
