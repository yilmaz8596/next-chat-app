"use client";

import { useState, useEffect } from "react";
import { getFirestore, query, collection, getDocs } from "firebase/firestore";
import { ChatroomData } from "@/types";

export const useChatroom = () => {
  const [chatrooms, setChatrooms] = useState<ChatroomData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const firestore = getFirestore();

  useEffect(() => {
    const fetchChatrooms = async () => {
      try {
        setLoading(true);
        const chatroomsQuery = query(collection(firestore, "chatrooms"));
        const querySnapshot = await getDocs(chatroomsQuery);

        const chatroomsData = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            users: data.users || [],
            usersData: data.usersData || {},
            timestamp: data.timestamp,
            lastMessage: data.lastMessage || null,
          } satisfies ChatroomData;
        });

        setChatrooms(chatroomsData);
      } catch (error) {
        console.error("Error fetching chatrooms:", error);
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchChatrooms();
  }, [firestore]);

  return { chatrooms, loading, error };
};
