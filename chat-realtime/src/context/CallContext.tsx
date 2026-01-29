"use client";

import { createContext, useContext } from "react";
import { useCall } from "@/hook/useCall";
import { auth } from "@/lib/firebase";

const CallContext = createContext<ReturnType<typeof useCall> | null>(null);

export function CallProvider({ children }: { children: React.ReactNode }) {
  const me = auth.currentUser!;
  const call = useCall(me.uid);

  return (
    <CallContext.Provider value={call}>
      {children}
    </CallContext.Provider>
  );
}

export function useCallContext() {
  const ctx = useContext(CallContext);
  if (!ctx) throw new Error("useCallContext must be used inside CallProvider");
  return ctx;
}
