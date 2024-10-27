"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { LiveSession, Song } from "@prisma/client"
import { createObject, sendData } from "@/lib/socket"
import { useToast } from "@/components/ui/use-toast"
import { memo, useCallback } from "react"
import { editSongAction } from "@/action/editSongAction"

// Schema for validating song name input
const songSchema = z.object({
    song: z.string().trim().min(1, "Song name is required"),
})

type SongSchemaType = z.infer<typeof songSchema>

type ChangeSongNameFormProps = {
    song: Song
    liveId: LiveSession["id"]
}

// Memoized component to avoid unnecessary re-renders
export const ChangeSongNameForm = memo(({ song, liveId }: ChangeSongNameFormProps) => {
    const { toast } = useToast()

    // Initialize form with validation schema and default values
    const form = useForm<SongSchemaType>({
        resolver: zodResolver(songSchema),
        defaultValues: {
            song: song.title,
        },
    })

    // Utility function to handle errors and show toast messages
    const showErrorToast = useCallback((message: string) => {
        toast({
            title: "Error",
            description: message,
            variant: "destructive",
        })
    }, [toast])

    // Handle form submission with async logic
    const onSubmit = useCallback(
        async ({ song: songInput }: SongSchemaType) => {
            try {
                // Edit the song and send the updated list through socket
                const songList = await editSongAction({
                    LiveSessionId: liveId,
                    id: song.id,
                    title: songInput,
                })

                sendData("send-song", createObject(liveId, songList))
            } catch (error) {
                const errorMessage =
                    error instanceof Error ? error.message : "Something went wrong"
                showErrorToast(errorMessage)
            }
        },
        [liveId, song.id, showErrorToast]
    )

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="song"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Song name</FormLabel>
                            <FormControl>
                                <Input placeholder="Song name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    )
})

ChangeSongNameForm.displayName = "ChangeSongNameForm"