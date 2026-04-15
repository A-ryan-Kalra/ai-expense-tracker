"use client";

import { Bar, BarChart, XAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

// const chartData = [
//   { month: "January", desktop: 186, mobile: 80 },
//   { month: "February", desktop: 305, mobile: 200 },
//   { month: "March", desktop: 237, mobile: 120 },
//   { month: "April", desktop: 73, mobile: 190 },
//   { month: "May", desktop: 209, mobile: 130 },
//   { month: "June", desktop: 214, mobile: 140 },
// ];
// [
//   {
//     id: 1,
//     title: "Laptop",
//     amount: 80000,
//     date: "2026-04-12",
//   },
//   {
//     id: 3,
//     title: "iPhone 7 (bought 2026-03-03)",
//     amount: 60000,
//     date: "2026-04-14",
//   },
// ];

const chartConfig = {
  amount: {
    label: "Amount",
    color: "#2563eb",
  },
} satisfies ChartConfig;

type ChartElement = {
  [key: string]: string | number;
};

export function ExpenseChart({
  chartData,
  labelKey,
}: {
  chartData: ChartElement[];
  labelKey: string;
}) {
  return (
    <ChartContainer
      config={chartConfig}
      className="min-h-[200px] py-12 bg-neutral-900 rounded-xl my-4 p-4"
    >
      <BarChart accessibilityLayer data={chartData}>
        <ChartTooltip content={<ChartTooltipContent />} cursor={false} />
        <XAxis
          dataKey={labelKey}
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 30)}
        />

        <Bar dataKey="amount" fill="var(--color-amount)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
