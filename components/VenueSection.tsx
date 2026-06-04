export function VenueSection() {
  return (
    <section className="section venue-section">
      <div className="section-inner">
        <div className="venue-card">
          <div className="section-label venue-label">The Celebration Venue</div>
          <p className="venue-quote">
            &quot;With the blessings of our beloved parents, we invite you to celebrate
            this most special day with us.&quot;
          </p>
          <div className="ornament-line">
            <span className="ornament-diamond">❖</span>
          </div>
          <div className="venue-name">The Maharaja Palace</div>
          <div className="venue-address">Indianapolis, Indiana</div>
          <div className="btn-group">
            <a
              href="https://maps.google.com/?q=The+Maharaja+Palace+Indianapolis+Indiana"
              target="_blank"
              rel="noreferrer"
              className="btn btn-gold"
            >
              🗺 Navigate to Venue
            </a>
            <a
              href="https://maps.google.com/?q=The+Maharaja+Palace+Indianapolis+Indiana"
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
