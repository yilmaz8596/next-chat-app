"use client";

import { useState } from "react";
import { useMessages } from "@/app/hooks/useMessages";
import { useChatroom } from "@/app/hooks/useChatroom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import UserCard from "./UserCard";
import { User, UserData } from "@/types";
import LogoutButton from "./LogoutButton";
import { Timestamp } from "firebase/firestore";

interface SideDrawerContentProps {
  users: User[];
  userData: UserData | null;
  createChat: (user: User) => void;
}

export default function SideDrawerContent({
  users,
  userData,
  createChat,
}: SideDrawerContentProps) {
  const [activeTab, setActiveTab] = useState("users");

  const { chatrooms } = useChatroom();
  const chatroom = chatrooms.find((chatroom) =>
    chatroom.users.includes(userData?.id || "")
  );
  const { messages } = useMessages(chatroom?.id || "");
  const latestMessage = messages[messages.length - 1];

  const formattedTime = latestMessage?.timestamp
    ? new Timestamp(
        latestMessage.timestamp.seconds,
        latestMessage.timestamp.nanoseconds
      )
        .toDate()
        .toLocaleString()
    : "No time";

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4">
        <div className="grid grid-cols-2 gap-2 w-full">
          <Button
            onClick={() => setActiveTab("users")}
            variant={activeTab === "chatrooms" ? "outline" : "default"}
            className={cn(
              "w-full",
              activeTab === "users" && "bg-primary text-primary-foreground"
            )}
          >
            Users
          </Button>
          <Button
            onClick={() => setActiveTab("chatrooms")}
            variant={activeTab === "users" ? "outline" : "default"}
            className={cn(
              "w-full",
              activeTab === "chatrooms" && "bg-primary text-primary-foreground"
            )}
          >
            <span className="truncate">Chatrooms</span>
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === "users"
          ? users.map(
              (user) =>
                user.id !== userData?.id && (
                  <UserCard
                    key={user.id}
                    {...user}
                    latestMessage="Click to start chatting"
                    time="12:00"
                    type="user"
                    onClick={() => createChat(user)}
                  />
                )
            )
          : users.map((chatRoom) => (
              <UserCard
                key={chatRoom.id}
                {...chatRoom}
                latestMessage={latestMessage?.content || "No messages"}
                time={formattedTime}
                type="chat"
                onClick={() => createChat(chatRoom)}
              />
            ))}
      </div>

      <div className="p-4">
        <LogoutButton />
      </div>
    </div>
  );
}
