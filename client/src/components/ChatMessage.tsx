import { BotMessageSquare, Check, User, Wrench } from "lucide-react";
import type { StreamMessage } from "../types";
import { ExpenseChart } from "./ExpenseChart";

type Props = {
  message: StreamMessage;
};

export function ChatMessage({ message }: Props) {
  return message.type === "user" ? (
    <div className="flex gap-4 py-6 px-6 transition-colors">
      <div className="shrink-0">
        <div className="w-8 h-8 rounded-lg bg-linear-to-br from-purple-500 to-gray-500 flex items-center justify-center shadow-lg">
          <User color="white" />
        </div>
      </div>
      <div className="flex-1 space-y-2 overflow-hidden">
        <div className="text-sm font-medium text-zinc-300">User</div>
        <div className="text-zinc-100 whitespace-pre-wrap wrap-break-word leading-7">
          {message.payload.text}
        </div>
      </div>
    </div>
  ) : message.type === "ai" ? (
    <div className="flex gap-4 py-6 px-6 transition-colors">
      <div className="shrink-0">
        <div className="w-8 h-8 rounded-lg bg-linear-to-br from-green-500 via-white-500 to-gray-500 flex items-center justify-center shadow-lg">
          <BotMessageSquare color="white" />
        </div>
      </div>
      <div className="flex-1 space-y-2 overflow-hidden">
        <div className="text-sm font-medium text-zinc-300">AI Assistant</div>
        <div className="text-zinc-100 whitespace-pre-wrap wrap-break-word leading-7">
          {message.payload.text}
        </div>
      </div>
    </div>
  ) : message.type === "toolCall:start" ? (
    <div className="flex gap-4 py-6 px-6 transition-colors">
      <div className="shrink-0">
        <div className="w-8 h-8 rounded-lg bg-linear-to-br from-white-500 via-white-500 to-gray-500 flex items-center justify-center shadow-lg">
          <Wrench color="white" />
        </div>
      </div>
      <div className="flex-1 space-y-2 overflow-hidden">
        <div className="text-sm text-zinc-400 italic">
          Using Tool{" "}
          <span className="text-purple-400 font-medium">
            {message.payload.name}
          </span>
        </div>
        <div className="text-xs text-zinc-300 bg-purple-900/15 rounded-lg p-3 font-mono whitespace-pre-wrap">
          {JSON.stringify(message.payload.args, null, 2)}
        </div>
      </div>
    </div>
  ) : (
    //  message.type === "tool"
    <div className="flex gap-4 py-6 px-6 transition-colors">
      <div className="shrink-0">
        <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center shadow-lg">
          <Check color="green" />
        </div>
      </div>
      <div className="flex-1 space-y-2 overflow-hidden">
        <div className="text-sm text-zinc-400 italic">
          Tool Result:{" "}
          <span className="text-green-500 font-medium">
            {message.payload.name}
          </span>
        </div>
        <div className="text-xs text-zinc-300 bg-purple-900/15 rounded-lg p-3 font-mono whitespace-pre-wrap">
          {JSON.stringify(message.payload.result, null, 2)}
        </div>
        {message.payload.name === "generate_expense_chart" && (
          // <span className="text-white">Rendering the chart...</span>
          <ExpenseChart
            chartData={message.payload.result.data}
            labelKey={message.payload.result.labelKey}
          />
        )}
      </div>
    </div>
  );
}
