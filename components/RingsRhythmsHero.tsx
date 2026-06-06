export function RingsRhythmsHero() {
  return (
    <section
      className="section"
      style={{
        background: "linear-gradient(180deg, #F0EAD6 0%, #E8DFC5 100%)",
        minHeight: "unset",
      }}
    >
      <div className="section-inner" style={{ padding: 0 }}>
        <img
          src="/rings-and-rhythms.png"
          alt="Rings & Rhythms — An evening full of music, dance & love"
          style={{
            width: "100%",
            height: "auto",
            display: "block",
            objectFit: "contain",
            borderRadius: "12px",
            boxShadow: "0 12px 48px rgba(139,105,20,0.13)",
          }}
        />
      </div>
    </section>
  );
}
