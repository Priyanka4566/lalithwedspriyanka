import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import {
  buildRSVPSummary,
  createPartyKey,
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
  created_at: string;
  updated_at: string;
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
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toSupabaseRow(response: StoredRSVP) {
  return {
    id: response.id,
    party_key: response.partyKey,
    name: response.name,
    email: response.email || null,
    status: response.status,
    event_ids: response.eventIds,
    guest_count: response.guestCount,
    message: response.message || null,
    created_at: response.createdAt,
    updated_at: response.updatedAt,
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
          ? (item.eventIds.filter((eventId) => eventId === "haldi" || eventId === "wedding") as StoredRSVP["eventIds"])
          : [],
        guestCount: Number(item.guestCount ?? 0) || 0,
        message: String(item.message ?? ""),
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

async function listLocalRSVPs(): Promise<StoredRSVP[]> {
  const data = await readLocalData();
  return data.responses.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

async function saveSupabaseRSVP(submission: RSVPSubmission): Promise<StoredRSVP> {
  const now = new Date().toISOString();
  const partyKey = createPartyKey(submission);
  const existing = await fetch(
    `${process.env.SUPABASE_URL}/rest/v1/rsvps?party_key=eq.${encodeURIComponent(
      partyKey,
    )}&select=*`,
    { headers: supabaseHeaders(), cache: "no-store" },
  );

  if (!existing.ok) {
    throw new Error("Unable to check existing RSVP");
  }

  const existingRows = (await existing.json()) as SupabaseRSVP[];
  const previous = existingRows[0] ? toStoredRSVP(existingRows[0]) : undefined;
  const response: StoredRSVP = {
    ...submission,
    id: previous?.id ?? createId(),
    partyKey,
    createdAt: previous?.createdAt ?? now,
    updatedAt: now,
  };

  const saved = await fetch(
    `${process.env.SUPABASE_URL}/rest/v1/rsvps?on_conflict=party_key`,
    {
      method: "POST",
      headers: {
        ...supabaseHeaders(),
        Prefer: "resolution=merge-duplicates,return=representation",
      },
      body: JSON.stringify(toSupabaseRow(response)),
      cache: "no-store",
    },
  );

  if (!saved.ok) {
    throw new Error("Unable to save RSVP");
  }

  const rows = (await saved.json()) as SupabaseRSVP[];
  return rows[0] ? toStoredRSVP(rows[0]) : response;
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

export async function saveRSVP(submission: RSVPSubmission) {
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

export async function getRSVPSummary() {
  return buildRSVPSummary(await listRSVPs());
}
