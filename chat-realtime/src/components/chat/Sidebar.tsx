import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { motion } from "framer-motion";
import { Search, MessageCircle, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

type User = {
  uid: string;
  email: string;
  photoURL?: string;
  displayName?: string;
};

export default function Sidebar({
  onSelect,
  selectedId,
}: {
  onSelect: (uid: string) => void;
  selectedId: string | null;
}) {
  const [friends, setFriends] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadFriends = async () => {
      const current = auth.currentUser;
      if (!current) return;

      const ref = doc(db, "friends", current.uid);
      const snap = await getDoc(ref);
      if (!snap.exists()) return;

      const ids: string[] = snap.data().list || [];
      if (ids.length === 0) return;

      const q = query(collection(db, "users"), where("uid", "in", ids));
      const usersSnap = await getDocs(q);

      const result: User[] = usersSnap.docs.map((d) => d.data() as User);
      setFriends(result);
    };

    loadFriends();
  }, []);

  const filteredFriends = friends.filter((u) =>
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.displayName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-[320px] border-r border-gray-200 h-full flex flex-col bg-white"
    >
      {/* HEADER */}
      <div className="p-4 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-6 h-6 text-blue-600" />
          <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Con gà
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full">
            <Settings className="w-4 h-4 text-gray-600" />
          </Button>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Avatar className="w-9 h-9 border-2 border-blue-100 cursor-pointer">
              <AvatarImage src={auth.currentUser?.photoURL || ""} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                {auth.currentUser?.email?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          </motion.div>
        </div>
      </div>

      {/* SEARCH */}
      <div className="p-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
          />
        </div>
      </div>

      {/* FRIEND LIST */}
      <ScrollArea className="flex-1">
        <div className="space-y-1 p-2">
          {filteredFriends.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p>No friends found</p>
            </div>
          ) : (
            filteredFriends.map((u, index) => (
              <motion.div
                key={u.uid}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelect(u.uid)}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                  selectedId === u.uid
                    ? "bg-gradient-to-r from-blue-50 to-purple-50 shadow-sm border border-blue-100"
                    : "hover:bg-gray-50"
                }`}
              >
                <div className="relative">
                  <Avatar className="w-12 h-12 border-2 border-white shadow-sm">
                    <AvatarImage
                      src={u.photoURL || "https://github.com/shadcn.png"}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-400 text-white">
                      {u.email[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {/* Online Indicator */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 truncate">
                    {u.displayName || u.email.split("@")[0]}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {u.email}
                  </div>
                </div>
                {selectedId === u.uid && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-2 h-2 bg-blue-600 rounded-full"
                  />
                )}
              </motion.div>
            ))
          )}
        </div>
      </ScrollArea>
    </motion.div>
  );
}