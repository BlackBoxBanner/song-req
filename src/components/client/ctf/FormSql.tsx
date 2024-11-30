"use client"

import { addCtfWinner } from "@/action/addCtf";
import { query23 } from "@/action/ctf23";
import useCountdownTimer from "@/app/hook/useCountdownTimer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

const MediumAndHard = () => {
    const { status } = useCountdownTimer(
        "2024-12-01T00:00:00Z",
        "2025-01-01T23:59:59Z",
        "Asia/Bangkok"
    );

    const [value, setValue] = useState<string>("")

    const onSubmit = async () => {
        try {
            const res = await query23(value)

            console.log(res);

        } catch (error) {
            if (error instanceof Error) {
                console.error(error.message)
            }
            console.error(error);

        }
    }

    return status == "during" && (
        <div className="p-6 bg-white shadow rounded-lg text-center mb-4 flex justify-center items-center flex-col">
            <h2 className="text-2xl font-bold text-indigo-600 mb-4">สำหรับระดับกลางและยาก</h2>
            <p className="text-xs">{`hint: ')`}</p>
            <p className="text-xs">{`hint: CtfAnswer answer`}</p>
            <p className="text-xs">{`hint: 7`}</p>
            <div className="border-b mb-4" />
            <div className="max-w-[30rem] w-full">
                <input
                    placeholder="ช่องใส่อะไรสักอย่าง"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
                    onChange={(e) => setValue(String(e.target.value))}
                />
                <button
                    onClick={onSubmit}
                    className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    Submit
                </button>
            </div>
        </div>
    )
}

export default MediumAndHard
