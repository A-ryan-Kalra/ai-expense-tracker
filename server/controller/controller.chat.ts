import type { Request, Response } from "express";
import { agent } from "../agent.ts";
import type { StreamMessage } from "../types.ts";

export const interactWithLLM = async (req: Request, res: Response) => {
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
      streamMode: ["messages", "custom"],
      // todo: generate dynamically
      configurable: { thread_id: "1" },
    },
  );

  for await (const [eventType, chunk] of response) {
    console.log("eventType", eventType);
    // console.log("Chunk", JSON.stringify(chunk[0].content, null, 2));
    let message: StreamMessage = {} as StreamMessage;

    if (eventType === "custom") {
      console.log("chunk", chunk);
      message = chunk;
    } else if (eventType === "messages") {
      if (chunk[0].content === "") continue;
      const messageType = chunk[0].type;
      console.log("MessageType", messageType);

      if (messageType === "ai") {
        message = {
          type: "ai",
          payload: { text: chunk[0].content as string },
        };
      } else if (messageType === "tool") {
        message = {
          type: "tool",
          payload: {
            name: chunk[0].name as string,
            result: JSON.parse(chunk[0].content as string),
          },
        };
      }
    }

    res.write(`event: cgPing\n`);
    res.write(`data: ${JSON.stringify(message)}\n\n`);
  }

  // setInterval(() => {
  //   res.write(`event: cgPing\n`);
  //   res.write(`data: ${query}\n\n`);
  // }, 1000);
  res.end(); //It will end the stream
};
