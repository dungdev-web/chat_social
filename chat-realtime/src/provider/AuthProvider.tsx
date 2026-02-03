import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import type { AuthContextType } from "@/type/types";
import { usePresence } from "@/hook/usePresence";
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setLoading(false);

      if (!u) return;

      const ref = doc(db, "users", u.uid);

      // ✅ USER ONLINE
      await updateDoc(ref, {
        online: true,
      });

      // ✅ KHI THOÁT TAB / REFRESH
      const handleOffline = async () => {
        await updateDoc(ref, {
          online: false,
          lastActive: serverTimestamp(),
        });
      };

      window.addEventListener("beforeunload", handleOffline);

      // cleanup
      return () => {
        handleOffline();
        window.removeEventListener("beforeunload", handleOffline);
      };
    });

    return () => unsub();
  }, []);
usePresence();

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
