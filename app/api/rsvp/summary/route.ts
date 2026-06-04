import { NextResponse } from "next/server";
import { isAuthorizedAdminRequest } from "@/lib/adminAuth";
import { getRSVPSummary } from "@/lib/rsvpStore";

export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!isAuthorizedAdminRequest(request)) {
    return NextResponse.json(
      {
        ok: false,
        error: "Unauthorized",
      },
      { status: 401 },
    );
  }

  try {
    const summary = await getRSVPSummary();
    return NextResponse.json({
      ok: true,
      summary,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load RSVP summary";

    return NextResponse.json(
      {
        ok: false,
        error: message,
      },
      { status: 500 },
    );
  }
}
