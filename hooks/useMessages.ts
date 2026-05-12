"use client";

import { useEffect, useState } from "react";
// import { useAuth } from "./useAuth";

import {
    collection,
    addDoc,
    onSnapshot,
    query,
    orderBy,
    serverTimestamp,
    Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export type Message = {
    id: string;
    text: string;
    userName: string;
    userId: string;
    createdAt?: Timestamp;
};

export const useMessages = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    // const { user } = useAuth();

    useEffect(() => {
        const q = query(
            collection(db, "messages"),
            orderBy("createdAt")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...(doc.data() as Omit<Message, "id">),
            }));

            setMessages(msgs);
        });

        return () => unsubscribe();
    }, []);

    const sendMessage = async (
        text: string,
        userId: string,
        userName: string
    ) => {
        if (!text.trim()) return;

        await addDoc(collection(db, "messages"), {
            text,
            userId,
            userName,
            createdAt: serverTimestamp(),
        });
    };


    return { messages, sendMessage };
};