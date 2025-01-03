import { Message, User } from "@/types";
import Image from "next/image";

export default function MessageCard({
  message,
  currentUser, // Changed from user to currentUser for clarity
  otherUser,
}: {
  message: Message;
  currentUser: User;
  otherUser: User;
}) {
  // Check each message individually
  const isCurrentUserMessage = message.senderId === currentUser.id;

  console.log("Message comparison:", {
    messageSenderId: message.senderId,
    currentUserId: currentUser.id,
    isCurrentUserMessage,
  });

  console.log(currentUser.avatar);

  return (
    <div
      className={`flex w-full mb-4 ${
        isCurrentUserMessage ? "justify-start" : "justify-end"
      }`}
    >
      <div className="flex max-w-[80%] gap-2">
        {isCurrentUserMessage && (
          <div className="w-8 h-8 flex-shrink-0">
            <Image
              src={currentUser?.avatar.toString()}
              alt="Avatar"
              width={32}
              height={32}
              className="rounded-full w-full h-full object-cover"
            />
          </div>
        )}

        <div
          className={`p-3 rounded-lg ${
            isCurrentUserMessage
              ? "bg-[#19d39e] rounded-tl-none"
              : "bg-pink-500 rounded-tr-none"
          }`}
        >
          <p className="text-white">{message.content}</p>
          <span className="text-xs text-gray-200 block mt-1">
            {message.time}
          </span>
        </div>

        {!isCurrentUserMessage && (
          <div className="w-8 h-8 flex-shrink-0">
            <Image
              src={otherUser?.avatar}
              alt="Avatar"
              className="rounded-full w-full h-full object-cover"
            />
          </div>
        )}
      </div>
    </div>
  );
}
