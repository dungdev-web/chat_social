import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Phone,
  Video,
  MoreVertical,
  Search,
  Info,
  PhoneOff,
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { auth } from "@/lib/firebase";
import { useCallContext } from "@/context/CallContext";
import IncomingCallModal from "./IncomingCallModal";
import MiniCallWindow from "./MiniCallWindow";

type User = {
  email: string;
  photoURL?: string;
  displayName?: string;
};

export default function ChatHeader({ friendId }: { friendId: string }) {
  const [friend, setFriend] = useState<User | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const me = auth.currentUser!;

  const { callUser, acceptCall, rejectCall, incoming, inCall, endCall,callStartAt } =
    useCallContext();
  useEffect(() => {
    const loadFriend = async () => {
      const snap = await getDoc(doc(db, "users", friendId));
      if (snap.exists()) {
        setFriend(snap.data() as User);
      }
    };
    loadFriend();
  }, [friendId]);

  if (!friend) return null;

  return (
    <>
     {inCall && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-xl shadow-lg">
          🔊 Đang trong cuộc gọi...
          <button onClick={endCall}>❌</button>
        </div>
      )}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="border-b border-gray-200 bg-white/80 backdrop-blur-lg"
      >
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="cursor-pointer"
              >
                <Avatar className="w-11 h-11 border-2 border-blue-100 shadow-sm">
                  <AvatarImage
                    src={friend.photoURL || "https://github.com/shadcn.png"}
                  />
                  <AvatarFallback className="bg-linear-to-br from-blue-400 to-purple-400 text-white">
                    {friend.email[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </motion.div>
              {/* Online Status */}
              {isOnline && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white shadow-sm"
                />
              )}
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">
                {friend.displayName || friend.email.split("@")[0]}
              </h3>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-xs text-gray-500"
              >
                {isOnline ? (
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                    Active now
                  </span>
                ) : (
                  "Offline"
                )}
              </motion.p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full text-gray-600 hover:text-blue-600 hover:bg-blue-50"
              >
                <Search className="w-5 h-5" />
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full text-gray-600 hover:text-green-600 hover:bg-green-50"
                onClick={() => {
                  if (inCall) {
                    endCall(); // ❌ cúp máy
                  } else {
                    callUser(friendId); // 📞 gọi
                  }
                }}
              >
                {inCall ? <PhoneOff /> : <Phone />}
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full text-gray-600 hover:text-purple-600 hover:bg-purple-50"
              >
                <Video className="w-5 h-5" />
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full text-gray-600 hover:text-gray-900 "
              >
                <Info className="w-5 h-5" />
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>
      <IncomingCallModal
        isOpen={!!incoming && !inCall}
        callerName={friend.displayName || friend.email.split("@")[0]}
        callerAvatar={friend.photoURL}
        callerEmail={friend.email}
        onAccept={acceptCall}
        onReject={rejectCall}
      />
     <MiniCallWindow
  isOpen={inCall}
  name={friend.displayName || friend.email}
  avatar={friend.photoURL}
  callStartAt={callStartAt}
  onEnd={endCall}
/>

    </>
  );
}
