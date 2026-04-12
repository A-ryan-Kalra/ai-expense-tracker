import { DatabaseSync } from "node:sqlite";
import { tool } from "@langchain/core/tools";
import { z } from "zod";

export function initTools(database: DatabaseSync) {
  /* 
  Add Expense Tool
  */
  const addExpense = tool(
    ({ title, amount }) => {
      console.log({ title, amount });
      // todo: do proper args validation
      const date = new Date().toISOString().split("T")[0];

      //todo: add Error handling
      const stmt = database.prepare(
        `Insert into expenses (title, amount, date) VALUES (?, ?, ?)`,
      );
      stmt.run(title, amount, date);

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

  /* 
  Get Expenses Tool
 */

  const getExpenses = tool(
    ({ from, to }) => {
      console.log({ from, to });
      // todo: do proper args validation
      const stmt = database.prepare(
        `SELECT * FROM expenses WHERE date BETWEEN ? AND ?`,
      );
      const rows = stmt.all(from, to);
      console.log("rows", rows);
      return JSON.stringify(rows);
    },
    {
      name: "get_expenses",
      description: "Get the expenses from database for given date range",
      schema: z.object({
        from: z.string().describe("Start date in YYYY-MM-DD format"),
        to: z.string().describe("End date in YYYY-MM-DD format"),
      }),
    },
  );

  return [addExpense, getExpenses];
}
