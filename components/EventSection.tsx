import type { WeddingEvent } from "./weddingData";

type EventSectionProps = {
  event: WeddingEvent;
};

export function EventSection({ event }: EventSectionProps) {
  return (
    <section className={`section ${event.sectionClassName}`}>
      {event.backgroundClassName ? <div className={event.backgroundClassName} /> : null}
      <div className="section-inner">
        <div className="event-card">
          <div className="section-label">{event.label}</div>
          <h2 className="section-title" style={event.styles.title}>
            {event.title}
          </h2>
          <div className="section-date" style={event.styles.date}>
            {event.date}
          </div>
          <div className="floral-divider" style={event.styles.divider}>
            ✿
          </div>
          <p className="event-desc" style={event.styles.description}>
            {event.description}
          </p>
          <div className="outfit-guide" style={event.styles.outfitGuide}>
            <h4 style={event.styles.outfitTitle}>{event.outfitTitle}</h4>
            <div className="outfit-cols">
              {event.outfitColumns.map((column) => (
                <div
                  className="outfit-col"
                  key={column.label}
                  style={event.styles.outfitColumn}
                >
                  <strong style={event.styles.outfitStrong}>{column.label}</strong>
                  {column.lines.map((line) => (
                    <span className="outfit-line" key={line}>
                      {line}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
          {event.extraBlessing ? (
            <p className="event-extra-blessing">{event.extraBlessing}</p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
