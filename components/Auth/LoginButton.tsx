"use client";

import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "@/lib/firebase";

export const LoginButton = () => {
    const login = async () => {
        await signInWithPopup(auth, provider);
    };
    return <button onClick={login}> Googleログイン</button>
};