"use client";

import { useEffect, useState } from "react";
import { EnvelopeReveal, type DecorativeParticle } from "./EnvelopeReveal";
<<<<<<< HEAD
import { EventSection } from "./EventSection";
=======
import { EventImageSection } from "./EventImageSection";
>>>>>>> b0db782 (updated invite)
import { Footer } from "./Footer";
import { Hero } from "./Hero";
import { RSVPForm } from "./RSVPForm";
import { TravelSection } from "./TravelSection";
import { VenueSection } from "./VenueSection";
import { weddingEvents } from "./weddingData";

const FORM_SUBMIT_ENDPOINT =
  process.env.NEXT_PUBLIC_RSVP_ENDPOINT ?? "/api/rsvp";

const WEDDING_DATE = new Date("2026-07-04T10:08:00");

type CountdownValues = {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
};

const initialCountdown: CountdownValues = {
  days: "--",
  hours: "--",
  minutes: "--",
  seconds: "--",
};

function createParticles(
  count: number,
  sizeRange: [number, number],
  durationRange: [number, number],
  delayMax: number,
): DecorativeParticle[] {
  return Array.from({ length: count }, (_, id) => ({
    id,
    delay: Math.random() * delayMax,
    duration: durationRange[0] + Math.random() * durationRange[1],
    left: Math.random() * 100,
    size: sizeRange[0] + Math.random() * sizeRange[1],
  }));
}

function getCountdownValues(): CountdownValues {
  const diff = WEDDING_DATE.getTime() - Date.now();

  if (diff <= 0) {
    return {
      days: "0",
      hours: "0",
      minutes: "0",
      seconds: "0",
    };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return {
    days: String(days).padStart(2, "0"),
    hours: String(hours).padStart(2, "0"),
    minutes: String(minutes).padStart(2, "0"),
    seconds: String(seconds).padStart(2, "0"),
  };
}

export default function InvitationClient() {
  const [countdown, setCountdown] = useState<CountdownValues>(initialCountdown);
  const [envelopeHidden, setEnvelopeHidden] = useState(false);
  const [envelopeOpening, setEnvelopeOpening] = useState(false);
  const [mainVisible, setMainVisible] = useState(false);
  const [envelopeParticles, setEnvelopeParticles] = useState<DecorativeParticle[]>([]);
  const [heroParticles, setHeroParticles] = useState<DecorativeParticle[]>([]);

  useEffect(() => {
    setEnvelopeParticles(createParticles(24, [2, 4], [3, 5], 5));
    setHeroParticles(createParticles(25, [2, 5], [6, 8], 8));
  }, []);

  useEffect(() => {
    setCountdown(getCountdownValues());
    const countdownTimer = window.setInterval(() => {
      setCountdown(getCountdownValues());
    }, 1000);

    return () => window.clearInterval(countdownTimer);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("in-view");
        });
      },
      { threshold: 0.1 },
    );

    document.querySelectorAll(".section").forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const openEnvelope = () => {
    if (envelopeOpening || envelopeHidden) return;

    setMainVisible(true);
    setEnvelopeOpening(true);

    window.setTimeout(() => {
      setEnvelopeHidden(true);
    }, 1150);
  };

  return (
    <>
      <EnvelopeReveal
        isHidden={envelopeHidden}
        isOpening={envelopeOpening}
        onOpen={openEnvelope}
        particles={envelopeParticles}
      />

      <div id="main-site" className={mainVisible ? "visible" : ""}>
        <Hero countdown={countdown} particles={heroParticles} />

        {weddingEvents.map((event) => (
<<<<<<< HEAD
          <EventSection event={event} key={event.id} />
=======
          <EventImageSection event={event} key={event.id} />
>>>>>>> b0db782 (updated invite)
        ))}

        <VenueSection />
        <TravelSection />
        <RSVPForm endpoint={FORM_SUBMIT_ENDPOINT} />
        <Footer />
      </div>
    </>
  );
}
