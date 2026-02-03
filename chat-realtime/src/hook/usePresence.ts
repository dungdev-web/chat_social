// src/hook/usePresence.ts
import { useEffect } from "react";
import { getDatabase, ref, onDisconnect, set, serverTimestamp } from "firebase/database";
import { auth } from "@/lib/firebase";

export function usePresence() {
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const db = getDatabase();
    const statusRef = ref(db, `status/${user.uid}`);

    // ONLINE
    set(statusRef, {
      online: true,
      lastActive: serverTimestamp(),
    });

    // OFFLINE (mất mạng / tắt tab)
    onDisconnect(statusRef).set({
      online: false,
      lastActive: serverTimestamp(),
    });
  }, []);
}
