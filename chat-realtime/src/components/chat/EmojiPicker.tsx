import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

type EmojiPickerProps = {
  onSelect: (emoji: string) => void;
  onClose: () => void;
};

const EMOJI_CATEGORIES = {
  smileys: ["😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂", "🙂", "🙃", "😉", "😊", "😇", "🥰", "😍", "🤩", "😘", "😗", "😚", "😙"],
  gestures: ["👍", "👎", "👌", "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉", "👆", "👇", "☝️", "👏", "🙌", "👐", "🤲", "🤝", "🙏", "✍️"],
  hearts: ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "💟"],
  reactions: ["🔥", "⭐", "✨", "💫", "💥", "💢", "💯", "✅", "❌", "⚠️", "🎉", "🎊", "🎈", "🎁", "🏆", "🥇", "🥈", "🥉"],
};

export default function EmojiPicker({ onSelect, onClose }: EmojiPickerProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <motion.div
      ref={ref}
      className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 w-80"
    >
      <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
        {Object.entries(EMOJI_CATEGORIES).map(([category, emojis]) => (
          <div key={category}>
            <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2 capitalize">
              {category}
            </h4>
            <div className="grid grid-cols-8 gap-1">
              {emojis.map((emoji) => (
                <motion.button
                  key={emoji}
                  whileHover={{ scale: 1.3 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onSelect(emoji)}
                  className="text-2xl p-2 rounded-lg  transition-colors"
                >
                  {emoji}
                </motion.button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}