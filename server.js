import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

const app = express();
const PORT = process.env.PORT || 3000;
const API_BASE = (process.env.BASKETBALL_API_BASE || "https://api.basketballapi.net/v1").replace(/\/$/, "");
const API_KEY = process.env.BASKETBALL_API_KEY;

app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.static("public"));
app.use("/api", rateLimit({ windowMs: 60_000, limit: 60, standardHeaders: true, legacyHeaders: false }));

const allowed = [
  /^\/competitions$/,
  /^\/seasons$/,
  /^\/teams$/,
  /^\/games$/,
  /^\/results\/yesterday$/,
  /^\/standings$/,
  /^\/stats\/teams$/,
  /^\/teams\/[A-Za-z0-9_-]+$/,
  /^\/teams\/[A-Za-z0-9_-]+\/(form|head-to-head|roster|seasons)$/
];

app.use("/api", async (req, res) => {
  if (!API_KEY) return res.status(503).json({error:"Server is missing BASKETBALL_API_KEY. Add it in your hosting provider's environment variables."});
  const path = req.path.replace(/^\/api/, "");
  if (!allowed.some(rule => rule.test(path))) return res.status(404).json({error:"This data endpoint is not enabled in this prototype."});
  const url = new URL(API_BASE + path);
  for (const [key,value] of Object.entries(req.query)) {
    if (typeof value === "string") url.searchParams.set(key,value);
  }
  try {
    const upstream = await fetch(url, {
      headers: { Authorization: `Bearer ${API_KEY}`, Accept: "application/json" },
      signal: AbortSignal.timeout(20_000)
    });
    const payload = await upstream.text();
    res.status(upstream.status);
    res.type(upstream.headers.get("content-type") || "application/json");
    res.send(payload);
  } catch (error) {
    res.status(502).json({error:"Basketball data provider could not be reached.", detail:error.message});
  }
});

app.get("/health", (_req,res) => res.json({ok:true, provider:"Basketball API", keyConfigured:Boolean(API_KEY)}));
app.listen(PORT, () => console.log(`COURTWISE AI server listening on ${PORT}`));
