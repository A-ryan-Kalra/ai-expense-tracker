import express from "express";
import cors from "cors";

const app = express();

app.use(express.json());

app.use(cors());

app.get("/", (req, res) => {
  res.json({ message: "Ok" });
});

// SSE
// 1. Add special header
//2. Send data in special format

app.post("/chat", (req, res) => {
  const query = req?.body?.query;
  console.log("Query=>", query);
  res.writeHead(200, {
    "Content-type": "text/event-stream",
  });

  setInterval(() => {
    res.write(`event: cgPing\n`);
    res.write(`data: ${query}\n\n`);
  }, 1000);
});

const PORT = process.env.PORT || 4100;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
