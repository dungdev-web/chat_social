import { Timestamp } from "firebase/firestore";
import { Dispatch, SetStateAction } from "react";

export type User = {
  uid?: string;
  email: string;
  photoURL?: string;
  name?: string;
  online?: boolean;
  lastActive?: Timestamp;
};
export type Message = {
  text: string;
  sender: string;
  seenBy: string[];   // ✅ AI đã xem
  createdAt?: any;
  imageUrl?: string;
  imageName?: string;
};
export type AuthContextType = {
  user: User | null;
  loading: boolean;
};
export type MessageListProps = {
  messages: Message[];
  meId: string;
    friendId?: string;

};
export type SendMessagePayload = {
  text?: string;
  imageUrl?: string;
};
export type ChatInputProps = {
  text: string;
  setText: Dispatch<SetStateAction<string>>; // ✅ QUAN TRỌNG
  onSend: (payload?: SendMessagePayload) => void;
  onTyping?: () => void;
};
export type EmojiPickerProps = {
  onSelect: (emoji: string) => void;
  onClose: () => void;
};
