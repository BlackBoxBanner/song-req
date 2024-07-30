"use client";

import ClearSongForm from "../client/clearSong";
import CreateSessionForm from "../client/createSession";
import DeleteSessionForm from "../client/deleteSession";
import ToggleSongRequestForm from "../client/toggleSongRequest";
import {useSessionInit} from "@/components/context/sessionContext";

const AdminSetting = () => {
  const {sessionInit} = useSessionInit();
  return (
    <>
      <div className="px-4 grid gap-2 grid-cols-2">
        <ClearSongForm />
        <ToggleSongRequestForm />
      </div>
    </>
  );
};

export default AdminSetting;
