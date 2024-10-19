"use server";

import prisma from "@/lib/prisma"; // Import the Prisma client for database operations
import { LiveSession, Prisma } from "@prisma/client"; // Import types from Prisma client
import { revalidatePath } from "next/cache"; // Import function to revalidate cached paths

//SECTION - Constants
// Constants for error messages and default values
const DEFAULT_LIMIT = 10; // Default limit for live sessions
const DEFAULT_SESSION_STATUS = false; // Default status for live sessions

//!SECTION

//SECTION - Utility Functions

// Utility function to get the user's live session by username
export const getLiveSessionFromUserName = async (username: string) => {
  return await prisma.liveParticipant.findMany({
    where: {
      sessions: {
        some: {
          liveParticipant: {
            User: {
              username, // Filter live participants by username
            },
          },
        },
      },
    },
    select: {
      id: true, // Select participant ID
      sessions: {
        include: {
          liveSession: {
            include: {
              participants: {
                include: {
                  liveParticipant: {
                    include: {
                      User: true, // Include user information for participants
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
};

// Fetch user by ID with optional selection
export const getUserById = async (id: string, select?: Prisma.UserSelect) => {
  return await prisma.user.findUnique({
    where: { id }, // Find user by ID
    select, // Optional fields to select
  });
};

// Fetch user by username with optional selection
export const getUserByName = async (
  username: string,
  select?: Prisma.UserSelect
) => {
  return await prisma.user.findUnique({
    where: { username }, // Find user by username
    select, // Optional fields to select
  });
};

// Get all users with limited fields
export const getAllUsers = async () => {
  return await prisma.user.findMany({
    select: {
      id: true, // Select user ID
      username: true, // Select username
    },
  });
};

//!SECTION

//SECTION - Live Session Management

// Fetch a live session by its route
export const getLiveSessionByRoute = async (route: string) => {
  return await prisma.liveSession.findUnique({
    where: { route }, // Find live session by route
    include: {
      Song: { orderBy: { createAt: "asc" } }, // Include songs ordered by creation date
      participants: {
        include: {
          liveParticipant: { include: { User: true } }, // Include participants and their user info
        },
      },
    },
  });
};

// Fetch a live session by ID with optional songs
export const getLiveSessionById = async (id: string, includeSongs = false) => {
  return await prisma.liveSession.findUnique({
    where: { id }, // Find live session by ID
    include: {
      Song: includeSongs ? { orderBy: { createAt: "asc" } } : false, // Include songs if specified
      participants: {
        include: {
          liveParticipant: { include: { User: true } }, // Include participants and their user info
        },
      },
    },
  });
};

export const getAllUniqueRoutes = async () => {
  return await prisma.liveSession.findMany({
    select: { route: true }, // Select routes
  });
};

// Create a new live session
export const createLiveSession = async ({
  name,
  route,
  limit,
  createdBy,
  default: isDefault = DEFAULT_SESSION_STATUS,
}: {
  name: string; // Name of the session
  route: string; // Route for the session
  limit: string; // Limit for participants
  createdBy: string; // User ID of the creator
  default?: boolean; // Default status for the session
}) => {
  const newLimit = isNaN(parseInt(limit)) ? DEFAULT_LIMIT : parseInt(limit); // Set limit or default

  const newLiveSession = await prisma.liveSession.create({
    data: {
      name, // Session name
      route, // Session route
      limit: newLimit, // Session limit
      createBy: createdBy, // Creator ID
      default: isDefault, // Default status
    },
  });

  // Create a participant for the newly created session
  await prisma.liveParticipant.create({
    data: {
      userId: createdBy, // Set user ID for participant
      sessions: {
        create: {
          liveSessionId: newLiveSession.id, // Link to the live session
          assignedBy: createdBy, // Assigned by the creator
        },
      },
    },
  });

  // Revalidate the creator's path to refresh data
  return revalidatePath("/creator");
};

// Change the live status of a session
export const toggleLiveStatus = async ({
  id,
  live = false,
}: Pick<LiveSession, "id" | "live">) => {
  if (!id) return; // Exit if ID is not provided

  return await prisma.liveSession.update({
    where: { id }, // Update session by ID
    data: {
      live: !live, // Toggle live status
      allowRequest: false, // Disable song requests
      Song: { deleteMany: {} }, // Delete all songs
    },
    select: {
      live: true,
      Song: {
        orderBy: { createAt: "asc" },
      },
    }, // Return updated live status
  });
};

// Toggle song request permission for a session
export const toggleAllowRequest = async ({
  id,
  allowRequest = false,
}: Pick<LiveSession, "id" | "allowRequest">) => {
  if (!id) return; // Exit if ID is not provided

  return await prisma.liveSession.update({
    where: { id }, // Update session by ID
    data: {
      allowRequest: !allowRequest, // Toggle request permission
    },
    select: { allowRequest: true }, // Return updated permission status
  });
};

export const setLimitConfigAction = async ({
  id,
  clearOnChangeLimit,
}: Pick<LiveSession, "id" | "clearOnChangeLimit">) => {
  if (!id) return; // Exit if ID is not provided

  const config = await prisma.liveSession.update({
    where: { id }, // Update session by ID
    data: { clearOnChangeLimit }, // Set the clearOnChangeLimit value
    select: { clearOnChangeLimit: true }, // Return updated value
  });

  revalidatePath("/creator/*");

  return config.clearOnChangeLimit;
};

// Set limit for a live session
export const setLimit = async ({
  id,
  limit,
  willClear = false,
}: Pick<LiveSession, "id" | "limit"> & { willClear: boolean }) => {
  if (!id) return; // Exit if ID is not provided

  return await prisma.liveSession.update({
    where: { id }, // Update session by ID
    data: {
      limit: Math.abs(limit),
      allowRequest: false,
      Song: willClear ? { deleteMany: {} } : {}, // Clear songs if specified
    }, // Set the limit as a non-negative number
    select: {
      limit: true,
      allowRequest: true,
      Song: { orderBy: { createAt: "asc" } },
    }, // Return updated limit and ordered songs
  });
};

// Delete a live session and its participants
export const deleteSession = async (id: string) => {
  // Delete participants associated with the session
  await prisma.liveParticipant.deleteMany({
    where: {
      sessions: {
        some: {
          liveSessionId: id, // Find participants linked to the session
        },
      },
    },
  });
  // Delete the live session
  await prisma.liveSession.delete({ where: { id } });
  // Revalidate creator's path to refresh data
  return revalidatePath("/creator/*");
};

//!SECTION

//SECTION - Song Management

// Delete all songs for a given live session
export const deleteSongs = async (liveSessionId: string) => {
  await prisma.song.deleteMany({
    where: { LiveSession: { id: liveSessionId } }, // Delete songs linked to the session
  });
};

// Edit a song's status
export const editSong = async ({ id, done }: { id: string; done: boolean }) => {
  const changedSong = await prisma.song.update({
    where: { id }, // Update song by ID
    data: { done }, // Set the song as done or not
    select: { LiveSession: true }, // Return linked live session information
  });

  // Fetch and return all songs for the live session ordered by creation date
  return await prisma.song.findMany({
    where: { liveSessionId: changedSong.LiveSession.id },
    orderBy: { createAt: "asc" },
  });
};

//!SECTION

//SECTION - Participant Management

// Add a participant to a live session
export const addParticipant = async (userId: string, liveSessionId: string) => {
  await prisma.liveParticipant.create({
    data: {
      userId, // User ID of the participant
      sessions: {
        create: {
          liveSessionId, // Link to the live session
          assignedBy: userId, // Assigned by the participant
        },
      },
    },
  });
  // Revalidate creator's path to refresh data
  return revalidatePath("/creator/*");
};

// Remove a participant from a live session
export const removeParticipant = async (
  userId: string,
  liveSessionId: string
) => {
  await prisma.liveParticipant.deleteMany({
    where: {
      userId, // Find participants by user ID
      sessions: {
        some: {
          liveSessionId, // Find sessions linked to the live session ID
        },
      },
    },
  });
  // Revalidate creator's path to refresh data
  return revalidatePath("/creator/*");
};

//!SECTION
