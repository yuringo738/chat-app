import ChatRoom from "@/components/Chat/ChatRoom";
import { AuthView } from "@/components/AuthView";

export default function ChatPage() {
    return (
        <AuthView>
            <ChatRoom />
        </AuthView>
    );
}