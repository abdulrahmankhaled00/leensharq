export default function Home() {
  return (
    //,e
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        fontFamily: "system-ui, sans-serif",
        background: "#0b1220",
        color: "#fff",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <div>
        <img
          src="/logo.png"
          alt="Leen Al Sharq Holding"
          style={{ width: "min(70vw, 320px)", marginBottom: "1.5rem" }}
        />
        <h1
          style={{
            fontSize: "clamp(1.5rem, 5vw, 2.5rem)",
            margin: "0 0 0.75rem",
            fontWeight: 600,
          }}
        >
          جاري العمل على الموقع وسيتم الإطلاق قريبًا
        </h1>
        <p style={{ opacity: 0.7, margin: "0.25rem" }}>Coming soon — launching shortly.</p>
      </div>
    </main>
  );
}
