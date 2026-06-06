"use client";

import { useEffect, useState } from "react";
import { EnvelopeReveal, type DecorativeParticle } from "./EnvelopeReveal";
import { EventImageSection } from "./EventImageSection";
import { Footer } from "./Footer";
import { HaldiVenueSection } from "./HaldiVenueSection";
import { RingsRhythmsHero } from "./RingsRhythmsHero";
import { RSVPForm } from "./RSVPForm";
import { TravelSection } from "./TravelSection";
import { VenueSection } from "./VenueSection";
import { weddingEvents } from "./weddingData";

const FORM_SUBMIT_ENDPOINT =
  process.env.NEXT_PUBLIC_RSVP_ENDPOINT ?? "/api/rsvp";

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

export default function InvitationClient() {
  const [envelopeHidden, setEnvelopeHidden] = useState(false);
  const [envelopeOpening, setEnvelopeOpening] = useState(false);
  const [mainVisible, setMainVisible] = useState(false);
  const [envelopeParticles, setEnvelopeParticles] = useState<DecorativeParticle[]>([]);

  useEffect(() => {
    setEnvelopeParticles(createParticles(24, [2, 4], [3, 5], 5));
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
        <RingsRhythmsHero />

        {weddingEvents.map((event) => (
          <EventImageSection event={event} key={event.id} />
        ))}

        <VenueSection />
        <HaldiVenueSection />
        <TravelSection />
        <RSVPForm endpoint={FORM_SUBMIT_ENDPOINT} />
        <Footer />
      </div>
    </>
  );
}
