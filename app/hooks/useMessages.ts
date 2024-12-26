"use client";

import { useState, useEffect } from "react";
import {
  getFirestore,
  query,
  collection,
  onSnapshot,
  where,
  orderBy,
} from "firebase/firestore";
import { Message } from "@/types";

export const useMessages = (chatRoomId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!chatRoomId) return;

    const firestore = getFirestore();
    const messagesQuery = query(
      collection(firestore, "messages"),
      where("chatRoomId", "==", chatRoomId),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(
      messagesQuery,
      (snapshot) => {
        const newMessages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Message[];

        setMessages(newMessages);
        setLoading(false);
        setError(null);
      },
      (error) => {
        console.error("Messages listener error:", error);
        setError(error as Error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [chatRoomId]);

  return { messages, loading, error };
};
