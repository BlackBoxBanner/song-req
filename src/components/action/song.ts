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

  if (!liveSession || !liveSession.live || !liveSession.allowRequest) {
    throw new Error(
      !liveSession
        ? "Session not found."
        : !liveSession.live
        ? "Cannot add song. Session is not live."
        : "Cannot add song. Song requests are not allowed."
    );
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

type EditSongProps = {
  LiveSessionId: LiveSession["id"];
  id: Song["id"];
  title: Song["title"];
};

export const editSongAction = async ({
  LiveSessionId,
  id,
  title,
}: EditSongProps) => {
  // Step 1: Fetch only the necessary fields
  const liveSession = await prisma.liveSession.findUnique({
    where: { id: LiveSessionId },
    select: {
      id: true,
      live: true,
      allowRequest: true,
      Song: {
        where: { id, deleted: false },
        select: {
          id: true,
          editCount: true,
          done: true,
        },
      },
    },
  });

  // Step 2: Check if the live session exists and meets the conditions
  if (!liveSession) throw new Error("Session not found.");
  if (!liveSession.live)
    throw new Error("Cannot add song. Session is not live.");
  if (!liveSession.allowRequest)
    throw new Error("Cannot add song. Song requests are not allowed.");

  // Step 3: Check if the song can be edited
  const currentSong = liveSession.Song[0]; // Fetching the single song based on id filter
  if (!currentSong) throw new Error("Song not found.");
  if (!currentSong.editCount || currentSong.done)
    throw new Error("Cannot edit song. Song is not editable.");

  // Step 4: Update the song title and reset editCount
  await prisma.song.update({
    where: { id, deleted: false },
    data: { title, editCount: false },
  });

  // Step 5: Fetch updated list of songs for the session (order by creation time)
  const songList = await prisma.song.findMany({
    where: { deleted: false, LiveSession: { id: LiveSessionId } },
    orderBy: { createAt: "asc" },
  });

  return songList;
};

// Function to update the song list cookie
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

export const getSongListCookie = (): Promise<string[]> => {
  const cookieStore = cookies();
  const cookieName = "song-list";
  const currentSongList = cookieStore.get(cookieName);

  return currentSongList?.value ? JSON.parse(currentSongList.value) : [];
};
