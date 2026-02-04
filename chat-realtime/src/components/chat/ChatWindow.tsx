import MessageList from "./MessageList";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import { useState, useEffect, useRef } from "react";
import { socket } from "../../lib/socket";
import { auth, db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { Message } from "@/type/types";

function getRoomId(a: string, b: string) {
  return [a, b].sort().join("_");
}

export default function ChatWindow({ friendId }: { friendId: string | null }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const me = auth.currentUser;

  const roomId = me && friendId ? getRoomId(me.uid, friendId) : null;
useEffect(() => {
  if (!roomId) return;

  const q = query(
    collection(db, "chats", roomId, "messages"),
    orderBy("createdAt", "asc")
  );

  const unsub = onSnapshot(q, (snap) => {
    const data: Message[] = snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<Message, "id">),
    }));

    setMessages(data);
  });

  return () => unsub();
}, [roomId]);
useEffect(() => {
  setText(""); // ✅ reset input khi đổi phòng
}, [friendId]);

  // ✅ RESET MESSAGE KHI ĐỔI PHÒNG
  useEffect(() => {
    setMessages([]);
  }, [roomId]);

  // ✅ LOAD MESSAGE
  useEffect(() => {
    if (!roomId) return;

    const q = query(
      collection(db, "chats", roomId, "messages"),
      orderBy("createdAt"),
    );

    const unsub = onSnapshot(q, (snap) => {
      const data: Message[] = snap.docs.map((d) => d.data() as Message);
      setMessages(data);
    });

    return () => unsub();
  }, [roomId]);

  // ✅ SOCKET JOIN
  useEffect(() => {
    if (!roomId) return;
    socket.emit("join-room", roomId);

    // Listen for typing indicator
    socket.on("user-typing", () => setIsTyping(true));
    socket.on("user-stopped-typing", () => setIsTyping(false));

    return () => {
      socket.off("user-typing");
      socket.off("user-stopped-typing");
    };
  }, [roomId]);

  // ✅ SEND MESSAGE
  const sendMessage = async () => {
    if (!text.trim() || !me || !roomId) return;

    await addDoc(collection(db, "chats", roomId, "messages"), {
      text,
      sender: me.uid,
      createdAt: serverTimestamp(),
       seenBy: [me.uid]
    });

    setText("");
  };

  // Handle typing indicator

  const handleTyping = () => {
    if (!roomId) return;

    socket.emit("typing", { roomId });

    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }

    typingTimeout.current = setTimeout(() => {
      socket.emit("stop-typing", { roomId });
    }, 1000);
  };

  // ✅ UI PLACEHOLDER
  if (!me || !friendId) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 flex items-center justify-center bg-linear-to-br from-white to-gray-50"
      >
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-6xl"
          >
            💬
          </motion.div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-gray-600 font-medium"
          >
            Select a friend to start chatting
          </motion.div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-sm text-gray-400"
          >
            Choose from your contacts to begin a conversation
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 h-full flex flex-col overflow-hidden bg-white"
    >
      <ChatHeader friendId={friendId} />

      {/* MESSAGE LIST SCROLL */}
      <div className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50/30 to-white">
        <MessageList messages={messages} meId={me.uid}   friendId={friendId}
 />

        {/* Typing Indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="px-6 py-2"
            >
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="flex gap-1">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                    className="w-2 h-2 bg-gray-400 rounded-full"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                    className="w-2 h-2 bg-gray-400 rounded-full"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                    className="w-2 h-2 bg-gray-400 rounded-full"
                  />
                </div>
                <span>Đang soạn tin...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* INPUT FIXED BOTTOM */}
      <div className="border-t bg-white shadow-lg">
        <ChatInput
          text={text}
          setText={setText}
          onSend={sendMessage}
          onTyping={handleTyping}
        />
      </div>
    </motion.div>
  );
}
