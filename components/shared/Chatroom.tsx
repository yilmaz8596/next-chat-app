"use client";

import { useChatroom } from "@/app/hooks/useChatroom";
import { useAuth } from "@/context/useAuthContext";
import { User } from "@/types";
import MessageCard from "./MessageCard";
import { MessageInput } from "./MessageInput";
import { Message } from "@/types";
import Image from "next/image";

export default function Chatroom({
  user,
  messages,
}: {
  user: User;
  messages?: Message[];
}) {
  const { chatrooms, loading } = useChatroom();
  // Find chatroom first
  const chatroom = chatrooms.find((chatroom) =>
    chatroom.users.includes(user.id || "")
  );

  // Then find other user from the chatroom's users
  const otherUserId = chatroom?.users.find((id) => id !== user.id);
  const otherUser = chatroom?.usersData[otherUserId || ""];

  if (loading) {
    return <div>Loading chat...</div>;
  }

  if (!chatroom || !otherUser) {
    return <div>No chat selected</div>;
  }

  return (
    <div className="flex flex-col h-full w-full">
      {/* Chat header */}
      <div className="p-4 border-b flex items-center justify-start gap-2">
        <h2 className="text-lg font-semibold">{user.userName}</h2>
        <Image src={user?.avatar} alt="Avatar" width={40} height={40} />
      </div>

      {/* Messages container */}
      <div className="flex-1 w-full overflow-y-auto p-4">
        <div className="w-full mx-auto">
          {messages?.map((message) => (
            <MessageCard key={message.id} message={message} user={user} />
          ))}
        </div>
      </div>
      <MessageInput
        chatRoomId={chatroom?.id!}
        receiverId={otherUser?.id!}
        senderId={user.id!}
      />
    </div>
  );
}
