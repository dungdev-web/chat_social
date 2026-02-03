import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { UserPlus } from "lucide-react";

type User = {
  uid: string;
  email: string;
  name?: string;
  photoURL?: string;
};

export default function AddFriendSearchResult({
  user,
  loading,
  onAdd,
}: {
  user: User;
  loading: boolean;
  onAdd: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-100 rounded-xl"
    >
      <Avatar className="w-11 h-11 border-2 border-white shadow-sm">
        <AvatarImage src={user.photoURL || ""} />
        <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white text-sm font-semibold">
          {user.email[0]?.toUpperCase() || "U"}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-gray-800 truncate">
          {user.name || user.email.split("@")[0]}
        </div>
        <div className="text-xs text-gray-400 truncate">{user.email}</div>
      </div>

      <Button
        size="sm"
        onClick={onAdd}
        disabled={loading}
        className="h-8 px-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-semibold shadow-sm hover:shadow-md hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50"
      >
        <UserPlus className="w-3.5 h-3.5 mr-1.5" />
        {loading ? "..." : "Thêm"}
      </Button>
    </motion.div>
  );
}