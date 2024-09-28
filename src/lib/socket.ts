"use client";

import { io, Socket } from "socket.io-client";
import { useState, useEffect, useCallback } from "react";

// Initialize socket instance globally with a default namespace
const socketInstance: Socket = io("/", {
  autoConnect: true, // Ensures the socket connects automatically
  reconnection: true, // Handles reconnection automatically
  reconnectionAttempts: 5, // Retry a few times if disconnected
  reconnectionDelay: 1000, // Delay between reconnection attempts
});

// Utility function to join a room
const joinRoom = (roomName: string) => {
  sendData("join-room", roomName); // Emit the room name to the server
};

// Utility function to send data through socket
const sendData = <T>(
  eventName: string,
  data: T,
  socket: Socket = socketInstance
) => {
  if (socket && eventName) {
    socket.emit(eventName, data);
  } else {
    console.error("Socket or eventName is not provided");
  }
};

// Custom hook to receive data from the socket
const useReceiveData = <T>(
  eventName: string,
  defaultData: T,
  socket: Socket = socketInstance
) => {
  const [receivedData, setReceivedData] = useState<T>(defaultData);

  useEffect(() => {
    if (!socket || !eventName) {
      console.error("Socket or eventName is missing");
      return;
    }

    // Callback function to handle received data
    const onReceiveData = (data: T) => {
      setReceivedData(data);
    };

    socket.on(eventName, onReceiveData);

    // Cleanup function to remove the event listener on unmount or when dependencies change
    return () => {
      socket.off(eventName, onReceiveData);
    };
  }, [socket, eventName]);

  return receivedData;
};

// Utility function to create an object with room and data
const createObject = <T>(room: string, data: T) => {
  return {
    room,
    data,
  };
};

// Optional: handle socket connection state
const useSocketConnection = (socket: Socket = socketInstance) => {
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    // Cleanup event listeners on unmount
    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, [socket]);

  return isConnected;
};

export {
  joinRoom,
  socketInstance as socket,
  sendData,
  useReceiveData,
  createObject,
  useSocketConnection,
};
