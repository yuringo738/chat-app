"use client";

import { Message } from "@/hooks/useMessages";
import { Timestamp } from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth";

type Props = {
    message: Message;
    lastReadAt: Timestamp | null;
};

export const MessageItem = ({ message, lastReadAt }: Props) => {
    const { user } = useAuth();

    const isMine = user?.uid === message.userId;

    const isUnread =
        lastReadAt &&
        message.createdAt &&
        message.createdAt.toDate() > lastReadAt.toDate();

    return (
        <div
            className={`flex mb-2 ${isMine ? "justify-end" : "justify-start"
                }`}
        >
            <div>
                {/* 他人だけ名前表示 */}
                {!isMine && (
                    <div className="text-xs text-gray-500 mb-1">
                        {message.userName}
                    </div>
                )}

                <div
                    className={`
            px-3 py-2 rounded-2xl max-w-xs break-words
            ${isMine ? "bg-green-400 text-white" : "bg-gray-200"}
          `}
                >
                    {message.text}
                </div>


                {isUnread && (
                    <div className="text-[10px] text-red-500 mt-1">
                        NEW
                    </div>
                )}
            </div>
        </div>
    );
};