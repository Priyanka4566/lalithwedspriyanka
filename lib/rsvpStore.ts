import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import {
  buildRSVPSummary,
  createPartyKey,
  rsvpEvents,
  type RSVPSubmission,
  type StoredRSVP,
} from "./rsvp";

type LocalDataFile = {
  responses: StoredRSVP[];
};

type SupabaseRSVP = {
  id: string;
  party_key: string;
  name: string;
  email: string | null;
  status: StoredRSVP["status"];
  event_ids: StoredRSVP["eventIds"];
  guest_count: number;
  message: string | null;
  sangeet_alcohol: string | null;
  created_at: string;
  updated_at: string;
};

export class DuplicateRSVPError extends Error {
  existing: StoredRSVP;

  constructor(existing: StoredRSVP) {
    super("An RSVP already exists for this email address");
    this.name = "DuplicateRSVPError";
    this.existing = existing;
  }
}

type SaveRSVPOptions = {
  allowUpdate?: boolean;
};

const dataDirectory = path.join(process.cwd(), "data");
const dataFile = path.join(dataDirectory, "rsvps.json");

function createId() {
  return `rsvp_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function hasSupabaseConfig() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

function shouldRequireSupabase() {
  return process.env.VERCEL === "1" || process.env.NODE_ENV === "production";
}

function assertProductionStorageConfigured() {
  if (!hasSupabaseConfig() && shouldRequireSupabase()) {
    throw new Error(
      "Supabase is not configured. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Vercel.",
    );
  }
}

function supabaseHeaders() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  return {
    apikey: key ?? "",
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
  };
}

function toStoredRSVP(row: SupabaseRSVP): StoredRSVP {
  return {
    id: row.id,
    partyKey: row.party_key,
    name: row.name,
    email: row.email ?? "",
    status: row.status,
    eventIds: row.event_ids,
    guestCount: row.guest_count,
    message: row.message ?? "",
    sangeetAlcohol:
      row.sangeet_alcohol === "yes" || row.sangeet_alcohol === "no"
        ? row.sangeet_alcohol
        : undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function readLocalData(): Promise<LocalDataFile> {
  try {
    const file = await readFile(dataFile, "utf8");
    const parsed = JSON.parse(file) as { responses?: Array<Record<string, unknown>> };
    const responses = Array.isArray(parsed.responses) ? parsed.responses : [];
    return {
      responses: responses.map((item) => ({
        id: String(item.id ?? ""),
        partyKey: String(item.partyKey ?? ""),
        name: String(item.name ?? ""),
        email: String(item.email ?? ""),
        status: item.status === "decline" || item.status === "all" || item.status === "selected"
          ? item.status
          : "decline",
        eventIds: Array.isArray(item.eventIds)
          ? (item.eventIds.filter((eventId) => eventId === "sangeeth" || eventId === "haldi") as StoredRSVP["eventIds"])
          : [],
        guestCount: Number(item.guestCount ?? 0) || 0,
        message: String(item.message ?? ""),
        sangeetAlcohol:
          item.sangeetAlcohol === "yes" || item.sangeetAlcohol === "no"
            ? item.sangeetAlcohol
            : undefined,
        createdAt: String(item.createdAt ?? new Date().toISOString()),
        updatedAt: String(item.updatedAt ?? new Date().toISOString()),
      })),
    };
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
      return { responses: [] };
    }

    throw error;
  }
}

async function writeLocalData(data: LocalDataFile) {
  await mkdir(dataDirectory, { recursive: true });
  await writeFile(dataFile, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

async function saveLocalRSVP(submission: RSVPSubmission): Promise<StoredRSVP> {
  const data = await readLocalData();
  const now = new Date().toISOString();
  const partyKey = createPartyKey(submission);
  const existingIndex = data.responses.findIndex((response) => response.partyKey === partyKey);
  const previous = existingIndex >= 0 ? data.responses[existingIndex] : undefined;

  const response: StoredRSVP = {
    ...submission,
    id: previous?.id ?? createId(),
    partyKey,
    createdAt: previous?.createdAt ?? now,
    updatedAt: now,
  };

  if (existingIndex >= 0) {
    data.responses[existingIndex] = response;
  } else {
    data.responses.push(response);
  }

  await writeLocalData(data);
  return response;
}

async function findLocalRSVPByPartyKey(partyKey: string): Promise<StoredRSVP | null> {
  const data = await readLocalData();

  return data.responses.find((response) => response.partyKey === partyKey) ?? null;
}

async function listLocalRSVPs(): Promise<StoredRSVP[]> {
  const data = await readLocalData();
  return data.responses.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

async function deleteLocalRSVP(id: string) {
  const data = await readLocalData();
  const nextResponses = data.responses.filter((response) => response.id !== id);

  if (nextResponses.length === data.responses.length) {
    return false;
  }

  await writeLocalData({ responses: nextResponses });
  return true;
}

async function findSupabaseRSVPByPartyKey(partyKey: string): Promise<StoredRSVP | null> {
  const response = await fetch(
    `${process.env.SUPABASE_URL}/rest/v1/rsvps?party_key=eq.${encodeURIComponent(
      partyKey,
    )}&select=*&limit=1`,
    { headers: supabaseHeaders(), cache: "no-store" },
  );

  if (!response.ok) {
    throw new Error("Unable to check existing RSVP");
  }

  const rows = (await response.json()) as SupabaseRSVP[];
  return rows[0] ? toStoredRSVP(rows[0]) : null;
}

async function saveSupabaseRSVP(submission: RSVPSubmission): Promise<StoredRSVP> {
  const partyKey = createPartyKey(submission);
  const saved = await fetch(
    `${process.env.SUPABASE_URL}/rest/v1/rpc/submit_rsvp`,
    {
      method: "POST",
      headers: {
        ...supabaseHeaders(),
      },
      body: JSON.stringify({
        rsvp_id: createId(),
        rsvp_party_key: partyKey,
        rsvp_name: submission.name,
        rsvp_email: submission.email || null,
        rsvp_status: submission.status,
        rsvp_event_ids: submission.eventIds,
        rsvp_guest_count: submission.guestCount,
        rsvp_message: submission.message || null,
        rsvp_sangeet_alcohol: submission.sangeetAlcohol ?? null,
      }),
      cache: "no-store",
    },
  );

  if (!saved.ok) {
    throw new Error("Unable to save RSVP");
  }

  const result = (await saved.json()) as SupabaseRSVP | SupabaseRSVP[];
  const row = Array.isArray(result) ? result[0] : result;

  if (!row) {
    throw new Error("Unable to save RSVP");
  }

  return toStoredRSVP(row);
}

async function listSupabaseRSVPs(): Promise<StoredRSVP[]> {
  const response = await fetch(
    `${process.env.SUPABASE_URL}/rest/v1/rsvps?select=*&order=updated_at.desc`,
    { headers: supabaseHeaders(), cache: "no-store" },
  );

  if (!response.ok) {
    throw new Error("Unable to load RSVPs");
  }

  const rows = (await response.json()) as SupabaseRSVP[];
  return rows.map(toStoredRSVP);
}

async function deleteSupabaseRSVP(id: string) {
  const response = await fetch(
    `${process.env.SUPABASE_URL}/rest/v1/rsvps?id=eq.${encodeURIComponent(id)}`,
    {
      method: "DELETE",
      headers: {
        ...supabaseHeaders(),
        Prefer: "return=representation",
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error("Unable to delete RSVP");
  }

  const rows = (await response.json()) as SupabaseRSVP[];
  return rows.length > 0;
}

export function describeRSVP(response: StoredRSVP) {
  return {
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
  };
}

export async function findRSVPBySubmissionIdentity(submission: RSVPSubmission) {
  const partyKey = createPartyKey(submission);

  if (hasSupabaseConfig()) {
    return findSupabaseRSVPByPartyKey(partyKey);
  }

  assertProductionStorageConfigured();

  return findLocalRSVPByPartyKey(partyKey);
}

export async function saveRSVP(
  submission: RSVPSubmission,
  options: SaveRSVPOptions = {},
) {
  const existing = await findRSVPBySubmissionIdentity(submission);

  if (existing && !options.allowUpdate) {
    throw new DuplicateRSVPError(existing);
  }

  if (hasSupabaseConfig()) {
    return saveSupabaseRSVP(submission);
  }

  assertProductionStorageConfigured();

  return saveLocalRSVP(submission);
}

export async function listRSVPs() {
  if (hasSupabaseConfig()) {
    return listSupabaseRSVPs();
  }

  assertProductionStorageConfigured();

  return listLocalRSVPs();
}

export async function deleteRSVP(id: string) {
  if (hasSupabaseConfig()) {
    return deleteSupabaseRSVP(id);
  }

  assertProductionStorageConfigured();

  return deleteLocalRSVP(id);
}

export async function getRSVPSummary() {
  return buildRSVPSummary(await listRSVPs());
}
