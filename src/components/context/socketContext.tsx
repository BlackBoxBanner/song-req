"use client";

import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

type SocketContextType = {
  socketInit: boolean;
  setSocketInit: Dispatch<SetStateAction<boolean>>;
};

export const SocketContext = createContext<SocketContextType>({
  setSocketInit: () => {},
  socketInit: false,
});

export const SocketProvider = ({children}: {children: React.ReactNode}) => {
  const [socketInit, setSocketInit] = useState(false);
  return (
    <SocketContext.Provider value={{socketInit, setSocketInit}}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketInit = () => useContext(SocketContext);
