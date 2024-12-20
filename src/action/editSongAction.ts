"use server";

import prisma from "@/lib/prisma";
import { LiveSession, Song } from "@prisma/client";

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

  // Step 2: Validate the live session and song conditions
  if (!liveSession) throw new Error("Session not found.");
  if (!liveSession.live)
    throw new Error("Cannot edit song. Session is not live.");
  if (!liveSession.allowRequest)
    throw new Error("Cannot edit song. Song requests are not allowed.");

  const currentSong = liveSession.Song[0]; // Fetching the single song based on id filter
  if (!currentSong) throw new Error("Song not found.");
  if (!currentSong.editCount || currentSong.done) {
    throw new Error("Cannot edit song. Song is not editable.");
  }

  // Step 3: Update the song title and reset editCount
  await prisma.song.update({
    where: { id, deleted: false },
    data: {
      title,
      editCount: {
        decrement: 1,
      },
    },
  });

  // Step 4: Fetch updated list of songs for the session (ordered by creation time)
  const songList = await prisma.song.findMany({
    where: { deleted: false, LiveSession: { id: LiveSessionId } },
    orderBy: { createAt: "asc" },
  });

  return songList; // Return the updated song list
};
