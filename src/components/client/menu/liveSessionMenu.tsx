"use client";

import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { LiveSession, User } from "@prisma/client";
import {
  toggleAllowRequest,
  toggleLiveStatus,
  deleteSession,
  deleteSongs,
  setLimitConfigAction,
} from "@/components/action/admin";
import {
  sendData,
  createObject,
  useReceiveData,
  joinRoom,
  leaveRoom,
} from "@/lib/socket";
import { useEffect, useRef } from "react";
import { setLimit as setLimitAction } from "@/components/action/admin";
import { LimitForm } from "@/components/client/limitForm";
import { signOutAction } from "@/components/action/auth";
import AddParticipantsForm from "@/components/client/menu/addParticipantsForm";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface CreatorMenuProps {
  id: LiveSession["id"];
  live: LiveSession["live"];
  limit: LiveSession["limit"];
  allowRequest: LiveSession["allowRequest"];
  liveParticipant: User[];
  createBy: LiveSession["createBy"];
  userId: User["id"];
  defaultSession: LiveSession["default"];
  config: {
    isClearAfterLimitChange: LiveSession["clearOnChangeLimit"];
  }
}

const LiveSessionMenu = ({
  live,
  id,
  limit,
  allowRequest,
  liveParticipant,
  createBy,
  userId,
  defaultSession,
  config
}: CreatorMenuProps) => {
  const songLimit = useReceiveData("receive-limit", limit);
  const liveStatus = useReceiveData("receive-session", live);
  const isAllowRequest = useReceiveData("receive-allowRequest", allowRequest);
  const sessionConfig = useReceiveData("receive-session-config", config);
  const limitFormRef = useRef<HTMLButtonElement>(null);

  const route = useRouter();

  const handleDeleteAll = async () => {
    try {
      await deleteSongs(id); // Delete songs related to the user
      sendData("send-song", createObject(id, [])); // Send an empty list (or the appropriate data structure)
    } catch (error) {
      console.error("Error deleting songs or sending data:", error);
    }
  };

  const handlerChangeLimit = async (limit: number) => {
    try {
      const songs = await setLimitAction({ id, limit, willClear: sessionConfig.isClearAfterLimitChange });
      sendData("send-limit", createObject(id, limit));
      sendData("send-song", createObject(id, songs?.Song || []));
      sendData("send-allowRequest", createObject(id, songs?.allowRequest)); // Removed the non-null assertion (!)
    } catch (error) {
      console.error("Error setting limit or sending data:", error);
    }
  };

  const onChangeLive = async () => {
    try {
      const data = await toggleLiveStatus({ id, live: liveStatus });
      if (!data) return;
      sendData("send-session", createObject(id, data.live)); // Removed the non-null assertion (!)
      sendData("send-allowRequest", createObject(id, false)); // Removed the non-null assertion (!)
      sendData("send-song", createObject(id, data?.Song || []));
    } catch (error) {
      console.error("Error changing live status:", error);
    }
  };

  const onChangeAllowSongRequest = async () => {
    try {
      const data = await toggleAllowRequest({
        id,
        allowRequest: isAllowRequest,
      });
      if (!data) return;
      sendData("send-allowRequest", createObject(id, data.allowRequest)); // Removed the non-null assertion (!)
    } catch (error) {
      console.error("Error changing live status:", error);
    }
  };

  const onDeleteSession = async () => {
    try {
      await deleteSession(id);
      route.push("/creator");
    } catch (error) {
      console.error("Error changing live status:", error);
    }
  };

  const onChangeConfigLimit = async (clearOnChangeLimit: boolean) => {
    try {
      const data = await setLimitConfigAction({ id, clearOnChangeLimit });
      sendData("send-session-config", createObject(id, {
        ...sessionConfig,
        isClearAfterLimitChange: !!data
      })); // Removed the non-null assertion (!)
    } catch (error) {
      console.error("Error changing live status:", error);
    }
  }

  useEffect(() => {
    if (id) {
      joinRoom(id); // Join room when component mounts
    }

    return () => {
      if (id) {
        leaveRoom(id); // Clean up by leaving room when component unmounts
      }
    };
  }, [id]);

  return (
    <>
      <LimitForm id={id} limit={limit} ref={limitFormRef} config={sessionConfig} />
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>Session</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onClick={onChangeLive}>Change live status</MenubarItem>
            <MenubarItem onClick={onChangeAllowSongRequest}>
              Change allow song request
            </MenubarItem>
            {userId === createBy && !defaultSession && (
              <MenubarItem onClick={onDeleteSession}>
                Delete session
              </MenubarItem>
            )}
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Songs</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onClick={handleDeleteAll}>Delete all</MenubarItem>
            <MenubarCheckboxItem onClick={() => onChangeConfigLimit(!sessionConfig.isClearAfterLimitChange)} checked={sessionConfig.isClearAfterLimitChange}>
              Clear after limit change
            </MenubarCheckboxItem>
            <MenubarSeparator />
            <MenubarItem disabled>Current limit: {songLimit}</MenubarItem>
            <MenubarItem onClick={() => handlerChangeLimit(0)}>
              Set limit to 0
            </MenubarItem>
            <MenubarItem onClick={() => handlerChangeLimit(5)}>
              Set limit to 5
            </MenubarItem>
            <MenubarItem onClick={() => handlerChangeLimit(10)}>
              Set limit to 10
            </MenubarItem>
            <MenubarItem onClick={() => handlerChangeLimit(15)}>
              Set limit to 15
            </MenubarItem>
            <MenubarItem onClick={() => handlerChangeLimit(20)}>
              Set limit to 20
            </MenubarItem>
            <MenubarItem onClick={() => limitFormRef.current?.click()}>
              Set limit
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Account</MenubarTrigger>
          <MenubarContent>
            <MenubarItem disabled>View profile (not implemented)</MenubarItem>
            <MenubarItem
              onClick={async () => {
                signOutAction();
              }}
            >
              Sign out
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
      <div
        className={cn(
          "min-w-40 ml-4",
          userId === createBy && defaultSession && "hidden"
        )}
      >
        <AddParticipantsForm
          id={id}
          liveParticipant={liveParticipant}
          createBy={createBy}
        />
      </div>
    </>
  );
};

export default LiveSessionMenu;
