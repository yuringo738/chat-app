"use client";

"use client";

import { useAuth } from "@/hooks/useAuth";
import { LoginButton } from "@/components/Auth/LoginButton";

type Props = {
    children: React.ReactNode;
};

export const AuthView = ({ children }: Props) => {
    const { user, loading } = useAuth();

    if (loading) return <p>読み込み中...</p>;

    return (
        <>
            {user ? (
                children
            ) : (
                <>
                    <p>未ログイン</p>
                    <LoginButton />
                </>
            )}
        </>
    );
};
