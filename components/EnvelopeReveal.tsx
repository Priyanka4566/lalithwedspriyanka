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
=======
        <p className="wedding-invitation-text">✦ &nbsp;WEDDING INVITATION&nbsp; ✦</p>
>>>>>>> b0db782 (updated invite)
        <div
          className={`envelope-wrap${isOpening ? " opening-anim" : ""}`}
          id="envelopeWrap"
        >
          <EnvelopeSvg />
          <WaxSeal />
        </div>
<<<<<<< HEAD
        <p className="tap-text">✦ Tap to Reveal ✦</p>
=======
        <p className="tap-text">✦ &nbsp;TAP TO REVEAL&nbsp; ✦</p>
>>>>>>> b0db782 (updated invite)
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
<<<<<<< HEAD
      </defs>
      <rect
        x="10"
        y="60"
        width="360"
        height="190"
        rx="8"
=======
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
>>>>>>> b0db782 (updated invite)
        fill="url(#envGrad)"
        stroke="url(#goldBorderGrad)"
        strokeWidth="1.5"
      />
<<<<<<< HEAD
      <rect
        x="20"
        y="70"
        width="340"
        height="170"
        rx="4"
=======
      {/* Inner border */}
      <rect
        x="20" y="70" width="340" height="170" rx="4"
>>>>>>> b0db782 (updated invite)
        fill="none"
        stroke="rgba(201,168,76,0.2)"
        strokeWidth="0.8"
      />
<<<<<<< HEAD
      <line
        x1="10"
        y1="250"
        x2="190"
        y2="165"
        stroke="rgba(201,168,76,0.25)"
        strokeWidth="0.8"
      />
      <line
        x1="370"
        y1="250"
        x2="190"
        y2="165"
        stroke="rgba(201,168,76,0.25)"
        strokeWidth="0.8"
      />
=======
      {/* Bottom fold lines */}
      <line x1="10" y1="250" x2="190" y2="165" stroke="rgba(201,168,76,0.25)" strokeWidth="0.8" />
      <line x1="370" y1="250" x2="190" y2="165" stroke="rgba(201,168,76,0.25)" strokeWidth="0.8" />
      {/* Top flap */}
>>>>>>> b0db782 (updated invite)
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
<<<<<<< HEAD
=======
      {/* Corner accents */}
>>>>>>> b0db782 (updated invite)
      <g fill="none" stroke="#C9A84C" strokeWidth="1.2" opacity="0.7">
        <path d="M22 75 L22 85 M22 75 L32 75" />
        <path d="M358 75 L358 85 M358 75 L348 75" />
        <path d="M22 235 L22 225 M22 235 L32 235" />
        <path d="M358 235 L358 225 M358 235 L348 235" />
      </g>
<<<<<<< HEAD
      <g
        transform="translate(190,215)"
        fill="none"
        stroke="rgba(201,168,76,0.5)"
        strokeWidth="0.8"
      >
        <ellipse cx="0" cy="0" rx="30" ry="8" />
        <path d="M-15,-5 Q0,-20 15,-5" />
        <path d="M-22,-2 Q-10,-18 0,-12" />
        <path d="M22,-2 Q10,-18 0,-12" />
      </g>
      <text
        x="190"
        y="210"
        textAnchor="middle"
        fontFamily="'Georgia', serif"
        fontSize="12"
        fill="rgba(201,168,76,0.6)"
        letterSpacing="8"
      >
        ✦ P & L ✦
      </text>
=======
>>>>>>> b0db782 (updated invite)
    </svg>
  );
}

function WaxSeal() {
  return (
    <div className="wax-seal">
<<<<<<< HEAD
      <svg viewBox="0 0 90 90" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="sealGrad" cx="40%" cy="35%">
            <stop offset="0%" stopColor="#E8C97A" />
            <stop offset="50%" stopColor="#C9A84C" />
            <stop offset="100%" stopColor="#8B4A0A" />
          </radialGradient>
        </defs>
        <circle
          cx="45"
          cy="45"
          r="40"
          fill="url(#sealGrad)"
          stroke="#8B6914"
          strokeWidth="1.5"
        />
        <circle
          cx="45"
          cy="45"
          r="34"
          fill="none"
          stroke="rgba(255,230,150,0.5)"
          strokeWidth="0.8"
        />
        <g transform="translate(45,45)">
          <path d="M0,-28 Q8,-18 0,-10 Q-8,-18 0,-28Z" fill="rgba(139,74,10,0.5)" />
          <path d="M28,0 Q18,8 10,0 Q18,-8 28,0Z" fill="rgba(139,74,10,0.5)" />
          <path d="M0,28 Q-8,18 0,10 Q8,18 0,28Z" fill="rgba(139,74,10,0.5)" />
          <path d="M-28,0 Q-18,-8 -10,0 Q-18,8 -28,0Z" fill="rgba(139,74,10,0.5)" />
        </g>
        <text
          x="45"
          y="42"
          textAnchor="middle"
          fontFamily="Georgia, serif"
          fontSize="14"
          fill="#FFF8E1"
          fontWeight="bold"
        >
          ॐ
        </text>
        <text
          x="45"
          y="57"
          textAnchor="middle"
          fontFamily="Georgia, serif"
          fontSize="8"
          fill="rgba(255,248,225,0.8)"
          letterSpacing="1"
        >
          P & L
        </text>
      </svg>
=======
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
>>>>>>> b0db782 (updated invite)
    </div>
  );
}
