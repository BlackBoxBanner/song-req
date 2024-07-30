"use client";

import {socket} from "@/lib/socket";
import {Session} from "@prisma/client";
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

type SessionContextType = {
  sessionInit: Session | null;
  setSessionInit: Dispatch<SetStateAction<Session | null>>;
};

export const SessionContext = createContext<SessionContextType>({
  setSessionInit: () => {},
  sessionInit: null,
});

export const SessionProvider = ({children}: {children: React.ReactNode}) => {
  const [sessionInit, setSessionInit] = useState<Session | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch("/api/session");
        const sessionData = (await response.json()) as Session[];

        if (!sessionData.length) return;

        console.log(sessionData);

        // Assuming the API returns an array of session objects
        setSessionInit(sessionData[0]);

        // Emit the initial session state through the socket
        socket.emit("send-session", sessionData[0]);
      } catch (error) {
        console.error("Failed to fetch session data:", error);
      }
    };

    // Fetch session data once on component mount
    fetchSession();

    // Listen for session updates via socket and update the state
    const handleReceiveSession = (sessionData: Session) => {
      setSessionInit(sessionData);
    };

    socket.on("receive-session", handleReceiveSession);

    // Clean up the socket listener on component unmount
    return () => {
      socket.off("receive-session", handleReceiveSession);
    };
  }, []);

  return (
    <SessionContext.Provider value={{sessionInit, setSessionInit}}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSessionInit = () => useContext(SessionContext);
