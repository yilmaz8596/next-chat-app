"use client";

import { useState } from "react";
import { useAuth } from "@/context/useAuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/types";
import Users from "@/components/shared/Users";

export default function ChatBoard() {
  const { userId, loading, getUser, getAllUsers, user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const router = useRouter();

  console.log(user);

  useEffect(() => {
    const fetchUsers = async () => {
      const users = await getAllUsers();
      setUsers(users);
    };

    fetchUsers();
  }, [getAllUsers]);

  if (loading) return <div>Loading...</div>;

  if (!user) return <div>Redirecting to login...</div>;

  return (
    <div className="flex h-screen">
      <div className="flex-shrink-0 w-3/12">
        <Users users={users} />
      </div>
    </div>
  );
}
