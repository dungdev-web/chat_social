import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { auth, db } from "@/lib/firebase";
import { collection, query, where, getDocs, doc, setDoc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";

type User = {
  uid: string;
  email: string;
  name?: string;
  photoURL?: string;
};

export default function AddFriend() {
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<User | null>(null);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    setError("");
    setResult(null);

    if (!email.trim()) return;

    const q = query(collection(db, "users"), where("email", "==", email));
    const snap = await getDocs(q);

    if (snap.empty) {
      setError("User not found");
      return;
    }

    const user = snap.docs[0].data() as User;

    if (user.uid === auth.currentUser?.uid) {
      setError("You cannot add yourself");
      return;
    }

    setResult(user);
  };

  const handleAddFriend = async () => {
    if (!result) return;
    const me = auth.currentUser;
    if (!me) return;

    const myRef = doc(db, "friends", me.uid);
    const friendRef = doc(db, "friends", result.uid);

    // ensure docs exist
    const mySnap = await getDoc(myRef);
    if (!mySnap.exists()) await setDoc(myRef, { list: [] });

    const friendSnap = await getDoc(friendRef);
    if (!friendSnap.exists()) await setDoc(friendRef, { list: [] });

    await updateDoc(myRef, { list: arrayUnion(result.uid) });
    await updateDoc(friendRef, { list: arrayUnion(me.uid) });

    // create chat room
    const roomId = [me.uid, result.uid].sort().join("_");
    await setDoc(doc(db, "chats", roomId), {
      members: [me.uid, result.uid],
      createdAt: Date.now(),
    });

    alert("Added friend successfully!");
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <h2 className="text-xl font-bold">Add Friend</h2>

      <div className="flex gap-2">
        <Input
          placeholder="Enter email..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button onClick={handleSearch}>Search</Button>
      </div>

      {error && <div className="text-red-500">{error}</div>}

      {result && (
        <div className="flex items-center gap-3 p-3 border rounded-lg">
          <img
            src={result.photoURL || "https://github.com/shadcn.png"}
            className="w-10 h-10 rounded-full"
          />
          <div className="flex-1">
            <div className="font-medium">{result.name || result.email}</div>
            <div className="text-sm text-muted-foreground">{result.email}</div>
          </div>
          <Button onClick={handleAddFriend}>Add</Button>
        </div>
      )}
    </div>
  );
}
