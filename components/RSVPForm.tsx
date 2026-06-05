"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import {
  rsvpOptions,
  type RSVPStatus,
  rsvpSelectableEvents,
} from "./weddingData";

type RSVPFormProps = {
  endpoint: string;
};

type RSVPFormValues = {
  name: string;
  guests: string;
  email: string;
  message: string;
};

<<<<<<< HEAD
=======
type SangeetAlcohol = "yes" | "no";

>>>>>>> c5eaedb (Sangeet & Haldi invite)
type RSVPSubmitPayload = {
  name: string;
  email: string;
  status: RSVPStatus;
  eventIds: string[];
  guestCount: number;
  message: string;
<<<<<<< HEAD
=======
  sangeetAlcohol?: SangeetAlcohol;
>>>>>>> c5eaedb (Sangeet & Haldi invite)
};

type ExistingRSVPDetails = {
  name: string;
  email: string;
  status: RSVPStatus;
  events: string[];
  guestCount: number;
  message: string;
  updatedAt: string;
};

type RSVPSubmitResponse =
  | {
      ok: true;
      id: string;
      updatedAt: string;
    }
  | {
      ok: false;
      error: string;
      duplicate?: boolean;
      existing?: ExistingRSVPDetails;
    };

const initialFormValues: RSVPFormValues = {
  name: "",
  guests: "1",
  email: "",
  message: "",
};

export function RSVPForm({ endpoint }: RSVPFormProps) {
  const [status, setStatus] = useState<RSVPStatus | "">("");
  const [selectedEventIds, setSelectedEventIds] = useState<string[]>([]);
<<<<<<< HEAD
=======
  const [sangeetAlcohol, setSangeetAlcohol] = useState<SangeetAlcohol | "">("");
>>>>>>> c5eaedb (Sangeet & Haldi invite)
  const [formValues, setFormValues] = useState<RSVPFormValues>(initialFormValues);
  const [submitState, setSubmitState] = useState<"idle" | "loading" | "success">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [duplicateRSVP, setDuplicateRSVP] = useState<ExistingRSVPDetails | null>(null);
  const [pendingPayload, setPendingPayload] = useState<RSVPSubmitPayload | null>(null);

  const isAttending = status === "all" || status === "selected";

  const updateField =
    (field: keyof RSVPFormValues) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormValues((current) => ({ ...current, [field]: event.target.value }));
      setDuplicateRSVP(null);
      setPendingPayload(null);
    };

  const updateGuestCount = (event: ChangeEvent<HTMLInputElement>) => {
    const nextGuestValue = event.target.value;

    setFormValues((current) => ({
      ...current,
      guests: nextGuestValue,
    }));
  };

  const selectStatus = (nextStatus: RSVPStatus) => {
    setStatus(nextStatus);
    setErrorMessage("");
    setDuplicateRSVP(null);
    setPendingPayload(null);

    if (nextStatus !== "selected") {
      setSelectedEventIds([]);
    }

<<<<<<< HEAD
=======
    if (nextStatus === "decline") {
      setSangeetAlcohol("");
    }

>>>>>>> c5eaedb (Sangeet & Haldi invite)
    setFormValues((current) => {
      if (nextStatus === "decline") {
        return {
          ...current,
          guests: "",
        };
      }

      return {
        ...current,
        guests: current.guests || "1",
      };
    });
  };

  const selectEvent = (eventId: string) => {
    setSelectedEventIds([eventId]);
<<<<<<< HEAD
=======
    if (eventId !== "sangeeth") setSangeetAlcohol("");
>>>>>>> c5eaedb (Sangeet & Haldi invite)
    setDuplicateRSVP(null);
    setPendingPayload(null);
  };

  const validate = () => {
    const fullName = formValues.name.trim();

    if (!status) {
      alert("Please select your RSVP status");
      return false;
    }

    if (!fullName) {
      alert("Please enter your name");
      return false;
    }

    if (!formValues.email.trim()) {
      alert("Please enter your email address");
      return false;
    }

    if (status === "selected" && !selectedEventIds.length) {
      alert("Please select at least one event");
      return false;
    }

    if (isAttending) {
      const guestCount = Number(formValues.guests);

      if (!Number.isInteger(guestCount) || guestCount < 1 || guestCount > 10) {
        alert("Please enter the number of guests attending");
        return false;
      }
    }

    return true;
  };

  const submitRSVP = async (payload: RSVPSubmitPayload, confirmOverwrite = false) => {
    setErrorMessage("");
    setSubmitState("loading");

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...payload,
          confirmOverwrite,
        }),
      });

      const result = (await response.json().catch(() => null)) as
        | RSVPSubmitResponse
        | null;

      if (!response.ok) {
        if (response.status === 409 && result && !result.ok && result.duplicate && result.existing) {
          setDuplicateRSVP(result.existing);
          setPendingPayload(payload);
          setSubmitState("idle");
          return;
        }

        throw new Error(
          result && !result.ok ? result.error : "Unable to save your RSVP",
        );
      }

      setDuplicateRSVP(null);
      setPendingPayload(null);
      setSubmitState("success");
    } catch (error) {
      setSubmitState("idle");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to save your RSVP. Please try again.",
      );
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validate()) return;

    const fullName = formValues.name.trim();
    const emailAddress = formValues.email.trim().toLowerCase();
    const blessings = formValues.message.trim();

<<<<<<< HEAD
=======
    const attendingSangeeth =
      status === "all" || (status === "selected" && selectedEventIds.includes("sangeeth"));

>>>>>>> c5eaedb (Sangeet & Haldi invite)
    await submitRSVP({
      name: fullName,
      email: emailAddress,
      status: status as RSVPStatus,
      eventIds: status === "selected" ? selectedEventIds : [],
      guestCount: isAttending ? Number(formValues.guests) : 0,
      message: blessings,
<<<<<<< HEAD
=======
      sangeetAlcohol: attendingSangeeth && sangeetAlcohol ? sangeetAlcohol : undefined,
>>>>>>> c5eaedb (Sangeet & Haldi invite)
    });
  };

  const confirmOverwrite = () => {
    if (!pendingPayload) return;

    void submitRSVP(pendingPayload, true);
  };

  return (
    <section className="section rsvp-section">
      <div className="section-inner">
        <div className="rsvp-card">
          {submitState === "success" ? (
            <RSVPSuccess />
          ) : submitState === "loading" ? (
            <RSVPLoading />
          ) : (
            <form id="rsvp-form-container" onSubmit={handleSubmit}>
              <div className="section-label rsvp-label">Join Our Celebration</div>
              <div className="rsvp-title">RSVP</div>
              <div className="rsvp-subtitle">We would be honoured by your presence</div>

              <div className="rsvp-options" role="radiogroup" aria-label="RSVP status">
                {rsvpOptions.map((option) => (
                  <label
                    className={`rsvp-option${status === option.value ? " selected" : ""}`}
                    key={option.value}
                  >
                    <input
                      type="radio"
                      name="rsvp"
                      value={option.value}
                      checked={status === option.value}
                      onChange={() => selectStatus(option.value)}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>

              {status ? (
                <div className="rsvp-response-panel">
                  {status === "selected" ? (
                    <div className="events-checkbox visible" id="eventsBox">
                      <p className="events-title">Select One Event</p>
                      <div className="event-tile-grid">
                        {rsvpSelectableEvents.map((eventItem) => {
                          const [eventTitle, eventDate] = eventItem.responseLabel.split(" — ");
                          const isSelected = selectedEventIds.includes(eventItem.id);
                          return (
                          <button
                            type="button"
                            className={`event-tile${
                              isSelected ? " selected" : ""
                            }`}
                            key={eventItem.id}
                            onClick={() => selectEvent(eventItem.id)}
                            aria-pressed={isSelected}
                          >
                            <span className="event-tile-title">{eventTitle}</span>
                            <span className="event-tile-date">{eventDate}</span>
                          </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}

<<<<<<< HEAD
=======
                  {/* Sangeet Alcohol Preference — shown when attending Sangeeth */}
                  {(status === "all" || (status === "selected" && selectedEventIds.includes("sangeeth"))) ? (
                    <div className="events-checkbox visible alcohol-pref-box">
                      <p className="events-title">Alcohol Preferred</p>
                      <div className="alcohol-options">
                        <label className={`rsvp-option alcohol-option${sangeetAlcohol === "yes" ? " selected" : ""}`}>
                          <input
                            type="radio"
                            name="sangeet-alcohol"
                            value="yes"
                            checked={sangeetAlcohol === "yes"}
                            onChange={() => setSangeetAlcohol("yes")}
                          />
                          <span>Yes</span>
                        </label>
                        <label className={`rsvp-option alcohol-option${sangeetAlcohol === "no" ? " selected" : ""}`}>
                          <input
                            type="radio"
                            name="sangeet-alcohol"
                            value="no"
                            checked={sangeetAlcohol === "no"}
                            onChange={() => setSangeetAlcohol("no")}
                          />
                          <span>No</span>
                        </label>
                      </div>
                    </div>
                  ) : null}

>>>>>>> c5eaedb (Sangeet & Haldi invite)
                  <div className="form-group">
                    <label className="form-label" htmlFor="rsvp-name">
                      Full Name
                    </label>
                    <input
                      className="form-input"
                      type="text"
                      id="rsvp-name"
                      placeholder="Your full name"
                      value={formValues.name}
                      onChange={updateField("name")}
                    />
                  </div>

                  {isAttending ? (
                    <div className="form-group">
                      <label className="form-label" htmlFor="rsvp-guests">
                        Number of Guests
                      </label>
                      <input
                        className="form-input"
                        type="number"
                        id="rsvp-guests"
                        placeholder="1"
                        min="1"
                        max="10"
                        value={formValues.guests}
                        onChange={updateGuestCount}
                      />
                    </div>
                  ) : null}

                  <div className="form-group">
                    <label className="form-label" htmlFor="rsvp-email">
                      Email Address
                    </label>
                    <input
                      className="form-input"
                      type="email"
                      id="rsvp-email"
                      placeholder="your@email.com"
                      value={formValues.email}
                      onChange={updateField("email")}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="rsvp-msg">
                      Blessings & Message
                    </label>
                    <textarea
                      className="form-textarea"
                      id="rsvp-msg"
                      placeholder="Share your blessings and well wishes with Priyanka & Lalith…"
                      value={formValues.message}
                      onChange={updateField("message")}
                    />
                  </div>

                  <button className="btn-submit" type="submit">
                    Send Love ✦
                  </button>
                  {duplicateRSVP ? (
                    <div className="rsvp-duplicate" role="alert">
                      <strong>You already submitted an RSVP with this email.</strong>
                      <p>
                        Previous response: {duplicateRSVP.status}
                        {duplicateRSVP.events.length
                          ? ` for ${duplicateRSVP.events.join(", ")}`
                          : ""}
                        {duplicateRSVP.status !== "decline"
                          ? `, ${duplicateRSVP.guestCount} guest${
                              duplicateRSVP.guestCount === 1 ? "" : "s"
                            }`
                          : ""}
                        .
                      </p>
                      <p>
                        Name used: {duplicateRSVP.name}. Submitting again will override
                        the old response.
                      </p>
                      <button
                        className="btn-submit rsvp-overwrite"
                        type="button"
                        onClick={confirmOverwrite}
                      >
                        Confirm & Update RSVP
                      </button>
                    </div>
                  ) : null}
                  {errorMessage ? <p className="rsvp-error">{errorMessage}</p> : null}
                </div>
              ) : null}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function RSVPLoading() {
  return (
    <div className="rsvp-loading show" id="rsvp-loading" aria-live="polite">
      <div className="spinner" />
      <p className="rsvp-loading-text">Sending your blessings…</p>
    </div>
  );
}

function RSVPSuccess() {
  return (
    <div className="rsvp-success show" id="rsvp-success" aria-live="polite">
      <div className="success-check">✓</div>
      <div className="success-title">Thank You</div>
      <p className="success-subtitle">&quot;Thank you for your blessings and love&quot;</p>
      <div className="success-telugu">శుభమస్తు ✦ కళ్యాణమస్తు</div>
    </div>
  );
}
