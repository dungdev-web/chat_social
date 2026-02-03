import { Routes, Route } from "react-router-dom";
import Login from "./page/Login";
import ChatLayout from "@/layouts/ChatLayout";
import AddFriend from "./page/AddFriend";
import PrivateRoute from "./auth/PrivateRoute";
import PublicRoute from "./auth/PublicRoute";
import { onAuthStateChanged } from "firebase/auth";
import { socket } from "@/lib/socket";
import { auth } from "@/lib/firebase";
import { useEffect } from "react";
import { CallProvider } from "./context/CallContext";
export default function App() {
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        socket.emit("register", user.uid);
        console.log("✅ Socket registered:", user.uid);
      }
    });

    return () => unsub();
  }, []);
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      {/* <Route path="/register" element={<Register />} /> */}
      <Route path="/add-friend" element={<AddFriend />} />

      <Route
        path="/"
        element={
          <PrivateRoute>
            <CallProvider>
              <ChatLayout />{" "}
            </CallProvider>
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
