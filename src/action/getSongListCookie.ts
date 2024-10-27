"use server";

import { cookies } from "next/headers";

export const getSongListCookie = async (): Promise<string[]> => {
  const cookieStore = cookies();
  const cookieName = "song-list";
  const currentSongList = cookieStore.get(cookieName);

  // Check if the cookie exists and parse it; if not, return an empty array
  if (currentSongList && currentSongList.value) {
    try {
      return JSON.parse(currentSongList.value) as string[];
    } catch (error) {
      console.error("Failed to parse song list cookie:", error);
      return []; // Return an empty array on parsing error
    }
  }

  return []; // Return an empty array if the cookie doesn't exist
};
