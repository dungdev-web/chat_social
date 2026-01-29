import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Smile, Paperclip, Mic } from "lucide-react";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import EmojiPicker from "./EmojiPicker";
type ChatInputProps = {
  text: string;
  setText: (text: string) => void;
  onSend: () => void;
  onTyping?: () => void;
};

export default function ChatInput({
  text,
  setText,
  onSend,
  onTyping,
}: ChatInputProps) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setText(text + emoji);
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  };

  return (
    <div className="relative">
      <AnimatePresence>
        {showEmojiPicker && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full left-4 mb-2"
          >
            <EmojiPicker
              onSelect={handleEmojiSelect}
              onClose={() => setShowEmojiPicker(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-4 flex items-center gap-2">
        {/* Attachment Button */}
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-gray-600 hover:text-blue-600 hover:bg-blue-50"
          >
            <Paperclip className="w-5 h-5" />
          </Button>
        </motion.div>

        {/* Input Field */}
        <div className="flex-1 relative">
          <Input
            ref={inputRef}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              onTyping?.();
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="pr-12 py-6 rounded-full bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-300 transition-all"
          />
          
          {/* Emoji Button */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="rounded-full text-gray-600 hover:text-yellow-500 hover:bg-yellow-50"
            >
              <Smile className="w-5 h-5" />
            </Button>
          </motion.div>
        </div>

        {/* Voice Message Button */}
        {!text.trim() ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-gray-600 hover:text-purple-600 hover:bg-purple-50"
            >
              <Mic className="w-5 h-5" />
            </Button>
          </motion.div>
        ) : (
          /* Send Button */
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button
              onClick={onSend}
              className="rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all"
              size="icon"
            >
              <Send className="w-5 h-5" />
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}