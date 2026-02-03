import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuid } from "uuid";
import { storage } from "@/lib/firebase";

export async function uploadChatImage(file: File): Promise<string> {
  const imageRef = ref(
    storage,
    `chat-images/${uuid()}-${file.name}`
  );

  await uploadBytes(imageRef, file);
  return await getDownloadURL(imageRef);
}
