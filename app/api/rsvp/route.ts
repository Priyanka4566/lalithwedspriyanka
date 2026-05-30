import { NextResponse } from "next/server";
import { parseRSVPSubmission } from "@/lib/rsvp";
import { saveRSVP } from "@/lib/rsvpStore";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const submission = parseRSVPSubmission(payload);
    const saved = await saveRSVP(submission);

    return NextResponse.json({
      ok: true,
      id: saved.id,
      updatedAt: saved.updatedAt,
    });
  } catch (error) {
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
