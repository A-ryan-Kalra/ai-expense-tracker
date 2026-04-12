import { DatabaseSync } from "node:sqlite";
import { tool } from "@langchain/core/tools";
import { z } from "zod";

export function initTools(database: DatabaseSync) {
  const addExpense = tool(
    ({ title, amount }) => {
      console.log({ title, amount });
      // todo: do proper args validation
      const date = new Date().toISOString().split("T")[0];

      //todo: add Error handling
      const statement = database.prepare(
        `Insert into expenses (title, amount, date) VALUES (?, ?, ?)`,
      );
      statement.run(title, amount, date);

      return JSON.stringify({ status: "success!" });
    },
    {
      name: "add_expense",
      description: "Add the given expense to database",
      schema: z.object({
        title: z.string().describe("The expense title"),
        amount: z.number().describe("The amount spent"),
      }),
    },
  );

  return [addExpense];
}
