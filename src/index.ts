import express from "express";
import dotenv from "dotenv";
import { prisma } from "./prismaClient";
import { createClient } from "redis";

dotenv.config();
const app = express();
app.use(express.json());

const PORT = process.env.PORT ?? "3000";
const REDIS_URL = process.env.REDIS_URL ?? "redis://localhost:6379";

const redis = createClient({ url: REDIS_URL });
redis.connect().catch((err) => console.error("Redis connect error:", err));

app.get("/", (_req, res) => res.json({ status: "ok" }));

app.get("/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    await redis.ping();
    res.json({ status: "ok" });
  } catch (err) {
    res.status(500).json({ status: "unhealthy", error: String(err) });
  }
});

app.get("/users", async (_req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.post("/users", async (req, res) => {
  const { email, name } = req.body;
  if (!email) return res.status(400).json({ error: "email required" });
  const user = await prisma.user.create({ data: { email, name } });
  res.status(201).json(user);
});

app.get("/visits", async (_req, res) => {
  try {
    const visits = await redis.incr("visits_count");
    res.json({ visits: Number(visits) });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

app.listen(parseInt(PORT, 10), () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
