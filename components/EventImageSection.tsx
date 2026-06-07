import type { WeddingEvent } from "./weddingData";

type EventImageSectionProps = {
  event: WeddingEvent;
};

export function EventImageSection({ event }: EventImageSectionProps) {
  if (!event.image) return null;

  return (
    <section
      className={`section ${event.sectionClassName}`}
      style={{ minHeight: "unset", background: "transparent" }}
    >
      <div
        className="section-inner"
        style={{ padding: 0 }}
      >
        <div
          style={{
            width: "100%",
            aspectRatio: "210 / 297",
            overflow: "hidden",
            borderRadius: "12px",
            boxShadow: "0 12px 48px rgba(0,0,0,0.12)",
          }}
        >
          <img
            src={event.image.src}
            alt={event.image.alt}
            style={{ width: "100%", height: "100%", display: "block", objectFit: "cover", objectPosition: "center" }}
          />
        </div>
      </div>
    </section>
  );
}
