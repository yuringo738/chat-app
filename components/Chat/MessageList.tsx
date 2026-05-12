"use client";

import { useEffect, useRef } from "react";
import { Message } from "@/hooks/useMessages";
import { MessageItem } from "./MessageItem";
import { Timestamp } from "firebase/firestore";

type Props = {
    messages: Message[];
    lastReadAt: Timestamp | null;
};

export const MessageList = ({ messages, lastReadAt }: Props) => {
    const bottomRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [messages]);

    let hasShownNew = false;

    return (
        <div className="p-2">
            {messages.map((msg) => {
                // createdAtがない場合はスキップ
                if (!msg.createdAt) {
                    return (
                        <MessageItem key={msg.id} message={msg} />
                    );
                }

                const isUnread =
                    lastReadAt &&
                    msg.createdAt.toDate() > lastReadAt.toDate();

                const showNew = isUnread && !hasShownNew;

                if (showNew) {
                    hasShownNew = true;
                }

                return (
                    <div key={msg.id}>

                        {showNew && (
                            <div className="flex items-center my-3">
                                <div className="flex-1 h-px bg-gray-300" />
                                <span className="mx-2 text-xs text-red-500 font-semibold">
                                    NEW
                                </span>
                                <div className="flex-1 h-px bg-gray-300" />
                            </div>
                        )}

                        <MessageItem
                            key={msg.id}
                            message={msg}
                            lastReadAt={lastReadAt}
                        />
                    </div>
                );
            })}

            <div ref={bottomRef} />
        </div>
    );
};