import { NextResponse } from "next/server";
import { getRSVPSummary } from "@/lib/rsvpStore";

export const runtime = "nodejs";

function isAuthorized(request: Request) {
  const adminToken = process.env.ADMIN_TOKEN;

  if (!adminToken && process.env.NODE_ENV !== "production") {
    return true;
  }

  const url = new URL(request.url);
  const providedToken =
    request.headers.get("x-admin-token") ?? url.searchParams.get("token") ?? "";

  return Boolean(adminToken && providedToken === adminToken);
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
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
