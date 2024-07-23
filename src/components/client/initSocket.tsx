"use client";

import {socket} from "@/lib/socket";
import {useSocketInit} from "../context/socketContext";
import {toast} from "../ui/use-toast";
import {useEffect} from "react";
import {delay} from "../basic/delay";

const InitSocket = () => {
  const {setSocketInit} = useSocketInit();

  useEffect(() => {
    const toastContent = toast({
      duration: 10000,
    });

    toastContent.update({
      ...toastContent,
      title: "กำลังเชื่อมต่อ",
      description: "ระบบกำลังเชื่อมต่อกับเซิร์ฟเวอร์ รอสักครู่",
      variant: "default",
    });

    const onConnect = () => {
      setSocketInit(true);

      toastContent.update({
        ...toastContent,
        title: "เชื่อมต่อสำเร็จ",
        description: "คุณเชื่อมต่อกับเซิร์ฟเวอร์แล้ว",
        variant: "default",
      });

      delay(1000).then(() => {
        toastContent.dismiss();
      });
    };

    const onDisconnect = () => {
      setSocketInit(false);
      toastContent.update({
        ...toastContent,
        title: "การเชื่อมต่อขาดหาย",
        description: "ระบบไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้",
        variant: "destructive",
      });

      delay(1000).then(() => {
        toastContent.dismiss();
      });
    };

    if (socket.connected) {
      onConnect();
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  return <></>;
};

export default InitSocket;
