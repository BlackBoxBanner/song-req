"use client";

import { socket } from "@/lib/socket";
import { useSocketInit } from "@/components/context/socketContext";
import { toast } from "@/components/ui/use-toast";
import { useEffect } from "react";
import { delay } from "@/components/basic/delay";

const InitSocket = () => {
  const { setSocketInit } = useSocketInit();

  useEffect(() => {
    const toastContent = toast({
      duration: 10000,
    });

    const updateToast = (
      title: string,
      description: string,
      variant: "default" | "destructive" = "default"
    ) => {
      toastContent.update({
        ...toastContent,
        title,
        description,
        variant,
      });
    };

    const handleToastDismiss = () => {
      delay(1000).then(() => toastContent.dismiss());
    };

    const onConnect = () => {
      setSocketInit(true);
      updateToast(
        "เชื่อมต่อสำเร็จ",
        "คุณเชื่อมต่อกับเซิร์ฟเวอร์แล้ว",
        "default"
      );
      handleToastDismiss();
    };

    const onDisconnect = () => {
      setSocketInit(false);
      updateToast(
        "การเชื่อมต่อขาดหาย",
        "ระบบไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้",
        "destructive"
      );
      handleToastDismiss();
    };

    updateToast(
      "กำลังเชื่อมต่อ",
      "ระบบกำลังเชื่อมต่อกับเซิร์ฟเวอร์ รอสักครู่",
      "default"
    );

    // If the socket is already connected, trigger onConnect
    if (socket.connected) {
      onConnect();
    }

    // Set up socket event listeners
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    // Cleanup on component unmount
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, [setSocketInit]); // Make sure setSocketInit is added as a dependency

  return null; // This component doesn't render any visible content
};

export default InitSocket;
