import { PhoneOff } from "lucide-react";
import { useEffect, useState } from "react";

export default function MiniCallWindow({
  isOpen,
  name,
  avatar,
  callStartAt,
  onEnd,
}: {
  isOpen: boolean;
  name: string;
  avatar?: string;
  callStartAt: number | null;
  onEnd: () => void;
}) {
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!callStartAt) return;

    const timer = setInterval(() => {
      setDuration(Math.floor((Date.now() - callStartAt) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [callStartAt]);

  if (!isOpen || !callStartAt) return null;

  const mm = String(Math.floor(duration / 60)).padStart(2, "0");
  const ss = String(duration % 60).padStart(2, "0");

  return (
    <div className="fixed bottom-4 right-4 bg-white shadow-xl rounded-2xl px-4 py-3 flex items-center gap-3 z-50 border">
      <img
        src={avatar || "https://github.com/shadcn.png"}
        className="w-10 h-10 rounded-full"
      />
      <div className="flex flex-col">
        <span className="font-semibold text-sm">{name}</span>
        <span className="text-xs text-gray-500">🔊 {mm}:{ss}</span>
      </div>

      <button
        onClick={onEnd}
        className="ml-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2"
      >
        <PhoneOff size={16} />
      </button>
    </div>
  );
}
