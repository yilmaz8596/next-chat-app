import { User } from "@/types";
import Image from "next/image";

interface UserCardProps extends User {
  latestMessage?: string;
  time?: string | Date;
  type?: string;
  onClick?: () => void;
}

export default function UserCard({
  userName,
  avatar,
  latestMessage,
  time,
  type,
  onClick,
}: UserCardProps) {
  return (
    <div
      className="flex items-center p-4 hover:bg-accent transition-colors duration-200 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex-shrink-0 mr-4">
        <div className="w-12 h-12 rounded-full overflow-hidden">
          <Image
            className="w-full h-full object-cover"
            src={avatar}
            alt="Avatar"
          />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <h2 className="text-lg font-semibold truncate">{userName}</h2>
        {type === "chat" && (
          <p className="text-sm text-muted-foreground truncate">
            {latestMessage}
          </p>
        )}
      </div>

      {time && type === "chat" && (
        <span className="text-xs text-muted-foreground">{time}</span>
      )}
    </div>
  );
}
