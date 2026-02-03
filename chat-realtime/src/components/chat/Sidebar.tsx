import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { onSnapshot } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
} from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MessageCircle, Settings, UserPlus, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logout } from "@/services/authService";
import { User } from "@/type/types";
import { timeAgo } from "@/hook/useUserStatus";

export default function Sidebar({
  onSelect,
  selectedId,
}: {
  onSelect: (uid: string) => void;
  selectedId: string | null;
}) {
  const [friends, setFriends] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  // Click outside to close menu
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Load friends realtime
  useEffect(() => {
    const current = auth.currentUser;
    if (!current) return;

    const loadFriendsRealtime = async () => {
      const ref = doc(db, "friends", current.uid);
      const snap = await getDoc(ref);
      if (!snap.exists()) return;

      const ids: string[] = snap.data().list || [];
      if (ids.length === 0) return;

      const q = query(collection(db, "users"), where("uid", "in", ids));

      const unsub = onSnapshot(q, (snapshot) => {
        const users = snapshot.docs.map((d) => d.data() as User);
        setFriends(users);
      });

      return unsub;
    };

    let unsub: (() => void) | undefined;
    loadFriendsRealtime().then((u) => (unsub = u));

    return () => unsub && unsub();
  }, []);

  const filteredFriends = friends.filter(
    (u) =>
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <motion.div
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-[320px] border-r border-gray-100 h-full flex flex-col bg-white"
    >
      {/* ─── HEADER ─── */}
      <div className="px-4 pt-5 pb-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-sm">
            <MessageCircle className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight text-gray-800">
            Con gà
          </span>
        </div>

        {/* Avatar + Dropdown */}
        <div ref={menuRef} className="relative">
          <motion.div
            whileTap={{ scale: 0.92 }}
            onClick={() => setOpen((prev) => !prev)}
            className="cursor-pointer"
          >
            <Avatar className="w-8 h-8 border-2 border-gray-100">
              <AvatarImage src={auth.currentUser?.photoURL || ""} />
              <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white text-xs font-semibold">
                {auth.currentUser?.email?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          </motion.div>

          {/* ─── DROPDOWN MENU ─── */}
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.96 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="absolute right-0 top-full mt-2 w-44 bg-white border border-gray-100 rounded-xl shadow-lg shadow-gray-100/60 z-50 overflow-hidden py-1.5"
              >
                <a
                  href="/add-friend"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2 mx-1 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <UserPlus className="w-4 h-4 text-blue-500" />
                  <span>Thêm bạn</span>
                </a>

                <div className="mx-1 border-t border-gray-100 my-1" />

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2.5 px-3.5 py-2 mx-1 w-full rounded-lg text-sm text-red-500 hover:bg-red-50 transition-colors text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Đăng xuất</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ─── SEARCH ─── */}
      <div className="px-3 pb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
          <Input
            placeholder="Tìm kiếm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9 bg-gray-50 border-gray-100 text-sm placeholder-gray-400 focus:bg-white focus:border-blue-200 focus:ring-0 rounded-lg transition-all"
          />
        </div>
      </div>

      {/* ─── SECTION LABEL ─── */}
      <div className="px-4 pb-1.5">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Bạn bè — {filteredFriends.length}
        </span>
      </div>

      {/* ─── FRIEND LIST ─── */}
      <ScrollArea className="flex-1 px-2">
        <div className="space-y-0.5 py-1">
          {filteredFriends.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-2">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                <Search className="w-5 h-5 text-gray-300" />
              </div>
              <p className="text-sm text-gray-400">Không tìm thấy bạn bè</p>
            </div>
          ) : (
            filteredFriends.map((u, index) => {
              const isSelected = selectedId === u.uid;
              return (
                <motion.div
                  key={u.uid}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.04, duration: 0.2 }}
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onSelect(u.uid)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all relative ${
                    isSelected
                      ? "bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100"
                      : "hover:bg-gray-50 border border-transparent"
                  }`}
                >
                  {/* Avatar + Online dot */}
                  <div className="relative shrink-0">
                    <Avatar className="w-10 h-10 border-2 border-white shadow-sm">
                      <AvatarImage
                        src={u.photoURL || "https://github.com/shadcn.png"}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-400 text-white text-sm font-semibold">
                        {u.email[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {u.online && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full shadow-sm" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-800 truncate">
                      {u.name || u.email.split("@")[0]}
                    </div>
                    <div
                      className={`text-xs truncate ${
                        u.online ? "text-emerald-500 font-medium" : "text-gray-400"
                      }`}
                    >
                      {u.online
                        ? "● Đang hoạt động"
                        : "Hoạt động " + timeAgo(u.lastActive)}
                    </div>
                  </div>

                  {/* Selected indicator */}
                  {isSelected && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-2 h-2 rounded-full bg-blue-500 shrink-0"
                    />
                  )}
                </motion.div>
              );
            })
          )}
        </div>
      </ScrollArea>
    </motion.div>
  );
}