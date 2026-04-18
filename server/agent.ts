import { ChatOpenAI } from "@langchain/openai";
import {
  MemorySaver,
  MessagesAnnotation,
  StateGraph,
  type LangGraphRunnableConfig,
} from "@langchain/langgraph";
import { initDB } from "./db.ts";
import { initTools } from "./tools.ts";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { AIMessage, ToolMessage } from "@langchain/core/messages";
import dotenv from "dotenv";
import type { StreamMessage } from "./types.ts";

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
      content: `
You are helpful expense tracking assistant. Current datetime: ${new Date().toISOString()}.
Call add_expense tool to add the expense to database.
Call getExpenses tool to get the list of expenses for given date range.
Call generate_expense_char tool only when user needs to visualize the expenses.
  `,
    },
    ...state.messages,
  ]);
  return { messages: [response] };
}

/* 
 Conditional Edge
 */
function shouldContinue(
  state: typeof MessagesAnnotation.State,
  config: LangGraphRunnableConfig,
) {
  const messages = state.messages;
  const lastMessages = messages.at(-1) as AIMessage;
  if (lastMessages.tool_calls?.length) {
    // send custom events
    const customMessage: StreamMessage = {
      type: "toolCall:start",
      payload: {
        name: lastMessages.tool_calls[0]?.name as string,
        args: lastMessages.tool_calls[0]?.args as StreamMessage,
      },
    };
    config.writer!(customMessage);
    return "tools";
  }
  return "__end__";
}

/*
 * Graph
 */

function shouldCallModel(state: typeof MessagesAnnotation.State) {
  // todo: chnage this when chart tool will be implemented
  const messages = state.messages;
  const lastMessages = messages.at(-1) as ToolMessage;

  const message = JSON.parse(lastMessages.content as string);
  if (message.type === "chart") {
    return "__end__";
  }

  return "callModel";
}

const graph = new StateGraph(MessagesAnnotation)
  .addNode("callModel", callModel)
  .addNode("tools", toolNode)
  .addEdge("__start__", "callModel")
  .addConditionalEdges("callModel", shouldContinue, {
    __end__: "__end__",
    tools: "tools",
  })
  .addConditionalEdges("tools", shouldCallModel, {
    callModel: "callModel",
    __end__: "__end__",
  });

export const agent = graph.compile({ checkpointer: new MemorySaver() });
