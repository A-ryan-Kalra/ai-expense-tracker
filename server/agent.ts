import { ChatOpenAI } from "@langchain/openai";
import {
  MemorySaver,
  MessagesAnnotation,
  StateGraph,
} from "@langchain/langgraph";
import { initDB } from "./db.ts";
import { initTools } from "./tools.ts";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { AIMessage } from "@langchain/core/messages";
import dotenv from "dotenv";

dotenv.config();
/*
 * Initialise the database
 */
const database = initDB("./expenses.db");
const tools = initTools(database);

/*
 * Initialise the llm
 */
const llm = new ChatOpenAI({
  model: "gpt-5-mini",
  // temperature: 0,
});

/*
 * Tool Node
 */
const toolNode = new ToolNode(tools);

/*
 * Call Model Node
 */

async function callModel(state: typeof MessagesAnnotation.State) {
  const llmWithTools = llm.bindTools(tools);
  const response = await llmWithTools.invoke([
    {
      role: "system",
      content: `You are helpful expense tracking assistant. Current datetime: ${new Date().toISOString()}.
  Call add_expense tool to add the expense to database.`,
    },
    ...state.messages,
  ]);
  return { messages: [response] };
}

/* 
 Conditional Edge
 */
function shouldContinue(state: typeof MessagesAnnotation.State) {
  const messages = state.messages;
  const lastMessages = messages.at(-1) as AIMessage;
  if (lastMessages.tool_calls?.length) {
    return "tools";
  }
  return "__end__";
}

/*
 * Graph
 */

const graph = new StateGraph(MessagesAnnotation)
  .addNode("callModel", callModel)
  .addNode("tools", toolNode)
  .addEdge("__start__", "callModel")
  .addConditionalEdges("callModel", shouldContinue, {
    __end__: "__end__",
    tools: "tools",
  });

const agent = graph.compile({ checkpointer: new MemorySaver() });

async function main() {
  const response = await agent.invoke(
    {
      messages: [
        {
          role: "user",
          content: `I bought phone worth 45000 INR.`,
        },
      ],
    },
    {
      configurable: { thread_id: "1" },
    },
  );

  console.log(JSON.stringify(response, null, 2));
}

main();
