import { AnimatePresence, motion } from "framer-motion";
import { Phone, PhoneOff, PhoneCall } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Props = {
  isOpen: boolean;
  callerName: string;
  callerAvatar?: string;
  callerEmail: string;
  onAccept: () => void;
  onReject: () => void;
};

export default function IncomingCallModal({
  isOpen,
  callerName,
  callerAvatar,
  callerEmail,
  onAccept,
  onReject,
}: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center"
          onClick={onReject}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 30 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl shadow-2xl w-95 overflow-hidden"
          >
            {/* HEADER */}
            <div className="relative bg-linear-to-br from-blue-600 to-purple-600 p-8 text-center overflow-hidden">
              {/* Pulse background */}
              <motion.div
                animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-3xl"
              />
              <motion.div
                animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/20 rounded-full blur-3xl"
              />

              {/* Avatar pulse */}
              <div className="relative inline-block mb-4">
                <motion.div
                  animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-white rounded-full blur-lg -m-4"
                />

                <Avatar className="w-24 h-24 border-4 border-white shadow-xl relative">
                  <AvatarImage src={callerAvatar || ""} />
                  <AvatarFallback className="text-2xl bg-linear-to-br from-blue-400 to-purple-400 text-white">
                    {callerEmail[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>

              <h3 className="text-2xl font-bold text-white">{callerName}</h3>
              <p className="text-blue-100 mt-1">đang gọi cho bạn...</p>

              {/* Ringing icon */}
              <motion.div
                animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
                className="inline-block mt-4"
              >
                <div className="bg-white/20 p-3 rounded-full">
                  <PhoneCall className="w-6 h-6 text-white" />
                </div>
              </motion.div>
            </div>

            {/* ACTIONS */}
            <div className="p-6 flex gap-4">
              {/* Reject */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onReject}
                className="flex-1 py-4 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-semibold shadow-lg flex items-center justify-center gap-2"
              >
                <PhoneOff />
                Reject
              </motion.button>

              {/* Accept */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
onClick={() => {
  console.log("🟢 CLICK ACCEPT BUTTON");
  onAccept();
}}
                
                className="flex-1 py-4 rounded-2xl bg-green-500 hover:bg-green-600 text-white font-semibold shadow-lg flex items-center justify-center gap-2"
              >
                <Phone />
                Accept
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
