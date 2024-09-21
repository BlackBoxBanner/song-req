import InitSocket from "@/components/client/initSocket";
import { ReactNode } from "react";

const LiveLayout = ({ children }: { children: Readonly<ReactNode> }) => {
  return (
    <>
      <InitSocket />
      {children}
    </>
  );
};

export default LiveLayout;
