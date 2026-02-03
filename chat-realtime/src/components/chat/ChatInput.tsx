import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Smile, Paperclip, Mic } from "lucide-react";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";
import { ChatInputProps } from "@/type/types";
import { uploadChatImage } from "@/services/uploadImage";

export default function ChatInput({
  text,
  setText,
  onSend,
  onTyping,
}: ChatInputProps) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [uploading, setUploading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  /* =========================
      SEND TEXT
  ========================== */
  const handleSendText = () => {
    if (!text.trim()) return;
    onSend({ text });
    setText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendText();
    }
  };

  /* =========================
      EMOJI
  ========================== */
  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setText((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  };

  /* =========================
      IMAGE UPLOAD
  ========================== */
  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const imageUrl = await uploadChatImage(file);
      onSend({ imageUrl });
    } catch (err) {
      console.error("Upload image failed", err);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="relative">
      {/* ================= EMOJI PICKER ================= */}
      <AnimatePresence>
        {showEmojiPicker && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full left-4 mb-2 z-50"
          >
            <EmojiPicker
              onEmojiClick={handleEmojiClick}
              height={350}
              theme={Theme.LIGHT}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= INPUT BAR ================= */}
      <div className="p-4 flex items-center gap-2">
        {/* IMAGE BUTTON */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => fileRef.current?.click()}
        >
          <Paperclip />
        </Button>

        <Input
          type="file"
          accept="image/*"
          hidden
          ref={fileRef}
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;

            const imageUrl = await uploadChatImage(file);
            onSend({ imageUrl });
            e.target.value = "";
          }}
        />

        {/* INPUT */}
        <div className="flex-1 relative">
          <Input
            ref={inputRef}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              onTyping();
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="pr-12 py-6 rounded-full"
            disabled={uploading}
          />

          {/* EMOJI BUTTON */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowEmojiPicker((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <Smile />
          </Button>
        </div>

        {/* SEND / MIC */}
        {text.trim() ? (
          <Button onClick={handleSendText} size="icon" disabled={uploading}>
            <Send />
          </Button>
        ) : (
          <Button variant="ghost" size="icon">
            <Mic />
          </Button>
        )}
      </div>

      {/* UPLOADING STATE */}
      {uploading && (
        <div className="absolute inset-0 bg-white/60 flex items-center justify-center text-sm text-gray-500">
          Đang gửi ảnh...
        </div>
      )}
    </div>
  );
}
