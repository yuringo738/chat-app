"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { doc, setDoc } from "firebase/firestore";
import Link from "next/link";

export default function RegisterPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const register = async () => {
        try {
            // Firebase Auth でユーザー作成
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

            const user = userCredential.user;

            // Firestore にユーザー情報を保存（任意）
            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
                createdAt: new Date(),
            });

            // 登録後にチャット画面へ
            router.push("/chat");
        } catch (error: unknown) {
            if (error instanceof Error) {
                alert(error.message);
            } else {
                alert("登録に失敗しました");
            }
        }
    };

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="w-80 space-y-4">
                <h1 className="text-2xl font-bold">新規登録</h1>

                <input
                    className="w-full border p-2 rounded"
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    className="w-full border p-2 rounded"
                    type="password"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    onClick={register}
                    className="w-full bg-black text-white py-2 rounded"
                >
                    Register
                </button>

                <Link href="/" className="text-sm underline">
                    ログインへ戻る
                </Link>
            </div>
        </div>
    );
}
