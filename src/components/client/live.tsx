"use client";

import { LiveSession, User } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { changeLive } from "@/components/action/admin";
import {
  createObject,
  joinRoom,
  sendData,
  useReceiveData,
  leaveRoom,
} from "@/lib/socket"; // Added leaveRoom for cleanup
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";

interface ChangeLiveFormProps {
  id: LiveSession["id"];
  live: LiveSession["live"];
}

const LiveMenu = ({ live, id }: ChangeLiveFormProps) => {
  // Use liveStatus here before defining it
  const liveStatus = useReceiveData("receive-session", live);

  const onChangeLive = async () => {
    try {
      const data = await changeLive({ id, live: liveStatus });
      if (!data) return;
      sendData("send-session", createObject(id, data.live)); // Removed the non-null assertion (!)
    } catch (error) {
      console.error("Error changing live status:", error);
    }
  };

  useEffect(() => {
    if (id) {
      joinRoom(id); // Safely join the room using props.name
    }

    return () => {
      if (id) {
        leaveRoom(id); // Leave room on component unmount
      }
    };
  }, [id]);
  return (
    <MenubarMenu>
      <MenubarTrigger>{liveStatus ? "Live" : "Offline"}</MenubarTrigger>
      <MenubarContent>
        <MenubarItem onClick={onChangeLive}>Change live status</MenubarItem>
      </MenubarContent>
    </MenubarMenu>
  );
};
interface LiveStatusProps {
  id: LiveSession["id"];
  live: LiveSession["live"];
}

const LiveStatus = ({ id, live }: LiveStatusProps) => {
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

export { LiveStatus, LiveMenu };
