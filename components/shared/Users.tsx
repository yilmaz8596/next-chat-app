"use client";

import { useState } from "react";
import { User, UsersProps } from "@/types";
import Chatroom from "./Chatroom";
import { toast } from "sonner";
import { getDocs, addDoc, query, serverTimestamp } from "firebase/firestore";
import { collection, where } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import SideDrawerContent from "./SideDrawerContent";

export default function Users({
  users,
  userData,
  selectedChatRoom,
  setSelectedChatRoom,
}: UsersProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const convoUser = users.find(
    (user) => user.id === selectedChatRoom?.otherData.id
  );

  const createChat = async (user: User) => {
    if (!userData) {
      toast.error("User data is not available");
      return;
    }
    try {
      const firestore = getFirestore();
      const existingChatroom = query(
        collection(firestore, "chatrooms"),
        where("users", "in", [
          [userData.id, user.id],
          [user.id, userData.id],
        ])
      );
      const existingChatroomSnapshot = await getDocs(existingChatroom);

      if (!existingChatroomSnapshot.empty) {
        setSelectedChatRoom({
          id: existingChatroomSnapshot.docs[0].id,
          myData: { ...userData, id: userData.id || "" },
          otherData: user,
        });
        setIsDrawerOpen(false);
        return;
      }

      // Ensure both users have all required fields
      const cleanUserData = {
        id: userData.id || "",
        email: userData.email,
        userName: userData.userName,
        avatar: userData.avatar, // Provide a default avatar
      };

      const cleanOtherUser = {
        id: user.id || "",
        email: user.email,
        userName: user.userName,
        avatar: user.avatar, // Provide a default avatar
      };

      const usersData = {
        [userData.id!]: cleanUserData,
        [user.id!]: cleanOtherUser,
      };

      const chatroomData = {
        users: [userData.id, user.id],
        usersData,
        timestamp: serverTimestamp(),
        lastMessage: null,
      };

      console.log("Creating chatroom with data:", chatroomData); // Debug log

      const chatroomRef = await addDoc(
        collection(firestore, "chatrooms"),
        chatroomData
      );

      setSelectedChatRoom({
        id: chatroomRef.id,
        myData: cleanUserData,
        otherData: cleanOtherUser,
      });
      setIsDrawerOpen(false);
      toast.success("Chatroom created successfully");
    } catch (error) {
      console.error("Error creating chat:", error);
      toast.error((error as Error).message);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col">
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="m-4">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] sm:w-[400px]">
          <SheetHeader>
            <SheetTitle>Chats</SheetTitle>
          </SheetHeader>
          <SideDrawerContent
            users={users}
            userData={userData}
            createChat={createChat}
          />
        </SheetContent>
      </Sheet>

      {/* Main chat area */}
      <div className="flex-1 overflow-hidden">
        {convoUser ? (
          <Chatroom user={convoUser} />
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-muted-foreground">
              Select a chat to start messaging
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
