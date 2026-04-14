import express from "express";
import cors from "cors";
import { agent } from "./agent.ts";
import type { StreamMessage } from "./types.ts";

const app = express();

app.use(express.json());

app.use(cors());

app.get("/", (req, res) => {
  res.json({ message: "Ok" });
});

// SSE
// 1. Add special header
//2. Send data in special format

app.post("/chat", async (req, res) => {
  const { query } = req.body;

  res.writeHead(200, {
    "Content-type": "text/event-stream",
  });
  const response = await agent.stream(
    {
      messages: [
        {
          role: "user",
          content: query,
        },
      ],
    },
    {
      streamMode: ["messages"],
      // todo: generate dynamically
      configurable: { thread_id: "1" },
    },
  );

  for await (const [eventType, chunk] of response) {
    console.log("Chunk", JSON.stringify(chunk[0].content, null, 2));
    let message: StreamMessage = {} as StreamMessage;
    const messageType = chunk[0].type;

    if (messageType === "ai") {
      message = {
        type: "ai",
        payload: { text: chunk[0].content as string },
      };
    }

    res.write(`event: cgPing\n`);
    res.write(`data: ${JSON.stringify(message)}\n\n`);
  }

  // setInterval(() => {
  //   res.write(`event: cgPing\n`);
  //   res.write(`data: ${query}\n\n`);
  // }, 1000);
  res.end(); //It will end the stream
});

const PORT = process.env.PORT || 4100;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
