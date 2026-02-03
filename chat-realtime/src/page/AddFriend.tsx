import { useState } from "react";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Search, UserPlus, ArrowLeft, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAddFriend } from "@/hook/useAddFriend";
import AddFriendSearchResult from "@/components/AddFriendSearchResult";
export default function AddFriendPage() {
  const [input, setInput] = useState("");
  const { result, loading, error, successMsg, handleSearch, handleAddFriend } =
    useAddFriend();

  const navigate = useNavigate();

  const onSubmit = () => {
    if (input.trim()) handleSearch(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") onSubmit();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center pt-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-md"
      >
        {/* ─── Back button ─── */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors mb-5"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại
        </button>

        {/* ─── Header ─── */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-sm">
            <UserPlus className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-800">Thêm bạn</h1>
            <p className="text-xs text-gray-400">
              Nhập email hoặc tên để tìm kiếm
            </p>
          </div>
        </div>

        {/* ─── Search Input ─── */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
            <Input
              placeholder="Email hoặc tên người dùng..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pl-9 h-10 bg-white border-gray-200 text-sm rounded-xl focus:border-blue-300 focus:ring-0 transition-all"
            />
          </div>
          <button
            onClick={onSubmit}
            disabled={loading || !input.trim()}
            className="px-4 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold shadow-sm hover:shadow-md hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? "..." : "Tìm"}
          </button>
        </div>

        {/* ─── Messages: error / success ─── */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="mt-3 text-sm text-red-500 bg-red-50 border border-red-100 px-3 py-2 rounded-lg"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {successMsg && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="mt-3 flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-2 rounded-lg"
            >
              <CheckCircle className="w-4 h-4 shrink-0" />
              {successMsg}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── Search Result ─── */}
        <AnimatePresence>
          {result && (
            <div className="mt-4">
              <AddFriendSearchResult
                user={result}
                loading={loading}
                onAdd={handleAddFriend}
              />
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}