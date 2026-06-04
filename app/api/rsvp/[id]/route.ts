import { NextResponse } from "next/server";
import { isAuthorizedAdminRequest } from "@/lib/adminAuth";
import { deleteRSVP } from "@/lib/rsvpStore";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function DELETE(request: Request, context: RouteContext) {
  if (!isAuthorizedAdminRequest(request)) {
    return NextResponse.json(
      {
        ok: false,
        error: "Unauthorized",
      },
      { status: 401 },
    );
  }

  const { id } = await context.params;

  if (!id) {
    return NextResponse.json(
      {
        ok: false,
        error: "Missing RSVP id",
      },
      { status: 400 },
    );
  }

  try {
    const deleted = await deleteRSVP(id);

    if (!deleted) {
      return NextResponse.json(
        {
          ok: false,
          error: "RSVP not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      ok: true,
      id,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to delete RSVP";

    return NextResponse.json(
      {
        ok: false,
        error: message,
      },
      { status: 500 },
    );
  }
}
