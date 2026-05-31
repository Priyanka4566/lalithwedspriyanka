import { NextResponse } from "next/server";
import { parseRSVPSubmission } from "@/lib/rsvp";
import { describeRSVP, DuplicateRSVPError, saveRSVP } from "@/lib/rsvpStore";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const submission = parseRSVPSubmission(payload);
    const body = payload && typeof payload === "object" ? payload as Record<string, unknown> : {};
    const saved = await saveRSVP(submission, {
      allowUpdate: body.confirmOverwrite === true,
    });

    return NextResponse.json({
      ok: true,
      id: saved.id,
      updatedAt: saved.updatedAt,
    });
  } catch (error) {
    if (error instanceof DuplicateRSVPError) {
      return NextResponse.json(
        {
          ok: false,
          duplicate: true,
          error: error.message,
          existing: describeRSVP(error.existing),
        },
        { status: 409 },
      );
    }

    const message = error instanceof Error ? error.message : "Unable to save RSVP";

    return NextResponse.json(
      {
        ok: false,
        error: message,
      },
      { status: 400 },
    );
  }
}
