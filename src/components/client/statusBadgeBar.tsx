"use client";
import { Badge } from "@/components/ui/badge";
import { joinRoom, leaveRoom, useReceiveData } from "@/lib/socket";
import { LiveSession } from "@prisma/client";
import { useEffect } from "react";

type StatusBadgeBarProps = {
  id: LiveSession["id"];
  allowRequest: LiveSession["allowRequest"];
  live: LiveSession["live"];
  limit: LiveSession["limit"];
};

const StatusBadgeBar = ({
  id,
  limit,
  live,
  allowRequest,
}: StatusBadgeBarProps) => {
  const isLive = useReceiveData("receive-session", live);
  const songLimit = useReceiveData("receive-limit", limit);
  const isAllowRequest = useReceiveData("receive-allowRequest", allowRequest);

  // Join room on mount and leave on unmount
  useEffect(() => {
    if (id) {
      joinRoom(id);

      return () => {
        leaveRoom(id); // Clean up the socket room
      };
    }
  }, [id]);
  return (
    <div className="flex  gap-2">
      <Badge>Session: {isLive ? "Live" : "Offline"}</Badge>
      <Badge>Allow song request: {isAllowRequest ? "Yes" : "No"}</Badge>
      <Badge>Song request limit: {songLimit}</Badge>
    </div>
  );
};

export default StatusBadgeBar;
