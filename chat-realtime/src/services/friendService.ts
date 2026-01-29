import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../lib/firebase";

export async function addFriend(myUid: string, friendUid: string) {
  if (myUid === friendUid) return;

  const myRef = doc(db, "friends", myUid);
  const friendRef = doc(db, "friends", friendUid);

  const mySnap = await getDoc(myRef);
  if (!mySnap.exists()) {
    await setDoc(myRef, { list: [] });
  }

  const friendSnap = await getDoc(friendRef);
  if (!friendSnap.exists()) {
    await setDoc(friendRef, { list: [] });
  }

  await updateDoc(myRef, {
    list: arrayUnion(friendUid),
  });

  await updateDoc(friendRef, {
    list: arrayUnion(myUid),
  });

  // tạo phòng chat
  const chatId = [myUid, friendUid].sort().join("_");
  await setDoc(doc(db, "chats", chatId), {
    members: [myUid, friendUid],
    createdAt: Date.now(),
  });
}
