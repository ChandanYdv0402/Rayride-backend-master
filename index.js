// index.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ---- Config ----
// Railway sets PORT for you. Fallback for local dev.
const PORT = process.env.PORT || 8080;

// Put your production frontend URL here after Hosting deploy
// e.g. https://your-project.web.app
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";

// Allowlist (add more origins if you need)
const allowedOrigins = new Set([
  FRONTEND_ORIGIN,
  "http://localhost:5173",
  "http://localhost:3000"
]);

// ---- Middleware ----
app.use(cors({
  origin(origin, cb) {
    // allow server-to-server, curl, mobile (no Origin header)
    if (!origin) return cb(null, true);
    if (allowedOrigins.has(origin)) return cb(null, true);
    return cb(new Error("CORS: origin not allowed"), false);
  },
  credentials: true
}));

// Handle preflight quickly
app.options("*", cors());

app.use(express.json());

// ---- Routes ----
app.use("/api/users", require("./routes/users"));
app.use("/api/rides", require("./routes/rides"));
app.use("/api/battery", require("./routes/battery"));
app.use("/api/maps", require("./routes/maps"));
app.use("/api/wallet", require("./routes/wallet"));
app.use("/api/notifications", require("./routes/notifications"));
app.use("/api/match", require("./routes/match"));
app.use("/api/negotiation", require("./routes/negotiation"));
app.use("/api/queue", require("./routes/queue"));
app.use("/api/sync", require("./routes/sync"));

// Health check
app.get("/health", (_req, res) => res.json({ ok: true }));

// ---- Start server ----
// Bind to 0.0.0.0 so Railway can expose it publicly
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on 0.0.0.0:${PORT}`);
});
