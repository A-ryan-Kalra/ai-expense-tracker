import express from "express";
import cors from "cors";
import { agent } from "./agent.ts";
import type { StreamMessage } from "./types.ts";
import chatRoute from "./route/chat.route.ts";
const app = express();

app.use(express.json());

app.use(cors());

app.get("/", (req, res) => {
  res.json({ message: "Ok" });
});

// SSE
// 1. Add special header
//2. Send data in special format

app.use("/api", chatRoute);

const PORT = process.env.PORT || 4100;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
