"use server";

import prisma from "@/lib/prisma";
import { LiveSession, Song } from "@prisma/client";
import { cookies } from "next/headers";

export const requestSongAction = async ({
  id,
  title,
}: {
  id: LiveSession["id"];
  title: Song["title"];
}) => {
  // Fetch the live session and check for its existence
  const liveSession = await prisma.liveSession.findUnique({
    where: { id },
  });

  // Validate live session existence and status
  if (!liveSession) {
    throw new Error("Session not found.");
  }
  if (!liveSession.live) {
    throw new Error("Cannot add song. Session is not live.");
  }
  if (!liveSession.allowRequest) {
    throw new Error("Cannot add song. Song requests are not allowed.");
  }

  // Fetch current songs for the session
  const songList = await prisma.song.findMany({
    where: { deleted: false, LiveSession: { id } },
    orderBy: { createAt: "asc" },
  });

  // Check if the song limit has been reached
  if (songList.length >= liveSession.limit) {
    throw new Error(`Cannot add song. Limit of ${liveSession.limit} reached.`);
  }

  // Create new song
  const newSong = await prisma.song.create({
    data: {
      title,
      LiveSession: {
        connect: { id },
      },
    },
  });

  // Update the song list cookie
  updateSongListCookie(newSong.id);

  // Return updated list of songs for the session
  return [...songList, newSong]; // Return existing songs along with the newly added song
};

const updateSongListCookie = (newSongId: string) => {
    const cookieStore = cookies();
    const cookieName = "song-list";
    const currentSongList = cookieStore.get(cookieName);
    const songIds: string[] = currentSongList?.value
      ? JSON.parse(currentSongList.value)
      : [];
  
    // Add the new song ID and update the cookie
    songIds.push(newSongId);
    cookies().set({
      name: cookieName,
      value: JSON.stringify(songIds),
      httpOnly: true,
      path: "/",
      expires: new Date(Date.now() + 1000 * 60 * 60 * 3), // 3 hours
    });
  };