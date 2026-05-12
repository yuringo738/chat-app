"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Image from "next/image";

type User = {
    uid: string;
    name: string;
    iconURL?: string;
    email?: string;
};

export const Sidebar = ({
    onSelectUser,
    selectedUid,
    currentUid,
}: {
    onSelectUser: (uid: string) => void;
    selectedUid: string | null;
    currentUid: string | null;
}) => {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const snap = await getDocs(collection(db, "users"))
            const list = snap.docs.map((d) => ({
                uid: d.id,
                ...(d.data() as Omit<User, "uid">),
            }));
            setUsers(list);
        };
        fetchUsers();
    }, []);

    const otherUsers = users.filter((u) => u.uid !== currentUid);

    return (
        <div className="w-64 border-r p-4">
            <h2 className="font-bold mb-4">ユーザー一覧</h2>

            {otherUsers.map((u) => (
                <div
                    key={u.uid}
                    onClick={() => onSelectUser(u.uid)}
                    className={`flex items-center gap-3 p-2 rounded cursor-pointer ${selectedUid === u.uid ? "bg-green-100" : ""
                        }`}
                >
                    {u.iconURL ? (
                        <img src={u.iconURL} alt="" className="rounded-full w-9 h-9 object-cover" />
                    ) : (
                        <div className="w-9 h-9 rounded-full bg-gray-300" />
                    )}

                    <span>{u.name}</span>
                </div>
            ))}
        </div>
    );
};
