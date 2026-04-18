import { DatabaseSync } from "node:sqlite";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import type { LangGraphRunnableConfig } from "@langchain/langgraph";

export function initTools(database: DatabaseSync) {
  /* 
  Add Expense Tool
  */
  const addExpense = tool(
    ({ title, amount }) => {
      // console.log({ title, amount });
      // todo: do proper args validation
      const date = new Date().toISOString().split("T")[0];

      try {
        const stmt = database.prepare(
          `Insert into expenses (title, amount, date) VALUES (?, ?, ?)`,
        );
        stmt.run(title, amount, date);
        return JSON.stringify({ status: "success!" });
      } catch (error) {
        console.error("Failed to add expense:", error);
        return JSON.stringify({
          status: "error",
          message: "Failed to add expense",
        });
      }
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
    ({ from, to }, config: LangGraphRunnableConfig) => {
      // console.log({ from, to });

      // Stream any arnitary data
      // config.writer?.(`Looking up data for your expense`);
      // todo: do proper args validation
      const stmt = database.prepare(
        `SELECT * FROM expenses WHERE date BETWEEN ? AND ?`,
      );
      const rows = stmt.all(from, to);
      // console.log("rows", rows);
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

  /*
   * Generate Chart
   */

  const generateChart = tool(
    ({ from, to, groupBy }) => {
      // console.log("args", { from, to, groupBy });
      let sqlGroupBy: string;

      switch (groupBy) {
        case "month":
          sqlGroupBy = "strftime('%Y-%m', date)";
          break;
        case "week":
          sqlGroupBy = `strftime('%Y-%W%W', date)`;
          break;
        case "date":
          sqlGroupBy = `date`;
          break;
        default:
          sqlGroupBy = `strftime('%Y-%m', date)`;
      }

      // todo: do proper args validation
      const query = `
SELECT ${sqlGroupBy} as period, SUM(amount) as total
FROM expenses
WHERE date BETWEEN ? AND ?
GROUP BY period
ORDER BY period      
      `;

      const stmt = database.prepare(query);
      const rows = stmt.all(from, to);

      //todo: format to chart input structure

      const result = rows.map((row) => {
        return {
          [groupBy]: row.period,
          amount: row.total,
        };
      });

      return JSON.stringify({
        type: "chart",
        data: result,
        labelKey: groupBy,
      });
    },
    {
      name: "generate_expense_chart",
      description:
        "Generate expense charts by querying the database and grouping expenses by month, week or date.",
      schema: z.object({
        from: z.string().describe("Start date in YYYY-MM-DD format"),
        to: z.string().describe("End date in YYYY-MM-DD format"),
        groupBy: z
          .enum(["month", "week", "date"])
          .describe("How to group the data: by month, week or date."),
      }),
    },
  );

  return [addExpense, getExpenses, generateChart];
}
