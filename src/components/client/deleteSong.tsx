"use client";

import { User } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { deleteSongs } from "@/components/action/admin";
import { createObject, joinRoom, sendData, leaveRoom } from "@/lib/socket"; // Assuming leaveRoom exists
import { useEffect } from "react";

interface DeleteFormProps {
  name: User["name"];
}

export const DeleteForm = ({ name }: DeleteFormProps) => {
  const handleDelete = async () => {
    try {
      await deleteSongs(name!); // Delete songs related to the user
      sendData("send-song", createObject(name!, [])); // Send an empty list (or the appropriate data structure)
    } catch (error) {
      console.error("Error deleting songs or sending data:", error);
    }
  };

  useEffect(() => {
    if (!name) return; // Early return if no name is provided

    // Join room when component mounts
    joinRoom(name);

    // Clean up by leaving room when component unmounts
    return () => {
      leaveRoom(name);
    };
  }, [name]);

  // Return early if no name is provided
  if (!name) return null;

  return <Button onClick={handleDelete}>Delete all songs</Button>;
};