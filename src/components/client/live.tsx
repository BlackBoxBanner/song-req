"use client";

import { User } from "@prisma/client";
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
  live: User["live"];
  name: User["name"];
}

const LiveMenu = ({ live, name }: ChangeLiveFormProps) => {
  // Use liveStatus here before defining it
  const liveStatus = useReceiveData("receive-session", live);

  const onChangeLive = async () => {
    try {
      const data = await changeLive({ name: name, live: liveStatus });
      if (!data) return;
      sendData("send-session", createObject(name!, data.live)); // Removed the non-null assertion (!)
    } catch (error) {
      console.error("Error changing live status:", error);
    }
  };

  useEffect(() => {
    if (name) {
      joinRoom(name); // Safely join the room using props.name
    }

    return () => {
      if (name) {
        leaveRoom(name); // Leave room on component unmount
      }
    };
  }, [name]);
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
  live: User["live"];
  name: User["name"];
  prefix?: string;
}

const LiveStatus = ({ prefix = "", ...props }: LiveStatusProps) => {
  const liveStatus = useReceiveData("receive-session", props.live);

  useEffect(() => {
    if (props.name) {
      joinRoom(props.name); // Join room when component mounts
    }

    return () => {
      if (props.name) {
        leaveRoom(props.name); // Clean up by leaving the room on unmount
      }
    };
  }, [props.name]);

  return (
    <p
      className={cn(
        "w-full p-2 rounded text-center col-span-2 shadow",
        liveStatus
          ? "bg-green-400 text-primary"
          : "bg-red-600 text-primary-foreground"
      )}
    >
      {`${prefix} ${liveStatus ? "Live" : "Offline"}`}
    </p>
  );
};

export { LiveStatus, LiveMenu };
