import Sidebar from "@/components/chat/Sidebar";
import ChatWindow from "@/components/chat/ChatWindow";

export default function ChatLayout() {
  return (
    <div className="h-screen w-screen flex overflow-hidden bg-background">
      <Sidebar />
      <ChatWindow />
    </div>
  );
}
