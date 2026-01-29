import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../lib/firebase";

export async function findUserByEmail(email: string) {
  const q = query(
    collection(db, "users"),
    where("email", "==", email)
  );

  const snap = await getDocs(q);
  if (snap.empty) return null;

  return snap.docs[0].data();
}
