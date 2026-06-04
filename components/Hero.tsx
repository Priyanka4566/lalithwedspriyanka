import type { DecorativeParticle } from "./EnvelopeReveal";

type CountdownValues = {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
};

type HeroProps = {
  countdown: CountdownValues;
  particles: DecorativeParticle[];
};

export function Hero({ countdown, particles }: HeroProps) {
  return (
    <section className="hero">
      <div className="hero-ganesha-watermark" id="ganeshaWatermark" />
      <div className="hero-particles" id="heroParticles" aria-hidden="true">
        {particles.map((particle) => (
          <div
            className="hero-particle"
            key={particle.id}
            style={{
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`,
              height: `${particle.size}px`,
              left: `${particle.left}%`,
              width: `${particle.size}px`,
            }}
          />
        ))}
      </div>

      <HeroFloral position="top" />

      <div className="hero-symbols" aria-hidden="true">
        <div className="hero-om">
          <img src="/om-symbol.png" alt="Om" className="hero-symbol-img hero-om-img" />
        </div>
        <div className="hero-swastik">
          <img src="/swastik-symbol.png" alt="Swastik" className="hero-symbol-img hero-swastik-img" />
        </div>
      </div>

      <div className="hero-content">
        <div className="telugu-blessings">
          <span className="telugu-blessing">శ్రీరస్తు</span>
          <span className="telugu-blessing blessing-separator">✦</span>
          <span className="telugu-blessing">శుభమస్తు</span>
          <span className="telugu-blessing blessing-separator">✦</span>
          <span className="telugu-blessing">కళ్యాణమస్తు</span>
        </div>

        <div className="ornament-line">
          <span className="ornament-diamond">❖</span>
        </div>

        <div className="couple-names">Priyanka</div>
        <div className="couple-and">weds</div>
        <div className="couple-names">Lalith</div>

        <div className="ornament-line">
          <span className="ornament-diamond">❖</span>
        </div>

        <p className="hero-subtitle">
          Together with our families, we invite you to celebrate our wedding
        </p>

        <div className="floral-divider">✿</div>

        <div className="hero-date">July 4, 2026</div>
        <div className="hero-muhurtham">Muhurtham at 10:08 AM</div>

        <div className="countdown-section" id="countdown">
          <CountdownCard value={countdown.days} label="Days" />
          <CountdownCard value={countdown.hours} label="Hours" />
          <CountdownCard value={countdown.minutes} label="Minutes" />
          <CountdownCard value={countdown.seconds} label="Seconds" />
        </div>
      </div>

      <HeroFloral position="bottom" />
    </section>
  );
}

function CountdownCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="countdown-card">
      <div className="countdown-num">{value}</div>
      <div className="countdown-label">{label}</div>
    </div>
  );
}

function HeroFloral({ position }: { position: "top" | "bottom" }) {
  const isTop = position === "top";

  return (
    <div className={`hero-floral-${position}`} aria-hidden="true">
      <svg
        viewBox="0 0 700 60"
        xmlns="http://www.w3.org/2000/svg"
        style={{ opacity: 0.6, width: "100%" }}
      >
        <g fill="none" stroke="#C9A84C" strokeWidth="0.8">
          {isTop ? (
            <>
              <path d="M0,30 Q175,5 350,30 Q525,55 700,30" />
              <path d="M0,35 Q175,10 350,35 Q525,60 700,35" strokeWidth="0.4" opacity="0.5" />
              <circle cx="350" cy="30" r="5" fill="#C9A84C" opacity="0.5" />
              <circle cx="175" cy="17" r="3" fill="#C9A84C" opacity="0.4" />
              <circle cx="525" cy="43" r="3" fill="#C9A84C" opacity="0.4" />
              <path d="M340,25 Q350,15 360,25 Q350,35 340,25Z" fill="rgba(201,168,76,0.4)" />
              <path d="M165,12 Q175,2 185,12 Q175,22 165,12Z" fill="rgba(201,168,76,0.3)" />
              <path d="M515,38 Q525,28 535,38 Q525,48 515,38Z" fill="rgba(201,168,76,0.3)" />
            </>
          ) : (
            <>
              <path d="M0,30 Q175,55 350,30 Q525,5 700,30" />
              <circle cx="350" cy="30" r="5" fill="#C9A84C" opacity="0.5" />
              <path d="M340,35 Q350,45 360,35 Q350,25 340,35Z" fill="rgba(201,168,76,0.4)" />
            </>
          )}
        </g>
      </svg>
    </div>
  );
}
