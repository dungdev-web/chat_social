import {
  collection,
  getDocs,
  query,
  updateDoc,
  where,
  arrayUnion,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
export async function markMessagesSeen(roomId: string, userId: string) {
  const q = query(
    collection(db, "chats", roomId, "messages"),
    where("sender", "!=", userId)
  );

  const snap = await getDocs(q);

  snap.docs.forEach((docSnap) => {
    updateDoc(docSnap.ref, {
      seenBy: arrayUnion(userId),
    });
  });
}


export async function sendMessage(
  cid: string,
  data: {
    text?: string;
    imageUrl?: string;
    sender: string;
  }
) {
  await addDoc(collection(db, "chats", cid, "messages"), {
    ...data,
    createdAt: serverTimestamp(),
    seenBy: [data.sender],
  });
}