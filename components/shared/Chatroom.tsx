"use client";

import { useChatroom } from "@/app/hooks/useChatroom";
import { useAuth } from "@/context/useAuthContext";
import { useMessages } from "@/app/hooks/useMessages";
import { User } from "@/types";
import MessageCard from "./MessageCard";
import { MessageInput } from "./MessageInput";
import Image from "next/image";

export default function Chatroom({ user }: { user: User }) {
  const { chatrooms, loading } = useChatroom();
  const { user: authUser } = useAuth();

  const chatroom = chatrooms.find((chatroom) =>
    chatroom.users.includes(user.id || "")
  );

  const otherUserId = chatroom?.users.find((id) => id !== authUser?.id);
  const otherUser = chatroom?.usersData[otherUserId || ""];

  const { messages: chatMessages, loading: messagesLoading } = useMessages(
    chatroom?.id || ""
  );

  console.log("Chat data:", {
    authUserId: authUser?.id,
    otherUserId,
    messages: chatMessages,
  });

  if (loading || messagesLoading) {
    return <div>Loading chat...</div>;
  }

  if (!chatroom || !otherUser || !authUser) {
    return <div>No chat selected</div>;
  }

  return (
    <div className="flex flex-col h-full w-full">
      {/* Chat header - show other user's info */}
      <div className="p-4 border-b flex items-center justify-start gap-2">
        <h2 className="text-lg font-semibold">{otherUser.userName}</h2>
        <Image src={otherUser.avatar} alt="Avatar" width={40} height={40} />
      </div>

      {/* Messages container */}
      <div className="flex-1 w-full overflow-y-auto p-4">
        <div className="w-full mx-auto">
          {chatMessages.map((message) => (
            <MessageCard
              key={message.id}
              message={message}
              currentUser={authUser}
              otherUser={otherUser}
            />
          ))}
        </div>
      </div>

      <MessageInput
        chatRoomId={chatroom.id!}
        senderId={authUser.id}
        receiverId={otherUser.id!}
        user={authUser}
      />
    </div>
  );
}
