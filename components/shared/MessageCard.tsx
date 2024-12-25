import { Message, User } from "@/types";

export default function MessageCard({
  message,
  user,
}: {
  message: Message;
  user: User;
}) {
  const isMessageFromCurrentUser = message.sender === user.userName;

  return (
    <div
      className={`flex w-full mb-4 ${
        isMessageFromCurrentUser ? "justify-end" : "justify-start"
      }`}
    >
      <div className="flex max-w-[80%] gap-2">
        {!isMessageFromCurrentUser && (
          <div className="w-8 h-8 flex-shrink-0">
            <img
              src={message.avatar}
              alt="Avatar"
              className="rounded-full w-full h-full object-cover"
            />
          </div>
        )}

        <div
          className={`p-3 rounded-lg ${
            isMessageFromCurrentUser
              ? "bg-pink-500 rounded-tr-none"
              : "bg-[#19d39e] rounded-tl-none"
          }`}
        >
          <p className="text-white">{message.content}</p>
          <span className="text-xs text-gray-200 block mt-1">
            {message.time}
          </span>
        </div>

        {isMessageFromCurrentUser && (
          <div className="w-8 h-8 flex-shrink-0">
            <img
              src={message.avatar}
              alt="Avatar"
              className="rounded-full w-full h-full object-cover"
            />
          </div>
        )}
      </div>
    </div>
  );
}
