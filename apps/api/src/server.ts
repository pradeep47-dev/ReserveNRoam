import "dotenv/config";
import cors from "cors";
import express from "express";

const app = express();
const port = Number(process.env.PORT ?? 3001);
const allowedOrigin = process.env.CORS_ORIGIN ?? "http://localhost:5173";

app.use(cors({ origin: allowedOrigin }));
app.use(express.json());

app.get("/api/health", (_request, response) => {
  response.status(200).json({
    status: "ok",
    service: "reservenroam-api",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api", (_request, response) => {
  response.json({
    name: "ReserveNRoam API",
    version: "0.1.0",
    message: "Outdoor discovery and reservation API",
  });
});

app.listen(port, () => {
  console.log(`ReserveNRoam API listening on http://localhost:${port}`);
});
