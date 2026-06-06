export const rsvpEvents = [
  { id: "sangeeth", title: "Engagement/Sangeet", date: "July 2, 2026" },
  { id: "haldi", title: "Haldi Ceremony", date: "July 3, 2026" },
] as const;

export type RSVPEventId = (typeof rsvpEvents)[number]["id"];
export type RSVPStatus = "all" | "selected" | "decline";
export type SangeetAlcohol = "yes" | "no";

export type RSVPSubmission = {
  name: string;
  email: string;
  status: RSVPStatus;
  eventIds: RSVPEventId[];
  guestCount: number;
  message: string;
  sangeetAlcohol?: SangeetAlcohol;
};

export type StoredRSVP = RSVPSubmission & {
  id: string;
  partyKey: string;
  createdAt: string;
  updatedAt: string;
};

export type RSVPSummary = {
  generatedAt: string;
  totals: {
    responses: number;
    attendingParties: number;
    declinedParties: number;
    totalGuests: number;
  };
  events: Array<{
    id: RSVPEventId;
    title: string;
    date: string;
    partyCount: number;
    guestCount: number;
    attendees: Array<{
      name: string;
      email: string;
      guestCount: number;
    }>;
  }>;
  sangeetAlcohol: {
    yes: number;
    no: number;
  };
  responses: Array<{
    id: string;
    name: string;
    email: string;
    status: RSVPStatus;
    events: string[];
    guestCount: number;
    message: string;
    sangeetAlcohol?: SangeetAlcohol;
    updatedAt: string;
  }>;
};

const eventIds = new Set<string>(rsvpEvents.map((event) => event.id));

function readString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function readInteger(value: unknown) {
  const number = typeof value === "number" ? value : Number(value);
  return Number.isInteger(number) ? number : Number.NaN;
}

function isRSVPStatus(value: string): value is RSVPStatus {
  return value === "all" || value === "selected" || value === "decline";
}

function isRSVPEventId(value: string): value is RSVPEventId {
  return eventIds.has(value);
}

function isSangeetAlcohol(value: string): value is SangeetAlcohol {
  return value === "yes" || value === "no";
}

export function parseRSVPSubmission(payload: unknown): RSVPSubmission {
  if (!payload || typeof payload !== "object") {
    throw new Error("Invalid RSVP payload");
  }

  const body = payload as Record<string, unknown>;
  const name = readString(body.name);
  const email = readString(body.email).toLowerCase();
  const statusValue = readString(body.status);
  const message = readString(body.message);

  if (!name) {
    throw new Error("Please enter your name");
  }

  if (!email) {
    throw new Error("Please enter your email address");
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Please enter a valid email address");
  }

  if (!isRSVPStatus(statusValue)) {
    throw new Error("Please select your RSVP status");
  }

  const status = statusValue;
  const isAttending = status === "all" || status === "selected";
  const rawEventIds = Array.isArray(body.eventIds) ? body.eventIds.map(readString) : [];
  const selectedEventIds = rawEventIds.filter(isRSVPEventId);

  let eventIdsForSubmission: RSVPEventId[] = [];
  if (status === "all") {
    eventIdsForSubmission = rsvpEvents.map((event) => event.id);
  } else if (status === "selected") {
    if (!selectedEventIds.length) {
      throw new Error("Please select at least one event");
    }
    const uniqueSelectedEventIds = Array.from(new Set(selectedEventIds));
    if (uniqueSelectedEventIds.length > 1) {
      throw new Error("Please select only one event or choose Attending All Events");
    }
    eventIdsForSubmission = uniqueSelectedEventIds;
  }

  if (!isAttending) {
    return {
      name,
      email,
      status,
      eventIds: [],
      guestCount: 0,
      message,
      sangeetAlcohol: undefined,
    };
  }

  const guestCount = readInteger(body.guestCount);
  if (!Number.isInteger(guestCount) || guestCount < 1 || guestCount > 10) {
    throw new Error("Please enter the number of guests attending");
  }

  const attendingSangeeth =
    status === "all" || eventIdsForSubmission.includes("sangeeth");
  const rawAlcohol = readString(body.sangeetAlcohol);
  const sangeetAlcohol =
    attendingSangeeth && isSangeetAlcohol(rawAlcohol) ? rawAlcohol : undefined;

  return {
    name,
    email,
    status,
    eventIds: eventIdsForSubmission,
    guestCount,
    message,
    sangeetAlcohol,
  };
}

export function createPartyKey(submission: Pick<RSVPSubmission, "email" | "name">) {
  return submission.email.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function buildRSVPSummary(responses: StoredRSVP[]): RSVPSummary {
  const attendingResponses = responses.filter((response) => response.status !== "decline");
  const eventSummaries = rsvpEvents.map((event) => {
    const attendees = attendingResponses.filter((response) =>
      response.eventIds.includes(event.id),
    );

    return {
      id: event.id,
      title: event.title,
      date: event.date,
      partyCount: attendees.length,
      guestCount: attendees.reduce((total, response) => total + response.guestCount, 0),
      attendees: attendees.map((response) => ({
        name: response.name,
        email: response.email,
        guestCount: response.guestCount,
      })),
    };
  });

  const sangeetAttendees = attendingResponses.filter((response) =>
    response.eventIds.includes("sangeeth"),
  );
  const sangeetAlcoholYes = sangeetAttendees.filter(
    (response) => response.sangeetAlcohol === "yes",
  ).length;
  const sangeetAlcoholNo = sangeetAttendees.filter(
    (response) => response.sangeetAlcohol === "no",
  ).length;

  return {
    generatedAt: new Date().toISOString(),
    totals: {
      responses: responses.length,
      attendingParties: attendingResponses.length,
      declinedParties: responses.filter((response) => response.status === "decline").length,
      totalGuests: attendingResponses.reduce((total, response) => total + response.guestCount, 0),
    },
    events: eventSummaries,
    sangeetAlcohol: {
      yes: sangeetAlcoholYes,
      no: sangeetAlcoholNo,
    },
    responses: responses.map((response) => ({
      id: response.id,
      name: response.name,
      email: response.email,
      status: response.status,
      events: rsvpEvents
        .filter((event) => response.eventIds.includes(event.id))
        .map((event) => event.title),
      guestCount: response.guestCount,
      message: response.message,
      sangeetAlcohol: response.sangeetAlcohol,
      updatedAt: response.updatedAt,
    })),
  };
}
