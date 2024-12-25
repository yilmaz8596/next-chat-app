import { User } from "@/types";
import Image from "next/image";

interface UserCardProps extends User {
  latestMessage?: string;
  time?: string;
  type?: string;
}

export default function UserCard({
  userName,
  email,
  avatar,
  latestMessage,
  time,
  type,
}: UserCardProps) {
  return (
    <div className="flex items-center p-4 border-b border-gray-200 relative hover:cursor-pointer">
      {/* Avatar on the left */}
      <div className="flex-shrink-0 mr-4 relative">
        <div className="w-12 h-12 rounded-full overflow-hidden">
          <img
            className="w-full h-full object-cover"
            src={avatar}
            alt="Avatar"
          />
        </div>
      </div>

      {type == "chat" && (
        /* Name, latest message, and time on the right */
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">{userName}</h2>
          </div>
          <p className="text-gray-500 truncate">{latestMessage}</p>
        </div>
      )}

      {type == "user" && (
        /* Name */
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">{userName}</h2>
          </div>
        </div>
      )}
    </div>
  );
}
