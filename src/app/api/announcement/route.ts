import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

type Announcement = { title: string; description: string };

/**
 * Decode a base64 encoded string.
 * @param {string} str - The encoded string.
 * @returns {string} - The decoded string.
 */
const decode = (str: string): string => {
  return Buffer.from(str, "base64").toString("utf-8");
};

/**
 * Encode a string to base64.
 * @param {string} str - The string to encode.
 * @returns {string} - The base64 encoded string.
 */
const encode = (str: string): string => {
  return Buffer.from(str, "utf-8").toString("base64");
};

/**
 * GET handler to fetch all announcements stored in cookies.
 * @param {NextRequest} req - The incoming request object.
 * @returns {NextResponse} - A JSON response with the announcements.
 */
export const GET = async (req: NextRequest) => {
  try {
    const cookiesStore = cookies();
    const allAnnouncements: Announcement[] = cookiesStore
      .getAll()
      .reduce((acc, { name, value }) => {
        if (name.startsWith("announcement_")) {
          acc.push({
            title: decode(name.replace("announcement_", "")),
            description: value,
          });
        }
        return acc;
      }, [] as Announcement[]);

    return NextResponse.json({ announcement: allAnnouncements });
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return NextResponse.json(
      { error: "Failed to fetch announcements" },
      { status: 500 }
    );
  }
};

/**
 * POST handler to store announcements as cookies.
 * @param {NextRequest} req - The incoming request object.
 * @returns {NextResponse} - A JSON response indicating success or failure.
 */
export const POST = async (req: NextRequest) => {
  try {
    const { announcement } = (await req.json()) as {
      announcement: Announcement[];
    };

    if (!Array.isArray(announcement)) {
      return NextResponse.json(
        { error: "Invalid data format. Expected an array of announcements." },
        { status: 400 }
      );
    }

    const cookiesStore = cookies();
    announcement.forEach(({ title, description }) => {
      if (title && description) {
        cookiesStore.set(`announcement_${encode(title)}`, description, {
          path: "/",
          maxAge: 60 * 60 * 24 * 360, // 1 year
        });
      } else {
        console.warn(
          `Invalid announcement skipped: ${JSON.stringify({
            title,
            description,
          })}`
        );
      }
    });

    return NextResponse.json({ message: "Announcements stored successfully." });
  } catch (error) {
    console.error("Error storing announcements:", error);
    return NextResponse.json(
      { error: "Failed to store announcements" },
      { status: 500 }
    );
  }
};
