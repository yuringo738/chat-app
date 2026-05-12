"use client";

import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { MessageInput } from "./MessageInput";
import { db } from "@/lib/firebase";
import {
    collection,
    query,
    orderBy,
    onSnapshot,
    Timestamp,
    getDocs,
} from "firebase/firestore";

type Message = {
    text: string;
    from: string;
    to: string[];
    createdAt: Timestamp;
};

type UserInfo = {
    uid: string;
    name: string;
    iconURL?: string;
    email: string;
};

export const DMView = ({ partnerUid }: { partnerUid: string }) => {
    const { user, loading } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [allUsers, setAllUsers] = useState<UserInfo[]>([]);
    const bottomRef = useRef<HTMLDivElement | null>(null);

    const sorted = user && partnerUid ? [user.uid, partnerUid].sort() : [];
    const roomId = sorted.length ? `${sorted[0]}_${sorted[1]}` : null;

    useEffect(() => {
        if (!user) return;
        const fetchUsers = async () => {
            const snap = await getDocs(collection(db, "users"));
            const users = snap.docs.map((d) => ({ uid: d.id, ...d.data() })) as UserInfo[];
            setAllUsers(users);
        };
        fetchUsers();
    }, [user]);

    useEffect(() => {
        if (!roomId) return;
        const q = query(
            collection(db, "dmRooms", roomId, "messages"),
            orderBy("createdAt")
        );
        const unsub = onSnapshot(q, (snap) => {
            setMessages(snap.docs.map((d) => d.data() as Message));
        });
        return () => unsub();
    }, [roomId]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    if (loading) {
        return <div className="flex items-center justify-center h-full text-gray-500">読み込み中…</div>;
    }
    if (!user) {
        return <div className="flex items-center justify-center h-full text-gray-500">ログインしてください</div>;
    }
    if (!partnerUid) {
        return <div className="flex items-center justify-center h-full text-gray-500">左のユーザーを選択してください</div>;
    }

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((m, i) => {
                    const isMe = m.from === partnerUid;
                    const sender = allUsers.find((u) => u.uid === m.from);

                    return (
                        <div key={i} style={{ display: "flex", width: "100%", alignItems: "flex-end", gap: "8px", justifyContent: isMe ? "flex-end" : "flex-start" }}>

                            {/* 相手のアイコン＋名前（左側） */}
                            {!isMe && (
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                    {sender?.iconURL ? (
                                        <img src={sender.iconURL} alt="" style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover" }} />
                                    ) : (
                                        <div style={{ width: 36, height: 36, borderRadius: "50%", backgroundColor: "#d1d5db", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "white" }}>
                                            {sender?.name?.[0] ?? "?"}
                                        </div>
                                    )}
                                    <div style={{ fontSize: 10, color: "#6b7280", marginTop: 4, textAlign: "center", width: 48, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                        {sender?.name ?? ""}
                                    </div>
                                </div>
                            )}

                            <div style={{ display: "flex", flexDirection: "column", maxWidth: "65%", alignItems: isMe ? "flex-end" : "flex-start" }}>
                                {/* 吹き出し */}
                                {/* 吹き出し */}
                                <div style={{ position: "relative" }}>
                                    <div style={{
                                        padding: "8px 16px",
                                        fontSize: 14,
                                        lineHeight: 1.6,
                                        backgroundColor: isMe ? "#06C755" : "#ffffff",
                                        color: isMe ? "white" : "black",
                                        border: isMe ? "none" : "1.5px solid #d1d5db",
                                        borderRadius: "18px",
                                        boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
                                    }}>
                                        {m.text}
                                    </div>
                                </div>
                                {/* タイムスタンプ */}
                                <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 4, textAlign: isMe ? "right" : "left" }}>
                                    {m.createdAt.toDate().toLocaleString("ja-JP", {
                                        year: "numeric",
                                        month: "numeric",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </div>
                            </div>

                            {/* 自分のアイコン＋名前（右側） */}
                            {isMe && (
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                    {sender?.iconURL ? (
                                        <img src={sender.iconURL} alt="" style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover" }} />
                                    ) : (
                                        <div style={{ width: 36, height: 36, borderRadius: "50%", backgroundColor: "#60a5fa", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "white" }}>
                                            {sender?.name?.[0] ?? "?"}
                                        </div>
                                    )}
                                    <div style={{ fontSize: 10, color: "#6b7280", marginTop: 4, textAlign: "center", width: 48, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                        {sender?.name ?? ""}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
                <div ref={bottomRef} />
            </div>

            <MessageInput roomId={roomId} partnerUid={partnerUid} allUsers={allUsers} />
        </div>
    );
};