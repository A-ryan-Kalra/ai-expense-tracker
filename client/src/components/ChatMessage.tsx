import { BotMessageSquare, User } from "lucide-react";
import type { StreamMessage } from "../types";

type Props = {
  message: StreamMessage;
};

export function ChatMessage({ message }: Props) {
  return message.type === "user" ? (
    <div className="flex gap-4 py-6 px-6 transition-colors">
      <div className="shrink-0">
        <div className="w-8 h-8 rounded-lg bg-linear-to-br from-white-500 via-white-500 to-gray-500 flex items-center justify-center shadow-lg">
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
    <>
      <div className="flex gap-4 py-6 px-6 transition-colors">
        <div className="shrink-0">
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-white-500 via-white-500 to-gray-500 flex items-center justify-center shadow-lg">
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
    </>
  ) : (
    <></>
  );
}
