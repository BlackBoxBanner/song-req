"use client";

import {useSessionInit} from "@/components/context/sessionContext";
import InfiniteText from "@/components/basic/infiniteText";

const AdminFooter = () => {
  const {sessionInit} = useSessionInit();

  if (!sessionInit) {
    return <InfiniteText text="ยังไม่เปิด" />;
  }

  if (!sessionInit.request) {
    return <InfiniteText text="การขอเพลงได้ถูกระงับโดยผู้ดูแล" />;
  }

  return null;
};

export default AdminFooter;
