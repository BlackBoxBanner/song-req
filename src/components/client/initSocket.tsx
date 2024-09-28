"use client";

import { socket } from "@/lib/socket";
import { useSocketInit } from "@/components/context/socketContext";
import { toast } from "@/components/ui/use-toast";
import { useEffect, useCallback } from "react";
import { delay } from "@/components/basic/delay";

const InitSocket = () => {
  const { setSocketInit } = useSocketInit();

  const showToast = (
    title: string,
    description: string,
    variant: "default" | "destructive" = "default"
  ) => {
    const toastContent = toast({
      title,
      description,
      variant,
      duration: 10000,
    });

    // Auto-dismiss the toast after a delay
    delay(1000).then(() => toastContent.dismiss());
  };

  const handleConnect = useCallback(() => {
    setSocketInit(true);
    showToast("เชื่อมต่อสำเร็จ", "คุณเชื่อมต่อกับเซิร์ฟเวอร์แล้ว");
  }, [setSocketInit]);

  const handleDisconnect = useCallback(() => {
    setSocketInit(false);
    showToast(
      "การเชื่อมต่อขาดหาย",
      "ระบบไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้",
      "destructive"
    );
  }, [setSocketInit]);

  useEffect(() => {
    // Show initial connecting message
    showToast("กำลังเชื่อมต่อ", "ระบบกำลังเชื่อมต่อกับเซิร์ฟเวอร์ รอสักครู่");

    // Trigger onConnect immediately if socket is already connected
    if (socket.connected) {
      handleConnect();
    }

    // Set up socket event listeners
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    // Cleanup listeners on unmount
    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, [setSocketInit]); // `setSocketInit` is stable, no need for extra dependencies

  return null; // No visual content
};

export default InitSocket;
