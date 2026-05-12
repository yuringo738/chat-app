"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
            console.log("ログイン中のuid:", firebaseUser.uid);
            console.log("ログイン中のemail:", firebaseUser.email);
        }
    })

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // Firestore の users に必ず登録
                await setDoc(
                    doc(db, "users", firebaseUser.uid),
                    {
                        email: firebaseUser.email ?? "",
                        createdAt: serverTimestamp(),
                        ...(firebaseUser.displayName ? { name: firebaseUser.displayName } : {}),
                        ...(firebaseUser.photoURL ? { iconURL: firebaseUser.photoURL } : {}),
                    },
                    { merge: true }
                );
            }

            setUser(firebaseUser);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return { user, loading };
};
