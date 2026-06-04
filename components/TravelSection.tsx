import { travelCards } from "./weddingData";

export function TravelSection() {
  return (
    <section className="section travel-section">
      <div className="section-inner">
        <div className="section-label travel-label">Getting Here</div>
        <h2 className="travel-title">Travel & Stay</h2>
        <p className="travel-subtitle">We look forward to welcoming you from near and far</p>
        <div className="ornament-line travel-ornament">
          <span className="ornament-diamond">❖</span>
        </div>
        <div className="travel-grid">
          {travelCards.map((card) => (
            <div className="travel-card" key={card.title}>
              <div className="travel-icon">{card.icon}</div>
              <h3>{card.title}</h3>
              <p>{card.body}</p>
              <a
                href={card.href}
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline travel-button"
              >
                {card.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
