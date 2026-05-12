import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

const sendMessage = async (
    text: string,
    userId: string,
    userName: string
) => {
    //空送信防止
    if (!text.trim()) return;

    try {
        await addDoc(collection(db, "messages"), {
            text,
            userId,
            userName,
            createdAt: serverTimestamp(),
            read: false,
        });
    } catch (error) {
        console.error("送信エラー:", error);
    }
};