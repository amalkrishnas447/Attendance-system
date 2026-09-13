function StatsCard({ title, value }) {
  return (
    <div
      style={{
        width: "220px",
        background: "white",
        padding: "25px",
        borderRadius: "15px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        textAlign: "center",
      }}
    >
      <h3>{title}</h3>
      <h1>{value}</h1>
    </div>
  );
}

export default StatsCard;