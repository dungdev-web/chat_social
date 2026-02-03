import { useState } from "react";
import { auth, db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  arrayUnion,
  getDoc,
  or,
} from "firebase/firestore";

type User = {
  uid: string;
  email: string;
  name?: string;
  photoURL?: string;
};

export function useAddFriend() {
  const [result, setResult] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const reset = () => {
    setResult(null);
    setError("");
    setSuccessMsg("");
  };

  // ─── Search user by email or name ───
  const handleSearch = async (input: string) => {
    reset();
    const trimmed = input.trim();
    if (!trimmed) return;

    setLoading(true);

    try {
      const q = query(
        collection(db, "users"),
        or(
          where("email", "==", trimmed),
          where("name", "==", trimmed),
        ),
      );
      const snap = await getDocs(q);

      if (snap.empty) {
        setError("Không tìm thấy người dùng này.");
        return;
      }

      const user = snap.docs[0].data() as User;

      // Không cho add chính mình
      if (user.uid === auth.currentUser?.uid) {
        setError("Không thể thêm chính bạn.");
        return;
      }

      // Kiểm tra đã là bạn chưa
      const myFriendsSnap = await getDoc(doc(db, "friends", auth.currentUser!.uid));
      const myList: string[] = myFriendsSnap.exists()
        ? myFriendsSnap.data().list || []
        : [];

      if (myList.includes(user.uid)) {
        setError("Người này đã là bạn của bạn.");
        return;
      }

      setResult(user);
    } catch (err) {
      setError("Lỗi tìm kiếm. Thử lại sau.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ─── Add friend + create chat room ───
  const handleAddFriend = async () => {
    if (!result) return;
    const me = auth.currentUser;
    if (!me) return;

    setLoading(true);
    setError("");

    try {
      const myRef = doc(db, "friends", me.uid);
      const friendRef = doc(db, "friends", result.uid);

      // Ensure docs exist
      const mySnap = await getDoc(myRef);
      if (!mySnap.exists()) await setDoc(myRef, { list: [] });

      const friendSnap = await getDoc(friendRef);
      if (!friendSnap.exists()) await setDoc(friendRef, { list: [] });

      // Add lẫn nhau
      await updateDoc(myRef, { list: arrayUnion(result.uid) });
      await updateDoc(friendRef, { list: arrayUnion(me.uid) });

      // Create chat room (merge để không overwrite nếu đã có)
      const roomId = [me.uid, result.uid].sort().join("_");
      await setDoc(
        doc(db, "chats", roomId),
        {
          members: [me.uid, result.uid],
          createdAt: Date.now(),
        },
        { merge: true },
      );

      setSuccessMsg(`Đã thêm ${result.name || result.email} vào danh sách bạn!`);
      setResult(null);
    } catch (err) {
      setError("Không thể thêm bạn. Thử lại sau.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    result,
    loading,
    error,
    successMsg,
    handleSearch,
    handleAddFriend,
    reset,
  };
}