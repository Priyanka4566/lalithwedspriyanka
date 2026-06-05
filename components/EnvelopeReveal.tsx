export type DecorativeParticle = {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
};

type EnvelopeRevealProps = {
  isHidden: boolean;
  isOpening: boolean;
  particles: DecorativeParticle[];
  onOpen: () => void;
};

export function EnvelopeReveal({
  isHidden,
  isOpening,
  particles,
  onOpen,
}: EnvelopeRevealProps) {
  const screenClassName = [
    isOpening ? "opening" : "",
    isHidden ? "hidden" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onOpen();
    }
  };

  return (
    <div
      id="envelope-screen"
      className={screenClassName}
      onClick={onOpen}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label="Open wedding invitation"
    >
      <div className="particles-bg" id="envParticles" aria-hidden="true">
        {particles.map((particle) => (
          <div
            className="particle"
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
      <div className="env-glow" aria-hidden="true" />
      <div className="envelope-container">
<<<<<<< HEAD
        <p className="wedding-invitation-text">✦ &nbsp;WEDDING INVITATION&nbsp; ✦</p>
=======
        <p className="wedding-invitation-text">
          <span aria-hidden="true">✦</span>
          <span>Pre-wedding Invitation</span>
          <span aria-hidden="true">✦</span>
        </p>
>>>>>>> c5eaedb (Sangeet & Haldi invite)
        <div
          className={`envelope-wrap${isOpening ? " opening-anim" : ""}`}
          id="envelopeWrap"
        >
          <EnvelopeSvg />
          <WaxSeal />
        </div>
<<<<<<< HEAD
        <p className="tap-text">✦ &nbsp;TAP TO REVEAL&nbsp; ✦</p>
=======
        <p className="tap-text">
          <span aria-hidden="true">✦</span>
          <span>Tap to Reveal</span>
          <span aria-hidden="true">✦</span>
        </p>
>>>>>>> c5eaedb (Sangeet & Haldi invite)
      </div>
    </div>
  );
}

function EnvelopeSvg() {
  return (
    <svg
      className="envelope-svg"
      viewBox="0 0 380 260"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="envGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1a3a1e" stopOpacity="1" />
          <stop offset="50%" stopColor="#0d2518" stopOpacity="1" />
          <stop offset="100%" stopColor="#1a3a1e" stopOpacity="1" />
        </linearGradient>
        <linearGradient id="envFlapGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22481e" stopOpacity="1" />
          <stop offset="100%" stopColor="#122010" stopOpacity="1" />
        </linearGradient>
        <linearGradient id="goldBorderGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8B6914" />
          <stop offset="30%" stopColor="#E8C97A" />
          <stop offset="50%" stopColor="#C9A84C" />
          <stop offset="70%" stopColor="#E8C97A" />
          <stop offset="100%" stopColor="#8B6914" />
        </linearGradient>
        <radialGradient id="envGlow" cx="50%" cy="100%" r="60%">
          <stop offset="0%" stopColor="rgba(201,168,76,0.18)" />
          <stop offset="100%" stopColor="rgba(201,168,76,0)" />
        </radialGradient>
      </defs>
      {/* Glow beneath envelope */}
      <ellipse cx="190" cy="252" rx="160" ry="18" fill="url(#envGlow)" />
      {/* Main envelope body */}
      <rect
        x="10" y="60" width="360" height="190" rx="8"
        fill="url(#envGrad)"
        stroke="url(#goldBorderGrad)"
        strokeWidth="1.5"
      />
      {/* Inner border */}
      <rect
        x="20" y="70" width="340" height="170" rx="4"
        fill="none"
        stroke="rgba(201,168,76,0.2)"
        strokeWidth="0.8"
      />
      {/* Bottom fold lines */}
      <line x1="10" y1="250" x2="190" y2="165" stroke="rgba(201,168,76,0.25)" strokeWidth="0.8" />
      <line x1="370" y1="250" x2="190" y2="165" stroke="rgba(201,168,76,0.25)" strokeWidth="0.8" />
      {/* Top flap */}
      <polygon
        points="10,60 370,60 190,155"
        fill="url(#envFlapGrad)"
        stroke="url(#goldBorderGrad)"
        strokeWidth="1.5"
      />
      <polygon
        points="20,65 360,65 190,145"
        fill="none"
        stroke="rgba(201,168,76,0.2)"
        strokeWidth="0.8"
      />
      {/* Corner accents */}
      <g fill="none" stroke="#C9A84C" strokeWidth="1.2" opacity="0.7">
        <path d="M22 75 L22 85 M22 75 L32 75" />
        <path d="M358 75 L358 85 M358 75 L348 75" />
        <path d="M22 235 L22 225 M22 235 L32 235" />
        <path d="M358 235 L358 225 M358 235 L348 235" />
      </g>
    </svg>
  );
}

function WaxSeal() {
  return (
    <div className="wax-seal">
      <img
        src="/lp-logo.jpeg"
        alt="LP Monogram"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: "50%",
          display: "block",
        }}
      />
    </div>
  );
}
