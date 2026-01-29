import Sidebar from "@/components/chat/Sidebar";
import ChatWindow from "@/components/chat/ChatWindow";
import { useState } from "react";
export default function ChatLayout() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);

   return (
    <div className="flex h-screen overflow-hidden">
      {/* SIDEBAR SLIDE */}
      <div
        className={`
          transition-all duration-300 ease-in-out
          ${showSidebar ? "w-[320px]" : "w-0"}
          overflow-hidden border-r
        `}
      >
        <Sidebar
          selectedId={selectedId}
          onSelect={(uid) => {
            setSelectedId(uid);
            setShowSidebar(false);
          }}
        />
      </div>

      {/* MAIN */}
      <div className="flex-1 flex flex-col">
        {/* TOP BAR */}
        <div className="h-12 border-b flex items-center gap-2 px-4">
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="p-2 rounded hover:bg-accent transition"
          >
            ☰
          </button>

          <div className="font-medium">Chat</div>
        </div>

        <ChatWindow friendId={selectedId} />
      </div>
    </div>
  );
}