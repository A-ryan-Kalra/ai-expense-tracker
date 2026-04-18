import express from "express";
import { interactWithLLM } from "../controller/controller.chat.ts";

const router = express.Router();

router.post("/chat", interactWithLLM);

export default router;
