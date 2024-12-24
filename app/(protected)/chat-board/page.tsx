"use client";

import { useState } from "react";
import { useAuth } from "@/context/useAuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/types";

export default function ChatBoard() {
  const { userId, loading, getUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!userId) {
      router.push("/login");
    }

    const fetchUser = async () => {
      const user = await getUser(userId!);
      setUser(user);
    };

    fetchUser();
  }, [userId, getUser, router]);

  if (loading) return <div>Loading...</div>;

  if (!user) return <div>Redirecting to login...</div>;

  return (
    <div>
      <h1>Welcome, {user.userName}</h1>
      <img
        src={user.avatar}
        alt={user.userName}
        className="w-12 h-12 rounded-full"
      />
    </div>
  );
}
