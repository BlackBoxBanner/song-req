"use client";

import { User } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { changeLive } from "@/components/action/admin";
import { createObject, joinRoom, sendData, useReceiveData } from "@/lib/socket";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

const ChangeLiveForm = (props: Pick<User, "live" | "name">) => {
  const onChangeLive = async () => {
    try {
      const data = await changeLive({ name: props.name, live: liveStatus });
      if (!data) return;
      sendData("send-session", createObject(props.name!, data.live));
    } catch (error) {
      console.error(error);
    }
  };

  const liveStatus = useReceiveData("receive-session", props.live);

  useEffect(() => {
    joinRoom(name!);
  }, [name]);

  return (
    <Button
      onClick={onChangeLive}
      variant={liveStatus ? "default" : "secondary"}
    >
      {liveStatus ? "Live Online" : "Live Offline"}
    </Button>
  );
};

const LiveStatus = (props: Pick<User, "live">) => {
  const liveStatus = useReceiveData("receive-session", props.live);

  useEffect(() => {
    joinRoom(name!);
  }, [name]);
  return (
    <p
      className={cn(
        "w-full p-2 rounded text-center col-span-2 shadow",
        liveStatus
          ? "bg-green-400 text-primary"
          : "bg-red-600 text-primary-foreground"
      )}
    >
      {liveStatus ? "Live" : "Offline"}
    </p>
  );
};

export { ChangeLiveForm, LiveStatus };
