"use client";

import { useState, useCallback } from "react";
import { Sidebar } from "./Sidebar";
import { DMView } from "./DMView";
import { useAuth } from "@/hooks/useAuth";

export default function ChatRoom() {
    const { user } = useAuth();
    const [partnerUid, setPartnerUid] = useState<string | null>(null);

    const handleSelectUser = useCallback((uid: string) => {
        setPartnerUid(uid);
    }, []);

    return (
        <div className="flex h-screen">
            <Sidebar
                onSelectUser={handleSelectUser}
                selectedUid={partnerUid}
                currentUid={user?.uid ?? null}
            />

            <div className="flex-1">
                {partnerUid ? (
                    <DMView key={partnerUid} partnerUid={partnerUid} />
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        左のユーザーを選択してください
                    </div>
                )}
            </div>
        </div>
    );
}
