import { useEffect, useRef, useState } from "react";
import { socket } from "@/lib/socket";

export function useCall(myId: string) {
  const [inCall, setInCall] = useState(false);
  const [incoming, setIncoming] = useState<string | null>(null);
  const [incomingOffer, setIncomingOffer] =
    useState<RTCSessionDescriptionInit | null>(null);
const [callStartAt, setCallStartAt] = useState<number | null>(null);

  const pc = useRef<RTCPeerConnection | null>(null);
  const localStream = useRef<MediaStream | null>(null);
  const remoteAudio = useRef<HTMLAudioElement | null>(null);
  const currentTarget = useRef<string | null>(null);

  const cleanup = () => {
    pc.current?.close();
    pc.current = null;

    localStream.current?.getTracks().forEach((t) => t.stop());
    localStream.current = null;

    setInCall(false);
    setIncoming(null);
    setIncomingOffer(null);
    setCallStartAt(null);

  };

  useEffect(() => {
    socket.on("incoming-call", ({ from, offer }) => {
      if (inCall || pc.current) return; // 🔥 ĐANG TRONG CALL → BỎ QUA

      console.log("📞 incoming-call", from);

      currentTarget.current = from;
      setIncoming(from);
      setIncomingOffer(offer);
    });

    socket.on("call-answered", async ({ answer }) => {
      await pc.current!.setRemoteDescription(answer);
      setInCall(true);
        setCallStartAt(Date.now()); // ⏱

    });

    socket.on("call-rejected", () => {
      alert("User rejected the call");
      cleanup();
    });

    socket.on("call-ended", () => {
      cleanup();
    });

    socket.on("ice-candidate", async ({ candidate }) => {
      await pc.current?.addIceCandidate(candidate);
    });

    return () => {
      socket.off("incoming-call");
      socket.off("call-answered");
      socket.off("call-rejected");
      socket.off("call-ended");
      socket.off("ice-candidate");
    };
  }, []);
  useEffect(() => {
    console.log("🧠 incoming =", incoming, "inCall =", inCall);
  }, [incoming, inCall]);

  const setupPC = async (targetId: string) => {
    pc.current = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    pc.current.onicecandidate = (e) => {
      if (e.candidate) {
        socket.emit("ice-candidate", {
          to: targetId,
          candidate: e.candidate,
        });
      }
    };

    pc.current.ontrack = (e) => {
      if (!remoteAudio.current) {
        remoteAudio.current = new Audio();
        remoteAudio.current.autoplay = true;
      }
      remoteAudio.current.srcObject = e.streams[0];
    };

    localStream.current = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    localStream.current.getTracks().forEach((track) => {
      pc.current!.addTrack(track, localStream.current!);
    });
  };

  // ================= CALL =================

  const callUser = async (targetId: string) => {
    currentTarget.current = targetId;

    await setupPC(targetId);

    const offer = await pc.current!.createOffer();
    await pc.current!.setLocalDescription(offer);

    socket.emit("call-user", {
      from: myId,
      to: targetId,
      offer,
    });
  };

  // ================= ACCEPT =================

  const acceptCall = async () => {
    if (!incoming || !incomingOffer) return;

    console.log("✅ CLICK ACCEPT");

    const from = incoming;

    // 🔥 ĐÓNG MODAL NGAY
    setIncoming(null);
    setIncomingOffer(null);
setCallStartAt(Date.now()); // ⏱

    await setupPC(from);

    await pc.current!.setRemoteDescription(incomingOffer);

    const answer = await pc.current!.createAnswer();
    await pc.current!.setLocalDescription(answer);

    socket.emit("answer-call", { to: from, answer });

    setInCall(true);
  };

  // ================= REJECT =================

  const rejectCall = () => {
    if (incoming) {
      socket.emit("reject-call", { to: incoming });
    }
    setIncoming(null);
    setIncomingOffer(null);
  };

  // ================= END =================

  const endCall = () => {
    if (currentTarget.current) {
      socket.emit("end-call", { to: currentTarget.current });
    }
    cleanup();
  };

  return {
    callUser,
    acceptCall,
    rejectCall,
    endCall,
    inCall,
    incoming,
    callStartAt
  };
}
