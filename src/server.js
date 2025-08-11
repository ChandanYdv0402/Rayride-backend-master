import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();

// parse env
const port = process.env.PORT || 8080;
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

// CORS
app.use(cors({
  origin: (origin, cb) => {
    // allow mobile apps / curl (no origin)
    if (!origin) return cb(null, true);
    if (allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error("CORS blocked for origin: " + origin));
  },
  credentials: true
}));

app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

// Example API
app.get("/api/hello", (req, res) => {
  res.json({ hello: "world" });
});

// Error handler (keep last)
app.use((err, req, res, next) => {
  console.error("ERROR:", err?.message || err);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(port, () => console.log(`Server listening on ${port}`));
