import { io } from "socket.io-client";
console.log(import.meta.env.VITE_FIREBASE_API_KEY);

export const socket = io(import.meta.env.VITE_SOCKET_URL, {
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: 5,
  timeout: 20000
});