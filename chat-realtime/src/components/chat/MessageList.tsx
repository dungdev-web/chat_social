import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, CheckCheck } from "lucide-react";

type Message = {
  text: string;
  sender: string;
  createdAt?: any;
};

type MessageListProps = {
  messages: Message[];
  meId: string;
};

export default function MessageList({ messages, meId }: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="p-6 space-y-4">
      <AnimatePresence initial={false}>
        {messages.map((msg, i) => {
          const isMe = msg.sender === meId;
          const showAvatar = i === 0 || messages[i - 1].sender !== msg.sender;
          const isLastInGroup =
            i === messages.length - 1 || messages[i + 1].sender !== msg.sender;

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
              className={`flex gap-2 ${isMe ? "justify-end" : "justify-start"}`}
            >
              {!isMe && (
                <div className="w-8 flex-shrink-0">
                  {showAvatar && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      <Avatar className="w-8 h-8 border-2 border-white shadow-sm">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-400 text-white text-xs">
                          F
                        </AvatarFallback>
                      </Avatar>
                    </motion.div>
                  )}
                </div>
              )}

              <motion.div
                whileHover={{ scale: 1.02 }}
                className={`max-w-[70%] ${isMe ? "items-end" : "items-start"} flex flex-col gap-1`}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.05 }}
                  className={`px-4 py-2.5 rounded-2xl shadow-sm ${
                    isMe
                      ? `bg-gradient-to-r from-blue-600 to-purple-600 text-white ${
                          isLastInGroup ? "rounded-br-md" : ""
                        }`
                      : `bg-white border border-gray-200 text-gray-900 ${
                          isLastInGroup ? "rounded-bl-md" : ""
                        }`
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap wrap-break-words">
                    {msg.text}
                  </p>
                </motion.div>

                {/* Message Status */}
                {isMe && isLastInGroup && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center gap-1 text-xs text-gray-400 px-1"
                  >
                    <CheckCheck className="w-3 h-3 text-blue-500" />
                    <span>Seen</span>
                  </motion.div>
                )}
              </motion.div>

              {isMe && <div className="w-8 flex-shrink-0" />}
            </motion.div>
          );
        })}
      </AnimatePresence>
      <div ref={scrollRef} />
    </div>
  );
}