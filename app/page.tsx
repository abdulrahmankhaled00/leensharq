export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        fontFamily: "system-ui, sans-serif",
        background: "#0b1220",
        color: "#fff",
        textAlign: "center",
      }}
    >
      <div>
        <h1 style={{ fontSize: "clamp(2rem, 8vw, 4rem)", letterSpacing: "0.1em", margin: "0 0 0.5rem" }}>
          COMING SOON
        </h1>
        <p style={{ opacity: 0.7, margin: "0.25rem" }}>جاري العمل على موقعنا الجديد</p>
        <p style={{ opacity: 0.7, margin: "0.25rem" }}>We're building something great.</p>
      </div>
    </main>
  );
}
