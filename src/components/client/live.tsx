"use client";

import { LiveSession } from "@prisma/client";
import {
  joinRoom,
  useReceiveData,
  leaveRoom,
} from "@/lib/socket"; // Added leaveRoom for cleanup
import { cn } from "@/lib/utils";
import { useEffect } from "react";

interface LiveStatusProps {
  id: LiveSession["id"];
  live: LiveSession["live"];
}

export const LiveStatus = ({ id, live }: LiveStatusProps) => {
  const liveStatus = useReceiveData("receive-session", live);

  useEffect(() => {
    if (id) {
      joinRoom(id); // Join room when component mounts
    }

    return () => {
      if (id) {
        leaveRoom(id); // Clean up by leaving the room on unmount
      }
    };
  }, [id]);

  return (
    <p
      className={cn(
        "w-full p-2 rounded text-center shadow",
        liveStatus
          ? "bg-green-400 text-primary"
          : "bg-red-600 text-primary-foreground"
      )}
    >
      {`${liveStatus ? "Live" : "Offline"}`}
    </p>
  );
};
