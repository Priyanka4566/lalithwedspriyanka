export function VenueSection() {
  return (
    <section className="section venue-section">
      <div className="section-inner">
        <div className="venue-card">
          <div className="section-label venue-label">Rings &amp; Rhythms Celebration Venue</div>
          <p className="venue-quote">
            Join us for an evening filled with love, music, and celebration.
          </p>
          <div className="ornament-line">
            <span className="ornament-diamond">❖</span>
          </div>
          <div className="venue-name">Arlington Farms Community Hall</div>
          <div className="venue-address">2755 Red Bloom Dr, Greenwood, IN 46143</div>
          <div className="btn-group">
            <a
              href="https://maps.google.com/?q=2755+Red+Bloom+Dr+Greenwood+IN+46143"
              target="_blank"
              rel="noreferrer"
              className="btn btn-gold"
            >
              🗺 Navigate to Venue
            </a>
            <a
              href="https://maps.google.com/?q=2755+Red+Bloom+Dr+Greenwood+IN+46143"
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline"
            >
              📍 Open Google Maps
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
