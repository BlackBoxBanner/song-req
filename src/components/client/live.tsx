"use client";

import { LiveSession } from "@prisma/client";
import {
  joinRoom,
  useReceiveData,
  leaveRoom,
} from "@/lib/socket"; // Added leaveRoom for cleanup
import { cn } from "@/lib/utils";
import { use, useEffect } from "react";
import { fetchLiveSessionByRoute } from "@/action/fetchLiveSessionByRoute";
import { notFound } from "next/navigation";

interface LiveStatusProps {
  LiveSession: Awaited<ReturnType<typeof fetchLiveSessionByRoute>>
}

export const LiveStatus = ({ LiveSession}: LiveStatusProps) => {
  const liveSession = LiveSession!
  const liveStatus = useReceiveData("receive-session", liveSession.live);

  useEffect(() => {
    if (liveSession.id) {
      joinRoom(liveSession.id); // Join room when component mounts
    }

    return () => {
      if (liveSession.id) {
        leaveRoom(liveSession.id); // Clean up by leaving the room on unmount
      }
    };
  }, [liveSession?.id]);

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
