export function HaldiVenueSection() {
  return (
    <section className="section venue-section haldi-venue-section">
      <div className="section-inner">
        <div className="venue-card haldi-venue-card">
          <div className="section-label haldi-venue-label">Haldi Celebration Venue</div>
          <p className="venue-quote haldi-venue-quote">
            Get ready for some yellow masti, and a whole lot of Haldi fun!🌼
          </p>
          <div className="ornament-line">
            <span className="ornament-diamond">❖</span>
          </div>
          <div className="venue-name">10 E Smith Valley Rd</div>
          <div className="venue-address">Greenwood, IN 46143</div>
          <div className="btn-group">
            <a
              href="https://maps.google.com/?q=10+E+Smith+Valley+Rd+Greenwood+IN+46143"
              target="_blank"
              rel="noreferrer"
              className="btn btn-gold"
            >
              🗺 Navigate to Venue
            </a>
            <a
              href="https://maps.google.com/?q=10+E+Smith+Valley+Rd+Greenwood+IN+46143"
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
