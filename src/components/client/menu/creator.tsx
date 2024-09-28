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
import { User } from "@prisma/client";
import { deleteSongs } from "@/components/action/admin";
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
import { LiveMenu } from "@/components/client/live";
import { signOutAction } from "@/components/action/auth";

interface CreatorMenuProps {
  live: User["live"];
  name: User["name"];
  limit: User["limit"];
}

const CreatorMenu = ({ live, name, limit }: CreatorMenuProps) => {
  const songLimit = useReceiveData("receive-limit", limit);
  const limitFormRef = useRef<HTMLButtonElement>(null);
  const handleDeleteAll = async () => {
    try {
      await deleteSongs(name!); // Delete songs related to the user
      sendData("send-song", createObject(name!, [])); // Send an empty list (or the appropriate data structure)
    } catch (error) {
      console.error("Error deleting songs or sending data:", error);
    }
  };

  const handlerChangeLimit = async (limit: number) => {
    try {
      const songs = await setLimitAction({ name, limit });
      sendData("send-limit", createObject(name!, limit));
      sendData("send-song", createObject(name!, songs?.Song || []));
    } catch (error) {
      console.error("Error setting limit or sending data:", error);
    }
  };

  useEffect(() => {
    if (name) {
      joinRoom(name); // Join room when component mounts
    }

    return () => {
      if (name) {
        leaveRoom(name); // Clean up by leaving room when component unmounts
      }
    };
  }, [name]);

  return (
    <>
      <LimitForm name={name} limit={limit} ref={limitFormRef} />
      <div className="p-2">
        <Menubar>
          <LiveMenu live={live} name={name} />
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
      </div>
    </>
  );
};

export default CreatorMenu;
