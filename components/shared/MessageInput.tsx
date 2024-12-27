"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, SmileIcon } from "lucide-react";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { MessageData } from "@/types";
import { serverTimestamp } from "firebase/firestore";
import { User } from "@/types";
import EmojiPicker from "emoji-picker-react";
import { EmojiClickData } from "emoji-picker-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface MessageInputProps {
  chatRoomId: string;
  senderId: string;
  receiverId: string;
  user: User;
}

export function MessageInput({
  chatRoomId,
  senderId,
  receiverId,
  user,
}: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
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
        avatar: user?.avatar,
        time: new Date().toLocaleTimeString(),
      };

      const docRef = await addDoc(
        collection(firestore, "messages"),
        messageData
      );

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

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setMessage(message + emojiData.emoji);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t">
      <div className="flex items-center space-x-2 max-w-4xl relative">
        <div className="flex-grow relative">
          <Input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="pr-10"
          />
          <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
            <PopoverTrigger asChild>
              <SmileIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 cursor-pointer text-gray-500 hover:text-gray-700" />
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 border-none">
              <EmojiPicker
                onEmojiClick={handleEmojiClick}
                height={350}
                width={300}
              />
            </PopoverContent>
          </Popover>
        </div>
        <Button type="submit" size="icon">
          <Send className="h-4 w-4" />
          <span className="sr-only">Send message</span>
        </Button>
      </div>
    </form>
  );
}
