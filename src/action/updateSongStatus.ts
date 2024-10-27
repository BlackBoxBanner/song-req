"use server";

import prisma from "@/lib/prisma";

// Update a song's status and return all songs for its associated live session
export const updateSongStatus = async ({
  id,
  done,
}: {
  id: string;
  done: boolean;
}) => {
  if (!id) throw new Error("Song ID is required"); // Error if ID is missing

  // Update the song's status (done or not)
  const updatedSong = await prisma.song.update({
    where: { id }, // Update song by ID
    data: { done }, // Set the song as done or not
    select: { LiveSession: { select: { id: true } } }, // Return linked live session information
  });

  // Fetch and return all songs for the live session ordered by creation date
  return await prisma.song.findMany({
    where: { liveSessionId: updatedSong.LiveSession.id, deleted: false },
    orderBy: { createAt: "asc" },
  });
};
