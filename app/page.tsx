"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";


export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    if (!email) {
      alert("メールアドレスを入力してください");
      return;
    }

    if (!password) {
      alert("パスワードを入力してください");
      return;
    }

    if (!email.includes("@")) {
      alert("正しいメールアドレスを入力してください");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/chat");
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("ログインに失敗しました");
      }
    }
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-80 space-y-4">
        <h1 className="text-2xl font-bold">ログイン</h1>

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
          onClick={login}
          className="w-full bg-black text-white py-2 rounded"
        >
          Login
        </button>

        <a href="/register" className="text-sm underline">
          新規登録
        </a>
      </div>
    </div>
  );
};
