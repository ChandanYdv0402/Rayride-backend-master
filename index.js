// index.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

// Allow only specific origins (add your frontend URL after deploy)
const allowedOrigins = [
  "http://localhost:5173", // local dev
  "http://localhost:3000", // local dev
  "https://<your-frontend>.web.app" // replace with your actual hosting domain
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps, curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json());

// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/rides', require('./routes/rides'));
app.use('/api/battery', require('./routes/battery'));
app.use('/api/maps', require('./routes/maps'));
app.use('/api/wallet', require('./routes/wallet'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/match', require('./routes/match'));
app.use('/api/negotiation', require('./routes/negotiation'));
app.use('/api/queue', require('./routes/queue'));
app.use('/api/sync', require('./routes/sync'));

// Health check route
app.get('/health', (req, res) => {
  res.json({ ok: true });
});

// Start Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running at http://0.0.0.0:${PORT}`);
});

