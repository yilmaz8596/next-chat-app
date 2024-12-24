import UserCard from "./UserCard";
import { User } from "@/types";

export default function Users({ users }: { users: User[] }) {
  return (
    <div>
      {users.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}
