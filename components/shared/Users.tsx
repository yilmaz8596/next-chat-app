"use client";

import { useState } from "react";
import UserCard from "./UserCard";
import { User } from "@/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Chatroom from "./Chatroom";
import LogoutButton from "./LogoutButton";

export default function Users({ users }: { users: User[] }) {
  const [activeTab, setActiveTab] = useState("users");

  return (
    <div className="h-screen w-screen flex flex-col">
      {/* Tabs */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="max-w-sm grid grid-cols-2 max-md:grid-cols-1 gap-2 p-4">
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
        <LogoutButton />
      </div>

      {/* Content */}
      {activeTab === "users" ? (
        // Users view
        <div className="grid gap-1 p-2 overflow-y-auto max-w-sm">
          {users.map((user) => (
            <UserCard
              key={user.id}
              {...user}
              latestMessage="Click to start chatting"
              time="12:00"
              type="user"
            />
          ))}
        </div>
      ) : (
        // Chatrooms view with conversation on the right
        <div className="flex overflow-hidden">
          {/* Left side: chat list */}
          <div className="w-1/5 border-r overflow-y-auto">
            {users.map((chatRoom) => (
              <UserCard
                key={chatRoom.id}
                {...chatRoom}
                latestMessage="Last message"
                time="12:00"
                type="chat"
              />
            ))}
          </div>

          {/* Right side: active chat */}
          <div className="w-4/5 flex flex-col">
            <Chatroom user={users[0]} />
          </div>
        </div>
      )}
    </div>
  );
}
