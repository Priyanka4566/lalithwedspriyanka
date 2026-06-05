import type { CSSProperties } from "react";

export type RSVPStatus = "all" | "selected" | "decline";

type OutfitColumn = {
  label: string;
  lines: string[];
};

type EventStyleSet = {
  title?: CSSProperties;
  date?: CSSProperties;
  divider?: CSSProperties;
  description?: CSSProperties;
  outfitGuide?: CSSProperties;
  outfitTitle?: CSSProperties;
  outfitColumn?: CSSProperties;
  outfitStrong?: CSSProperties;
};

export type WeddingEvent = {
  id: string;
  sectionClassName: string;
  backgroundClassName?: string;
  label: string;
  title: string;
  date: string;
  responseLabel: string;
  description: string;
  outfitTitle: string;
  outfitColumns: OutfitColumn[];
  extraBlessing?: string;
  image?: { src: string; alt: string };
  styles: EventStyleSet;
};

export const weddingEvents: WeddingEvent[] = [
  {
<<<<<<< HEAD
=======
    id: "sangeeth",
    sectionClassName: "sangeeth-section",
    label: "An Evening of Music & Dance",
    title: "Sangeeth",
    date: "July 2, 2026 · 6:00 PM",
    responseLabel: "Engagement/Sangeet — July 2",
    description:
      "An enchanting evening of music, dance, and love — celebrating the couple with joyful performances, laughter, and the warmth of family and friends coming together before the big day.",
    outfitTitle: "Dress Code",
    outfitColumns: [
      {
        label: "Gentlemen",
        lines: ["Sherwanis or kurta sets", "Festive ethnic wear", "Navy / jewel tones"],
      },
      {
        label: "Ladies",
        lines: ["Lehengas or sarees", "Festive & glam attire", "Gold & dark tones preferred"],
      },
    ],
    extraBlessing: undefined,
    image: undefined,
    styles: {
      description: { color: "#1a1a2e" },
      outfitGuide: {
        background: "rgba(20,20,60,0.07)",
        border: "1px solid rgba(100,80,180,0.25)",
      },
      outfitTitle: { color: "#2a1a4e" },
      outfitColumn: { color: "#1a1a3e" },
      outfitStrong: { color: "#3a2a6e" },
    },
  },
  {
>>>>>>> c5eaedb (Sangeet & Haldi invite)
    id: "haldi",
    sectionClassName: "haldi-section",
    label: "Sacred Turmeric Ritual",
    title: "Haldi Ceremony",
    date: "July 3, 2026 · 10:00 AM",
    responseLabel: "Haldi — July 3",
    description:
      "A joyful morning steeped in tradition — golden turmeric, fragrant marigolds, and the blessings of family. This sacred ceremony purifies and beautifies the bride and groom for their union.",
    outfitTitle: "Dress Code",
    outfitColumns: [
      {
        label: "Gentlemen",
        lines: ["Yellow / turmeric kurtas", "Dhoti kurta sets", "Casual ethnic wear"],
      },
      {
        label: "Ladies",
        lines: ["Yellow sarees", "Lehengas · Floral attire", "Marigold tones preferred"],
      },
    ],
    extraBlessing: undefined,
    image: { src: "/haldi.jpeg", alt: "Haldi Ceremony" },
    styles: {
      description: { color: "#4A3500" },
      outfitGuide: {
        background: "rgba(255,200,0,0.1)",
        border: "1px solid rgba(184,134,11,0.3)",
      },
      outfitTitle: { color: "#7A4F00" },
      outfitColumn: { color: "#5A3700" },
      outfitStrong: { color: "#8B6000" },
    },
  },
<<<<<<< HEAD
  {
    id: "wedding",
    sectionClassName: "wedding-section",
    label: "The Sacred Union",
    title: "Wedding Ceremony",
    date: "July 4, 2026 · Muhurtham 10:08 AM",
    responseLabel: "Wedding — July 4",
    description:
      "A sacred Telugu wedding ceremony celebrating the eternal bond blessed by Lord Ganesha. Beneath fragrant floral mandaps and the sacred fire, we take our seven vows in the presence of our beloved family and friends.",
    outfitTitle: "Traditional Attire",
    outfitColumns: [
      {
        label: "Groom",
        lines: ["Panchakattu", "Silk dhoti", "Traditional South Indian attire"],
      },
      {
        label: "Bride",
        lines: ["Kanchipuram silk saree", "Temple jewelry", "Jasmine flowers"],
      },
    ],
    extraBlessing: "శుభం భవతు ✦ కళ్యాణమస్తు",
    image: { src: "/wedding_ceremony.jpeg", alt: "Wedding Ceremony" },
    styles: {
      title: { color: "#6B2D3A" },
      date: { color: "#5A4030" },
      description: { color: "#4A3040" },
      outfitGuide: {
        background: "rgba(180,100,120,0.06)",
        border: "1px solid rgba(180,100,120,0.2)",
      },
      outfitTitle: { color: "#6B2D3A" },
      outfitColumn: { color: "#4A3040" },
      outfitStrong: { color: "#6B2D3A" },
    },
  },
=======
>>>>>>> c5eaedb (Sangeet & Haldi invite)
];

export const rsvpOptions: Array<{ value: RSVPStatus; label: string }> = [
  { value: "all", label: "✨ Attending All Events" },
  { value: "selected", label: "📋 Attending One Event" },
  { value: "decline", label: "🙏 Regretfully Decline" },
];

export const rsvpSelectableEvents = weddingEvents;

export const travelCards = [
  {
    icon: "✈️",
    title: "Nearest Airport",
    body: (
      <>
        Indianapolis International Airport (IND)
        <br />
        <br />
        The venue is approximately <strong>20 minutes</strong> from the airport — a smooth
        and easy journey.
      </>
    ),
    cta: "Airport Directions",
    href: "https://maps.google.com/?q=Indianapolis+International+Airport",
  },
  {
    icon: "🏡",
    title: "Our Home Location",
    body: (
      <>
        <strong>1325 Bellweather Dr</strong>
        <br />
        Greenwood, Indiana
        <br />
<<<<<<< HEAD
=======
        <br />
>>>>>>> c5eaedb (Sangeet & Haldi invite)
        Drop by, say hello, and celebrate with us before the big day!
      </>
    ),
    cta: "Navigate Here",
    href: "https://maps.google.com/?q=1325+Bellweather+Dr+Greenwood+Indiana",
  },
  {
    icon: "🏨",
    title: "Nearby Hotels",
    body: (
      <>
        Several comfortable hotels are available near the venue and family home in the
        Indianapolis-Greenwood area.
        <br />
        <br />
        We recommend booking early.
      </>
    ),
    cta: "Find Hotels",
    href: "https://maps.google.com/?q=hotels+near+Greenwood+Indiana",
  },
];
