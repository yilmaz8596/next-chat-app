"use client";

import { useAuth } from "@/context/useAuthContext";
import { useChatroom } from "@/app/hooks/useChatroom";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";

type CallRoomProps = {
  video: boolean;
  audio: boolean;
  handleDisconnect: () => void;
};
export default function CallRoom({
  video,
  audio,
  handleDisconnect,
}: CallRoomProps) {
  const { user } = useAuth();
  const { chatrooms } = useChatroom();
  const [token, setToken] = useState("");

  const currentChatroom = chatrooms.find(
    (chatroom) => user && chatroom?.users?.includes(user.id)
  );
  useEffect(() => {
    if (!user?.userName) return;
    const fetchToken = async () => {
      try {
        if (!currentChatroom) {
          return;
        }
        const safeUsername = encodeURIComponent(user.userName);
        const response = await fetch(
          `/api/livekit/?room=${currentChatroom?.id}&username=${safeUsername}}
              )`
        );
        const data = await response.json();
        setToken(data.token);
      } catch (error) {
        console.error("Error fetching token:", error);
        toast.error("Error fetching token");
      }
    };

    fetchToken();
  }, [user?.userName, currentChatroom?.id]);

  if (!currentChatroom) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-lg font-semibold">Loading...</p>
        <Button onClick={handleDisconnect} className="ml-4">
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <div className="w-1/2 h-1/2 mx-auto">
      <LiveKitRoom
        data-lk-theme="default"
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
        token={token}
        connect={true}
        video={video}
        audio={audio}
        onDisconnected={() => handleDisconnect()}
        onConnected={() => console.log("connected")}
      >
        <VideoConference />
      </LiveKitRoom>
    </div>
  );
}
