"use client";

import ClearSongForm from "@/components/client/clearSong";
import ToggleSongRequestForm from "@/components/client/toggleSongRequest";
import {useSessionInit} from "@/components/context/sessionContext";

const AdminSetting = () => {
  const {sessionInit} = useSessionInit();

  return (
    <div className="px-4 grid gap-2 grid-cols-2">
      {/* Conditionally render ClearSongForm based on sessionInit */}
      {sessionInit && <ClearSongForm />}

      {/* Conditionally render ToggleSongRequestForm based on sessionInit */}
      {sessionInit && <ToggleSongRequestForm />}
    </div>
  );
};

export default AdminSetting;
