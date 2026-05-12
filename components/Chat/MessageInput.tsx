"use client";

import { useState, useRef } from "react";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";

type User = {
    uid: string;
    name: string;
    iconURL?: string;
};

export const MessageInput = ({
    roomId,
    partnerUid,
    allUsers,
}: {
    roomId: string | null;
    partnerUid: string;
    allUsers: User[];
}) => {
    const [text, setText] = useState("");
    const [mentionOpen, setMentionOpen] = useState(false);
    const [mentionList, setMentionList] = useState<User[]>([]);
    const { user } = useAuth();
    const inputRef = useRef<HTMLInputElement | null>(null);

    // @メンション抽出
    const extractMentions = (text: string): string[] => {
        const regex = /@([^\s@]+)/g;
        const names: string[] = [];
        let match;

        while ((match = regex.exec(text)) !== null) {
            names.push(match[1]);
        }
        return names;
    };

    const send = async () => {
        if (!user) return;
        if (!text.trim()) return;

        const sorted = [user.uid, partnerUid].sort();
        const fixedRoomId = `${sorted[0]}_${sorted[1]}`;

        const mentionedNames = extractMentions(text);
        const mentionedUids = mentionedNames
            .map((name) => allUsers.find((u) => u.name === name)?.uid)
            .filter(Boolean) as string[];

        // メンションなし → 通常DM
        if (mentionedUids.length === 0) {
            await addDoc(collection(db, "dmRooms", fixedRoomId, "messages"), {
                text,
                from: partnerUid,  // 選択中のルームのユーザーが送信者
                to: [partnerUid],
                createdAt: Timestamp.now(),
            });
            setText("");
            return;
        }

        // 自分が開いているルームに保存
        await addDoc(collection(db, "dmRooms", fixedRoomId, "messages"), {
            text,
            from: partnerUid,  // 選択中のルームのユーザーが送信者
            to: mentionedUids,
            createdAt: Timestamp.now(),
        });

        // メンション相手ごとのルームにも保存
        for (const targetUid of mentionedUids) {
            // ✅ user.uid（sub-user）とメンション相手のルーム
            const sorted2 = [user.uid, targetUid].sort();
            const targetRoom = `${sorted2[0]}_${sorted2[1]}`;
            if (targetRoom === fixedRoomId) continue;

            await addDoc(collection(db, "dmRooms", targetRoom, "messages"), {
                text,
                from: partnerUid,  // 送信者はHANA
                to: [targetUid],
                createdAt: Timestamp.now(),
            });
        }

        setText("");
    };


    // @ を検知して候補を表示
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setText(value);

        const lastChar = value.slice(-1);

        if (lastChar === "@") {
            setMentionOpen(true);
            setMentionList(allUsers);
        }
    };

    return (
        <div className="relative border-t p-3 flex gap-2 items-center bg-white">

            {mentionOpen && (
                <div className="absolute bottom-14 left-0 bg-white shadow-lg rounded-lg w-56 max-h-60 overflow-y-auto z-10">
                    {mentionList.map((u) => (
                        <div
                            key={u.uid}
                            onClick={() => {
                                setText((prev) => prev + u.name + " ");
                                setMentionOpen(false);
                                inputRef.current?.focus();
                            }}
                            className="p-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                        >
                            {u.iconURL ? (
                                <Image
                                    src={u.iconURL}
                                    width={24}
                                    height={24}
                                    alt=""
                                    className="rounded-full"
                                />
                            ) : (
                                <div className="w-6 h-6 rounded-full bg-gray-300" />
                            )}
                            <span>{u.name}</span>
                        </div>
                    ))}
                </div>
            )}

            <input
                ref={inputRef}
                className="flex-1 border p-2 rounded-lg"
                placeholder="メッセージを入力..."
                value={text}
                onChange={handleChange}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        send();
                    }
                }}
            />

            <button
                onClick={send}
                className="bg-black text-white px-4 py-2 rounded-lg"
            >
                送信
            </button>
        </div>
    );
};
