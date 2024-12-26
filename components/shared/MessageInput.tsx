"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { MessageData } from "@/types";
import { serverTimestamp } from "firebase/firestore";

interface MessageInputProps {
  chatRoomId: string;
  senderId: string;
  receiverId: string;
}

export function MessageInput({
  chatRoomId,
  senderId,
  receiverId,
}: MessageInputProps) {
  const [message, setMessage] = useState("");

  const firestore = getFirestore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() === "") return;

    try {
      const messageData: MessageData = {
        chatRoomId,
        senderId,
        receiverId,
        content: message,
        timestamp: serverTimestamp(),
      };

      await addDoc(collection(firestore, "messages"), messageData);

      const chatroomRef = doc(firestore, "chatrooms", chatRoomId);
      await updateDoc(chatroomRef, {
        lastMessage: message,
        timestamp: serverTimestamp(),
      });

      setMessage("");
    } catch (error) {
      console.error("Error adding message: ", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t">
      <div className="flex items-center space-x-2 max-w-4xl">
        <Input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-grow"
        />
        <Button type="submit" size="icon">
          <Send className="h-4 w-4" />
          <span className="sr-only">Send message</span>
        </Button>
      </div>
    </form>
  );
}
