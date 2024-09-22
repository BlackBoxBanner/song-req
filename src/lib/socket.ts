"use client";

import { io, Socket } from "socket.io-client";
import { useState, useEffect } from "react";

// Initialize socket instance globally
const socketInstance: Socket = io(); // Automatically connects to the server

// Utility function to send data
const sendData = <T>(
  eventName: string,
  data: T,
  socket: Socket = socketInstance // Use default socket if not provided
) => {
  if (socket && eventName) {
    socket.emit(eventName, data);
  } else {
    console.error("Socket or eventName is not provided");
  }
};

// Custom hook to receive data
const useReceiveData = <T>(
  eventName: string,
  defaultData: T | null = null,
  socket: Socket = socketInstance // Use default socket if not provided
) => {
  const [receivedData, setReceivedData] = useState<T | null>(defaultData);

  useEffect(() => {
    if (!socket || !eventName) {
      console.error("Socket or eventName is missing");
      return;
    }

    const onReceiveData = (data: T) => {
      setReceivedData(data);
    };

    socket.on(eventName, onReceiveData);

    // Cleanup on component unmount or dependency change
    return () => {
      socket.off(eventName, onReceiveData);
    };
  }, [socket, eventName]);

  return receivedData;
};

export { socketInstance as socket, sendData, useReceiveData };
