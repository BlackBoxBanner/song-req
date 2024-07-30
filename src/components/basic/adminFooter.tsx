"use client";

import {useSessionInit} from "../context/sessionContext";
import InfiniteText from "./infiniteText";

const AdminFooter = () => {
  const {sessionInit} = useSessionInit();

  return !sessionInit ? (
    <InfiniteText text="ยังไม่เปิด" />
  ) : !sessionInit.request ? (
    <InfiniteText text="การขอเพลงได้ถูกระงับโดยผู้ดูแล" />
  ) : null;
};

export default AdminFooter;
