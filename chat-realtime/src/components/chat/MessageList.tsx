import { motion } from "framer-motion";

const messages = Array.from({ length: 20 }).map((_, i) => ({
  id: i,
  text: "Hello " + i,
  me: i % 2 === 0,
}));
type Message = {
  text: string;
  me: boolean;
};

type Props = {
  messages: Message[];
};

export default function MessageList({ messages }: Props) {
    
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      {messages.map((msg, i) => (
        <div
          key={i}
          className={`max-w-xs px-4 py-2 rounded-lg ${
            msg.me ? "bg-blue-500 text-white ml-auto" : "bg-muted"
          }`}
        >
          {msg.text}
        </div>
      ))}
    </div>
  );
}
