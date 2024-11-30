"use server";

import prisma from "@/lib/prisma";

export const query23 = async (query: string) => {
  // List of dangerous SQL keywords to check for
  const dangerousKeywords = [
    "drop",
    "delete",
    "insert",
    "update",
    "truncate",
    "alter",
    "from account",
    "from session",
    "from verificationToken",
    "from User",
    "from liveSession",
    "from liveSessionAccess",
    "from liveParticipant",
    "from liveParticipantOnSessions",
    "from song",
  ];

  // Convert query to lowercase and check for dangerous keywords
  const containsDangerousKeywords = dangerousKeywords.some((keyword) =>
    query.toLowerCase().includes(keyword.toLowerCase())
  );

  // If dangerous keywords are found, throw an error
  if (containsDangerousKeywords) {
    throw new Error("Your query contains disallowed SQL keywords.");
  }

  // If no dangerous keywords are found, proceed with the query
  const sql = `SELECT * FROM Song WHERE LOWER(title) LIKE LOWER('%${query}%')`;

  const vulnerable = await prisma.$queryRawUnsafe(sql);
  return vulnerable;
};
