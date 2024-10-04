"use client";

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
import { LiveSession, User } from "@prisma/client";
import {
  changeAllowRequest,
  changeLive,
  deleteSongs,
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

interface CreatorMenuProps {
  id: LiveSession["id"];
  live: LiveSession["live"];
  limit: LiveSession["limit"];
  allowRequest: LiveSession["allowRequest"];
}

const LiveSessionMenu = ({
  live,
  id,
  limit,
  allowRequest,
}: CreatorMenuProps) => {
  const songLimit = useReceiveData("receive-limit", limit);
  const liveStatus = useReceiveData("receive-session", live);
  const isAllowRequest = useReceiveData("receive-allowRequest", allowRequest);

  const limitFormRef = useRef<HTMLButtonElement>(null);
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
      const songs = await setLimitAction({ id, limit });
      sendData("send-limit", createObject(id, limit));
      sendData("send-song", createObject(id, songs?.Song || []));
    } catch (error) {
      console.error("Error setting limit or sending data:", error);
    }
  };

  const onChangeLive = async () => {
    try {
      const data = await changeLive({ id, live: liveStatus });
      if (!data) return;
      sendData("send-session", createObject(id, data.live)); // Removed the non-null assertion (!)
    } catch (error) {
      console.error("Error changing live status:", error);
    }
  };

  const onChangeAllowSongRequest = async () => {
    try {
      const data = await changeAllowRequest({
        id,
        allowRequest: isAllowRequest,
      });
      if (!data) return;
      sendData("send-allowRequest", createObject(id, data.allowRequest)); // Removed the non-null assertion (!)
    } catch (error) {
      console.error("Error changing live status:", error);
    }
  };

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
      <LimitForm id={id} limit={limit} ref={limitFormRef} />
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>Session</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onClick={onChangeLive}>Change live status</MenubarItem>
            <MenubarItem onClick={onChangeAllowSongRequest}>
              Change allow song request
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Songs</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onClick={handleDeleteAll}>Delete all</MenubarItem>
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
    </>
  );
};

export default LiveSessionMenu;
