"use client"

import { addCtfWinner } from "@/action/addCtf";
import useCountdownTimer from "@/app/hook/useCountdownTimer";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Ctf } from "@prisma/client";
import { Checkbox } from "@radix-ui/react-checkbox";
import { useForm } from "react-hook-form";
import { z } from "zod";

const ctfSchema = z.object({
    contact: z.string({ required_error: "กรอกช่องทางการติดต่อด้วย" }).min(1, "กรอกช่องทางการติดต่อด้วย"),
    answer: z.string({
        required_error: "กรอกคำตอบด้วย"
    }).min(1, "กรอกคำตอบด้วย")
})

type CtfFormType = z.infer<typeof ctfSchema>;

type CtfFormProps = {
    status: {
        first?: Ctf
        second?: Ctf
        third?: Ctf
        fourth?: Ctf
    }
}

const CtfForm = ({ status: challengeStatus }: CtfFormProps) => {
    const { status } = useCountdownTimer(
        "2024-12-01T00:00:00Z",
        "2025-01-01T23:59:59Z",
        "Asia/Bangkok"
    );

    const CTF_ANSWER_1 = process.env.NEXT_PUBLIC_CTF_1;
    const CTF_ANSWER_2 = process.env.NEXT_PUBLIC_CTF_2;
    const CTF_ANSWER_3 = process.env.NEXT_PUBLIC_CTF_3;
    const CTF_ANSWER_4 = process.env.NEXT_PUBLIC_CTF_4;

    const { ...form } = useForm<CtfFormType>({
        resolver: zodResolver(ctfSchema)
    })

    const checkAnswer = (answer: string) => {
        if (answer === CTF_ANSWER_1) return 1
        if (answer === CTF_ANSWER_2) return 2
        if (answer === CTF_ANSWER_3) return 3
        if (answer === CTF_ANSWER_4) return 4

        return null
    }


    async function onSubmit(values: CtfFormType) {
        const { answer, contact } = values;

        const challenge = checkAnswer(answer);

        if (!challenge) {
            alert("คำตอบไม่ถูกต้อง");
            return;
        }

        try {
            await addCtfWinner({
                contact,
                position: challenge
            })

            alert("ส่งคำตอบสำเร็จ! รอรับรางวัลได้เลย")
            form.reset({})
        } catch (e) {
            if (e instanceof Error) {
                console.error(e)
                return alert(`"มีบางอย่างผิดพลาด กรุณาลองใหม่อีกครั้ง: ${e.message}"`)
            }
            return alert("มีบางอย่างผิดพลาด กรุณาลองใหม่อีกครั้ง")
        }



    }

    return status == "during" && (
        <div className="p-6 bg-white shadow rounded-lg text-center mb-4">
            <h2 className="text-2xl font-bold text-indigo-600 mb-4">🔍 ส่งคำตอบ</h2>
            <p className="text-lg text-gray-700 mb-4">ค้นพบโค้ดลับแล้ว? ส่งคำตอบเพื่อรับรางวัล!</p>
            <div className="border-b mb-4" />
            <div className="grid grid-cols-2 lg:grid-cols-4 mb-4 flex-col gap-4">
                <div className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", challengeStatus.first && "text-green-500 line-through")}>
                    ข้อที่ 1 - ง่าย
                </div>
                <div className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", challengeStatus.second && "text-green-500 line-through")}>
                    ข้อที่ 2 - ปานกลาง
                </div>
                <div className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", challengeStatus.third && "text-green-500 line-through")}>
                    ข้อที่ 3 - ยาก
                </div>
                <div className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", challengeStatus.fourth && "text-green-500 line-through")}>
                    ข้อที่ 4 - ยากมาก
                </div>
            </div>
            <div className="border-b mb-4" />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-[30rem] mx-auto text-start">
                    <FormField
                        control={form.control}
                        name="contact"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>ช่องทางการติดต่อ</FormLabel>
                                <FormControl>
                                    <input
                                        placeholder="ช่องทางการติดต่อ"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="answer"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>คำตอบ</FormLabel>
                                <FormControl>
                                    <input
                                        placeholder="รหัสลับคืออะไรนะ..."
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        Submit
                    </button>
                </form>
            </Form>
        </div>
    )
}

export default CtfForm
