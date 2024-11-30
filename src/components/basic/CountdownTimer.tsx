"use client";

import useCountdownTimer from "@/app/hook/useCountdownTimer";
import React from "react";

const HeadlessCountdownComponent = () => {
    const { countdown, status } = useCountdownTimer(
        "2024-12-01T00:00:00Z",
        "2025-01-01T23:59:59Z",
        "Asia/Bangkok"
    );

    const messages: Record<typeof status, string> = {
        beforeStart: "คุณยังไม่สามารถส่งคำตอบได้",
        during: "มุ่งเน้นค้นหาโค้ดลับและรับรางวัล!",
        afterEnd: "กิจกรรมสิ้นสุดลงแล้ว",
    };

    // Define colors for each status
    const statusColors: Record<typeof status, string> = {
        beforeStart: "text-blue-500", // Blue for "beforeStart"
        during: "text-green-500", // Green for "during"
        afterEnd: "text-red-500", // Red for "afterEnd"
    };

    return (
        <div>
            <div className="p-6 bg-white shadow rounded-lg text-center mb-8">
                <h2 className="text-2xl font-bold text-indigo-600 mb-4">⏳ การนับถอยหลัง</h2>
                <p className={`text-2xl font-medium mb-4 ${statusColors[status]}`}>
                    {messages[status]}
                </p>
                <p className={`text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold ${statusColors[status]}`}>
                    {countdown}
                </p>
            </div>
        </div>
    );
};

export default HeadlessCountdownComponent;