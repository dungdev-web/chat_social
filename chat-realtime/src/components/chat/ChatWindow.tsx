import MessageList from "./MessageList";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import { useState, useEffect } from "react";
import { socket } from "../../lib/socket";

type Message = {
  text: string;
  me: boolean;
};

export default function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");

  useEffect(() => {
    socket.on("receive-message", (msg: string) => {
      setMessages((prev) => [...prev, { text: msg, me: false }]);
    });

    return () => {
      socket.off("receive-message");
    };
  }, []);

  const sendMessage = () => {
    if (!text.trim()) return;

    socket.emit("send-message", text);
    setMessages((prev) => [...prev, { text, me: true }]);
    setText("");
  };

  return (
    <div className="flex-1 flex flex-col">
      <ChatHeader />
      <MessageList messages={messages} />
      <ChatInput
        text={text}
        setText={setText}
        onSend={sendMessage}
      />
    </div>
  );
}
