import { User } from "@/types";
import MessageCard from "./MessageCard";
import { Button } from "@/components/ui/button";
import { MessageInput } from "./MessageInput";

export default function Chatroom({ user }: { user: User }) {
  // Test messages
  const messages = [
    {
      id: "1",
      sender: "John Doe",
      avatar: "https://avatar.iran.liara.run/public",
      content: "Hello",
      time: "12:00",
    },
    {
      id: "2",
      sender: user.userName,
      avatar: "https://avatar.iran.liara.run/public",
      content: "Hi there!",
      time: "12:01",
    },
    {
      id: "3",
      sender: "John Doe",
      avatar: "https://avatar.iran.liara.run/public",
      content: "How are you?",
      time: "12:02",
    },
    {
      id: "4",
      sender: user.userName,
      avatar: "https://avatar.iran.liara.run/public",
      content: "I'm doing great, thanks for asking!",
      time: "12:03",
    },
  ];

  return (
    <div className="flex flex-col h-full w-full">
      {/* Chat header */}
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">{user.userName}</h2>
      </div>

      {/* Messages container */}
      <div className="flex-1 w-full overflow-y-auto p-4">
        <div className="w-full mx-auto">
          {messages.map((message) => (
            <MessageCard key={message.id} message={message} user={user} />
          ))}
        </div>
      </div>
      <MessageInput />
    </div>
  );
}
