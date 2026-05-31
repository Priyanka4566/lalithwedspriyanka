"use client";

import { useEffect, useMemo, useState } from "react";
import type { RSVPSummary } from "@/lib/rsvp";

type SummaryResponse =
  | {
      ok: true;
      summary: RSVPSummary;
    }
  | {
      ok: false;
      error: string;
    };

type DeleteResponse =
  | {
      ok: true;
      id: string;
    }
  | {
      ok: false;
      error: string;
    };

export function AdminDashboard() {
  const [summary, setSummary] = useState<RSVPSummary | null>(null);
  const [token, setToken] = useState("");
  const [selectedResponseId, setSelectedResponseId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const updatedAt = useMemo(() => {
    if (!summary) return "";

    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(summary.generatedAt));
  }, [summary]);

  const selectedResponse = useMemo(() => {
    if (!summary || !selectedResponseId) return null;

    return summary.responses.find((response) => response.id === selectedResponseId) ?? null;
  }, [selectedResponseId, summary]);

  const loadSummary = async (adminToken = token) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/rsvp/summary", {
        headers: adminToken ? { "x-admin-token": adminToken } : undefined,
        cache: "no-store",
      });
      const result = (await response.json()) as SummaryResponse;

      if (!response.ok || !result.ok) {
        throw new Error(result.ok ? "Unable to load RSVP summary" : result.error);
      }

      setSummary(result.summary);
      setSelectedResponseId((currentId) =>
        result.summary.responses.some((response) => response.id === currentId)
          ? currentId
          : "",
      );

      if (adminToken) {
        window.localStorage.setItem("wedding-admin-token", adminToken);
      }
    } catch (error) {
      setSummary(null);
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to load RSVP summary",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSelectedResponse = async () => {
    if (!selectedResponse) return;

    const shouldDelete = window.confirm(
      `Delete RSVP for ${selectedResponse.name}? This will remove it from the database and update all event counts.`,
    );

    if (!shouldDelete) return;

    setIsDeleting(true);
    setErrorMessage("");

    try {
      const response = await fetch(`/api/rsvp/${encodeURIComponent(selectedResponse.id)}`, {
        method: "DELETE",
        headers: token ? { "x-admin-token": token } : undefined,
        cache: "no-store",
      });
      const result = (await response.json()) as DeleteResponse;

      if (!response.ok || !result.ok) {
        throw new Error(result.ok ? "Unable to delete RSVP" : result.error);
      }

      setSelectedResponseId("");
      await loadSummary();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to delete RSVP");
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    const savedToken = window.localStorage.getItem("wedding-admin-token") ?? "";
    setToken(savedToken);
    void loadSummary(savedToken);
    // Run once on mount; manual refresh uses the current token.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="admin-page">
      <section className="admin-shell">
        <div className="admin-header">
          <div>
            <p className="admin-kicker">Priyanka & Lalith</p>
            <h1>RSVP Dashboard</h1>
            <p className="admin-subtitle">
              Event-wise guest counts and attendee lists for planning.
            </p>
          </div>
          <button className="admin-refresh" type="button" onClick={() => loadSummary()}>
            Refresh
          </button>
        </div>

        <form
          className="admin-token-row"
          onSubmit={(event) => {
            event.preventDefault();
            void loadSummary();
          }}
        >
          <input
            className="form-input"
            type="password"
            placeholder="Admin token"
            value={token}
            onChange={(event) => setToken(event.target.value)}
          />
          <button className="btn btn-gold" type="submit">
            Load Counts
          </button>
        </form>

        {isLoading ? <p className="admin-status">Loading RSVP counts…</p> : null}
        {errorMessage ? <p className="admin-error">{errorMessage}</p> : null}

        {summary ? (
          <>
            <div className="admin-meta">Updated {updatedAt}</div>
            <div className="admin-metrics">
              <Metric label="Total Responses" value={summary.totals.responses} />
              <Metric label="Declined Parties" value={summary.totals.declinedParties} />
            </div>

            <div className="admin-events">
              {summary.events.map((event) => (
                <article className="admin-event-card" key={event.id}>
                  <div className="admin-event-heading">
                    <div>
                      <h2>{event.title}</h2>
                      <p>{event.date}</p>
                    </div>
                    <div className="admin-event-total">{event.guestCount}</div>
                  </div>
                  <div className="admin-event-stats">
                    <span>{event.partyCount} parties</span>
                    <span>{event.guestCount} guests</span>
                  </div>
                  <div className="admin-party-grid">
                    {event.attendees.length ? (
                      event.attendees.map((attendee) => (
                        <article className="admin-party-tile" key={`${event.id}-${attendee.name}`}>
                          <div className="admin-party-head">
                            <strong>{attendee.name}</strong>
                            <span>{attendee.guestCount} guests</span>
                          </div>
                          <p>{attendee.email || "No email"}</p>
                        </article>
                      ))
                    ) : (
                      <p className="admin-empty">No guests yet.</p>
                    )}
                  </div>
                </article>
              ))}
            </div>

            <div className="admin-responses">
              <div className="admin-responses-header">
                <div>
                  <h2>All Responses</h2>
                  <p>
                    {selectedResponse
                      ? `Selected ${selectedResponse.name}`
                      : "Select a response to delete it from the database."}
                  </p>
                </div>
                <button
                  className="admin-delete"
                  type="button"
                  disabled={!selectedResponse || isDeleting}
                  onClick={deleteSelectedResponse}
                >
                  {isDeleting ? "Deleting..." : "Delete Selected"}
                </button>
              </div>
              <div className="admin-table">
                <div className="admin-table-row admin-table-head">
                  <span>Select</span>
                  <span>Name</span>
                  <span>Status</span>
                  <span>Events</span>
                  <span>Guests</span>
                  <span>Message</span>
                </div>
                {summary.responses.map((response) => (
                  <label
                    className={`admin-table-row admin-response-row${
                      selectedResponseId === response.id ? " selected" : ""
                    }`}
                    key={response.id}
                  >
                    <span>
                      <input
                        aria-label={`Select RSVP from ${response.name}`}
                        type="radio"
                        name="selected-rsvp"
                        checked={selectedResponseId === response.id}
                        onChange={() => setSelectedResponseId(response.id)}
                      />
                    </span>
                    <span>
                      <strong>{response.name}</strong>
                      <small>{response.email || "No email"}</small>
                    </span>
                    <span>{response.status}</span>
                    <span>{response.events.join(", ") || "None"}</span>
                    <span>{response.guestCount}</span>
                    <span>{response.message || "No message"}</span>
                  </label>
                ))}
              </div>
            </div>
          </>
        ) : null}
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="admin-metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
